# Frontend static file server
FROM python:3.11-slim

WORKDIR /app

COPY index.html .
COPY styles/ ./styles/
COPY logic/ ./logic/
COPY libs/ ./libs/
COPY img/ ./img/

EXPOSE 3000

CMD ["python", "-m", "http.server", "3000"]