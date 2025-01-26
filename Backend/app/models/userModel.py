from typing import Optional
from pydantic import BaseModel, EmailStr
from enum import Enum

class UserRole(str, Enum):
    ADMIN = "admin"
    USER = "user"

class UserBase(BaseModel):
    displayName: str
    email: EmailStr
    imageUrl: Optional[str] = None
    role: UserRole = UserRole.USER

class UserCreate(UserBase):
    pass

class UserUpdate(BaseModel):
    displayName: Optional[str] = None
    email: Optional[EmailStr] = None
    imageUrl: Optional[str] = None
    role: Optional[UserRole] = None

class UserInDB(UserBase):
    id: str

    class Config:
        from_attributes = True
