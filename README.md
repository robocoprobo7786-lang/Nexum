# Nexum — Institutional Research Portfolio & Accreditation Readiness System

Nexum is an institutional research activity and accreditation readiness tracking system built for higher education institutions, research labs, and academic departments. It enables continuous tracking of faculty publications, co-author management (internal faculty vs. external collaborators), evidence attachment, and institutional reporting.

---

## 📚 Evaluation Documentation

For full evaluator documentation, UI explanations, database ER diagrams, user flows, and screenshots, visit the **[`docs/`](./docs/README.md)** directory:

- 📖 **[System Overview & Quickstart](./docs/README.md)**
- 📐 **[Architecture & Tech Stack](./docs/README.md#-system-architecture--tech-stack)**
- 🗄️ **[Database Schema & ER Diagram](./docs/README.md#-database-schema--er-diagram)**
- 🔄 **[User Flow & Navigation Diagrams](./docs/README.md#-user-navigation--system-flow)**
- 📱 **[Screen-by-Screen UI Documentation](./docs/README.md#-detailed-screen-by-screen-ui-documentation)**
- 📸 **[Screenshots Gallery](./docs/README.md#-screenshots-gallery)**

---

## 📸 UI Screenshots

| Institutional Dashboard | Publications Directory & Filters |
| :---: | :---: |
| ![Dashboard](./docs/screenshots/dashboard.png) | ![Publications List](./docs/screenshots/publications-list.png) |

| 3-Step Creation Wizard | Publication Details & Cascade Delete |
| :---: | :---: |
| ![Wizard](./docs/screenshots/new-publication-wizard.png) | ![Details](./docs/screenshots/publication-details.png) |

| Faculty Research Profile | Reports & Analytics |
| :---: | :---: |
| ![Faculty Profile](./docs/screenshots/faculty-profile.png) | ![Reports](./docs/screenshots/reports-analytics.png) |

---

## 🚀 Implemented Capabilities

- **Institutional Dashboard**: KPI cards, recent contributions feed, yearly & type distribution charts.
- **3-Step Creation Wizard**: Guided 3-step creation flow for metadata, internal/external co-authors, and evidence attachment.
- **Search, Filter & Pagination**: Server-side text search (Title/DOI), department, publication type, year, evidence status filters, column sorting, and URL param pagination.
- **Faculty Research Profiles**: Faculty KPI cards, active years range, top collaborators ranking, segmented evidence readiness bar, and output history.
- **Reports & Analytics**: Real SQL aggregate queries powering Yearly trends, Publication type donuts, Department breakdowns, Evidence readiness indicators, and Cross-department collaboration matrices.
- **Cascade Deletion**: Safe deletion of publication records with confirmation dialog and cascading removal of author/evidence rows.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router, Server Actions)
- **Language**: TypeScript (Strict mode, no `any`)
- **Database & ORM**: Neon PostgreSQL (Serverless) + Drizzle ORM
- **Styling & Components**: TailwindCSS v4, Shadcn UI / Radix primitives, Lucide icons
- **Charts**: Recharts

---

## 🏃 Quickstart

```bash
# 1. Install dependencies
npm install

# 2. Setup environment variables (.env.local)
# POSTGRES_URL="postgresql://..."

# 3. Run database migrations & seed dummy data
npm run db:migrate
npm run db:seed

# 4. Start local development server
npm run dev

# 5. Run E2E Acceptance Test Suite
npx tsx scripts/e2e-test-suite.ts
```
