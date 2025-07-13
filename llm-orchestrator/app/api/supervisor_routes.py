"""
Supervisor API routes for multi-agent system

This module provides REST API endpoints for interacting with the multi-agent system
that includes a supervisor routing queries to specialized agents.
"""

from fastapi import APIRouter, HTTPException, BackgroundTasks, Body, Query, Depends, File, UploadFile, Form
from fastapi.responses import JSONResponse, PlainTextResponse
from pydantic import BaseModel, ValidationError
from typing import Optional, List, Dict, Any
import os
import uuid
import logging
from pathlib import Path
import json
import asyncio
import base64

from app.tools.file_manager_tools import upload_file_tool, get_file_version_tool

from app.graphs.supervisor_graph import process_query, DEFAULT_DATA_PATH
from app.graphs.supervisor_graph_alone import process_query as process_query_alone
from app.graphs.supervisor_graph_with_analytics import process_query as process_query_analytics
from app.graphs.supervisor_graph_with_ml import process_query as process_query_ml
from app.graphs.supervisor_graph_with_preprocessing import process_query as process_query_preprocessing

logger = logging.getLogger(__name__)

PROJECT_ROOT = Path(__file__).parent.parent.parent
UPLOAD_DIR = PROJECT_ROOT / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

def file_to_base64(file_path: str) -> Optional[str]:
    pass

def get_content_type(file_path: str) -> str:
    pass

router = APIRouter(
    prefix="/supervisor",
    tags=["supervisor"],
    responses={404: {"description": "Not found"}},
)

class QueryRequest(BaseModel):
    query: str
    data_path: Optional[str] = None

class QueryResponse(BaseModel):
    message: str
    status: str = "success"
    plot_path: Optional[str] = None
    plot_paths: Optional[List[str]] = None
    has_plot: bool = False
    has_multiple_plots: bool = False
    plot_base64: Optional[str] = None
    plot_base64_list: Optional[List[Dict[str, str]]] = None
    plot_content_type: Optional[str] = None
    data_base64: Optional[str] = None
    data_content_type: Optional[str] = None
    file_id: Optional[str] = None
    file_updated: bool = False
    version_info: Optional[Dict[str, Any]] = None

@router.post("/query", response_model=QueryResponse)
async def query_supervisor(
    query: str = Form(..., description="Query to process"),
    file: Optional[UploadFile] = File(None, description="Optional data file to upload and process"),
    file_id: Optional[str] = Form(None, description="Optional file ID from file manager instead of uploading")
):
    pass





