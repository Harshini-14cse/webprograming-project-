import json
import re
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from utils.groq_client import chat_completion
from utils.pdf_utils import truncate_text
from routes.upload import pdf_store

router = APIRouter()


class MCQRequest(BaseModel):
    num_questions: int = 10
    difficulty: str = "medium"
    custom_text: str = ""


@router.post("/generate-mcq")
async def generate_mcq(req: MCQRequest):
    text = req.custom_text or pdf_store.get("text", "")
    if not text:
        raise HTTPException(status_code=400, detail="No PDF uploaded or text provided")

    content = truncate_text(text)
    messages = [
        {
            "role": "system",
            "content": """You are an expert exam question creator. Generate MCQ questions in valid JSON format only.
Return a JSON array like:
[
  {
    "id": 1,
    "question": "Question text?",
    "options": ["A) Option1", "B) Option2", "C) Option3", "D) Option4"],
    "correct": "A",
    "explanation": "Brief explanation"
  }
]
Return ONLY the JSON array, no other text.""",
        },
        {
            "role": "user",
            "content": f"Generate {req.num_questions} {req.difficulty} difficulty MCQ questions from:\n\n{content}",
        },
    ]
    raw = chat_completion(messages, max_tokens=4096)

    # Extract JSON from response
    match = re.search(r'\[.*\]', raw, re.DOTALL)
    if not match:
        raise HTTPException(status_code=500, detail="Failed to parse MCQ response")
    try:
        questions = json.loads(match.group())
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Invalid JSON in MCQ response")

    return {"questions": questions, "count": len(questions)}
