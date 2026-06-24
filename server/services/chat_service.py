import os
import re
from datetime import datetime
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_core.chat_history import InMemoryChatMessageHistory
from services.web_search_service import perform_web_search
from services.rag_service import retrieve

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
    persona_name = "Sophie Zhu(朱安琪)" if persona == "sophie" else "Naval Ravikant(那瓦尔)"
    current_year = datetime.now().year
    
    history = get_session_history(session_id)
    history_text = ""
    if history.messages:
        recent_msgs = history.messages[-4:]
        history_text = "\n".join([f"{msg.type}: {msg.content}" for msg in recent_msgs])
        
    prompt_text = f"当前系统年份：{current_year}年。请将用户的最新提问重写为适合用于搜索引擎和知识库检索的独立查询语句。要求：\n1. 如果提问中包含'你'、'你的'等代词，必须明确替换为'{persona_name}'。\n2. 如果包含“今年”、“去年”、“目前”等时间代词，必须替换为具体的年份（例如将“今年”替换为“{current_year}年”）。\n3. 结合对话历史补全缺失的上下文信息。\n4. 直接输出重写后的查询语句，不要包含任何标点符号、解释或回答。\n\n对话历史：\n{history_text}\n\n用户最新提问：{user_message}"

    try:
        response = llm.invoke(prompt_text)
        return response.content.strip()
    except Exception as e:
        return f"{persona_name} {user_message}"

def build_and_stream_chat(user_message: str, persona: str, session_id: str = "default_session", web_search: bool = False):

    """
    暴露给 main.py 的主干函数：返回 (流式生成器, sources)
    """
    search_query = rewrite_search_query(user_message, persona, session_id)
    
    # 1. 检索数据 (RAG)
    retrieved_results = retrieve(search_query, persona)

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

    # 2. 把检索出的结果拼接成 context
    context = "\n\n".join([f"知识库来源：{item['metadata']['source']}，标题：{item['metadata']['title']}，内容：{item['text']}" for item in retrieved_results])

    # 3. 动态组装 system prompt
    system_prompt = "你是 Sophie Zhu(朱安琪)个人网站中的AI交互分身，\n" if persona == "sophie" else "你是 Naval Ravikant(那瓦尔)个人网站中的AI交互分身，\n"
    system_prompt += f"请根据以下提供的知识库内容回答用户的问题，如果知识库内容无法回答用户的问题，请基于你的设定正常交流，不要编造资料中的内容。\n以下为知识库内容：\n{context}"

    # 4. 组装 sources 供前端引用展示
    sources = [
        {"source": item['metadata']['source'], "title": item['metadata']['title']}
        for item in retrieved_results
    ]

    # 5. 定义 Stream 生成器
    def generate():
        # 调用 langchain 封装链的 stream 方法
        for chunk in chain_with_history.stream(
            {
                "system_prompt": system_prompt, 
                "user_message": user_message
            },
            config={"configurable": {"session_id": session_id}}
        ):
            if chunk.content:
                yield chunk.content

    return generate, sources
