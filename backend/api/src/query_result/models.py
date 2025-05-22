from sqlalchemy import Column, Integer, Float, ForeignKey, PrimaryKeyConstraint
from sqlalchemy.orm import relationship

from api.core.database import Base

class QueryResult(Base):
    __tablename__ = "query_results"
    __table_args__ = (
        PrimaryKeyConstraint('query_id', 'document_id'),
    )

    query_id = Column(Integer, ForeignKey("queries.id"))
    document_id = Column(Integer, ForeignKey("documents.id"))
    score = Column(Float)  # changed to float assuming cosine/TF-IDF scores

    # Relationships
    query = relationship("Query", back_populates="results")
    document = relationship("Document")