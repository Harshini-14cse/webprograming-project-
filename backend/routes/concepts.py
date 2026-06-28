import logging
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from utils.groq_client import chat_completion
from utils.pdf_utils import truncate_text
from routes.upload import pdf_store

logger = logging.getLogger("learnbuddy.concepts")
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

    logger.info("Explaining concept: '%s' (pdf_context=%s)", req.concept, bool(context))
    messages = [
        {
            "role": "system",
            "content": (
                "You are an expert academic tutor. Explain concepts clearly with definitions, "
                "examples, analogies, and real-world applications. Use markdown formatting."
            ),
        },
        {
            "role": "user",
            "content": f"Explain the concept: '{req.concept}'{context}\n\nProvide a thorough explanation with examples.",
        },
    ]
    try:
        result = chat_completion(messages)
        logger.info("Concept explained (%d chars)", len(result))
        return {"explanation": result, "concept": req.concept}
    except Exception as e:
        logger.error("Concept explanation failed: %s", e)
        raise HTTPException(status_code=500, detail=f"AI generation failed: {str(e)}")
