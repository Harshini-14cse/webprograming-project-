import logging
import traceback
from pathlib import Path
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv

# Always load from backend/.env regardless of working directory
BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env")

# Logging setup — visible in VS Code terminal
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(name)s  %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger("learnbuddy")

from routes.upload import router as upload_router
from routes.summary import router as summary_router
from routes.concepts import router as concepts_router
from routes.mcq import router as mcq_router
from routes.questions import router as questions_router
from routes.doubt_solver import router as doubt_router
from routes.timetable import router as timetable_router
from routes.export import router as export_router
from routes.progress import router as progress_router

app = FastAPI(title="LearnBuddy AI API", version="1.0.0")

# ---------------------------------------------------------------------------
# CORS — allow all Vite dev-server ports (5173 and 5174) plus localhost:3000
# ---------------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Global exception handler — always return JSON, never plain-text 500
# ---------------------------------------------------------------------------
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error("Unhandled exception on %s %s: %s", request.method, request.url.path, exc)
    logger.error(traceback.format_exc())
    return JSONResponse(
        status_code=500,
        content={"detail": f"Internal server error: {str(exc)}"},
    )

app.include_router(upload_router, prefix="/api", tags=["Upload"])
app.include_router(summary_router, prefix="/api", tags=["Summary"])
app.include_router(concepts_router, prefix="/api", tags=["Concepts"])
app.include_router(mcq_router, prefix="/api", tags=["MCQ"])
app.include_router(questions_router, prefix="/api", tags=["Questions"])
app.include_router(doubt_router, prefix="/api", tags=["Doubt Solver"])
app.include_router(timetable_router, prefix="/api", tags=["Timetable"])
app.include_router(export_router, prefix="/api", tags=["Export"])
app.include_router(progress_router, prefix="/api", tags=["Progress"])


@app.get("/")
async def root():
    return {"message": "LearnBuddy AI API is running", "version": "1.0.0"}


@app.get("/health")
async def health():
    return {"status": "healthy"}
