from api.src.document.repository import DocumentRepository
from api.src.document.schemas import DocumentResponse


class DocumentService:

    def __init__(self, repository: DocumentRepository):
        self.repository = repository

    async def get_all_documents(self) -> list[DocumentResponse]:
        documents = await self.repository.get_all()

        print(documents, "testservc")
        return [DocumentResponse.model_validate(document) for document in documents]