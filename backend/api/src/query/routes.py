from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from api.src.query.service import QueryService
from api.src.query.repository import QueryRepository
from api.src.query.schemas import QueryResponse

from api.core.database import get_session

router = APIRouter(prefix="/queries", tags=["queries"])

def get_query_service(session: AsyncSession = Depends(get_session)) -> QueryService:
    repository = QueryRepository(session)
    return QueryService(repository)

@router.get("/", response_model=list[QueryResponse])
async def get_all_queries(
    service: QueryService = Depends(get_query_service),
) -> list[QueryService]:
    
    try:
        queries = await service.get_all_queries()

        return queries
    except Exception as e:
        print(e)
        raise

@router.get("/{id}", response_model=QueryResponse)
async def get_query(
    id: int,
    service: QueryService = Depends(get_query_service),
) -> QueryResponse:
    
    try:
        query = await service.get_query(id)

        return query
    except Exception as e:
        print(e)
        raise
