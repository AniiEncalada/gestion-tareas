from dataclasses import dataclass
import uuid
from typing import Any, Type, List, Union, Optional, Self
from sqlalchemy import func, literal_column, select, String, insert

from app.database import db
from datetime import datetime
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy_serializer import SerializerMixin


class BaseModel(db.Model, SerializerMixin):
    __abstract__ = True

    db = db

    id: Mapped[uuid.UUID] = mapped_column(
        String(36), primary_key=True, default=str(uuid.uuid4())
    )
    created_at: Mapped[datetime] = mapped_column(nullable=False, default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        nullable=False, default=func.now(), onupdate=func.now()
    )
    is_active: Mapped[bool] = mapped_column(nullable=False, default=True)
    is_deleted: Mapped[bool] = mapped_column(nullable=False, default=False)

    def __repr__(self):
        return f"<{self.__class__.__name__}(id={self.id}, created_at={self.created_at}, updated_at={self.updated_at}, is_active={self.is_active}, is_deleted={self.is_deleted})>"

    @classmethod
    def find_all(
        cls: Type[Self], limit: int = 100, offset: int = 0, eq: dict[str, Any] = None
    ) -> List[Self]:
        """Find all records."""
        stmt = select(cls).limit(limit).offset(offset)
        if isinstance(eq, dict):
            for k, v in eq.items():
                stmt.where(getattr(cls, k) == v)
        result = cls.db.session.execute(stmt).scalars().all()
        return result

    @classmethod
    def find_one(
        cls: Type[Self], id_: Optional[str] = None, eq: Optional[dict[str, Any]] = None
    ) -> Union[Self, None]:
        """Find a record by ID."""
        stmt = select(cls).limit(1)

        if id_ is not None:
            stmt = stmt.where(cls.id == id_)

        if isinstance(eq, dict):
            for k, v in eq.items():
                stmt = stmt.where(getattr(cls, k) == v)
        result = cls.db.session.execute(stmt).scalar()
        return result

    @classmethod
    def insert_one(cls: Type[Self], data: dict[str, Any], return_: bool = True) -> Self:
        """Insert one record."""
        instance = cls(**data)
        db.session.add(instance)
        db.session.commit()
        return instance

    @classmethod
    def insert_many(cls: Type[Self], data: list[dict[str, Any]]) -> List[Self]:
        """Insert multiple records."""
        instances = [cls(**data) for item in data]
        db.session.add_all(instances)
        db.session.commit()
        return instances

    def update(self, data: dict[str, Any]) -> Self:
        """Update the current record."""
        for attr, value in data.items():
            setattr(self, attr, value)
        db.session.commit()
        return self

    @classmethod
    def update_one(
        cls: Type[Self], id_: str, data: dict[str, Any]
    ) -> Union[Self, None]:
        """Update one record by ID."""
        instance = cls.find_one(id_)
        if instance is not None:
            return instance.update(data)
        return None

    @classmethod
    def update_many(cls: Type[Self], filter_args: dict, **kwargs) -> List[Self]:
        """Update multiple records that match the filter."""
        instances = cls.query.filter_by(**filter_args).all()
        if instances:
            for instance in instances:
                instance.update(**kwargs)
            return instances
        return []

    def delete(self) -> None:
        """Delete the current record."""
        db.session.delete(self)
        db.session.commit()

    @classmethod
    def delete_one(cls: Type[Self], id_: str) -> bool:
        """Delete one record by ID."""
        instance = cls.find_one(id_)
        if instance:
            instance.delete()
            return id_
        return None

    @classmethod
    def soft_delete_one(cls: Type[Self], id_: str):
        """Changes `is_deleted` flag to True"""
        return cls.update_one(id_, {"is_deleted": True})

    @classmethod
    def delete_many(cls: Type[Self], filter_args: dict) -> bool:
        """Delete multiple records that match the filter."""
        instances = cls.query.filter_by(**filter_args).all()
        if instances:
            for instance in instances:
                instance.delete()
            return True
        return False
