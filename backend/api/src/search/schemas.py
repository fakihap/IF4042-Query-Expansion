from pydantic import BaseModel

from enum import Enum

class TermFrequencyMode(Enum):
    Logarithmic = 'log'
    Binary = 'binary'
    Augmented = 'augmented'
    Natural = 'natural'
    No = 'no'

class SearchBase(BaseModel):
    queries: list[str]

    useStemming: bool
    useStopwordElim: bool

    tfMode: TermFrequencyMode
    useIDF: bool
    useNormalize: bool

class SearchRank(BaseModel):
    score: float
    document_id: int

class SearchRequest(SearchBase):
    pass

class SearchResponse(SearchBase):
    result: list[list[SearchRank]]