import json
import logging
import re
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from utils.groq_client import chat_completion
from utils.pdf_utils import truncate_text
from routes.upload import pdf_store

logger = logging.getLogger("learnbuddy.mcq")
router = APIRouter()


class MCQRequest(BaseModel):
    num_questions: int = 10
    difficulty: str = "medium"
    custom_text: str = ""


@router.post("/generate-mcq")
async def generate_mcq(req: MCQRequest):
    text = req.custom_text or pdf_store.get("text") or ""
    if not text.strip():
        raise HTTPException(status_code=400, detail="No PDF uploaded or text provided")

    logger.info("Generating %d MCQs (difficulty=%s)", req.num_questions, req.difficulty)
    content = truncate_text(text)
    messages = [
        {
            "role": "system",
            "content": (
                "You are an expert exam question creator. Generate MCQ questions in valid JSON format only.\n"
                "Return a JSON array like:\n"
                '[\n  {\n    "id": 1,\n    "question": "Question text?",\n'
                '    "options": ["A) Option1", "B) Option2", "C) Option3", "D) Option4"],\n'
                '    "correct": "A",\n    "explanation": "Brief explanation"\n  }\n]\n'
                "Return ONLY the JSON array, no markdown fences, no other text."
            ),
        },
        {
            "role": "user",
            "content": f"Generate {req.num_questions} {req.difficulty} difficulty MCQ questions from:\n\n{content}",
        },
    ]
    try:
        raw = chat_completion(messages, max_tokens=4096)
        logger.info("MCQ raw response length: %d", len(raw))
    except Exception as e:
        logger.error("MCQ Groq call failed: %s", e)
        raise HTTPException(status_code=500, detail=f"AI generation failed: {str(e)}")

    # Strip markdown code fences if present
    raw = re.sub(r"```(?:json)?", "", raw).strip()

    # Extract JSON array
    match = re.search(r"\[.*\]", raw, re.DOTALL)
    if not match:
        logger.error("No JSON array found in MCQ response: %s", raw[:300])
        raise HTTPException(status_code=500, detail="AI did not return valid JSON. Try again.")
    try:
        questions = json.loads(match.group())
    except json.JSONDecodeError as e:
        logger.error("JSON parse error in MCQ: %s | raw: %s", e, raw[:300])
        raise HTTPException(status_code=500, detail="Failed to parse AI response as JSON. Try again.")

    logger.info("MCQ generated: %d questions", len(questions))
    return {"questions": questions, "count": len(questions)}
