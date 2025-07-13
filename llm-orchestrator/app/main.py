from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import time
import logging
import os

# Set up logger
logger = logging.getLogger(__name__)

from .core.config import settings
from .api.routes import router as api_router
from .api.supervisor_routes import router as supervisor_router
from .api.llm_routes import router as llm_router

from colorama import Fore, Style, init as colorama_init
colorama_init(autoreset=True)

# Define custom info levels
INFO1 = 21
INFO2 = 22
INFO3 = 23
logging.addLevelName(INFO1, "INFO1")
logging.addLevelName(INFO2, "INFO2")
logging.addLevelName(INFO3, "INFO3")

def info1(self, message, *args, **kws):
    if self.isEnabledFor(INFO1):
        self._log(INFO1, message, args, **kws)
def info2(self, message, *args, **kws):
    if self.isEnabledFor(INFO2):
        self._log(INFO2, message, args, **kws)
def info3(self, message, *args, **kws):
    if self.isEnabledFor(INFO3):
        self._log(INFO3, message, args, **kws)

logging.Logger.info1 = info1
logging.Logger.info2 = info2
logging.Logger.info3 = info3

class ColorFormatter(logging.Formatter):
    COLORS = {
        logging.DEBUG: Fore.CYAN,
        logging.INFO: Fore.GREEN,
        INFO1: Fore.LIGHTGREEN_EX,
        INFO2: Fore.LIGHTBLUE_EX,
        INFO3: Fore.LIGHTMAGENTA_EX,
        logging.WARNING: Fore.YELLOW,
        logging.ERROR: Fore.RED,
        logging.CRITICAL: Fore.MAGENTA,
    }
    def format(self, record):
        # For custom INFO levels, override the levelname for display
        if record.levelno == INFO1:
            record.levelname = "INFO1"
        elif record.levelno == INFO2:
            record.levelname = "INFO2"
        elif record.levelno == INFO3:
            record.levelname = "INFO3"
        color = self.COLORS.get(record.levelno, "")
        message = super().format(record)
        return f"{color}{message}{Style.RESET_ALL}"

# Configure logging based on environment variable
log_level = os.environ.get("LOG_LEVEL", "INFO").upper()
handler = logging.StreamHandler()
handler.setFormatter(ColorFormatter("%(asctime)s - %(name)s - %(levelname)s :%(lineno)d: - %(message)s"))

logging.basicConfig(level=getattr(logging, log_level), handlers=[handler], force=True)

app_loggers = ["app", "app.api", "app.api.routes", "app.api.supervisor_routes", ]
for name in app_loggers:
    module_logger = logging.getLogger(name)
    module_logger.handlers = []  # Clear handlers
    module_logger.addHandler(handler)
    module_logger.setLevel(logging.INFO)  # Set all to DEBUG for testing
    module_logger.propagate = True

# Test log
logging.getLogger("app.api.routes").info("Test log after configuration")

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add request timing middleware
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response

# Exception handling
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "An unexpected error occurred"},
    )

# Include API routes
app.include_router(api_router, prefix=settings.API_V1_STR)

# Include supervisor routes
app.include_router(supervisor_router, prefix=settings.API_V1_STR)

# Include simple LLM routes
app.include_router(llm_router, prefix=settings.API_V1_STR + "/llm", tags=["LLM Provider"])

# Health check endpoint
@app.get("/health")
async def health():
    return {"status": "healthy"}

# Documentation route
@app.get("/")
async def root():
    return {
        "name": settings.PROJECT_NAME,
        "docs": "/docs",
        "redoc": "/redoc"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)