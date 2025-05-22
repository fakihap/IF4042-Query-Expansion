from pydantic import BaseModel, ConfigDict, Field

class DocumentBase(BaseModel):
    title: str = Field(...)
    author: str = Field(... )
    content: str = Field(...)

class DocumentResponse(DocumentBase):
    model_config = ConfigDict(from_attributes=True)
    id: int