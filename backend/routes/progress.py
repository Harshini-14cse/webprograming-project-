import logging
from typing import Dict, Any
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

logger = logging.getLogger("learnbuddy.progress")
router = APIRouter()

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
    try:
        progress_store["sessions"].append(session.model_dump())
        progress_store["total_study_time"] += session.duration_minutes
        if session.topic not in progress_store["topics_studied"]:
            progress_store["topics_studied"].append(session.topic)
        logger.info("Session logged: %s (%d min)", session.topic, session.duration_minutes)
        return {"success": True, "total_sessions": len(progress_store["sessions"])}
    except Exception as e:
        logger.error("log_session failed: %s", e)
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/log-quiz-score")
async def log_quiz_score(score: QuizScore):
    try:
        if score.total <= 0:
            raise HTTPException(status_code=400, detail="total must be > 0")
        progress_store["quiz_scores"].append(score.model_dump())
        logger.info("Quiz score logged: %s %d/%d", score.topic, score.score, score.total)
        return {"success": True}
    except HTTPException:
        raise
    except Exception as e:
        logger.error("log_quiz_score failed: %s", e)
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/progress")
async def get_progress():
    try:
        scores = progress_store["quiz_scores"]
        avg_score = 0.0
        if scores:
            avg_score = round(
                sum(s["score"] / s["total"] * 100 for s in scores) / len(scores), 1
            )
        return {
            "total_sessions": len(progress_store["sessions"]),
            "topics_studied": progress_store["topics_studied"],
            "total_study_time_minutes": progress_store["total_study_time"],
            "quiz_scores": scores,
            "average_quiz_score": avg_score,
            "recent_sessions": progress_store["sessions"][-5:],
        }
    except Exception as e:
        logger.error("get_progress failed: %s", e)
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/reset-progress")
async def reset_progress():
    progress_store["sessions"] = []
    progress_store["topics_studied"] = []
    progress_store["quiz_scores"] = []
    progress_store["total_study_time"] = 0
    logger.info("Progress reset")
    return {"success": True}
