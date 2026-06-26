from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from utils.groq_client import chat_completion

router = APIRouter()


class TimetableRequest(BaseModel):
    subjects: List[str]
    exam_date: str
    daily_hours: int = 4
    start_date: str = ""


@router.post("/generate-timetable")
async def generate_timetable(req: TimetableRequest):
    if not req.subjects:
        raise HTTPException(status_code=400, detail="At least one subject is required")

    subjects_list = ", ".join(req.subjects)
    messages = [
        {
            "role": "system",
            "content": "You are an expert academic planner. Create detailed, realistic study timetables. Use markdown tables and clear scheduling. Include revision days and breaks.",
        },
        {
            "role": "user",
            "content": f"""Create a comprehensive study timetable with these details:
- Subjects: {subjects_list}
- Exam Date: {req.exam_date}
- Daily Study Hours: {req.daily_hours} hours
- Start Date: {req.start_date or 'Today'}

Include:
1. Day-by-day schedule in a markdown table
2. Time slots for each subject
3. Revision days
4. Short and long breaks
5. Tips for each subject""",
        },
    ]
    result = chat_completion(messages, max_tokens=4096)
    return {"timetable": result}
