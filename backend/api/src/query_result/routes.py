from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from api.src.query_result.service import QueryResultService
from api.src.query_result.repository import QueryResultRepository
from api.src.query_result.schemas import QueryResultResponse

from api.core.database import get_session

router = APIRouter(prefix="/results", tags=["query_results"])

def get_query_result_service(session: AsyncSession = Depends(get_session)) -> QueryResultService:
    repository = QueryResultRepository(session)
    return QueryResultService(repository)

@router.get("/", response_model=list[QueryResultResponse])
async def get_all_query_results(
    service: QueryResultService = Depends(get_query_result_service),
) -> list[QueryResultResponse]:
    
    try:
        results = await service.get_all_query_results()

        return results
    except Exception as e:
        print(e)
        raise
