FROM python:3.11-slim

WORKDIR /app

# Copy requirements first for better caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Create uploads directory
RUN mkdir -p /app/uploads

# Expose API port
EXPOSE 20001

# Run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "20001"]