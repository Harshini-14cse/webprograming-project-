import logging
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from utils.groq_client import chat_completion
from utils.pdf_utils import truncate_text
from routes.upload import pdf_store

logger = logging.getLogger("learnbuddy.questions")
router = APIRouter()


class QuestionRequest(BaseModel):
    num_questions: int = 5
    custom_text: str = ""


@router.post("/generate-2mark")
async def generate_2mark(req: QuestionRequest):
    text = req.custom_text or pdf_store.get("text") or ""
    if not text.strip():
        raise HTTPException(status_code=400, detail="No PDF uploaded or text provided")

    logger.info("Generating %d 2-mark questions", req.num_questions)
    content = truncate_text(text)
    messages = [
        {
            "role": "system",
            "content": (
                "You are an expert exam question creator. Generate concise 2-mark questions "
                "with brief model answers. Use markdown formatting with numbered questions and clear answers."
            ),
        },
        {
            "role": "user",
            "content": (
                f"Generate {req.num_questions} 2-mark questions with answers from:\n\n{content}\n\n"
                "Format:\nQ1. [Question]\nAnswer: [2-mark answer in 2-3 sentences]\n"
            ),
        },
    ]
    try:
        result = chat_completion(messages)
        logger.info("2-mark questions generated (%d chars)", len(result))
        return {"questions": result}
    except Exception as e:
        logger.error("2-mark generation failed: %s", e)
        raise HTTPException(status_code=500, detail=f"AI generation failed: {str(e)}")


@router.post("/generate-13mark")
async def generate_13mark(req: QuestionRequest):
    text = req.custom_text or pdf_store.get("text") or ""
    if not text.strip():
        raise HTTPException(status_code=400, detail="No PDF uploaded or text provided")

    logger.info("Generating %d 13-mark questions", req.num_questions)
    content = truncate_text(text)
    messages = [
        {
            "role": "system",
            "content": (
                "You are an expert exam question creator. Generate detailed 13-mark essay questions "
                "with comprehensive model answers including introduction, key points, diagrams description, "
                "and conclusion. Use markdown formatting."
            ),
        },
        {
            "role": "user",
            "content": (
                f"Generate {req.num_questions} 13-mark questions with detailed model answers from:\n\n{content}\n\n"
                "Each answer should be comprehensive with multiple sections."
            ),
        },
    ]
    try:
        result = chat_completion(messages, max_tokens=4096)
        logger.info("13-mark questions generated (%d chars)", len(result))
        return {"questions": result}
    except Exception as e:
        logger.error("13-mark generation failed: %s", e)
        raise HTTPException(status_code=500, detail=f"AI generation failed: {str(e)}")
