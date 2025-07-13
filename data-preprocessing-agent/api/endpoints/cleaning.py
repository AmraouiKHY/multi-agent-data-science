from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, List, Any, Optional, Union

router = APIRouter()

class ResponseModel(BaseModel):
    success: bool
    message: str
    data: Optional[Dict[str, Any]] = None

class DataPreprocessingError(HTTPException):
    def __init__(self, detail: str = "Data preprocessing failed", status_code: int = 400):
        super().__init__(status_code=status_code, detail=detail)

class FileOperationInput(BaseModel):
    file_content_base64: str
    original_filename: str
    sheet_name: Optional[str] = None

class RemoveDuplicatesInput(FileOperationInput):
    subset: Optional[List[str]] = None

class HandleMissingValuesInput(FileOperationInput):
    strategy: str
    columns: Optional[List[str]] = None
    fill_value: Optional[Any] = None

class DropRowsColumnsInput(FileOperationInput):
    axis: int
    threshold: Optional[float] = None
    to_drop: Optional[List[Union[str,int]]] = None

class CleanTextInput(FileOperationInput):
    column: str
    operation: str

class RemoveOutliersInput(FileOperationInput):
    method: str
    threshold: float
    columns: List[str]

@router.post("/remove-duplicates", response_model=ResponseModel)
async def api_remove_duplicates(input: RemoveDuplicatesInput):
    pass

@router.post("/handle-missing-values", response_model=ResponseModel)
async def api_handle_missing_values(input: HandleMissingValuesInput):
    pass

@router.post("/drop-rows-columns", response_model=ResponseModel)
async def api_drop_rows_columns(input: DropRowsColumnsInput):
    pass

@router.post("/clean-text", response_model=ResponseModel)
async def api_clean_text(input: CleanTextInput):
    pass

@router.post("/remove-outliers", response_model=ResponseModel)
async def api_remove_outliers(input: RemoveOutliersInput):
    pass