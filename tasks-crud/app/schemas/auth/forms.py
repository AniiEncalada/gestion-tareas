from pydantic import BaseModel


class LoginForm(BaseModel):
    email: str
    password: str


class SignupForm(BaseModel):
    email: str
    password: str
