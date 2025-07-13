from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "Multi-Agent Data Science System"
    API_V1_STR: str = "/api/v1"
    
    # LLM Provider selection
    LLM_PROVIDER: str = "azure"  # Options: "ollama", "azure"
    
    # Ollama settings
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    # OLLAMA_MODEL: str = "gemma3:4b"
    OLLAMA_MODEL: str = "qwen2.5:14b"
    
    # Azure OpenAI settings
    AZURE_OPENAI_API_KEY: Optional[str] = None
    AZURE_OPENAI_ENDPOINT: Optional[str] = None  # Base endpoint without deployment path
    AZURE_OPENAI_API_VERSION: str = "2024-08-01-preview"
    AZURE_OPENAI_DEPLOYMENT_NAME: Optional[str] = None
    
    # Helper property to get the full Azure endpoint URL
    @property
    def AZURE_OPENAI_FULL_ENDPOINT(self):
        if self.AZURE_OPENAI_ENDPOINT and self.AZURE_OPENAI_DEPLOYMENT_NAME:
            return f"{self.AZURE_OPENAI_ENDPOINT}/openai/deployments/{self.AZURE_OPENAI_DEPLOYMENT_NAME}/chat/completions"
        return None

    # Common LLM parameters
    TEMPERATURE: float = 0.7
    MAX_TOKENS: int = 5000

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()