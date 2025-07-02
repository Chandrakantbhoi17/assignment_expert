import razorpay
from app.core.config import settings
from fastapi import  HTTPException,APIRouter,Depends
from app.models.base import get_db
from app.models.payement import Payment
from app.models.user import User
from app.core.dependencies import get_current_user
from app.models.assignment import Assignment
from app.schemas.payment import AmountRequest,VerifyPaymentSchema
from sqlalchemy.orm import Session
razorpay_client = razorpay.Client(
    auth=(settings.RAZORPAY_KEY_ID,settings.RAZORPAY_SECRET_KEY)
)
router = APIRouter(tags=["Payment"])

@router.post("/create-order/")
def create_order(data: AmountRequest):
    try:
        # Convert to paise (e.g., ₹100 -> 10000)
        amount_paise = int(data.amount * 100)
        order = razorpay_client.order.create(dict(
            amount=amount_paise,
            currency="INR",
            payment_capture=1
        ))
        return {"order_id": order["id"], "amount": amount_paise, "currency": "INR"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

@router.post("/verify-payment/")
def verify_payment(payload: VerifyPaymentSchema, db: Session = Depends(get_db),current_user: User = Depends(get_current_user)):
    try:
        razorpay_client.utility.verify_payment_signature({
            "razorpay_order_id": payload.order_id,
            "razorpay_payment_id": payload.payment_id,
            "razorpay_signature": payload.signature,
        })
    except razorpay.errors.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid payment signature")

    payment = Payment(
        assignment_id=payload.assignment_id,
        amount_paid=payload.amount_paid,
        payment_method="razorpay",
        status="completed",
        user_id=current_user.id
    )

    db.add(payment)



    db.commit()
    return {"message": "Payment verified and saved"}