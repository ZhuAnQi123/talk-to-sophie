#把 main.py 里的 prompt 组装 + LLM 调用逻辑抽到 service 层（项目级规范）
# build_messages() + stream_completion()

from services.rag_service import retrieve

def build_messages(user_message:str, persona:str)->tuple[list[dict],list[dict]]:
    # 检索出结果
    retrieved_results = retrieve(user_message, persona)

    # 把检索出的结果拼接成context
    context = "\n\n".join([f"知识库来源：{item['metadata']['source']}，标题：{item['metadata']['title']}，内容：{item['text']}" for item in retrieved_results])

    # 组装为system prompt
    system_prompt="""
        你是 Sophie Zhu(朱安琪)个人网站中的AI交互分身，
        """ if persona == "sophie" else """
        你是 Naval Ravikant(那瓦尔)个人网站中的AI交互分身，
        """
    system_prompt += f"""
        请根据以下提供的知识库内容回答用户的问题，如果知识库内容无法回答用户的问题，请直接说不知道，不要编造答案。
        以下为知识库内容{context}
    """

    # 将system prompt组装到messages
    messages=[
        {"role":"system","content":system_prompt},
        {"role":"user","content":user_message}
    ]

    # 组装sources（其中包含source & title）恭候需前端展示
    sources = [
        {
            "source": item['metadata']['source'],
            "title": item['metadata']['title']
        }
        for item in retrieved_results
    ]
    return messages, sources