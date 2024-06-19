from fastapi import FastAPI
from app.routers.api import router as router_api_v1


def get_app():
    app = FastAPI(title="XP Programación API - Tasks APP")
    app.include_router(router_api_v1)
    return app
