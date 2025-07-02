# services/admin_dashboard_service.py

from sqlalchemy.orm import Session
from app.models.assignment import Assignment,AssignmentStatus

def get_assignment_summary(db: Session):
    """
    Returns a dictionary with total assignments and breakdown by approval_status .
    """
    total = db.query(Assignment).count()
    pending = db.query(Assignment).filter(Assignment.approval_status  == AssignmentStatus.Pending).count()
    approved = db.query(Assignment).filter(Assignment.approval_status  == AssignmentStatus.Approved).count()
    rejected = db.query(Assignment).filter(Assignment.approval_status  == AssignmentStatus.Rejected).count()

    return {
        "total_assignments": total,
        "pending": pending,
        "approved": approved,
        "rejected": rejected
    }
