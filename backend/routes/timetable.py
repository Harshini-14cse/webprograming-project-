import logging
from typing import List
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from utils.groq_client import chat_completion

logger = logging.getLogger("learnbuddy.timetable")
router = APIRouter()


class TimetableRequest(BaseModel):
    subjects: List[str]
    exam_date: str
    daily_hours: int = 4
    start_date: str = ""


@router.post("/generate-timetable")
async def generate_timetable(req: TimetableRequest):
    valid_subjects = [s.strip() for s in req.subjects if s.strip()]
    if not valid_subjects:
        raise HTTPException(status_code=400, detail="At least one subject is required")
    if not req.exam_date.strip():
        raise HTTPException(status_code=400, detail="Exam date is required")

    subjects_list = ", ".join(valid_subjects)
    logger.info("Generating timetable: subjects=%s, exam=%s", subjects_list, req.exam_date)
    messages = [
        {
            "role": "system",
            "content": (
                "You are an expert academic planner. Create detailed, realistic study timetables. "
                "Use markdown tables and clear scheduling. Include revision days and breaks."
            ),
        },
        {
            "role": "user",
            "content": (
                f"Create a comprehensive study timetable with these details:\n"
                f"- Subjects: {subjects_list}\n"
                f"- Exam Date: {req.exam_date}\n"
                f"- Daily Study Hours: {req.daily_hours} hours\n"
                f"- Start Date: {req.start_date or 'Today'}\n\n"
                "Include:\n"
                "1. Day-by-day schedule in a markdown table\n"
                "2. Time slots for each subject\n"
                "3. Revision days\n"
                "4. Short and long breaks\n"
                "5. Tips for each subject"
            ),
        },
    ]
    try:
        result = chat_completion(messages, max_tokens=4096)
        logger.info("Timetable generated (%d chars)", len(result))
        return {"timetable": result}
    except Exception as e:
        logger.error("Timetable generation failed: %s", e)
        raise HTTPException(status_code=500, detail=f"AI generation failed: {str(e)}")
