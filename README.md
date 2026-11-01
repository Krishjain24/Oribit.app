# ◈ Orbit — The Agent-First Workspace (React SPA)

A modern, responsive **React + TypeScript + Vite** application for **Orbit — The Agent-First Workspace**.

---

## ⚡ Features Ported & Available

1. **Agent-First Development Landing Page**:
   - Brand header with mobile menu and quick navigation to Platform, Workflow, Builders, and Mission Control.
   - **Interactive Agent Studio Demo**: Enter natural language briefs (e.g. storefront layouts, auth systems, or dark theme engines) and observe live simulated multi-step agent plans, affected files, branch targets, and diff previews directly in the hero window.
   - **Capability Strip**: Plan with context, Build across codebases, and Verify with live browser reviews.
   - **Platform Section**: Visual cards for Orchestration constellation, Code Editor with syntax highlighting, and Live Browser Verification.
   - **Outcome-Driven Workflow**: Interactive 3-stage process (Describe destination, Review plan, Follow work through) with active stage switching.
   - **Persona Architecture for Builders**: Interactive tabs for **Frontend Developers**, **Full Stack Builders**, and **Product Teams**, complete with dynamic feature checklists and 3D visual geometry.
   - **Newsletter Subscription**: Inline email subscription in footer with instant validation and status indicators.

2. **Waitlist & Lead Generation Modals**:
   - **Early Access Waitlist Modal**: Full signup flow capturing work email, name, builder role, and company, calculating priority queue position and immediate confirmation.
   - **Team Demo Inquiry Modal**: Enterprise and team inquiry form with inquiry type selection (demo, sales, partnership, general), team size description, and feedback confirmation.

3. **Mission Control Admin Dashboard**:
   - Accessible via the "Mission Control ◈" button or `/admin` route.
   - **Role-Based Authentication**: Secure admin login overlay with default administrator credentials (`admin@orbit.dev` / `OrbitAdminPassword2026!`).
   - **Overview Tab**: Live KPI counters for Total Waitlist, Inquiries, Users & Workspaces, and Agent Tasks, plus interactive bar charts for Builder Roles Distribution and Inquiry Types Breakdown.
   - **Waitlist Management Tab**: Filterable table with queue numbering, roles, company, status pills, and instant inline actions to **Approve** or **Invite** applicants.
   - **Export Waitlist CSV**: Real CSV export button that generates and downloads `orbit_waitlist.csv`.
   - **Inquiries Management Tab**: Review incoming customer and partner inquiries, view messages, and mark status as contacted.
   - **User Accounts Tab**: View registered accounts with role badges and active statuses.
   - **Interactive Agent Studio**: Test and simulate multi-agent orchestration plans on any custom prompt with instant feedback on branch, diffs, and milestones.

---

## ⚡ One-Click Startup (Windows & Mac)

The repository includes self-contained 1-click launcher scripts that check requirements, automatically install missing dependencies **strictly into the local project folder**, and start the server:

### On Windows
Double-click `start.bat` (or run in terminal):
```cmd
.\start.bat
```

### On macOS / Linux
Run `start.sh`:
```bash
chmod +x start.sh && ./start.sh
```

> **🛡️ Strict Project Isolation:**
> - All dependencies are installed **only** inside this directory (`./node_modules` and `./.venv` if Python is present).
> - Zero system-wide or global packages are modified.
> - Starts on `http://localhost:3000` and automatically opens the browser.

---

## 🚀 Running Manually with npm

```bash
npm run dev
```

The Vite dev server listens on `http://0.0.0.0:3000`.

### Building for Production

```bash
npm run build
```
