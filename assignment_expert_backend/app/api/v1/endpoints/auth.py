from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from app.models.base import get_db
from sqlalchemy.orm import Session
from app.core.security import verify_password, create_access_token
from app.core.config import settings
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.user import UserOut
from app.crud.user import get_user_by_email
from app.schemas.user import Token,LoginRequest

router = APIRouter(prefix="/auth",tags=["Authentication"])

@router.post("/token", response_model=Token)
def login(form_data:LoginRequest, db: Session = Depends(get_db)):
    user = get_user_by_email(db, email=form_data.email)
    if not user or not verify_password(form_data.password,user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token(data={"sub": user.email,"role":user.role.value})
    return {"access_token": token, "token_type": "bearer"}

@router.get("/me", response_model=UserOut)
def profile(current_user: User = Depends(get_current_user)):
    return current_user