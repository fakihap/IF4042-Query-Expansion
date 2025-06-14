from pydantic import BaseModel
from typing import Optional

from enum import Enum

class TermFrequencyMode(Enum):
    Logarithmic = 'logarithmic'
    Binary = 'binary'
    Augmented = 'augmented'
    Natural = 'natural'
    No = 'no'

class SearchBase(BaseModel):
    query: str
    useStemming: bool
    useStopwordElim: bool
    tfMode: TermFrequencyMode
    useIDF: bool
    useNormalize: bool
    numberExpansionWords: int

class SearchInvertBase(BaseModel):
    document_id: int
    useStemming: bool
    useStopwordElim: bool
    tfMode: TermFrequencyMode
    useIDF: bool
    useNormalize: bool

class SearchRank(BaseModel):
    similarity: float
    document_id: int

class SearchInverted(BaseModel):
    document_id: int
    title: str
    author: str
    abstract: str
    vocab: list[list[str]]
    tf: list[list[float]]
    idf: list[list[float]]

class SearchRequest(SearchBase):
    pass
class SearchInvertRequest(SearchInvertBase):
    pass

class SearchResponse(SearchBase):
    result: list[tuple[list[SearchRank], list[str], list[list[float]], list[list[float]], list[list[str]]]]

class SearchInvertResponse(SearchInvertBase):
    result: SearchInverted