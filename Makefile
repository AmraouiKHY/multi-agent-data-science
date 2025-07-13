# Multi-Agent Data Science System Makefile
# This Makefile simplifies running services with their virtual environments

# Default port values
DATA_ANALYTICS_PORT ?= 10005
DATA_PREPROCESSING_PORT ?= 10003
DUMMY_TESTING_PORT ?= 10000
FILE_MANAGER_BACKEND_PORT ?= 20001
FILE_MANAGER_FRONTEND_PORT ?= 3000
LLM_ORCH ?= 9999
CES_PORT ?= 1000

# Log level settings (ERROR shows only errors, disabling INFO logs)
LOG_LEVEL ?= ERROR
PYTHONUNBUFFERED ?= 1
PYTHONWARNINGS ?= ignore

.PHONY: all data-analytics data-preprocessing dummy-testing file-manager-backend file-manager-frontend llm-orchestrator ces run-all clean help ces-direct llm-cli

# Default target
all: help

# Help message
help:
	@echo "Multi-Agent Data Science System Makefile"
	@echo "----------------------------------------"
	@echo "Available commands:"
	@echo "  make data-analytics [port=PORT]        - Run the data analytics agent (default port: $(DATA_ANALYTICS_PORT))"
	@echo "  make data-preprocessing [port=PORT]    - Run the data preprocessing agent (default port: $(DATA_PREPROCESSING_PORT))"
	@echo "  make dummy-testing [port=PORT]         - Run the dummy testing agent (default port: $(DUMMY_TESTING_PORT))"
	@echo "  make file-manager-backend [port=PORT]  - Run the file manager backend (default port: $(FILE_MANAGER_BACKEND_PORT))"
	@echo "  make file-manager-frontend [port=PORT] - Run the file manager frontend (default port: $(FILE_MANAGER_FRONTEND_PORT))"
	@echo "  make llm-orchestrator [port=PORT]      - Run the LLM Orchestrator (default port: $(LLM_ORCH))"
	@echo "  make ces [port=PORT]                   - Run the Code Execution Service using docker-compose (default port: 1001)"
	@echo "  make llm-cli                           - Run the LLM Orchestrator CLI in interactive mode"
	@echo "  make run-all                           - Run all services in separate terminal windows"
	@echo "  make clean                             - Clean up temporary files"
	@echo "  make all-services                      - Run all services using docker-compose"
	@echo "  make help                              - Show this help message"
	@echo "  make ces-direct                        - Run the Code Execution Service directly from the ces folder"
	@echo ""
	@echo "Examples:"
	@echo "  make data-analytics port=8000          - Run data analytics agent on port 8000"

# Data Analytics Agent
data-analytics:
	@echo "Starting Data Analytics Agent on port $(port)..."
	@cd data-analytics-agent && \
	if [ ! -d "venv" ]; then \
		echo "Creating virtual environment..."; \
		python3 -m venv venv; \
	fi && \
	. venv/bin/activate && \
	pip install -r requirements.txt && \
	uvicorn main:app --host 0.0.0.0 --port $(if $(port),$(port),$(DATA_ANALYTICS_PORT)) --reload

# Data Preprocessing Agent
data-preprocessing:
	@echo "Starting Data Preprocessing Agent on port $(port)..."
	@cd data-preprocessing-agent && \
	if [ ! -d "venv" ]; then \
		echo "Creating virtual environment..."; \
		python3 -m venv venv; \
	fi && \
	. venv/bin/activate && \
	pip install -r requirements.txt && \
	uvicorn main:app --host 0.0.0.0 --port $(if $(port),$(port),$(DATA_PREPROCESSING_PORT)) --reload

# Dummy Testing Agent
dummy-testing:
	@echo "Starting Dummy Testing Agent on port $(port)..."
	@cd dummy-testing-agent && \
	if [ ! -d "venv" ]; then \
		echo "Creating virtual environment..."; \
		python3 -m venv venv; \
	fi && \
	. venv/bin/activate && \
	pip install -r requirements.txt && \
	uvicorn app:app --host 0.0.0.0 --port $(if $(port),$(port),$(DUMMY_TESTING_PORT)) --reload

# File Manager Backend
file-manager-backend:
	@echo "Starting File Manager Backend on port $(port)..."
	@cd file-manager && \
	if [ ! -d "venv" ]; then \
		echo "Creating virtual environment..."; \
		python3 -m venv venv; \
	fi && \
	. venv/bin/activate && \
	pip install -r requirements.txt && \
	uvicorn main:app --host 0.0.0.0 --port $(if $(port),$(port),$(FILE_MANAGER_BACKEND_PORT)) --reload

# File Manager Frontend
file-manager-frontend:
	@echo "Starting File Manager Frontend on port $(port)..."
	@cd file-manager/frontend && \
	npm install && \
	if [ -n "$(port)" ]; then \
		NEXT_PUBLIC_PORT=$(port) npm run dev -- -p $(port); \
	else \
		npm run dev; \
	fi

# LLM Orchestrator
llm-orchestrator:
	@echo "Starting LLM Orchestrator on port $(port)..."
	@cd llm-orchestrator && \
	if [ ! -d "venv" ]; then \
		echo "Creating virtual environment..."; \
		python3 -m venv venv; \
	fi && \
	. venv/bin/activate && \
	uvicorn app.main:app --host 0.0.0.0 --port $(if $(port),$(port),$(LLM_ORCH)) --reload

# Code Execution Service
ces:
	@echo "Starting Code Execution Service using docker-compose..."
	@cd ces && \
	if [ -n "$(port)" ]; then \
		echo "version: '3.8'\n\nservices:\n  heavy-task:\n    ports:\n      - \"$(port):1000\"" > docker-compose.override.yml && \
		docker-compose up --build && \
		rm docker-compose.override.yml; \
	else \
		docker-compose up --build; \
	fi

# Run CES directly without Docker
ces-direct:
	@echo "Starting Code Execution Service directly from ces folder..."
	@cd ces && \
	if [ ! -d "venv" ]; then \
		echo "Creating virtual environment..."; \
		python3 -m venv venv; \
	fi && \
	. venv/bin/activate && \
	pip install -r requirements.txt && \
	uvicorn app:app --host 0.0.0.0 --port $(if $(port),$(port),$(CES_PORT)) --reload

# LLM CLI
llm-cli:
	@echo "Starting LLM Orchestrator CLI in interactive mode..."
	@cd llm-orchestrator && \
	if [ ! -d "venv" ]; then \
		echo "Creating virtual environment..."; \
		python3 -m venv venv; \
	fi && \
	. venv/bin/activate && \
	python cli.py 

# Run all services using docker-compose
all-services:
	@echo "Starting all services using docker-compose..."
	docker-compose up --build

# Run all services in separate terminal windows
run-all:
	@echo "Starting all services in separate terminal windows..."
	@osascript -e 'tell application "Terminal" to do script "cd $(PWD) && make data-analytics"'
	@osascript -e 'tell application "Terminal" to do script "cd $(PWD) && make data-preprocessing"'
	@osascript -e 'tell application "Terminal" to do script "cd $(PWD) && make dummy-testing"'
	@osascript -e 'tell application "Terminal" to do script "cd $(PWD) && make file-manager-backend"'
	@osascript -e 'tell application "Terminal" to do script "cd $(PWD) && make file-manager-frontend"'
	@osascript -e 'tell application "Terminal" to do script "cd $(PWD) && make llm-orchestrator"'
	@osascript -e 'tell application "Terminal" to do script "cd $(PWD) && make ces"'
	@echo "All services started in separate terminal windows."

# Clean up temporary files
clean:
	@echo "Cleaning up temporary files..."
	find . -type d -name "__pycache__" -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete
	find . -type f -name "*.pyo" -delete
	find . -type f -name "*.pyd" -delete
	find . -type f -name ".DS_Store" -delete
	find . -type d -name "*.egg-info" -exec rm -rf {} +
	find . -type d -name "*.egg" -exec rm -rf {} +
	find . -type d -name ".pytest_cache" -exec rm -rf {} +
	find . -type d -name ".coverage" -exec rm -rf {} +
	find . -type d -name "htmlcov" -exec rm -rf {} +
	find . -type d -name ".tox" -exec rm -rf {} +
	find . -type d -name ".hypothesis" -exec rm -rf {} +
