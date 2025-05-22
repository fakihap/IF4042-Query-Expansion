from api.src.query_result.repository import QueryResultRepository
from api.src.query_result.schemas import QueryResultResponse


class QueryResultService:

    def __init__(self, repository: QueryResultRepository):
        self.repository = repository

    async def get_all_query_results(self) -> list[QueryResultResponse]:
        query_results = await self.repository.get_all()

        return [QueryResultResponse.model_validate(query_result) for query_result in query_results]