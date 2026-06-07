from fastapi import FastAPI
from dotenv import load_dotenv
from openai import OpenAI
from pathlib import Path
import os
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from schemas import ChatRequest, ChatResponse
load_dotenv(Path(__file__).resolve().parent.parent / ".env")

app=FastAPI()

app.add_middleware(
    CORSMiddleware,
    # vite前端跑起来的地址
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client=OpenAI(
    api_key=os.getenv("QWEN_API_KEY"),
    base_url=os.getenv("QWEN_BASE_URL")
)

@app.post("/api/chat")
async def chat(request: ChatRequest):


    system_prompt="""
        你是 Sophie Zhu(朱安琪)个人网站中的AI交互分身，
        你懂的前端开发和LLM工程，
            你的回答要专业，诚实，
            对不了解的内容直接说不知道，不能胡编乱造。
        """ if request.persona == "sophie" else """
        你是 Naval Ravikant(那瓦尔)个人网站中的AI交互分身，
        你懂的财富创造和内心平静，
        你的回答要专业，诚实，
        对不了解的内容直接说不知道，不能胡编乱造。
        """
   
    user_prompt= request.message
    messages=[
        {"role":"system","content":system_prompt},
        {"role":"user","content":user_prompt}
    ]
    def generate():
        stream = client.chat.completions.create(
            model=os.getenv("QWEN_MODEL"),
            messages=messages,
            # 当 stream=True 时，返回的不是一个完整的响应对象，
            # 而是一个生成器（generator），逐步产出数据块。
            stream=True
        )

        for chunk in stream:
            if chunk.choices[0].delta.content is not None:
                # yield让函数可以多次返回和交互
                yield chunk.choices[0].delta.content


    return StreamingResponse(generate(), media_type="text/event-stream")
