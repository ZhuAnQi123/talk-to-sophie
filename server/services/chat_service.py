import os
import re
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_core.chat_history import InMemoryChatMessageHistory
from services.web_search_service import perform_web_search
from services.rag_service import retrieve
from services.prompt_registry import build_system_message, build_context_prompt
from collections import defaultdict
# 全局的会话存储字典，用于在内存中保存多个 session 的对话历史
session_store = {}

def get_session_history(session_id: str):
    if session_id not in session_store:
        session_store[session_id] = InMemoryChatMessageHistory()
    
    # 【核心】保留 5 条短期记忆：每次获取 history 时，检查并截取最后 10 条消息 (5次 User + 5次 AI)
    # Langchain 中的一轮对话包含一条 HumanMessage 和一条 AIMessage
    if len(session_store[session_id].messages) > 10:
        session_store[session_id].messages = session_store[session_id].messages[-10:]
        
    return session_store[session_id]

# 1. 初始化 LangChain 模型实例
llm = ChatOpenAI(
    api_key=os.getenv("QWEN_API_KEY"),
    base_url=os.getenv("QWEN_BASE_URL"),
    model=os.getenv("QWEN_MODEL"),
    verbose=True
)

# 2. 构建带记忆的 prompt 模板
# system_prompt 作为变量每次动态注入，而 MessagesPlaceholder 会自动展开历史记录
prompt = ChatPromptTemplate.from_messages([
    ("system", "{system_prompt}"),
    MessagesPlaceholder(variable_name="history"),
    ("human", "{user_message}")
])

chain = prompt | llm

# 3. 封装为带历史记忆的 Runnable
chain_with_history = RunnableWithMessageHistory(
    chain,
    get_session_history,
    input_messages_key="user_message", # 告诉 LangChain 仅把 user_message 存为 HumanMessage，防止 system_prompt 污染历史
    history_messages_key="history",    # 历史记录注入到 prompt 中的占位符名称
)


def rewrite_search_query(user_message: str, persona: str, session_id: str) -> str:
    
    history = get_session_history(session_id)
    prompt_text = build_context_prompt(persona, user_message, history)
    try:
        response = llm.invoke(prompt_text)
        return response.content.strip()
    except Exception as e:
        return f"{persona} {user_message}"


def resolve_retrieval_params(user_message: str, search_query: str) -> tuple[int, dict | None]:
    """根据用户问题推断 top_k 与 metadata 过滤条件。"""
    text = f"{user_message} {search_query}"
    top_k = 12 if re.search(r"所有|全部|有哪些|列举|分别|几个|几段|哪些", text) else 8

    filters = None
    if re.search(r"个人项目", text):
        filters = {"type": "self project"}
    elif re.search(r"公司项目|上一家公司.*项目|在职.*项目", text):
        filters = {"type": {"$in": ["company project", "project"]}}
    elif re.search(r"工作经历|几段经历|上一家公司|待了几年|工作了多久|职业经历|工作几年", text):
        filters = {"type": "experience"}
    elif re.search(r"技能|擅长|技术栈", text):
        filters = {"type": "skill"}

    return top_k, filters


def build_and_stream_chat(user_message: str, persona: str, session_id: str = "default_session", web_search: bool = False):

    """
    暴露给 main.py 的主干函数：返回 (流式生成器, sources)
    """
    search_query = rewrite_search_query(user_message, persona, session_id)
    
    # 1. 检索数据 (RAG)
    top_k, metadata_filters = resolve_retrieval_params(user_message, search_query)
    retrieved_results = retrieve(search_query, persona, top_k=top_k, filters=metadata_filters)
    if metadata_filters and not retrieved_results:
        retrieved_results = retrieve(search_query, persona, top_k=top_k)

    # 符合条件则拼接网络搜索结果
    need_search = False
    if persona == "naval":
        if web_search:
            need_search = True
        elif re.search(r"最新|最近|今天|2026|今年", search_query):
            need_search = True
        elif not retrieved_results:
            need_search = True
        else:
            # 假设distances 越小越好。
            top_score = retrieved_results[0].get('score',0)
            # 需要观察日志确认什么是最佳阈值,暂定1
            if top_score is None or top_score > 1: # L2距离举例
                need_search = True

    if need_search:
        web_res=perform_web_search(search_query)
        retrieved_results.extend(web_res)

   # 2.拿到chunk值的时候先把结果去重整理之后再拼接发给agent的话获得的结果会更为准确

    # 创建一个名为 grouped_results 的字典，如果访问的键不存在，就自动初始化一个空的列表（list()）作为它的值。让它不用报类型错误
    grouped_results=defaultdict(list)

    for item in retrieved_results:
        meta = item.get("metadata", {})
        source = meta.get("source", "")
        title = meta.get("title", "")
        key = (source, title)
        text = item.get("text", "").strip()
        if text and text not in grouped_results[key]:
            grouped_results[key].append(text)

    # 2.截断与结构化组装
    MAX_CHAR_PER_DOC=1000
    structured_results=[]
    unique_sources=[]

    for (source,title),texts in grouped_results.items():
        unique_sources.append({"source":source,"title":title})
        # 将文本列表合并为一个字符串，并按 MAX_CHAR_PER_DOC 截断
        combined_text = "\n".join(texts)

        if len(combined_text) > MAX_CHAR_PER_DOC:
            combined_text=combined_text[:MAX_CHAR_PER_DOC] + "\n[内容被截断，原文过长]"

        # 使用XML标签结构化边界，这种格式大模型解析起来更不容易产生幻觉
        block=(
            f"<document>\n"
            f"  <source>{source}</source>\n"
            f"  <title>{title}</title>\n"
            f"  <content>{combined_text}</content>\n"
            f"</document>\n"
        )

        structured_results.append(block)


    # 结果拼接成 context
    context = "\n\n".join(structured_results)

    sources=unique_sources
    system_prompt=build_system_message(persona, rag_context=context)

    # 4. 组装 sources 供前端引用展示
    sources = [
        {"source": item['metadata']['source'], "title": item['metadata']['title']}
        for item in retrieved_results
    ]

    # 5. 定义 Stream 生成器
    def generate():
        is_thinking = False
        # 调用 langchain 封装链的 stream 方法
        for chunk in chain_with_history.stream(
            {
                "system_prompt": system_prompt, 
                "user_message": user_message
            },
            config={"configurable": {"session_id": session_id}}
        ):
            # 兼容推理模型（如 DeepSeek-R1）的 thinking 过程
            reasoning = chunk.additional_kwargs.get("reasoning_content", "")
            if reasoning:
                if not is_thinking:
                    yield "<think>\n"
                    is_thinking = True
                yield reasoning

            if chunk.content:
                # 当模型开始输出正文时，闭合 thinking 标签
                if is_thinking:
                    yield "\n</think>\n\n"
                    is_thinking = False
                yield chunk.content
                
        # 兜底闭合标签
        if is_thinking:
            yield "\n</think>\n\n"

    return generate, sources
