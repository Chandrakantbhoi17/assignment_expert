# endpoints/user_dashboard.py

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.models.base import get_db
from app.models.user import User
from app.core.dependencies import get_current_user
from app.services.user_dashboard_service import get_assignment_summary

router = APIRouter(prefix="/user", tags=["User Service"])

# For now, user_id is passed as query param. In production, you'd use OAuth/JWT auth.
@router.get("/dashboard/assignment-summary")
def user_assignment_summary( db: Session = Depends(get_db),current_user: User = Depends(get_current_user)):
    return get_assignment_summary(db,current_user.id)
