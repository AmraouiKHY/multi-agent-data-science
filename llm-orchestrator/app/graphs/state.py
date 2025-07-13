from typing import Dict, Any, List, TypedDict, Literal, Optional


class AgentState(TypedDict):
    """State schema for the agent workflow."""
    session_id: str
    thread_id: str
    messages: List[Dict[str, Any]]
    file_data_base64: Optional[str]
    file_format: Optional[str]
    file_metadata: Optional[Dict[str, Any]]
    status: Literal["RUNNING", "DONE"]
    current_step: int
    plan: Optional[Dict[str, Any]]
    current_subtask: Optional[str]
    result: Optional[Dict[str, Any]]  # {content, file_path, is_large}
    file_id: Optional[str]
    file_version: Optional[int]
    file_versions_history: Optional[List[Dict[str, Any]]]
    model_path: Optional[str]
    model_metrics: Optional[Dict[str, Any]]
    tracking_uri: Optional[str]
    produce_final_message: Optional[bool]  # Flag indicating if current agent output should be final response

