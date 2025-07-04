import enum
from sqlalchemy import (
    Column, Integer, String, Text, DateTime, Float, Enum, ForeignKey, func
)
from app.models.base import Base
from sqlalchemy.orm import relationship


class Payment(Base):
    __tablename__ = 'payments'

    id = Column(Integer, primary_key=True)
    assignment_id = Column(Integer, ForeignKey('assignments.id'), nullable=False)
    user_id = Column(Integer, ForeignKey('users.id'))  # Optional: to track who paid
    amount_paid = Column(Float, nullable=False)
    payment_date = Column(DateTime, default=func.now())
    payment_method = Column(String(50))  # e.g., 'credit_card', 'paypal', 'bank_transfer'
    status = Column(String(20), default='completed')  # e.g., 'pending', 'completed', 'failed'

    assignment = relationship("Assignment",back_populates="payments")
