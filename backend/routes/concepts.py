from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from utils.groq_client import chat_completion
from utils.pdf_utils import truncate_text
from routes.upload import pdf_store

router = APIRouter()


class ConceptRequest(BaseModel):
    concept: str
    use_pdf: bool = True


@router.post("/explain-concept")
async def explain_concept(req: ConceptRequest):
    if not req.concept.strip():
        raise HTTPException(status_code=400, detail="Concept cannot be empty")

    context = ""
    if req.use_pdf and pdf_store.get("text"):
        context = f"\n\nContext from uploaded document:\n{truncate_text(pdf_store['text'], 8000)}"

    messages = [
        {
            "role": "system",
            "content": "You are an expert academic tutor. Explain concepts clearly with definitions, examples, analogies, and real-world applications. Use markdown formatting.",
        },
        {
            "role": "user",
            "content": f"Explain the concept: '{req.concept}'{context}\n\nProvide a thorough explanation with examples.",
        },
    ]
    result = chat_completion(messages)
    return {"explanation": result, "concept": req.concept}
