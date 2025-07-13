from langchain_ollama import ChatOllama
from langchain_openai import AzureChatOpenAI
from langchain_groq import ChatGroq  # Import for Groq
from langchain.schema.language_model import BaseLanguageModel
import logging
from .config import settings
import os
logger = logging.getLogger(__name__)

# Global variables for simple LLM switching
current_provider = os.getenv("DEFAULT_LLM_PROVIDER", "azure")  # Add this line
current_ollama_model = "qwen2.5:14b"  # Default Ollama model

def get_ollama_llm(model_name: str = None) -> BaseLanguageModel:
    """Returns an instance of ChatOllama compatible with LangGraph tools."""
    model = model_name or current_ollama_model
    return ChatOllama(
        base_url=settings.OLLAMA_BASE_URL,
        model=model,
        temperature=settings.TEMPERATURE,
        max_tokens=8000,  # Specify maximum number of tokens for the response
        # You can add top_p, top_k, etc. if supported by ChatOllama
    )

def get_azure_llm() -> BaseLanguageModel:
    """Returns an instance of Azure OpenAI LLM."""
    if not settings.AZURE_OPENAI_API_KEY or not settings.AZURE_OPENAI_ENDPOINT:
        raise ValueError("Azure OpenAI API key and endpoint must be configured")
    if not settings.AZURE_OPENAI_DEPLOYMENT_NAME:
        raise ValueError("Azure OpenAI deployment name must be configured")
    return AzureChatOpenAI(
        azure_endpoint=settings.AZURE_OPENAI_ENDPOINT,
        azure_deployment=settings.AZURE_OPENAI_DEPLOYMENT_NAME,
        api_key=settings.AZURE_OPENAI_API_KEY,
        api_version=settings.AZURE_OPENAI_API_VERSION,
        temperature=settings.TEMPERATURE,
        max_tokens=5000
    )

def get_groq_llm() -> BaseLanguageModel:
    """Returns an instance of Groq LLM."""
    # if not settings.GROQ_API_KEY:
    #     raise ValueError("Groq API key must be configured to use Groq")
    api_key=""
    return ChatGroq(
        model="meta-llama/llama-4-scout-17b-16e-instruct",  # Or another model like "mixtral-8x7b-32768"
        # model= "qwen-qwq-32b",
        groq_api_key=api_key,
        temperature=settings.TEMPERATURE,
        max_tokens=6000,
        max_retries=10,

    )

def get_llm() -> BaseLanguageModel:
    """Returns an instance of the configured LLM based on current provider."""
    global current_provider, current_ollama_model
    
    logger.info(f"Getting LLM with provider: {current_provider}")
    
    if current_provider.lower() == "azure":
        return get_azure_llm()
    elif current_provider.lower() == "groq":
        return get_groq_llm()
    elif current_provider.lower() == "ollama":
        return get_ollama_llm(current_ollama_model)
    else:  # Default to Azure
        logger.warning(f"Unknown provider {current_provider}, defaulting to Azure")
        return get_azure_llm()

def set_provider(provider: str, ollama_model: str = None):
    """Simple function to set the LLM provider."""
    global current_provider, current_ollama_model
    
    current_provider = provider.lower()
    if ollama_model and provider.lower() == "ollama":
        current_ollama_model = ollama_model
    
    logger.info(f"LLM provider set to: {current_provider}")
    if provider.lower() == "ollama":
        logger.info(f"Ollama model set to: {current_ollama_model}")

def get_current_provider():
    """Get the current provider information."""
    return {
        "provider": current_provider,
        "ollama_model": current_ollama_model if current_provider == "ollama" else None
    }
    
    