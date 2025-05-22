from pydantic import BaseModel, ConfigDict, Field

from datetime import datetime

from api.src.query_pair.models import QueryScheme

class QueryPairBase(BaseModel):
    terms_expanded: int = Field(...) # TODO: set min to 0 later

    used_stemming: bool = Field(... )
    removed_stopword: bool = Field(...)

    scheme_used: QueryScheme = Field(...)

    created_at: datetime = Field(...) # TODO: set to proper type

class QueryPairResponse(QueryPairBase):
    model_config = ConfigDict(from_attributes=True)
    query_id: int
    expanded_query_id: int