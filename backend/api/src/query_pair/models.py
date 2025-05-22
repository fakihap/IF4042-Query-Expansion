from sqlalchemy import Column, Integer, Boolean, DateTime, ForeignKey, PrimaryKeyConstraint, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from api.core.database import Base

import enum

class QueryScheme(str, enum.Enum):
    LogarithmicTF = "LogarithmicTF"
    BinaryTF = "BinaryTF"
    AugmentationTF = "AugmentationTF"
    NaturalTF = "NaturalTF"
    IDF = "IDF"
    TFxIDF = "TFxIDF"
    TFxIDFxNorm = "TFxIDFxNorm"

class QueryPair(Base):
    __tablename__ = "query_pairs"
    __table_args__ = (
        PrimaryKeyConstraint('query_id', 'expanded_query_id'),
    )

    query_id = Column(Integer, ForeignKey("queries.id"))
    expanded_query_id = Column(Integer, ForeignKey("queries.id"))
    terms_expanded = Column(Integer)

    used_stemming = Column(Boolean)
    removed_stopword = Column(Boolean)
    scheme_used = Column(Enum(QueryScheme), nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    original_query = relationship("Query", foreign_keys=[query_id], back_populates="pairs_as_original")
    expanded_query = relationship("Query", foreign_keys=[expanded_query_id], back_populates="pairs_as_expanded")