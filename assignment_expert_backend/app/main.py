from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api.v1.endpoints.user  import router as  user_v1_router
from app.api.v1.endpoints.auth import router as auth_v1_router
from app.api.v1.endpoints.assignment import router as assignment_v1_router
from app.api.v1.endpoints.admin_assignments import router as v1_admin_assignments_router
from app.api.v1.endpoints.payment import router as v1_payment_router
from app.api.v1.endpoints.admin_dashboard import router as v1_admin_dashboard_router
from app.api.v1.endpoints.user_dashboard import router as v1_user_dashboard_router
def get_application():
    _app = FastAPI(title=settings.PROJECT_NAME)

    _app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    return _app


app = get_application()
app.include_router(user_v1_router)
app.include_router(auth_v1_router)
app.include_router(assignment_v1_router)
app.include_router(v1_admin_assignments_router)
app.include_router(v1_payment_router)
app.include_router(v1_admin_dashboard_router)
app.include_router(v1_user_dashboard_router)
