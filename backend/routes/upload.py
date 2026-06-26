import os
import shutil
from fastapi import APIRouter, UploadFile, File, HTTPException
from utils.pdf_utils import extract_text_from_pdf

router = APIRouter()
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# In-memory store for the current session
pdf_store = {"filename": None, "text": None, "path": None}


@router.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")

    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        text = extract_text_from_pdf(file_path)
    except Exception as e:
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
