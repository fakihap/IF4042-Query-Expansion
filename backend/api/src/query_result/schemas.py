from pydantic import BaseModel, ConfigDict, Field

class QueryResultBase(BaseModel):
    score: float = Field(...)

class QueryResultResponse(QueryResultBase):
    model_config = ConfigDict(from_attributes=True)
    query_id: int
    document_id: int