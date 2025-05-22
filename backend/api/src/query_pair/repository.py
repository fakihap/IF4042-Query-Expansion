from sqlalchemy import delete, select, update
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from api.src.query_pair.models import QueryPair

class QueryPairRepository:

    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_all(self) -> list[QueryPair]:
        query = select(QueryPair)
        result = await self.session.execute(query)

        return list(result.scalars().all())