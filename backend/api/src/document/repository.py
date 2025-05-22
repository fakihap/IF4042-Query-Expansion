from sqlalchemy import delete, select, update
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from api.src.document.models import Document

class DocumentRepository:

    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_all(self) -> list[Document]:
        query = select(Document)
        result = await self.session.execute(query)

        return list(result.scalars().all())