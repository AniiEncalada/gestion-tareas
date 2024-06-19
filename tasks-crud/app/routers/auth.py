from uuid import UUID
from fastapi import APIRouter


router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/login")
def login():
    pass


@router.get("/signup")
def register(task_id: UUID):
    pass
