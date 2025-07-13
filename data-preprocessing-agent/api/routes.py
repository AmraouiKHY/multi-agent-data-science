from fastapi import APIRouter
from api.endpoints import cleaning, transformation, feature_engineering,data_reduction,data_validation



api_router = APIRouter()

# Include routers from different modules
api_router.include_router(cleaning.router, prefix="/cleaning", tags=["Data Cleaning"])
api_router.include_router(transformation.router, prefix="/transformation", tags=["Data Transformation"])
api_router.include_router(feature_engineering.router, prefix="/feature-engineering", tags=["Feature Engineering"])
api_router.include_router(data_reduction.router, prefix="/data-reduction", tags=["Data Reduction"])
api_router.include_router(data_validation.router, prefix="/data-validation", tags=["Data Validation"])
