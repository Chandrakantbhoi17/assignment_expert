from pydantic import BaseModel
class AmountRequest(BaseModel):
    amount: float


class VerifyPaymentSchema(BaseModel):
    assignment_id: int
    payment_id: str
    order_id: str
    signature: str
    amount_paid: float
 