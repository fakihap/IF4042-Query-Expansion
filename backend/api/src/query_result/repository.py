from sqlalchemy import delete, select, update
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from api.src.query_result.models import QueryResult

class QueryResultRepository:

    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_all(self) -> list[QueryResult]:
        query = select(QueryResult)
        result = await self.session.execute(query)

        return list(result.scalars().all())