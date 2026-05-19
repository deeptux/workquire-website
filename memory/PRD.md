# WorkQuire — Product Requirements Document

## Original problem statement
Build a landing page: convert the Canva portfolio https://cgonline.my.canva.site/workquire to a decent 3D immersive website — comparable to modern sites but not as flashy as https://www.shader.se/ — enough to feel alive. Top navigation must include "Get Talent Now" and "Inquire  TalentsTeam Now". Mobile responsive down to 320px.

## User choices (confirmed)
- Visual mood: Sleek dark navy + warm amber accents (premium/professional)
- 3D effect intensity: Medium — Three.js animated mesh + particles in hero with scroll-linked depth
- Inquiry forms: Save to DB + send email notification (Resend)
- Logo / imagery: Original WorkQuire branding (stylized text-O)
- Contact info: Keep originals (+63 915 042 3954, workquire@gmail.com)

## Architecture
- Backend: FastAPI + Motor (MongoDB)
- Frontend: React 19 (CRA + craco), Tailwind CSS, shadcn/ui, lucide-react, framer-motion
- 3D: vanilla three.js (R3F JSX bypassed due to visual-edits babel plugin)
- Email: Resend (sender `onboarding@resend.dev`, recipient `deeptuxph2025@gmail.com` in test mode)

## Core requirements
- Sticky glassmorphic top navigation w/ desktop links + mobile hamburger panel
- Two prominent CTAs: "Get Talent Now" and "Inquire Talents Team Now"
- Subtle 3D hero (wireframe icosahedrons + amber/cool particle halo + mouse parallax)
- Sections: Hero → About + Mission/Vision → Milestones → Why Built → Talents (14 roles) → Process (3 steps) → Footer/Contact
- Inquiry dialog (reused for VA + Team) with validation, success state, sonner toasts
- Mobile responsive down to 320px

## Implemented (2026-05-18)
- Backend `POST /api/inquiries`, `GET /api/inquiries`, `GET /api/health`
- MongoDB persistence (no `_id` exposed, datetime stored as ISO)
- Resend email notification with HTML template (graceful fallback if key missing)
- Full landing page with all 7 sections
- Three.js hero animation (icosahedron + particles + mouse parallax)
- Framer Motion scroll reveals on every section
- Sonner toasts for form feedback
- 100% pass on backend + frontend test suite

## Prioritized backlog
- P1: Add talent role filter / search and bookmarkable inquiry deep-links
- P1: Live "We're online" indicator + Calendly embed for instant booking
- P2: Case studies / client logos marquee
- P2: Verified Resend domain (replace `onboarding@resend.dev`)
- P2: Lifespan handler migration (replace deprecated `@app.on_event`)
- P2: Native BSON datetime storage for created_at
- P3: Multi-language (Tagalog / English toggle)
- P3: Admin dashboard to view inquiries

## Next tasks
- Optional: Calendly / scheduling integration for instant calls
- Optional: Admin dashboard at `/admin` with simple JWT auth
- Optional: SEO meta / OG image / sitemap
