from fastapi import HTTPException
from bson import ObjectId
from typing import List, Optional
from app.core.database import getDatabase
from app.models.userModel import UserCreate, UserUpdate, UserInDB

async def getAllUsers() -> List[UserInDB]:
    db = await getDatabase()
    users = await db.users.find().to_list(1000)
    return [UserInDB(id=str(user["_id"]), **user) for user in users]

async def createUser(user: UserCreate) -> UserInDB:
    db = await getDatabase()
    
    if await db.users.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="Email already registered")
    
    userDict = user.model_dump()
    result = await db.users.insert_one(userDict)
    
    createdUser = await db.users.find_one({"_id": result.inserted_id})
    return UserInDB(id=str(createdUser["_id"]), **createdUser)

async def searchUsers(email: Optional[str] = None, query: Optional[str] = None) -> List[UserInDB]:
    db = await getDatabase()
    
    filterQuery = {}
    if email:
        filterQuery["email"] = {"$regex": f"^{email}$", "$options": "i"}  # Exact email match (case-insensitive)
    elif query:
        filterQuery = {
            "$or": [
                {"displayName": {"$regex": query, "$options": "i"}},
                {"email": {"$regex": query, "$options": "i"}}
            ]
        }
    
    users = await db.users.find(filterQuery).to_list(1000)
    return [UserInDB(id=str(user["_id"]), **user) for user in users]

async def getUserById(userId: str) -> UserInDB:
    db = await getDatabase()
    
    try:
        user = await db.users.find_one({"_id": ObjectId(userId)})
    except:
        raise HTTPException(status_code=400, detail="Invalid user ID")
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return UserInDB(id=str(user["_id"]), **user)

async def updateUser(userId: str, userUpdate: UserUpdate) -> UserInDB:
    db = await getDatabase()
    
    try:
        userDict = userUpdate.model_dump(exclude_unset=True)
        if not userDict:
            raise HTTPException(status_code=400, detail="No fields to update")
        
        result = await db.users.find_one_and_update(
            {"_id": ObjectId(userId)},
            {"$set": userDict},
            return_document=True
        )
        
        if not result:
            raise HTTPException(status_code=404, detail="User not found")
        
        return UserInDB(id=str(result["_id"]), **result)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

async def deleteUser(userId: str):
    db = await getDatabase()
    
    try:
        result = await db.users.delete_one({"_id": ObjectId(userId)})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="User not found")
    except:
        raise HTTPException(status_code=400, detail="Invalid user ID")