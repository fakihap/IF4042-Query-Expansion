from fastapi import FastAPI, Request

from api.core.config import settings

from api.src.document.routes import router as documents_router

app = FastAPI()

app.include_router(documents_router)

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/health")
async def healthcheck():
    return {"message": settings.DATABASE_URL}