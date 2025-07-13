"""
Preprocessing Tools
=================

This module provides tools for data preprocessing operations that can be used with LangGraph.
"""

import base64
import httpx
import logging
import os
import tempfile
import traceback
from typing import Any, Dict, List, Optional
from enum import Enum
from pydantic import BaseModel, Field
from datetime import datetime
from langchain.tools import StructuredTool

from ..tools.file_manager_tools import get_file_version_tool, update_file_from_data_tool, analyze_file_changes_tool

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

DATA_PREPROCESSING_URL = "http://localhost:10003/"

class CleaningOperation(str, Enum):
    REMOVE_DUPLICATES = "remove-duplicates"
    HANDLE_MISSING_VALUES = "handle-missing-values"
    DROP_ROWS_COLUMNS = "drop-rows-columns"
    CLEAN_TEXT = "clean-text"
    REMOVE_OUTLIERS = "remove-outliers"

class MissingValuesMethod(str, Enum):
    MEAN = "mean"
    MEDIAN = "median"
    MODE = "mode"
    CONSTANT = "constant"
    DROP = "drop"

class OutlierRemovalMethod(str, Enum):
    Z_SCORE = "zscore"
    IQR = "iqr"
    ISOLATION_FOREST = "isolation-forest"

class TextCleaningOperation(str, Enum):
    LOWERCASE = "lowercase"
    REMOVE_PUNCTUATION = "remove_punctuation"
    REMOVE_NUMBERS = "remove_numbers"
    REMOVE_WHITESPACE = "remove_whitespace"

class TransformationOperation(str, Enum):
    NORMALISATION = "normalisation"
    STANDARDIZATION = "standardization"
    ONE_HOT_ENCODING = "one-hot-encoding"
    LABEL_ENCODING = "label-encoding"
    SKEWNESS_CORRECTION = "skewness-correction"

class SkewnessMethod(str, Enum):
    LOG = "log"
    SQRT = "sqrt"
    BOXCOX = "boxcox"

class FeatureEngineeringOperation(str, Enum):
    POLYNOMIAL = "create_polynomial_feature"
    INTERACTION = "create_interaction_terms"
    RATIO = "create_ratio_feature"
    DIFF = "create_diff_feature"
    DATE_COMPONENTS = "extract_date_components"
    BINNING = "binning"
    TEXT_EXTRACTION = "text_feature_extraction"

class TextExtractionMethod(str, Enum):
    TOKENIZATION = "tokenization"
    TERM_FREQUENCY = "term_frequency"

class ValidationOperation(str, Enum):
    NON_NEGATIVE = "validate_non_negative"
    RANGE = "validate_range"
    INTEGRITY = "validate_integrity"
    PATTERN = "validate_pattern"
    TYPES = "validate_types"

class ScoreFunction(str, Enum):
    F_CLASSIF = "f_classif"
    MUTUAL_INFO_CLASSIF = "mutual_info_classif"

def handle_missing_values(
    data_path: str, 
    sheet_name: Optional[str] = None,
    strategy: Optional[str] = "mean",
    columns: Optional[str] = None,
    fill_value: Optional[str] = None
) -> Dict[str, Any]:
    """Send an HTTP request to handle missing values by sending file content as base64."""
    pass

def remove_duplicates(data_path: str, sheet_name: Optional[str] = None, subset: Optional[str] = None) -> Dict[str, Any]:
    """Send an HTTP request to remove duplicate rows from the dataset by sending file content as base64."""
    pass

def drop_rows_columns(
    data_path: str,
    sheet_name: Optional[str] = None,
    axis: Optional[int] = 0,
    threshold: Optional[float] = None,
    to_drop: Optional[str] = None
) -> Dict[str, Any]:
    """Send an HTTP request to drop rows or columns using base64 file content."""
    pass

def clean_text(
    data_path: str,
    column: str,
    operation: str,
    sheet_name: Optional[str] = None
) -> Dict[str, Any]:
    """Send an HTTP request to clean text data in a specific column."""
    pass

def remove_outliers(
    data_path: str,
    columns: str,
    method: Optional[str] = "zscore",
    threshold: Optional[float] = 3.0,
    sheet_name: Optional[str] = None
) -> Dict[str, Any]:
    """Send an HTTP request to remove outliers from specified columns."""
    pass

def normalisation(
    data_path: str,
    columns: Optional[str] = None,
    sheet_name: Optional[str] = None
) -> Dict[str, Any]:
    """Send an HTTP request to normalize numeric columns to a 0-1 range."""
    pass

def one_hot_encoding(
    data_path: str,
    columns: str,
    sheet_name: Optional[str] = None
) -> Dict[str, Any]:
    """Send an HTTP request to perform one-hot encoding on categorical columns."""
    pass

def create_polynomial_features(
    data_path: str,
    degree: int = 2,
    interaction_only: bool = False,
    sheet_name: Optional[str] = None
) -> Dict[str, Any]:
    """Send an HTTP request to create polynomial features from numeric columns."""
    pass

def feature_reduction_pca(
    data_path: str,
    columns: str,
    n_components: int = 2,
    sheet_name: Optional[str] = None
) -> Dict[str, Any]:
    """Send an HTTP request to reduce data dimensionality using PCA."""
    pass

def validate_non_negative(
    data_path: str,
    columns: str,
    sheet_name: Optional[str] = None
) -> Dict[str, Any]:
    """Send an HTTP request to validate that columns contain only non-negative values."""
    pass

def validate_range(
    data_path: str,
    column: str,
    min_val: float,
    max_val: float,
    sheet_name: Optional[str] = None
) -> Dict[str, Any]:
    """Send an HTTP request to validate that values in a column are within a specified range."""
    pass

class RemoveDuplicatesInput(BaseModel):
    data_path: Optional[str] = Field(None, description="Path to the data file (CSV or Excel)")
    file_id: Optional[str] = Field(None, description="ID of the file in the file manager (use instead of data_path)")
    sheet_name: Optional[str] = Field(None, description="Optional name of the sheet to process (defaults to first sheet)")
    subset: Optional[str] = Field(None, description="Optional comma-separated list of column names to consider for identifying duplicates")

def remove_duplicates_structured(
    data_path: Optional[str] = None,
    file_id: Optional[str] = None,
    sheet_name: Optional[str] = None,
    subset: Optional[str] = None
) -> dict:
    pass

class HandleMissingValuesInput(BaseModel):
    data_path: Optional[str] = Field(None, description="Path to the data file (CSV or Excel)")
    file_id: Optional[str] = Field(None, description="ID of the file in the file manager (use instead of data_path)")
    sheet_name: Optional[str] = Field(None, description="Optional name of the sheet to process (defaults to first sheet)")
    strategy: Optional[str] = Field("mean", description="Strategy to use for filling missing values (mean, median, mode, constant, drop)")
    columns: Optional[str] = Field(None, description="Optional comma-separated list of column names to process")
    fill_value: Optional[str] = Field(None, description="Value to use when strategy is 'constant'")

def handle_missing_values_structured(
    data_path: Optional[str] = None,
    file_id: Optional[str] = None,
    sheet_name: Optional[str] = None,
    strategy: Optional[str] = "mean",
    columns: Optional[str] = None,
    fill_value: Optional[str] = None
) -> dict:
    pass

class DropRowsColumnsInput(BaseModel):
    data_path: Optional[str] = Field(None, description="Path to the data file (CSV or Excel)")
    file_id: Optional[str] = Field(None, description="ID of the file in the file manager (use instead of data_path)")
    sheet_name: Optional[str] = Field(None, description="Optional name of the sheet to process (defaults to first sheet)")
    axis: Optional[int] = Field(0, description="0 to drop rows, 1 to drop columns")
    threshold: Optional[float] = Field(None, description="Proportion of missing values required to drop (0.0 to 1.0)")
    to_drop: Optional[str] = Field(None, description="Optional comma-separated list of column names (if axis=1) or row indices (if axis=0) to drop explicitly")

def drop_rows_columns_structured(
    data_path: Optional[str] = None,
    sheet_name: Optional[str] = None,
    axis: Optional[int] = 0,
    threshold: Optional[float] = None,
    to_drop: Optional[str] = None
) -> dict:
    pass

class CleanTextInput(BaseModel):
    data_path: Optional[str] = Field(None, description="Path to the data file (CSV or Excel)")
    file_id: Optional[str] = Field(None, description="ID of the file in the file manager (use instead of data_path)")
    column: str = Field(..., description="Name of the column containing text to clean")
    operation: str = Field(..., description="Text cleaning operation (lowercase, remove_punctuation, remove_numbers, remove_whitespace)")
    sheet_name: Optional[str] = Field(None, description="Optional name of the sheet to process (defaults to first sheet)")

def clean_text_structured(
    data_path: Optional[str] = None,
    file_id: Optional[str] = None,
    column: str = None,
    operation: str = None,
    sheet_name: Optional[str] = None
) -> dict:
    pass

class RemoveOutliersInput(BaseModel):
    data_path: Optional[str] = Field(None, description="Path to the data file (CSV or Excel)")
    file_id: Optional[str] = Field(None, description="ID of the file in the file manager (use instead of data_path)")
    columns: str = Field(..., description="Comma-separated list of column names to process")
    method: Optional[str] = Field("zscore", description="Method for outlier detection (zscore, iqr, isolation-forest)")
    threshold: Optional[float] = Field(3.0, description="Threshold for outlier detection (e.g. zscore > 3.0)")
    sheet_name: Optional[str] = Field(None, description="Optional name of the sheet to process (defaults to first sheet)")

def remove_outliers_structured(
    data_path: Optional[str] = None,
    file_id: Optional[str] = None,
    columns: str = None,
    method: Optional[str] = "zscore",
    threshold: Optional[float] = 3.0,
    sheet_name: Optional[str] = None
) -> dict:
    pass

class NormalisationInput(BaseModel):
    data_path: Optional[str] = Field(None, description="Path to the data file (CSV or Excel)")
    file_id: Optional[str] = Field(None, description="ID of the file in the file manager (use instead of data_path)")
    columns: Optional[str] = Field(None, description="Optional comma-separated list of column names to normalize")
    sheet_name: Optional[str] = Field(None, description="Optional name of the sheet to process (defaults to first sheet)")

def normalisation_structured(
    data_path: Optional[str] = None,
    file_id: Optional[str] = None,
    columns: Optional[str] = None,
    sheet_name: Optional[str] = None
) -> dict:
    pass

class OneHotEncodingInput(BaseModel):
    data_path: Optional[str] = Field(None, description="Path to the data file (CSV or Excel)")
    file_id: Optional[str] = Field(None, description="ID of the file in the file manager (use instead of data_path)")
    columns: str = Field(..., description="Comma-separated list of column names to encode")
    sheet_name: Optional[str] = Field(None, description="Optional name of the sheet to process (defaults to first sheet)")

def one_hot_encoding_structured(
    data_path: Optional[str] = None,
    file_id: Optional[str] = None,
    columns: str = None,
    sheet_name: Optional[str] = None
) -> dict:
    pass

class CreatePolynomialFeaturesInput(BaseModel):
    data_path: Optional[str] = Field(None, description="Path to the data file (CSV or Excel)")
    file_id: Optional[str] = Field(None, description="ID of the file in the file manager (use instead of data_path)")
    degree: int = Field(2, description="Degree of the polynomial features (default: 2)")
    interaction_only: bool = Field(False, description="If True, only interaction features are produced (default: False)")
    sheet_name: Optional[str] = Field(None, description="Optional name of the sheet to process (defaults to first sheet)")

def create_polynomial_features_structured(
    data_path: Optional[str] = None,
    file_id: Optional[str] = None,
    degree: int = 2,
    interaction_only: bool = False,
    sheet_name: Optional[str] = None
) -> dict:
    pass

class FeatureReductionPCAInput(BaseModel):
    data_path: Optional[str] = Field(None, description="Path to the data file (CSV or Excel)")
    file_id: Optional[str] = Field(None, description="ID of the file in the file manager (use instead of data_path)")
    columns: str = Field(..., description="Comma-separated list of columns to include in PCA")
    n_components: int = Field(2, description="Number of principal components to keep (default: 2)")
    sheet_name: Optional[str] = Field(None, description="Optional name of the sheet to process (defaults to first sheet)")

def feature_reduction_pca_structured(
    data_path: Optional[str] = None,
    file_id: Optional[str] = None,
    columns: str = None,
    n_components: int = 2,
    sheet_name: Optional[str] = None
) -> dict:
    pass

class ValidateNonNegativeInput(BaseModel):
    data_path: Optional[str] = Field(None, description="Path to the data file (CSV or Excel)")
    file_id: Optional[str] = Field(None, description="ID of the file in the file manager (use instead of data_path)")
    columns: str = Field(..., description="Comma-separated list of column names to validate")
    sheet_name: Optional[str] = Field(None, description="Optional name of the sheet to process (defaults to first sheet)")

def validate_non_negative_structured(
    data_path: Optional[str] = None,
    file_id: Optional[str] = None,
    columns: str = None,
    sheet_name: Optional[str] = None
) -> dict:
    pass

class ValidateRangeInput(BaseModel):
    data_path: Optional[str] = Field(None, description="Path to the data file (CSV or Excel)")
    file_id: Optional[str] = Field(None, description="ID of the file in the file manager (use instead of data_path)")
    column: str = Field(..., description="Name of the column to validate")
    min_val: float = Field(..., description="Minimum acceptable value (inclusive)")
    max_val: float = Field(..., description="Maximum acceptable value (inclusive)")
    sheet_name: Optional[str] = Field(None, description="Optional name of the sheet to process (defaults to first sheet)")

def validate_range_structured(
    data_path: Optional[str] = None,
    file_id: Optional[str] = None,
    column: str = None,
    min_val: float = None,
    max_val: float = None,
    sheet_name: Optional[str] = None
) -> dict:
    pass

remove_duplicates_tool = StructuredTool.from_function(
    remove_duplicates_structured,
    args_schema=RemoveDuplicatesInput,
    name="remove_duplicates",
    description="Remove duplicate rows from the dataset."
)

handle_missing_values_tool = StructuredTool.from_function(
    handle_missing_values_structured,
    args_schema=HandleMissingValuesInput,
    name="handle_missing_values",
    description="Handle missing values in the dataset using various strategies (mean, median, mode, constant, drop)."
)

drop_rows_columns_tool = StructuredTool.from_function(
    drop_rows_columns_structured,
    args_schema=DropRowsColumnsInput,
    name="drop_rows_columns",
    description="Drop rows or columns with too many missing values based on a threshold, or drop specific rows/columns."
)

clean_text_tool = StructuredTool.from_function(
    clean_text_structured,
    args_schema=CleanTextInput,
    name="clean_text",
    description="Clean text data in a specific column using operations like lowercase, remove punctuation, etc."
)

remove_outliers_tool = StructuredTool.from_function(
    remove_outliers_structured,
    args_schema=RemoveOutliersInput,
    name="remove_outliers",
    description="Remove outliers from the dataset using statistical methods."
)

normalisation_tool = StructuredTool.from_function(
    normalisation_structured,
    args_schema=NormalisationInput,
    name="normalisation",
    description="Normalize numerical features to a 0-1 range."
)

one_hot_encoding_tool = StructuredTool.from_function(
    one_hot_encoding_structured,
    args_schema=OneHotEncodingInput,
    name="one_hot_encoding",
    description="Convert categorical features to binary vectors (one-hot encoding)."
)

create_polynomial_features_tool = StructuredTool.from_function(
    create_polynomial_features_structured,
    args_schema=CreatePolynomialFeaturesInput,
    name="create_polynomial_features",
    description="Create polynomial features from existing numerical features."
)

feature_reduction_pca_tool = StructuredTool.from_function(
    feature_reduction_pca_structured,
    args_schema=FeatureReductionPCAInput,
    name="feature_reduction_pca",
    description="Reduce data dimensionality using Principal Component Analysis (PCA)."
)

validate_non_negative_tool = StructuredTool.from_function(
    validate_non_negative_structured,
    args_schema=ValidateNonNegativeInput,
    name="validate_non_negative",
    description="Validate that numeric columns contain only non-negative values."
)

validate_range_tool = StructuredTool.from_function(
    validate_range_structured,
    args_schema=ValidateRangeInput,
    name="validate_range",
    description="Validate that values in a column fall within a specified range."
)

tools = [
    remove_duplicates_tool,
    handle_missing_values_tool,
    drop_rows_columns_tool,
    clean_text_tool,
    remove_outliers_tool,
    normalisation_tool,
    one_hot_encoding_tool,
    create_polynomial_features_tool,
    feature_reduction_pca_tool,
    validate_non_negative_tool,
    validate_range_tool,
]

tool_map = {tool.name: tool for tool in tools}