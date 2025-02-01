from fastapi import APIRouter, Path
from typing import List
from app.models.chatModel import Chat, ChatCreate, ChatUpdate
from app.controllers import chatController

router = APIRouter()

@router.get("/user/{userId}", response_model=List[Chat])
async def getAllUserChats(userId: str = Path(..., description="User ID to fetch chats for")):
    return await chatController.getAllUserChats(userId)

@router.post("/", response_model=Chat, status_code=201)
async def createChat(chat: ChatCreate):
    return await chatController.createChat(chat)

@router.get("/{chatId}", response_model=Chat)
async def getChatById(chatId: str):
    return await chatController.getChatById(chatId)

@router.patch("/{chatId}", response_model=Chat)
async def updateChat(chatId: str, chatUpdate: ChatUpdate):
    return await chatController.updateChat(chatId, chatUpdate)

@router.delete("/{chatId}", status_code=204)
async def deleteChat(chatId: str):
    await chatController.deleteChat(chatId)