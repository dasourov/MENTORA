from fastapi import APIRouter
from app.api.v1.endpoints import auth, users, health, advisers

api_router = APIRouter()

api_router.include_router(health.router, tags=["Health"])
api_router.include_router(auth.router, prefix="/auth", tags=["Auth"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(advisers.router, prefix="/advisers", tags=["Advisers"])
