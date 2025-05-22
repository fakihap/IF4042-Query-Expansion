from api.src.query_pair.repository import QueryPairRepository
from api.src.query_pair.schemas import QueryPairResponse


class QueryPairService:

    def __init__(self, repository: QueryPairRepository):
        self.repository = repository

    async def get_all_query_pairs(self) -> list[QueryPairResponse]:
        query_pairs = await self.repository.get_all()

        return [QueryPairResponse.model_validate(query_pair) for query_pair in query_pairs]