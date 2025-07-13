FROM python:3.11-slim

# Install curl for healthchecks
RUN apt-get update && apt-get install -y curl && apt-get clean

RUN adduser --disabled-password --gecos '' runner

WORKDIR /app

# Copy requirements first for better caching
COPY requirements.txt .
# Add timeout and retry parameters to fix pip timeout issues
RUN pip3 install --no-cache-dir --timeout=120 --retries=5 -r requirements.txt || pip3 install --no-cache-dir --timeout=120 --retries=5 -r requirements.txt

# Copy the rest of the application
COPY . .

# Set proper permissions
RUN chown -R runner:runner /app

USER runner

EXPOSE 10003



CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "10003"]