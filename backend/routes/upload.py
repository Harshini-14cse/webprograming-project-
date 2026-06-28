import logging
import os
import shutil
from fastapi import APIRouter, UploadFile, File, HTTPException
from utils.pdf_utils import extract_text_from_pdf

logger = logging.getLogger("learnbuddy.upload")
router = APIRouter()

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Module-level store — shared across all route modules in the same process
pdf_store: dict = {"filename": None, "text": None, "path": None}


@router.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    logger.info("Upload request: %s (%s)", file.filename, file.content_type)

    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")

    file_path = os.path.join(UPLOAD_DIR, file.filename)
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        logger.info("Saved to %s", file_path)
    except Exception as e:
        logger.error("Failed to save file: %s", e)
        raise HTTPException(status_code=500, detail=f"Failed to save file: {str(e)}")

    try:
        text = extract_text_from_pdf(file_path)
        logger.info("Extracted %d chars from %s", len(text), file.filename)
    except Exception as e:
        logger.error("PDF extraction failed: %s", e)
        raise HTTPException(status_code=500, detail=f"Failed to extract PDF text: {str(e)}")

    pdf_store["filename"] = file.filename
    pdf_store["text"] = text
    pdf_store["path"] = file_path

    return {
        "filename": file.filename,
        "char_count": len(text),
        "preview": text[:500] if text else "No text extracted",
        "success": True,
    }


@router.get("/pdf-status")
async def get_pdf_status():
    if pdf_store["filename"]:
        return {
            "uploaded": True,
            "filename": pdf_store["filename"],
            "char_count": len(pdf_store["text"] or ""),
        }
    return {"uploaded": False}
