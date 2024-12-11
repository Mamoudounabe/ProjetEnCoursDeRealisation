FROM python:3.11

RUN apt-get update && apt-get install -y netcat-openbsd && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY data /var/lib/neo4j/import/data
COPY . .

COPY requirements.txt /app/requirements.txt
RUN pip install -r requirements.txt

COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

CMD ["./entrypoint.sh"]