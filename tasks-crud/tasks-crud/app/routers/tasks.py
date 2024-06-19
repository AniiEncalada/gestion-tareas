from uuid import UUID
from app.common.responses import Response
from app.schemas.tasks.data import Task
from fastapi import APIRouter


router = APIRouter(prefix="/tasks", tags=["Task"])

tasks = []


@router.get("/", response_model=Response[list[Task]])
def get_all_tasks():
    return Response.success(tasks)


@router.get("/{task_id}", response_model=Response[Task])
def get_task_by_id(task_id: UUID):
    return Response.success(None)


@router.post("/")
def create_task():
    return {"error": "invalid body"}


@router.put("/{task_id}")
def update_task(task_id: UUID):
    return {"message": "created"}


@router.delete("/{task_id}")
def delete_task_by_id(task_id: UUID):
    return {"message": "deleted"}
