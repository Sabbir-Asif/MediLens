from fastapi import APIRouter, Query
from typing import List, Optional
from app.models.userModel import UserCreate, UserUpdate, UserInDB
from app.controllers import userController

router = APIRouter()

@router.get("/", response_model=List[UserInDB])
async def getAllUsers():
    return await userController.getAllUsers()

@router.post("/", response_model=UserInDB, status_code=201)
async def createUser(user: UserCreate):
    return await userController.createUser(user)

@router.get("/search", response_model=List[UserInDB])
async def searchUsers(
    email: Optional[str] = Query(None, description="Search for a user by email"),
    query: Optional[str] = Query(None, description="General search query for user details")
):
    return await userController.searchUsers(email=email, query=query)

@router.get("/{userId}", response_model=UserInDB)
async def getUserById(userId: str):
    return await userController.getUserById(userId)

@router.patch("/{userId}", response_model=UserInDB)
async def updateUser(userId: str, userUpdate: UserUpdate):
    return await userController.updateUser(userId, userUpdate)

@router.delete("/{userId}", status_code=204)
async def deleteUser(userId: str):
    await userController.deleteUser(userId)