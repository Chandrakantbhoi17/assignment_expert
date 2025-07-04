# services/admin_dashboard_service.py

from sqlalchemy.orm import Session
from app.models.assignment import Assignment, AssignmentStatus

def get_assignment_summary(db: Session, user_id: int):
    """
    Returns a dictionary with total assignments and breakdown by approval_status
    for the current user (created_by=user_id).
    """
    total = db.query(Assignment).filter(Assignment.created_by == user_id).count()
    pending = db.query(Assignment).filter(
        Assignment.created_by == user_id,
        Assignment.approval_status == AssignmentStatus.Pending
    ).count()
    approved = db.query(Assignment).filter(
        Assignment.created_by == user_id,
        Assignment.approval_status == AssignmentStatus.Approved
    ).count()
    rejected = db.query(Assignment).filter(
        Assignment.created_by == user_id,
        Assignment.approval_status == AssignmentStatus.Rejected
    ).count()

    return {
        "total_assignments": total,
        "pending": pending,
        "approved": approved,
        "rejected": rejected
    }
