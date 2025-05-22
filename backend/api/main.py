from fastapi import FastAPI, Request

from api.core.config import settings

from api.src.document.routes import router as documents_router
from api.src.query_pair.routes import router as query_pair_router
from api.src.query.routes import router as query_router
from api.src.query_result.routes import router as query_result_router

app = FastAPI()

app.include_router(documents_router)
app.include_router(query_pair_router)
app.include_router(query_router)
app.include_router(query_result_router)

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/health")
async def healthcheck():
    return {"message": settings.DATABASE_URL}