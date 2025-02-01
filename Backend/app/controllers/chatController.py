from fastapi import HTTPException
from bson import ObjectId
from typing import List
from datetime import datetime
from app.core.database import getDatabase
from app.models.chatModel import Chat, ChatCreate, ChatUpdate

async def getAllUserChats(userId: str) -> List[Chat]:
    db = await getDatabase()
    chats = await db.chats.find({"userId": userId}).sort("updatedAt", -1).to_list(1000)
    return [Chat(id=str(chat["_id"]), **chat) for chat in chats]

async def createChat(chat: ChatCreate) -> Chat:
    db = await getDatabase()
    
    chatDict = chat.model_dump()
    chatDict["createdAt"] = datetime.now()
    chatDict["updatedAt"] = datetime.now()
    
    result = await db.chats.insert_one(chatDict)
    createdChat = await db.chats.find_one({"_id": result.inserted_id})
    
    return Chat(id=str(createdChat["_id"]), **createdChat)

async def getChatById(chatId: str) -> Chat:
    db = await getDatabase()
    
    try:
        chat = await db.chats.find_one({"_id": ObjectId(chatId)})
    except:
        raise HTTPException(status_code=400, detail="Invalid chat ID")
    
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    
    return Chat(id=str(chat["_id"]), **chat)

async def updateChat(chatId: str, chatUpdate: ChatUpdate) -> Chat:
    db = await getDatabase()
    
    try:
        updateDict = chatUpdate.model_dump(exclude_unset=True)
        updateDict["updatedAt"] = datetime.now()
        
        if not updateDict:
            raise HTTPException(status_code=400, detail="No fields to update")
        
        result = await db.chats.find_one_and_update(
            {"_id": ObjectId(chatId)},
            {"$set": updateDict},
            return_document=True
        )
        
        if not result:
            raise HTTPException(status_code=404, detail="Chat not found")
        
        return Chat(id=str(result["_id"]), **result)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

async def deleteChat(chatId: str):
    db = await getDatabase()
    
    try:
        result = await db.chats.delete_one({"_id": ObjectId(chatId)})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Chat not found")
    except:
        raise HTTPException(status_code=400, detail="Invalid chat ID")