from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

class Message(BaseModel):
    role: str  # 'user' or 'assistant'
    content: str
    timestamp: datetime = datetime.now()

class Chat(BaseModel):
    id: Optional[str] = None
    userId: str
    title: str
    messages: List[Message]
    createdAt: datetime = datetime.now()
    updatedAt: datetime = datetime.now()

    class Config:
        from_attributes = True

class ChatCreate(BaseModel):
    userId: str
    title: str
    messages: List[Message]

class ChatUpdate(BaseModel):
    title: Optional[str] = None
    messages: Optional[List[Message]] = None