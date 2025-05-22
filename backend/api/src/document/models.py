from sqlalchemy import Column, Integer, String, Text

from api.core.database import Base

class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True)
    title = Column(String)
    author = Column(String)
    content = Column(Text)