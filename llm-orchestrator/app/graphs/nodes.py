from langchain_core.messages import SystemMessage, HumanMessage, AIMessage
from langgraph.types import Command
from langgraph.prebuilt import create_react_agent
from .state import AgentState
from .utils import  decode_csv_schema
from app.agents.preprocessing_agent import preprocess_data
from app.agents.ml_agent import run_ml_task
from app.core.llm import get_llm
from app.tools.file_manager_tools import upload_file_tool, list_files_tool, find_file_tool, delete_file_tool
from typing import Dict, Any
import json 
import colorama
from colorama import Fore, Back, Style
from colorama import Fore, Style, init as colorama_init
colorama_init(autoreset=True)

import logging
from uuid import uuid4
import datetime

logger = logging.getLogger(__name__)

ruya_agent = create_react_agent(
    model=get_llm(),
    tools=[],
    name="ruya",
)

def format_agent_conversation_history(messages: list, max_len_per_message: int = 300) -> str:
    pass

async def ruya_node(state: AgentState) -> Dict[str, Any]:
    pass

async def preprocessing_node(state: AgentState) -> Dict[str, Any]:
    pass

async def analytics_node(state: AgentState) -> Dict[str, Any]:
    pass

from langchain_core.tools import tool

@tool
def get_base64_metadata(image_id: str) -> Dict[str, Any]:
    pass

reporter_agent = create_react_agent(
    model=get_llm(),
    tools=[get_base64_metadata],
    name="reporter"
)

def extract_message(msg: Any) -> str:
    pass

async def reporter_node(state: AgentState) -> Dict[str, Any]:
    pass

async def ml_node(state: AgentState) -> Dict[str, Any]:
    pass