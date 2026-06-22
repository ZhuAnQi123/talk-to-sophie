
import json
from fastapi import FastAPI
from dotenv import load_dotenv
from pathlib import Path
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

from schemas import ChatRequest
from exceptions import raise_for_openai_error
# 引入新写好的核心方法
from services.chat_service import build_and_stream_chat

load_dotenv(Path(__file__).resolve().parent.parent / ".env")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/chat")
async def chat(request: ChatRequest):
    try:
        # 此时调用的是我们封装好的带有上下文和 LangChain 记忆的业务方法
        generate, sources = build_and_stream_chat(
            request.message,
            request.persona.value,
            request.session_id # 加入 session ID 实现路由记忆隔离
        )

        return StreamingResponse(
            generate(),
            media_type="text/event-stream",
            headers={"X-RAG-SOURCES": json.dumps(sources)}
        )
    except Exception as e:
        raise_for_openai_error(e)

