from pydantic import BaseModel, EmailStr
from app.models.enums import UserRole
class UserCreate(BaseModel):
    email: EmailStr
    full_name: str
    password: str

class UserOut(BaseModel):
    id: int
    email: EmailStr
    full_name: str
    role:UserRole

    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: str

    
class LoginRequest(BaseModel):
    email: EmailStr
    password: str
