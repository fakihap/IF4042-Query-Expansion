FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

RUN python -m nltk.downloader stopwords

COPY ./api ./api
COPY ./scripts/ ./scripts

COPY ./alembic ./alembic
COPY alembic.ini alembic.ini

# RUN ["printenv"]
# CMD ["uvicorn", "api.main:app", "--host", "0.0.0.0", "--port", "8000"]