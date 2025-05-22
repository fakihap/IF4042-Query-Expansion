from fastapi import FastAPI, Request

from api.core.config import settings

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/health")
async def healthcheck():
    return {"message": settings.DATABASE_URL}