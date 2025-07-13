import os
import logging
import json
import pandas as pd
from typing import Dict, Any, Optional, List
from pydantic import BaseModel, Field
from langchain.tools import BaseTool

from ..utils.ml.matplotlib_config import *
from ..utils.ml.model_trainer import ModelTrainer
from ..utils.ml.model_selection import select_model
from ..utils.ml.hyperparameter_tuning import tune_hyperparameters
from ..utils.ml.model_evaluation import evaluate_model, predict_with_model
from ..utils.ml.mlflow_manager import MLflowManager
from ..utils.ml.model_manager import SimpleModelManager

logger = logging.getLogger(__name__)

class TrainModelInput(BaseModel):
    data_path: str = Field(..., description="Path to the dataset file")
    target_column: str = Field(..., description="Name of the target column to predict")
    task_type: str = Field("classification", description="Type of ML task: 'classification' or 'regression'")
    metric: Optional[str] = Field(None, description="Metric to optimize (e.g., 'accuracy', 'f1', 'rmse')")
    experiment_name: Optional[str] = Field(None, description="Name for MLflow experiment")
    n_trials: Optional[int] = Field(10, description="Number of trials for hyperparameter tuning")
    preferred_model: Optional[str] = Field(None, description="Preferred model type")

class TrainModelTool(BaseTool):
    name: str = "train_model"
    description: str = """Trains a machine learning model on the specified dataset."""
    args_schema: type[BaseModel] = TrainModelInput
    
    def _run(self, data_path: str, target_column: str, task_type: str = "classification", 
             metric: Optional[str] = None, experiment_name: Optional[str] = None,
             n_trials: int = 10, preferred_model: Optional[str] = None) -> str:
        pass

class EvaluateModelInput(BaseModel):
    model_path: str = Field(..., description="Path to the trained model")
    data_path: str = Field(..., description="Path to the evaluation dataset")
    target_column: str = Field(..., description="Name of the target column")
    task_type: str = Field("classification", description="Type of ML task: 'classification' or 'regression'")

class EvaluateModelTool(BaseTool):
    name: str = "evaluate_model"
    description: str = """Evaluates a trained machine learning model and reports performance metrics."""
    args_schema: type[BaseModel] = EvaluateModelInput
    
    def _run(self, model_path: str, data_path: str, target_column: str, 
             task_type: str = "classification") -> str:
        pass

class ModelSelectionInput(BaseModel):
    data_path: str = Field(..., description="Path to the dataset file")
    target_column: str = Field(..., description="Name of the target column")
    task_type: str = Field("classification", description="Type of ML task: 'classification' or 'regression'")

class ModelSelectionTool(BaseTool):
    name: str = "select_model"
    description: str = """Recommends the best model type for a given dataset and task."""
    args_schema: type[BaseModel] = ModelSelectionInput
    
    def _run(self, data_path: str, target_column: str, task_type: str = "classification") -> str:
        pass

class HyperparameterTuningInput(BaseModel):
    data_path: str = Field(..., description="Path to the dataset file")
    target_column: str = Field(..., description="Name of the target column")
    model_type: str = Field(..., description="Type of model to tune")
    task_type: str = Field("classification", description="Type of ML task")
    metric: Optional[str] = Field(None, description="Metric to optimize")
    n_trials: int = Field(20, description="Number of hyperparameter trials")

class HyperparameterTuningTool(BaseTool):
    name: str = "tune_hyperparameters"
    description: str = """Tunes hyperparameters for a specific model type on a dataset."""
    args_schema: type[BaseModel] = HyperparameterTuningInput
    
    def _run(self, data_path: str, target_column: str, model_type: str,
             task_type: str = "classification", metric: Optional[str] = None,
             n_trials: int = 20) -> str:
        pass

class MLflowTrackingInput(BaseModel):
    experiment_name: str = Field(..., description="Name for the MLflow experiment")
    run_name: Optional[str] = Field(None, description="Name for the MLflow run")
    metrics: Optional[Dict[str, float]] = Field(None, description="Metrics to log")
    params: Optional[Dict[str, Any]] = Field(None, description="Parameters to log")

class MLflowTrackingTool(BaseTool):
    name: str = "track_experiment"
    description: str = """Logs experiment details to MLflow tracking server."""
    args_schema: type[BaseModel] = MLflowTrackingInput
    
    def _run(self, experiment_name: str, run_name: Optional[str] = None,
             metrics: Optional[Dict[str, float]] = None,
             params: Optional[Dict[str, Any]] = None) -> str:
        pass

class EvaluateSavedModelInput(BaseModel):
    model_name: str = Field(..., description="Name pattern of the saved model to evaluate (e.g., 'random_forest', 'xgboost')")
    data_path: str = Field(..., description="Path to the evaluation dataset")
    target_column: str = Field(..., description="Name of the target column")
    task_type: str = Field("classification", description="Type of ML task: 'classification' or 'regression'")

class EvaluateSavedModelTool(BaseTool):
    name: str = "evaluate_saved_model"
    description: str = """Evaluates a previously saved model on new data and generates performance metrics and plots."""
    args_schema: type[BaseModel] = EvaluateSavedModelInput
    
    def _run(self, model_name: str, data_path: str, target_column: str, 
             task_type: str = "classification") -> str:
        pass

class PredictWithModelInput(BaseModel):
    model_name: str = Field(..., description="Name pattern of the saved model to use for prediction")
    data_path: str = Field(..., description="Path to the data file with features for prediction")
    task_type: str = Field("classification", description="Type of ML task: 'classification' or 'regression'")

class PredictWithModelTool(BaseTool):
    name: str = "predict_with_model"
    description: str = """Makes predictions using a previously saved model on new data."""
    args_schema: type[BaseModel] = PredictWithModelInput
    
    def _run(self, model_name: str, data_path: str, task_type: str = "classification") -> str:
        pass

class ListSavedModelsInput(BaseModel):
    pass

class ListSavedModelsTool(BaseTool):
    name: str = "list_saved_models"
    description: str = """Lists all saved models from MLflow artifacts with their details."""
    args_schema: type[BaseModel] = ListSavedModelsInput
    
    def _run(self) -> str:
        pass

tools = [
    TrainModelTool(),
    EvaluateSavedModelTool(),
    PredictWithModelTool(),
    ListSavedModelsTool(),
    ModelSelectionTool(),
    HyperparameterTuningTool(),
    MLflowTrackingTool()
]