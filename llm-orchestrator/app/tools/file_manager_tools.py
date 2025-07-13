import os
import httpx
import logging
import tempfile
import pandas as pd
from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field
from langchain.tools import StructuredTool
import base64

logger = logging.getLogger(__name__)

FILE_MANAGER_URL = os.environ.get("FILE_MANAGER_URL", "http://localhost:20001/api")
DEFAULT_USER_ID = "system_user"

def upload_file(file_path: str, display_name: Optional[str] = None, 
               convert_to_csv: bool = True, check_duplicates: bool = True) -> Dict[str, Any]:
    """Upload a data file to the system with rich metadata and duplicate detection."""
    pass

def list_files() -> Dict[str, Any]:
    """List all files with complete metadata."""
    pass

def get_file_version(file_id: str, version: Optional[int] = None) -> Dict[str, Any]:
    """Get a specific version of a file with both data and metadata."""
    pass

def update_file_from_data(file_id: str, file_content_base64: str, 
                         source: str = "orchestrator") -> Dict[str, Any]:
    """Update a file with base64 encoded content and track version history."""
    pass

def analyze_file_changes(file_id: str, version: Optional[int] = None) -> Dict[str, Any]:
    """Analyze changes between file versions with detailed LLM-generated descriptions."""
    pass

def find_file(search_term: str) -> Dict[str, Any]:
    """Find files matching a name or description."""
    pass

def delete_file(file_id: str) -> Dict[str, Any]:
    """Delete a file and its metadata."""
    pass

class UploadFileInput(BaseModel):
    file_path: str = Field(..., description="Path to the file to upload")
    display_name: Optional[str] = Field(None, description="Optional display name for the file")
    convert_to_csv: bool = Field(True, description="Whether to convert non-CSV/Excel files to CSV")
    check_duplicates: bool = Field(True, description="Whether to check for potential duplicates")

class FileIdInput(BaseModel):
    file_id: str = Field(..., description="ID of the file to operate on")

class VersionInput(BaseModel):
    file_id: str = Field(..., description="ID of the file")
    version: Optional[int] = Field(None, description="Version number (default: latest)")

class UpdateFileInput(BaseModel):
    file_id: str = Field(..., description="ID of the file to update")
    file_content_base64: str = Field(..., description="Base64 encoded file content")
    source: str = Field("orchestrator", description="Name of the component making the update")

class SearchInput(BaseModel):
    search_term: str = Field(..., description="Term to search for in filenames, descriptions or tags")

def upload_file_structured(
    file_path: str,
    display_name: Optional[str] = None,
    convert_to_csv: bool = True,
    check_duplicates: bool = True
) -> Dict[str, Any]:
    pass

def get_file_version_structured(
    file_id: str,
    version: Optional[int] = None
) -> Dict[str, Any]:
    pass

def update_file_from_data_structured(
    file_id: str,
    file_content_base64: str,
    source: str = "orchestrator"
) -> Dict[str, Any]:
    pass

def analyze_file_changes_structured(
    file_id: str,
    version: Optional[int] = None
) -> Dict[str, Any]:
    pass

def find_file_structured(
    search_term: str
) -> Dict[str, Any]:
    pass

def delete_file_structured(
    file_id: str
) -> Dict[str, Any]:
    pass

upload_file_tool = StructuredTool.from_function(
    func=upload_file_structured,
    name="upload_file",
    description="Upload a data file to the system with automatic metadata extraction and duplicate detection",
    args_schema=UploadFileInput,
    return_direct=False
)

list_files_tool = StructuredTool.from_function(
    func=list_files,
    name="list_files",
    description="List all files available in the system with complete metadata",
    return_direct=False
)

get_file_version_tool = StructuredTool.from_function(
    func=get_file_version_structured,
    name="get_file_version",
    description="Get a specific version of a file with data and version metadata",
    args_schema=VersionInput,
    return_direct=False
)

update_file_from_data_tool = StructuredTool.from_function(
    func=update_file_from_data_structured,
    name="update_file_from_data",
    description="Update a file with new base64 encoded content and automatically create a new version",
    args_schema=UpdateFileInput,
    return_direct=False
)

analyze_file_changes_tool = StructuredTool.from_function(
    func=analyze_file_changes_structured,
    name="analyze_file_changes",
    description="Analyze changes between file versions with detailed LLM-generated descriptions",
    args_schema=VersionInput,
    return_direct=False
)

find_file_tool = StructuredTool.from_function(
    func=find_file_structured,
    name="find_file",
    description="Find files matching a name, description or tag",
    args_schema=SearchInput,
    return_direct=False
)

delete_file_tool = StructuredTool.from_function(
    func=delete_file_structured,
    name="delete_file",
    description="Delete a file and its metadata",
    args_schema=FileIdInput,
    return_direct=False
)

tools = [
    upload_file_tool,
    list_files_tool,
    get_file_version_tool,
    update_file_from_data_tool,
    analyze_file_changes_tool,
    find_file_tool,
    delete_file_tool
]

tool_map = {tool.name: tool for tool in tools}