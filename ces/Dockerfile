FROM python:3.11-slim

RUN adduser --disabled-password --gecos '' runner

WORKDIR /home/runner

COPY app.py .

COPY requirements.txt .

RUN pip3 install --no-cache-dir -r requirements.txt

USER runner

EXPOSE 1000

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "1000"]
