import io
import logging
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.enums import TA_CENTER

logger = logging.getLogger("learnbuddy.export")
router = APIRouter()


def xml_escape(text: str) -> str:
    """Escape all XML special characters so ReportLab Paragraph never crashes."""
    return (
        text.replace("&", "&amp;")
            .replace("<", "&lt;")
            .replace(">", "&gt;")
            .replace('"', "&quot;")
            .replace("'", "&#39;")
    )


class ExportRequest(BaseModel):
    title: str = "Study Notes"
    content: str
    filename: str = "notes.pdf"


@router.post("/export-pdf")
async def export_pdf(req: ExportRequest):
    if not req.content.strip():
        raise HTTPException(status_code=400, detail="Content cannot be empty")

    logger.info("Exporting PDF: '%s' (%d chars)", req.title, len(req.content))
    try:
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(
            buffer,
            pagesize=A4,
            rightMargin=inch * 0.75,
            leftMargin=inch * 0.75,
            topMargin=inch * 0.75,
            bottomMargin=inch * 0.75,
        )

        styles = getSampleStyleSheet()
        title_style = ParagraphStyle(
            "LBTitle",
            parent=styles["Title"],
            fontSize=18,
            textColor=colors.HexColor("#1e40af"),
            spaceAfter=20,
            alignment=TA_CENTER,
        )
        heading_style = ParagraphStyle(
            "LBHeading",
            parent=styles["Heading2"],
            fontSize=13,
            textColor=colors.HexColor("#1e40af"),
            spaceBefore=12,
            spaceAfter=6,
        )
        body_style = ParagraphStyle(
            "LBBody",
            parent=styles["Normal"],
            fontSize=10,
            leading=16,
            spaceAfter=8,
        )

        story = [
            Paragraph(xml_escape(req.title), title_style),
            Spacer(1, 0.2 * inch),
        ]

        for raw_line in req.content.split("\n"):
            line = raw_line.strip()
            if not line:
                story.append(Spacer(1, 0.1 * inch))
            elif line.startswith("## "):
                story.append(Paragraph(xml_escape(line[3:]), heading_style))
            elif line.startswith("# "):
                story.append(Paragraph(xml_escape(line[2:]), heading_style))
            elif line.startswith("**") and line.endswith("**") and len(line) > 4:
                # Bold line — escape the inner text, then wrap in <b>
                story.append(Paragraph(f"<b>{xml_escape(line[2:-2])}</b>", body_style))
            elif line.startswith("- ") or line.startswith("* "):
                story.append(Paragraph(f"• {xml_escape(line[2:])}", body_style))
            else:
                story.append(Paragraph(xml_escape(line), body_style))

        doc.build(story)
        buffer.seek(0)
        logger.info("PDF built successfully")
    except Exception as e:
        logger.error("PDF export failed: %s", e)
        raise HTTPException(status_code=500, detail=f"PDF export failed: {str(e)}")

    filename = req.filename if req.filename.endswith(".pdf") else req.filename + ".pdf"
    return StreamingResponse(
        buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )
