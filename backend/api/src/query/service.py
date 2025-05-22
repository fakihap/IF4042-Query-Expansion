from api.src.query.repository import QueryRepository
from api.src.query.schemas import QueryResponse


class QueryService:

    def __init__(self, repository: QueryRepository):
        self.repository = repository

    async def get_all_queries(self) -> list[QueryResponse]:
        queries = await self.repository.get_all()

        return [QueryResponse.model_validate(query) for query in queries]
    
    async def get_query(self, id) -> QueryResponse:
        query = await self.repository.get(id)

        return QueryResponse.model_validate(query)