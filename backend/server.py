from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import asyncio
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional, Literal
import uuid
from datetime import datetime, timezone
import resend


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Resend setup
RESEND_API_KEY = os.environ.get('RESEND_API_KEY', '')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')
NOTIFICATION_EMAIL = os.environ.get('NOTIFICATION_EMAIL', 'workquire@gmail.com')
if RESEND_API_KEY:
    resend.api_key = RESEND_API_KEY

# Create the main app without a prefix
app = FastAPI(title="WorkQuire API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# ==================== MODELS ====================
class InquiryCreate(BaseModel):
    model_config = ConfigDict(extra="ignore")
    inquiry_type: Literal["va", "team"]
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    company: Optional[str] = Field(default=None, max_length=160)
    phone: Optional[str] = Field(default=None, max_length=40)
    role: Optional[str] = Field(default=None, max_length=120)
    team_size: Optional[str] = Field(default=None, max_length=40)
    message: str = Field(min_length=1, max_length=2000)


class Inquiry(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    inquiry_type: Literal["va", "team"]
    name: str
    email: EmailStr
    company: Optional[str] = None
    phone: Optional[str] = None
    role: Optional[str] = None
    team_size: Optional[str] = None
    message: str
    email_sent: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# ==================== HELPERS ====================
def build_email_html(inq: Inquiry) -> str:
    label = "Virtual Assistant" if inq.inquiry_type == "va" else "Team / Multiple Roles"
    rows = [
        ("Inquiry Type", label),
        ("Name", inq.name),
        ("Email", inq.email),
        ("Company", inq.company or "—"),
        ("Phone", inq.phone or "—"),
        ("Role / Skills", inq.role or "—"),
        ("Team Size", inq.team_size or "—"),
        ("Submitted", inq.created_at.isoformat()),
    ]
    rows_html = "".join(
        f"""<tr>
              <td style="padding:8px 14px;border-bottom:1px solid #1f2937;color:#9ca3af;font-size:12px;text-transform:uppercase;letter-spacing:0.08em;width:160px;">{k}</td>
              <td style="padding:8px 14px;border-bottom:1px solid #1f2937;color:#f9fafb;font-size:14px;">{v}</td>
            </tr>""" for k, v in rows
    )
    return f"""
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0b1120;padding:32px 0;font-family:Arial,Helvetica,sans-serif;">
      <tr><td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background:#111827;border:1px solid #1f2937;border-radius:16px;overflow:hidden;">
          <tr><td style="padding:28px 32px;background:linear-gradient(135deg,#111827,#1f2937);border-bottom:2px solid #f59e0b;">
            <div style="color:#f59e0b;letter-spacing:0.3em;font-size:11px;text-transform:uppercase;">WorkQuire</div>
            <div style="color:#f9fafb;font-size:22px;font-weight:700;margin-top:6px;">New {label} Inquiry</div>
          </td></tr>
          <tr><td style="padding:20px 18px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">{rows_html}</table>
            <div style="margin-top:18px;padding:16px;background:#0b1120;border:1px solid #1f2937;border-radius:10px;">
              <div style="color:#9ca3af;font-size:11px;text-transform:uppercase;letter-spacing:0.12em;margin-bottom:8px;">Message</div>
              <div style="color:#f9fafb;font-size:14px;line-height:1.6;white-space:pre-wrap;">{inq.message}</div>
            </div>
          </td></tr>
          <tr><td style="padding:18px 32px;background:#0b1120;color:#6b7280;font-size:11px;">
            Sent automatically by the WorkQuire landing page.
          </td></tr>
        </table>
      </td></tr>
    </table>
    """


async def send_inquiry_email(inq: Inquiry) -> bool:
    if not RESEND_API_KEY:
        logger.warning("RESEND_API_KEY missing — skipping email notification.")
        return False
    label = "VA" if inq.inquiry_type == "va" else "Team"
    params = {
        "from": f"WorkQuire <{SENDER_EMAIL}>",
        "to": [NOTIFICATION_EMAIL],
        "reply_to": inq.email,
        "subject": f"New {label} Inquiry — {inq.name}",
        "html": build_email_html(inq),
    }
    try:
        result = await asyncio.to_thread(resend.Emails.send, params)
        logger.info(f"Inquiry email sent: {result.get('id') if isinstance(result, dict) else result}")
        return True
    except Exception as e:
        logger.error(f"Failed to send inquiry email: {e}")
        return False


# ==================== ROUTES ====================
@api_router.get("/")
async def root():
    return {"service": "WorkQuire API", "status": "ok"}


@api_router.get("/health")
async def health():
    return {"status": "healthy", "email_configured": bool(RESEND_API_KEY)}


@api_router.post("/inquiries", response_model=Inquiry)
async def create_inquiry(payload: InquiryCreate):
    inq = Inquiry(**payload.model_dump())
    email_sent = await send_inquiry_email(inq)
    inq.email_sent = email_sent

    doc = inq.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    try:
        await db.inquiries.insert_one(doc)
    except Exception as e:
        logger.error(f"DB insert failed: {e}")
        raise HTTPException(status_code=500, detail="Could not save inquiry")
    return inq


@api_router.get("/inquiries", response_model=List[Inquiry])
async def list_inquiries():
    docs = await db.inquiries.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    for d in docs:
        if isinstance(d.get('created_at'), str):
            try:
                d['created_at'] = datetime.fromisoformat(d['created_at'])
            except Exception:
                d['created_at'] = datetime.now(timezone.utc)
    return docs


# Include the router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
