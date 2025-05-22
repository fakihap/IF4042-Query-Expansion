from sqlalchemy import Column, Integer, Boolean, Text, DateTime
from sqlalchemy.orm import relationship, declarative_base
from sqlalchemy.sql import func

from api.core.database import Base

class Query(Base):
    __tablename__ = "queries"

    id = Column(Integer, primary_key=True)
    content = Column(Text, nullable=False)
    search_result = Column(Integer)
    is_expansion = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    results = relationship("QueryResult", back_populates="query", cascade="all, delete-orphan")
    pairs_as_original = relationship("QueryPair", back_populates="original_query", foreign_keys='QueryPair.query_id')
    pairs_as_expanded = relationship("QueryPair", back_populates="expanded_query", foreign_keys='QueryPair.expanded_query_id')
