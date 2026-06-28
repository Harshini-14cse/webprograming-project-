import logging
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from utils.groq_client import chat_completion
from utils.pdf_utils import truncate_text
from routes.upload import pdf_store

logger = logging.getLogger("learnbuddy.doubt")
router = APIRouter()


class DoubtRequest(BaseModel):
    question: str
    use_pdf: bool = True


@router.post("/solve-doubt")
async def solve_doubt(req: DoubtRequest):
    if not req.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty")

    context = ""
    if req.use_pdf and pdf_store.get("text"):
        context = f"\n\nRelevant content from the uploaded document:\n{truncate_text(pdf_store['text'], 8000)}"

    logger.info("Solving doubt: '%s...' (pdf_context=%s)", req.question[:60], bool(context))
    messages = [
        {
            "role": "system",
            "content": (
                "You are a knowledgeable academic tutor. Answer student doubts clearly and thoroughly. "
                "When document context is provided, refer to it directly. "
                "Use markdown formatting with examples where helpful."
            ),
        },
        {
            "role": "user",
            "content": f"Student's doubt: {req.question}{context}",
        },
    ]
    try:
        result = chat_completion(messages)
        logger.info("Doubt answered (%d chars)", len(result))
        return {"answer": result, "used_pdf": bool(context)}
    except Exception as e:
        logger.error("Doubt solver failed: %s", e)
        raise HTTPException(status_code=500, detail=f"AI generation failed: {str(e)}")
