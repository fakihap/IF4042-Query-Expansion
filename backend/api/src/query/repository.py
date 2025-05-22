from sqlalchemy import delete, select, update
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from api.src.query.models import Query

class QueryRepository:

    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_all(self) -> list[Query]:
        query = select(Query)
        result = await self.session.execute(query)

        return list(result.scalars().all())
    
    async def get(self, id) -> Query:
        query = select(Query).where(Query.id == id)
        result = await self.session.execute(query)

        return result.scalars().first()