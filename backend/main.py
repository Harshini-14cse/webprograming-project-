import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

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

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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
