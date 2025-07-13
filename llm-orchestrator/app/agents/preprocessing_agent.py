import logging
import json
import base64
from typing import Dict, Any
from langchain.schema.language_model import BaseLanguageModel
from langchain_core.messages import HumanMessage, AIMessage, ToolMessage, SystemMessage
from langgraph.prebuilt import create_react_agent
from ..tools.preprocessing_tools import tools as preprocessing_tools
from datetime import datetime
from ..utils.file_utils import decode_base64_to_temp_file, cleanup_temp_file
from ..tools.code_tools import code_tools
import pandas as pd
from langchain_core.tools import tool
from ..utils.file_metadata import extract_file_metadata , format_metadata_for_prompt

logger = logging.getLogger(__name__)

@tool
def preview_data_tool(file_path: str) -> str:
    pass

tools = [preview_data_tool, *preprocessing_tools, *code_tools]

def get_preprocessing_prompt(data_path: str = None, file_metadata: str = None, conversation_history: str = None) -> str:
    pass

async def preprocess_data(
    llm: BaseLanguageModel, 
    input_text: str, 
    file_id: str = None,
    file_data_base64: str = None,
    file_format: str = "csv",
    file_metadata: str = None,
    conversation_history: str = None
) -> Dict[str, Any]:
    pass