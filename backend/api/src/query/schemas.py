from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime

class QueryBase(BaseModel):
    content: str = Field(...)
    is_expansion: bool = Field(... )
    created_at: datetime = Field(...)

class QueryResponse(QueryBase):
    model_config = ConfigDict(from_attributes=True)
    id: int