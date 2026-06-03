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
if RESEND_API_KEY:
    resend.api_key = RESEND_API_KEY


def _notification_recipients() -> list[str]:
    """Comma-separated NOTIFICATION_EMAIL env → list for Resend `to` field."""
    raw = os.environ.get('NOTIFICATION_EMAIL', 'workquire@gmail.com')
    return [e.strip() for e in raw.split(',') if e.strip()]

# Configure logging early so helpers can use the logger safely
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# #region agent log
_DEBUG_LOG = ROOT_DIR.parent / "debug-c4d022.log"


def _agent_log(location: str, message: str, data: dict, hypothesis_id: str, run_id: str = "pre-fix") -> None:
    import json
    import time
    try:
        with open(_DEBUG_LOG, "a", encoding="utf-8") as f:
            f.write(
                json.dumps(
                    {
                        "sessionId": "c4d022",
                        "hypothesisId": hypothesis_id,
                        "location": location,
                        "message": message,
                        "data": data,
                        "timestamp": int(time.time() * 1000),
                        "runId": run_id,
                    }
                )
                + "\n"
            )
    except Exception:
        pass


# #endregion

# Create the main app without a prefix
app = FastAPI(title="WorkQuire API")


def _cors_origins() -> list[str]:
    raw = os.environ.get("CORS_ORIGINS", "*").strip()
    if raw == "*":
        return ["*"]
    return [o.strip() for o in raw.split(",") if o.strip()]


app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=_cors_origins(),
    allow_origin_regex=r"https://(.*\.)?workquire\.com",
    allow_methods=["*"],
    allow_headers=["*"],
)

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
EMAIL_BRAND = {
    "bg_outer": "#080656",
    "bg_card": "#070E48",
    "bg_panel": "#050338",
    "bg_header": "#070E48",
    "accent": "#00B5D5",
    "accent_strong": "#0767B3",
    "text_primary": "#EAF8FD",
    "text_muted": "#79C2CF",
    "text_soft": "#B0E4FA",
    "border": "#081F60",
}


def _email_row_value(key: str, value: str) -> str:
    if key == "Email":
        return (
            f'<a href="mailto:{value}" style="color:{EMAIL_BRAND["accent"]};'
            f'text-decoration:underline;">{value}</a>'
        )
    return value


def build_email_html(inq: Inquiry) -> str:
    c = EMAIL_BRAND
    label = "Virtual Assistant" if inq.inquiry_type == "va" else "Team / Multiple Roles"
    rows = [
        ("Inquiry Type", label),
        ("Name", inq.name),
        ("Email", str(inq.email)),
        ("Company", inq.company or "—"),
        ("Phone", inq.phone or "—"),
        ("Role / Skills", inq.role or "—"),
        ("Team Size", inq.team_size or "—"),
        ("Submitted", inq.created_at.isoformat()),
    ]
    rows_html = "".join(
        f"""<tr>
              <td style="padding:10px 14px;border-bottom:1px solid {c['border']};color:{c['text_muted']};font-size:12px;text-transform:uppercase;letter-spacing:0.08em;width:160px;">{k}</td>
              <td style="padding:10px 14px;border-bottom:1px solid {c['border']};color:{c['text_primary']};font-size:14px;">{_email_row_value(k, v)}</td>
            </tr>"""
        for k, v in rows
    )
    return f"""
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:{c['bg_outer']};padding:32px 0;font-family:Arial,Helvetica,sans-serif;">
      <tr><td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background:{c['bg_card']};border:1px solid {c['border']};border-radius:16px;overflow:hidden;">
          <tr><td style="padding:28px 32px;background-color:{c['bg_header']};background:linear-gradient(135deg,{c['bg_header']},{c['border']});border-bottom:2px solid {c['accent']};">
            <div style="color:{c['accent']};letter-spacing:0.3em;font-size:11px;text-transform:uppercase;">WorkQuire</div>
            <div style="color:{c['text_primary']};font-size:22px;font-weight:700;margin-top:6px;">Client's {label} Inquiry</div>
          </td></tr>
          <tr><td style="padding:20px 18px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">{rows_html}</table>
            <div style="margin-top:18px;padding:16px;background:{c['bg_panel']};border:1px solid {c['border']};border-radius:10px;">
              <div style="color:{c['text_muted']};font-size:11px;text-transform:uppercase;letter-spacing:0.12em;margin-bottom:8px;">Message</div>
              <div style="color:{c['text_primary']};font-size:14px;line-height:1.6;white-space:pre-wrap;">{inq.message}</div>
            </div>
          </td></tr>
          <tr><td style="padding:18px 32px;background:{c['bg_panel']};color:{c['text_muted']};font-size:11px;">
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
        "to": _notification_recipients(),
        "reply_to": inq.email,
        "subject": f"New Client's {label} Inquiry — {inq.name}",
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
    # #region agent log
    _agent_log(
        "server.py:create_inquiry:entry",
        "inquiry_create_started",
        {"inquiry_type": payload.inquiry_type, "mongo_url_host": mongo_url.split("@")[-1][:40]},
        "H1",
    )
    # #endregion
    inq = Inquiry(**payload.model_dump())
    email_sent = await send_inquiry_email(inq)
    inq.email_sent = email_sent
    # #region agent log
    _agent_log(
        "server.py:create_inquiry:after_email",
        "email_step_finished",
        {"email_sent": email_sent},
        "H2",
    )
    # #endregion

    doc = inq.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    try:
        await db.inquiries.insert_one(doc)
        # #region agent log
        _agent_log(
            "server.py:create_inquiry:after_db",
            "db_insert_ok",
            {"inquiry_id": inq.id},
            "H1",
        )
        # #endregion
    except Exception as e:
        # #region agent log
        _agent_log(
            "server.py:create_inquiry:db_error",
            "db_insert_failed",
            {"error_type": type(e).__name__, "error_msg": str(e)[:200], "email_sent": email_sent},
            "H1",
        )
        # #endregion
        logger.error(f"DB insert failed: {e}")
        raise HTTPException(
            status_code=500,
            detail="Could not save inquiry. Database may be unavailable — ensure MongoDB is running on localhost:27017.",
        )
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

logger.info("WorkQuire API starting up — CORS origins: %s", _cors_origins())


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
