from pydantic import BaseModel
from typing import Optional


class Task(BaseModel):
    title: str
    description: str
    marked: bool = False
    user_id: Optional[str] = None
