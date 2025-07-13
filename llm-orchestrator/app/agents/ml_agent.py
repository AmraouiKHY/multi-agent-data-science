import logging
import json
import base64
from typing import Dict, Any
from langchain.schema.language_model import BaseLanguageModel
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage, ToolMessage
from langgraph.prebuilt import create_react_agent
from datetime import datetime
from ..tools.ml_tools import tools as ml_tools
from ..utils.file_utils import decode_base64_to_temp_file, cleanup_temp_file
from ..utils.file_metadata import extract_file_metadata, format_metadata_for_prompt

logger = logging.getLogger(__name__)

def get_ml_system_prompt(data_path: str = None, file_metadata: str = None) -> str:
    pass

async def run_ml_task(
    llm: BaseLanguageModel, 
    input_text: str, 
    file_id: str = None,  
    file_data_base64: str = None,
    file_format: str = "csv",
    file_metadata: str = None,
) -> Dict[str, Any]:
    pass