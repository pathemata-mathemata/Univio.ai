from fastapi import APIRouter
from app.api.v1 import auth, users, institutions, courses, transfer, planning, debug

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(institutions.router, prefix="/institutions", tags=["institutions"])
api_router.include_router(courses.router, prefix="/courses", tags=["courses"])
api_router.include_router(transfer.router, prefix="/transfer", tags=["transfer"])
api_router.include_router(planning.router, prefix="/planning", tags=["planning"])
api_router.include_router(debug.router, prefix="/debug", tags=["debug"]) 