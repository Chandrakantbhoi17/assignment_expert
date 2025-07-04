import enum
from app.models.base import Base
from sqlalchemy.orm import relationship
from sqlalchemy import (
    Column, Integer, String, Text, DateTime, Enum, ForeignKey, func, Float,Date
)

# Enum for approval status
class AssignmentStatus(enum.Enum):
    Pending = "pending"
    Approved = "approved"
    Rejected = "rejected"

class Assignment(Base):
    __tablename__ = 'assignments'

    id = Column(Integer, primary_key=True)
    title = Column(String(255), nullable=False)
    details = Column(Text)
    due_date = Column(Date, nullable=False)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    approval_status = Column(Enum(AssignmentStatus), default=AssignmentStatus.Pending, nullable=False)

    file_url = Column(String(255))       # File initially uploaded (e.g., by student)
    completed_url = Column(String(255))  # File uploaded after task is completed (e.g., by admin)

    amount = Column(Float,nullable=True)

    # 👇 Add this
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    creator = relationship("User", back_populates="assignments")

    payments = relationship("Payment", back_populates="assignment", lazy="dynamic")

    @property
    def total_paid(self):
        return sum(payment.amount_paid for payment in self.payments)

    @property
    def is_half_paid(self):
        if self.amount:
            return self.total_paid >= (self.amount / 2)
        return False

    @property
    def is_fully_paid(self):
        if self.amount:
            return self.total_paid >= self.amount
        return False
