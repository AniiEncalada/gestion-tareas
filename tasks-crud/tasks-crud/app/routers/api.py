from fastapi import APIRouter
from app.routers.tasks import router as router_tasks
from app.routers.auth import router as auth_router

router = APIRouter(prefix="/api/v1")
router.include_router(router_tasks)
router.include_router(auth_router)
