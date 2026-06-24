from pydantic import BaseModel
from enum import Enum
class Persona(str, Enum):
    sophie = "sophie"
    naval = "naval"
class ChatRequest(BaseModel):
    message: str
    persona:Persona
    session_id: str = "default_session"
    web_search: bool = False
class ChatResponse(BaseModel):
    reply: str