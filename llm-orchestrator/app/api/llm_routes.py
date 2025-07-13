from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
import logging

from app.core.llm import set_provider, get_current_provider, get_llm

logger = logging.getLogger(__name__)

router = APIRouter()

class ProviderRequest(BaseModel):
    provider: str
    ollama_model: Optional[str] = None

class ProviderResponse(BaseModel):
    success: bool
    message: str
    current_provider: str
    ollama_model: Optional[str] = None

@router.post("/set-provider", response_model=ProviderResponse)
async def set_llm_provider(request: ProviderRequest):
    pass

@router.get("/current-provider", response_model=ProviderResponse)
async def get_current_llm_provider():
    pass