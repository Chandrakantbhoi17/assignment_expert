from sqlalchemy.orm import Session
from fastapi.exceptions import HTTPException
from app.models.user import User,UserRole
from app.schemas.user import UserCreate
from app.core.security import hash_password

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def create_user(db: Session, user: UserCreate):
    hashed_password = hash_password(user.password)
    db_user = User(email=user.email, full_name=user.full_name,password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def create_admin_user(db: Session, user: UserCreate):
    # Check if an admin user already exists
    existing_admin = db.query(User).filter(User.role == UserRole.ADMIN).first()
    if existing_admin:
        raise HTTPException(status_code=400, detail="Admin user already exists.")

    # Hash the password
    hashed_password = hash_password(user.password)

    # Create the admin user
    db_user = User(
        email=user.email,
        full_name=user.full_name,
        password=hashed_password,
        role=UserRole.ADMIN
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user



