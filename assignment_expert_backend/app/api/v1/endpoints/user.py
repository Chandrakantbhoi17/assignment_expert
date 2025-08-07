from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app import crud, schemas, models
from app.models.base import get_db
from app.crud.user import get_user_by_email,create_user,create_admin_user
from datetime import timedelta
from app.schemas.user import UserCreate,UserOut
router = APIRouter(prefix="/users",tags=["Authentication"])

@router.post("/register", response_model=UserOut)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    existing_user = get_user_by_email(db, user_in.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return create_user(db, user_in)


@router.post("/admin/register", response_model=UserOut)
def admin_register(user_in: UserCreate, db: Session = Depends(get_db)):

    return create_admin_user(db, user_in)


