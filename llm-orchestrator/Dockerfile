FROM python:3.11-slim

# Add a non-root user for security
RUN adduser --disabled-password --gecos '' runner

WORKDIR /app

# Create uploads directory and set permissions
RUN mkdir -p /app/uploads

# Copy requirements first for better caching
COPY requirements.txt .
RUN pip3 install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Set proper permissions
RUN chown -R runner:runner /app

USER runner

# Define volume for persistent uploads
VOLUME ["/app/uploads"]

# Expose the port the app runs on
EXPOSE 9999

# Command to run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "9999"]