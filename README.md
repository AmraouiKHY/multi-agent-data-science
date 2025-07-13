# Multi-Agent Data Processing Platform

A comprehensive platform for data preprocessing, machine learning, and intelligent orchestration using specialized microservices.

## 🎯 Project Context

This work represents a **partial contribution** to a **PFE (Projet de Fin d'Études)** project developed during an internship at **Kabas**. The platform addresses the growing need for automated data processing solutions in modern data science workflows.

### Project Team

**Interns:**
- **Khireddine Amraoui** - Intern
- **Merouane Boukandoura** - Intern

**Supervisors:**
- **Chemseddine Berbague** - ESTIN Supervisor
- **Abderaouf Haithem Aroua** - Kabas Supervisor & Internship Tutor

### Institutions
- **ESTIN** - École Supérieure en Sciences et Technologies de l'Informatique et du Numérique
- **Kabas** - Host Company for Internship

## 🎯 Objectives

The primary objectives of this platform are:

1. **Automate Data Processing Workflows** - Reduce manual intervention in data preprocessing tasks
2. **Democratize Data Science** - Provide intuitive interfaces for non-technical users
3. **Enable Scalable Processing** - Support enterprise-level data processing requirements
4. **Integrate AI-Driven Orchestration** - Leverage LLMs for intelligent task coordination
5. **Ensure Multi-Domain Compatibility** - Support various data types and industry domains

## 🔧 Main Functionalities

### 1. Data Preprocessing & Cleaning
- **Automated Quality Assessment**: Detect missing values, outliers, and data inconsistencies
- **Smart Data Cleaning**: Remove duplicates, handle missing values with multiple strategies
- **Data Transformation**: Normalization, standardization, and categorical encoding
- **Feature Engineering**: Create polynomial features, interaction terms, and apply PCA

### 2. Machine Learning Pipeline
- **Automated Model Training**: Support for multiple ML algorithms with hyperparameter optimization
- **Experiment Tracking**: MLflow integration for reproducible experiments
- **Model Evaluation**: Comprehensive performance metrics and cross-validation
- **Real-time Inference**: RESTful API endpoints for model predictions

### 3. Intelligent Orchestration
- **Multi-Agent Architecture**: Specialized agents for different data science tasks using LangGraph
- **Graph-Based Coordination**: Orchestrates complex workflows between agents
- **Natural Language Processing**: Understand and process user requests in plain language
- **User Validation**: Interactive approval system for important decisions
- **LLM Support**: Compatible with both local LLMs (Ollama) and Azure OpenAI

### 4. File Management System
- **Multi-format Support**: Handle CSV, Excel, JSON, Parquet, and other data formats
- **Version Control**: Track file changes and maintain data lineage
- **Secure Storage**: Encrypted file storage with access controls
- **Collaborative Features**: Multi-user support and shared workspaces

## 🚀 Future Improvements

### Short-term Enhancements
- **UI/UX Improvements**: Modern dashboard with enhanced visualization components
- **Multi-dataset Support**: Batch processing capabilities for multiple datasets simultaneously
- **Real-time Processing**: Support for streaming data and live updates

### Long-term Vision
- **Domain-Specific LLM Fine-tuning**: 
  - Healthcare: Medical data processing with HIPAA compliance
  - Finance: Risk analysis and fraud detection
  - Manufacturing: Quality control and predictive maintenance
- **Advanced Analytics**: Deep learning model support and AutoML capabilities
- **Cloud Integration**: Deployment on AWS, Azure, and GCP platforms
- **Edge Computing**: Support for distributed processing at the edge

## 🚀 Quick Start

```bash
# Start all services
make all-services

# Or run individual services
make data-analytics          # Port 10005
make data-preprocessing      # Port 10003
make file-manager-backend    # Port 20001
make file-manager-frontend   # Port 3000
make llm-orchestrator        # Port 9999
make ces                     # Port 1000
```

## 🏗️ Services

| Service | Port | Description |
|---------|------|-------------|
| **Data Analytics** | 10005 | Advanced data analysis and visualization |
| **Data Preprocessing** | 10003 | Data cleaning and transformation |
| **File Manager Backend** | 20001 | File storage and management API |
| **File Manager Frontend** | 3000 | Web interface for file operations |
| **LLM Orchestrator** | 9999 | AI-powered task coordination with multi-agent architecture |
| **Code Execution Service** | 1000 | Secure code execution environment |
## 📊 Usage

1. **Access Web Interface**: http://localhost:3000
2. **Upload Data**: Use the file manager interface
3. **Process Data**: Apply preprocessing and analytics through natural language commands
4. **Run ML Models**: Train and evaluate through the orchestrator with user validation
5. **View Results**: Monitor progress and download outputs

## 🛠️ Development

```bash
# Interactive CLI
make llm-cli

# Custom ports
make data-preprocessing port=10003

# Clean environment
make clean

# Help
make help
```

## 🔧 Tech Stack

- **Backend**: FastAPI, Flask, Python
- **Frontend**: Next.js, React, TypeScript
- **ML**: MLflow, Pandas, Scikit-learn
- **AI/LLM**: LangGraph, Azure OpenAI, Ollama
- **Containerization**: Docker, Docker Compose

## 📄 License

MIT License