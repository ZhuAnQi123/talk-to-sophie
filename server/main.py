from fastapi import FastAPI
from dotenv import load_dotenv
from openai import OpenAI
from pathlib import Path
import os
from schemas import ChatRequest, ChatResponse
load_dotenv(Path(__file__).resolve().parent.parent / ".env")

app=FastAPI()

client=OpenAI(
    api_key=os.getenv("QWEN_API_KEY"),
    base_url=os.getenv("QWEN_BASE_URL")
)

@app.post("/api/chat")
async def chat(request: ChatRequest):
    system_prompt = """
    你是 Sophie Zhu(朱安琪)个人网站中的AI交互分身，
    你的回答要专业，诚实，
    对不了解的内容直接说不知道，不能胡编乱造。
    """
    user_prompt= request.message
    messages=[
        {"role":"system","content":system_prompt},
        {"role":"user","content":user_prompt}
    ]
    response = client.chat.completions.create(
        model=os.getenv("QWEN_MODEL"),
        messages=messages,
        stream=False
    )
    return {"message":response.choices[0].message.content}
