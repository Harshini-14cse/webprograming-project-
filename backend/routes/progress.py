from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Dict, Any

router = APIRouter()

# In-memory progress store
progress_store: Dict[str, Any] = {
    "sessions": [],
    "topics_studied": [],
    "quiz_scores": [],
    "total_study_time": 0,
}


class SessionLog(BaseModel):
    topic: str
    duration_minutes: int
    activity: str


class QuizScore(BaseModel):
    topic: str
    score: int
    total: int


@router.post("/log-session")
async def log_session(session: SessionLog):
    progress_store["sessions"].append(session.model_dump())
    progress_store["total_study_time"] += session.duration_minutes
    if session.topic not in progress_store["topics_studied"]:
        progress_store["topics_studied"].append(session.topic)
    return {"success": True, "total_sessions": len(progress_store["sessions"])}


@router.post("/log-quiz-score")
async def log_quiz_score(score: QuizScore):
    progress_store["quiz_scores"].append(score.model_dump())
    return {"success": True}


@router.get("/progress")
async def get_progress():
    scores = progress_store["quiz_scores"]
    avg_score = 0
    if scores:
        avg_score = round(sum(s["score"] / s["total"] * 100 for s in scores) / len(scores), 1)

    return {
        "total_sessions": len(progress_store["sessions"]),
        "topics_studied": progress_store["topics_studied"],
        "total_study_time_minutes": progress_store["total_study_time"],
        "quiz_scores": scores,
        "average_quiz_score": avg_score,
        "recent_sessions": progress_store["sessions"][-5:],
    }


@router.delete("/reset-progress")
async def reset_progress():
    progress_store["sessions"] = []
    progress_store["topics_studied"] = []
    progress_store["quiz_scores"] = []
    progress_store["total_study_time"] = 0
    return {"success": True}
