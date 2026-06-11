import json
from fastapi import FastAPI
from dotenv import load_dotenv
from openai import OpenAI
from pathlib import Path
import os
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from schemas import ChatRequest
from exceptions import raise_for_openai_error
from services.chat_service import build_messages

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


    messages, sources = build_messages(request.message, request.persona.value)

    try:
        stream = client.chat.completions.create(
            model=os.getenv("QWEN_MODEL"),
            messages=messages,
            # 当 stream=True 时，返回的不是一个完整的响应对象，
            # 而是一个生成器（generator），逐步产出数据块。
            stream=True,
        )
    except Exception as e:
        raise_for_openai_error(e)

    def generate():
        try:
            for chunk in stream:
                if chunk.choices[0].delta.content is not None:
                    # yield让函数可以多次返回和交互
                    yield chunk.choices[0].delta.content
        except Exception as e:
            raise_for_openai_error(e)


    return StreamingResponse(
        generate(), 
        media_type="text/event-stream",
        headers={"X-RAG-SOURCES": json.dumps(sources)}
    )
