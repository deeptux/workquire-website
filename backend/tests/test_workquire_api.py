"""
Backend API tests for the WorkQuire landing page.

Covers:
- /api/health
- POST /api/inquiries (VA + Team valid flows, validation errors)
- GET /api/inquiries (sorted desc, no MongoDB _id leak)
"""
import os
import time
import uuid
import requests
import pytest

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "").rstrip("/")
if not BASE_URL:
    # Fallback: read frontend env directly (REACT_APP_BACKEND_URL is set there)
    env_path = "/app/frontend/.env"
    if os.path.exists(env_path):
        with open(env_path) as f:
            for line in f:
                if line.startswith("REACT_APP_BACKEND_URL="):
                    BASE_URL = line.split("=", 1)[1].strip().strip('"').rstrip("/")
                    break

API = f"{BASE_URL}/api"


@pytest.fixture(scope="module")
def session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ==================== HEALTH ====================
class TestHealth:
    def test_health_endpoint(self, session):
        r = session.get(f"{API}/health", timeout=15)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data.get("status") == "healthy"
        assert data.get("email_configured") is True


# ==================== INQUIRIES - VALID ====================
class TestInquiryCreate:
    def test_create_va_inquiry_returns_email_sent_true(self, session):
        suffix = uuid.uuid4().hex[:8]
        payload = {
            "inquiry_type": "va",
            "name": f"TEST_VA_{suffix}",
            "email": f"test+va_{suffix}@example.com",
            "message": "Looking for a VA to manage calendar and email.",
            "company": "TEST Co.",
            "phone": "+1 555 0100",
            "role": "Calendar + Inbox",
        }
        r = session.post(f"{API}/inquiries", json=payload, timeout=30)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["inquiry_type"] == "va"
        assert data["name"] == payload["name"]
        assert data["email"] == payload["email"]
        assert data["message"] == payload["message"]
        assert "id" in data and isinstance(data["id"], str) and len(data["id"]) > 0
        assert "_id" not in data
        # Resend test mode delivers to verified address — should be true
        assert data.get("email_sent") is True, f"email_sent expected True, got {data.get('email_sent')}"

    def test_create_team_inquiry_with_team_size(self, session):
        suffix = uuid.uuid4().hex[:8]
        payload = {
            "inquiry_type": "team",
            "name": f"TEST_TEAM_{suffix}",
            "email": f"test+team_{suffix}@example.com",
            "message": "Need a designer + editor + VA combo.",
            "company": "TEST Org",
            "team_size": "3-5",
            "role": "Designer + Editor + VA",
        }
        r = session.post(f"{API}/inquiries", json=payload, timeout=30)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["inquiry_type"] == "team"
        assert data["team_size"] == "3-5"
        assert data["role"] == "Designer + Editor + VA"
        assert "_id" not in data

        # Verify persistence by listing
        time.sleep(0.5)
        r2 = session.get(f"{API}/inquiries", timeout=15)
        assert r2.status_code == 200
        items = r2.json()
        match = next((i for i in items if i.get("id") == data["id"]), None)
        assert match is not None, "Inquiry not found in list after create"
        assert match["team_size"] == "3-5"


# ==================== INQUIRIES - VALIDATION ====================
class TestInquiryValidation:
    @pytest.mark.parametrize("missing_field", ["name", "email", "message"])
    def test_missing_required_field_returns_422(self, session, missing_field):
        payload = {
            "inquiry_type": "va",
            "name": "TEST_X",
            "email": "x@example.com",
            "message": "hello",
        }
        payload.pop(missing_field)
        r = session.post(f"{API}/inquiries", json=payload, timeout=15)
        assert r.status_code == 422, f"Expected 422 for missing {missing_field}, got {r.status_code}: {r.text}"

    def test_empty_required_field_returns_422(self, session):
        payload = {
            "inquiry_type": "va",
            "name": "",
            "email": "x@example.com",
            "message": "hello",
        }
        r = session.post(f"{API}/inquiries", json=payload, timeout=15)
        assert r.status_code == 422, r.text

    def test_invalid_email_returns_422(self, session):
        payload = {
            "inquiry_type": "va",
            "name": "TEST",
            "email": "not-an-email",
            "message": "hello",
        }
        r = session.post(f"{API}/inquiries", json=payload, timeout=15)
        assert r.status_code == 422, r.text

    def test_invalid_inquiry_type_returns_422(self, session):
        payload = {
            "inquiry_type": "freelancer",
            "name": "TEST",
            "email": "x@example.com",
            "message": "hello",
        }
        r = session.post(f"{API}/inquiries", json=payload, timeout=15)
        assert r.status_code == 422, r.text


# ==================== INQUIRIES - LIST ====================
class TestInquiryList:
    def test_list_returns_sorted_desc_and_no_mongo_id(self, session):
        # Seed 2 quickly
        for i in range(2):
            session.post(
                f"{API}/inquiries",
                json={
                    "inquiry_type": "va",
                    "name": f"TEST_SORT_{i}_{uuid.uuid4().hex[:6]}",
                    "email": f"sort_{i}@example.com",
                    "message": "sort test",
                },
                timeout=20,
            )
            time.sleep(0.1)

        r = session.get(f"{API}/inquiries", timeout=15)
        assert r.status_code == 200, r.text
        items = r.json()
        assert isinstance(items, list)
        assert len(items) >= 2

        # Ensure no _id key leaks
        for it in items:
            assert "_id" not in it, f"_id leaked in response: {it}"

        # Verify desc sort by created_at
        ts = [it["created_at"] for it in items]
        assert ts == sorted(ts, reverse=True), "Inquiries are not sorted desc by created_at"
