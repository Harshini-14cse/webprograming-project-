from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from utils.groq_client import chat_completion
from utils.pdf_utils import truncate_text
from routes.upload import pdf_store

router = APIRouter()


class SummaryRequest(BaseModel):
    custom_text: str = ""


@router.post("/summary")
async def generate_summary(req: SummaryRequest):
    text = req.custom_text or pdf_store.get("text", "")
    if not text:
        raise HTTPException(status_code=400, detail="No PDF uploaded or text provided")

    content = truncate_text(text)
    messages = [
        {
            "role": "system",
            "content": "You are an expert academic tutor. Generate clear, structured summaries with key points, main concepts, and important details. Use markdown formatting with headers and bullet points.",
        },
        {
            "role": "user",
            "content": f"Please provide a comprehensive summary of the following content:\n\n{content}",
        },
    ]
    result = chat_completion(messages)
    return {"summary": result}
