from pydantic import BaseModel
from enum import Enum
class Persona(str, Enum):
    sophie = "sophie"
    naval = "naval"
class ChatRequest(BaseModel):
    message: str
    persona:Persona
class ChatResponse(BaseModel):
    reply: str