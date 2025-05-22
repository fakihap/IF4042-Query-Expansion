from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from api.src.query_pair.service import QueryPairService
from api.src.query_pair.repository import QueryPairRepository
from api.src.query_pair.schemas import QueryPairResponse

from api.core.database import get_session

router = APIRouter(prefix="/pairs", tags=["query_pairs"])

def get_query_pair_service(session: AsyncSession = Depends(get_session)) -> QueryPairService:
    repository = QueryPairRepository(session)
    return QueryPairService(repository)

@router.get("/", response_model=list[QueryPairResponse])
async def get_all_query_pairs(
    service: QueryPairService = Depends(get_query_pair_service),
) -> list[QueryPairResponse]:
    
    try:
        queries = await service.get_all_query_pairs()

        return queries
    except Exception as e:
        print(e)
        raise
