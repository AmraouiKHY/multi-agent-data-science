from fastapi import APIRouter, Request, File, UploadFile, Form
from typing import Dict, Any, Optional, List
import uuid
import json
import asyncio
import logging
import traceback
import tempfile
import os
from sse_starlette.sse import EventSourceResponse
from pydantic import BaseModel, Field
from app.graphs.builder import create_orchestrator
from langgraph.checkpoint.memory import MemorySaver
from app.graphs.utils import load_file_as_base64
from colorama import Fore, Style

from app.api.supervisor_routes import router as supervisor_router

router = APIRouter()

logger = logging.getLogger(__name__)

memory_saver = MemorySaver()

class ChatRequest(BaseModel):
    message: str = Field(..., description="The user's message")
    data_path: Optional[str] = Field(None, description="Path to the file to upload, if any")

@router.post("/chat/stream")
async def chat_stream(
    req: Request,
    message: str = Form(..., description="The user's message"),
    file: Optional[UploadFile] = File(None, description="Optional file upload")
):
    pass