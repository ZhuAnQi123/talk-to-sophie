import os
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_core.chat_history import InMemoryChatMessageHistory

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
    model=os.getenv("QWEN_MODEL")
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

def build_and_stream_chat(user_message: str, persona: str, session_id: str = "default_session"):
    """
    暴露给 main.py 的主干函数：返回 (流式生成器, sources)
    """
    # 1. 检索数据 (RAG)
    retrieved_results = retrieve(user_message, persona)

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
