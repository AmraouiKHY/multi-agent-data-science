import pandas as pd
import numpy as np
from typing import Dict, List, Any, Optional, Union
import base64
import io
import os

def _load_df_from_base64(file_content_base64: str, original_filename: str, sheet_name: Optional[str] = None) -> pd.DataFrame:
    pass

def _df_to_base64(df: pd.DataFrame, original_filename: str, sheet_name: Optional[str] = None) -> str:
    pass

def remove_duplicates(file_content_base64: str, original_filename: str, sheet_name: Optional[str], subset: Optional[List[str]] = None) -> Dict[str, Any]:
    pass

def handle_missing_values(file_content_base64: str, original_filename: str, sheet_name: Optional[str], strategy: str, 
                         columns: Optional[List[str]] = None, fill_value: Optional[Any] = None) -> Dict[str, Any]:
    pass

def drop_rows_columns(file_content_base64: str, original_filename: str, sheet_name: Optional[str], 
                     axis: int = 1, threshold: Optional[float] = None,
                     to_drop: Optional[List[Union[str, int]]] = None) -> Dict[str, Any]:
    pass

def clean_text(file_content_base64: str, original_filename: str, sheet_name: Optional[str], column: str, 
              operation: str) -> Dict[str, Any]:
    pass

def remove_outliers(file_content_base64: str, original_filename: str, sheet_name: Optional[str], method: str, 
                   threshold: float, columns: List[str]) -> Dict[str, Any]:
    pass