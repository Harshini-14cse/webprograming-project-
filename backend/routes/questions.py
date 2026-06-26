from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from utils.groq_client import chat_completion
from utils.pdf_utils import truncate_text
from routes.upload import pdf_store

router = APIRouter()


class QuestionRequest(BaseModel):
    num_questions: int = 5
    custom_text: str = ""


@router.post("/generate-2mark")
async def generate_2mark(req: QuestionRequest):
    text = req.custom_text or pdf_store.get("text", "")
    if not text:
        raise HTTPException(status_code=400, detail="No PDF uploaded or text provided")

    content = truncate_text(text)
    messages = [
        {
            "role": "system",
            "content": "You are an expert exam question creator. Generate concise 2-mark questions with brief model answers. Use markdown formatting with numbered questions and clear answers.",
        },
        {
            "role": "user",
            "content": f"Generate {req.num_questions} 2-mark questions with answers from:\n\n{content}\n\nFormat: Q1. [Question]\nAnswer: [2-mark answer in 2-3 sentences]",
        },
    ]
    result = chat_completion(messages)
    return {"questions": result}


@router.post("/generate-13mark")
async def generate_13mark(req: QuestionRequest):
    text = req.custom_text or pdf_store.get("text", "")
    if not text:
        raise HTTPException(status_code=400, detail="No PDF uploaded or text provided")

    content = truncate_text(text)
    messages = [
        {
            "role": "system",
            "content": "You are an expert exam question creator. Generate detailed 13-mark essay questions with comprehensive model answers including introduction, key points, diagrams description, and conclusion. Use markdown formatting.",
        },
        {
            "role": "user",
            "content": f"Generate {req.num_questions} 13-mark questions with detailed model answers from:\n\n{content}\n\nEach answer should be comprehensive with multiple sections.",
        },
    ]
    result = chat_completion(messages, max_tokens=4096)
    return {"questions": result}
