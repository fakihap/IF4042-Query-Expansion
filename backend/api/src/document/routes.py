from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from api.src.document.service import DocumentService
from api.src.document.repository import DocumentRepository
from api.src.document.schemas import DocumentResponse

from api.core.database import get_session

router = APIRouter(prefix="/documents", tags=["documents"])

def get_document_service(session: AsyncSession = Depends(get_session)) -> DocumentService:
    repository = DocumentRepository(session)
    return DocumentService(repository)

@router.get("/", response_model=list[DocumentResponse])
async def get_all_documents(
    service: DocumentService = Depends(get_document_service),
) -> list[DocumentService]:
    
    try:
        documents = await service.get_all_documents()

        print(documents, "pit[itas]")
        return documents
    except Exception as e:
        print(e)
        raise
