from typing import Generic, Literal, Optional, TypeVar
from uuid import UUID

from fastapi import status as STATUS
from fastapi.responses import JSONResponse
from pydantic import BaseModel

#
T = TypeVar("T")


class GenericResponse(BaseModel, Generic[T]):
    message: str
    status: Literal["ok"] | Literal["error"]
    data: Optional[T]
    error: Optional[str] = None


class Response(BaseModel, Generic[T]):
    message: str
    status: Literal["ok"] | Literal["error"]
    data: Optional[T]
    error: Optional[str] = None

    @classmethod
    def create_response(
        cls,
        data: Optional[T] = None,  # type: ignore
        message: str = "success",
        status_code: int = STATUS.HTTP_200_OK,
        status: Literal["ok"] | Literal["error"] = "ok",
        error: str | None = None,
    ) -> JSONResponse:
        """Return a success response

        Parameters:
        data (T): The data of the response
        message (str): The message of the response
        status_code (int): The status code of the response
        status (str): The status of the response
        """

        return JSONResponse(
            status_code=status_code,
            content=GenericResponse[T](
                message=message, status=status, data=data, error=error
            ).model_dump(mode="json"),
        )

    @classmethod
    def success(
        cls,
        data: Optional[T] = None,
        message: str = "success",
        status_code: int = STATUS.HTTP_200_OK,
    ):
        return cls.create_response(data=data, message=message, status_code=status_code)

    @classmethod
    def fail(
        cls,
        data: Optional[T] = None,
        message: str = "error",
        error: str | None = None,
        status_code: int = STATUS.HTTP_400_BAD_REQUEST,
    ):
        return cls.create_response(
            data=data, message=message, status_code=status_code, error=error
        )


class CommonDeleteResponse(BaseModel):
    id: UUID | None


DeleteResponse = GenericResponse[CommonDeleteResponse | None]
