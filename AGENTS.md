<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# 🚨 AI AGENT RULES & PROJECT STABILITY DIRECTIVES 🚨

> [!IMPORTANT]
> **READ THIS BEFORE MODIFYING ANY FILES IN THIS REPOSITORY.**
> These instructions are binding for all AI coding assistants (Cursor, Claude Code, Antigravity, Copilot, Windsurf, ChatGPT, etc.).

---

## 🔒 1. DATABASE & SCHEMA ARE LOCKED (DO NOT MODIFY)

The database architecture, Drizzle schemas, migrations, and Neon connection are **100% complete, verified, and deployed**.

- ❌ **DO NOT** edit, remove, or refactor any files in [`src/db/schema/*`](file:///c:/Users/LENOVO/Desktop/Hackathon/nexum/src/db/schema).
- ❌ **DO NOT** touch [`src/db/index.ts`](file:///c:/Users/LENOVO/Desktop/Hackathon/nexum/src/db/index.ts) or [`drizzle.config.ts`](file:///c:/Users/LENOVO/Desktop/Hackathon/nexum/drizzle.config.ts).
- ❌ **DO NOT** modify existing migration files in [`src/db/migrations/*`](file:///c:/Users/LENOVO/Desktop/Hackathon/nexum/src/db/migrations).
- ❌ **DO NOT** run destructive database commands (`drizzle-kit push --force`, `drop table`, `ALTER TABLE` manual drops).
- ❌ **DO NOT** alter the XOR constraint or unique constraints on `publication_author`.

---

## 🔒 2. SEED PIPELINE IS LOCKED (DO NOT MODIFY)

- ❌ **DO NOT** modify [`src/db/seed/data.ts`](file:///c:/Users/LENOVO/Desktop/Hackathon/nexum/src/db/seed/data.ts) or [`src/db/seed/index.ts`](file:///c:/Users/LENOVO/Desktop/Hackathon/nexum/src/db/seed/index.ts).
- ✅ You **MAY** run `npm run db:seed` if you need to reset seed data idempotently.

---

## 🎯 3. ACTIVE FOCUS AREA FOR DEVELOPMENT

All new feature work must take place exclusively in the **Application & UI Layer**:

- **Location:** `src/app/`, `src/components/`, `src/lib/`, `src/actions/`
- **Imports:** Always import `db` from `@/db` and schemas/relations from `@/db/schema`.
- **Target Features to Build:**
  1. Main Navigation Shell (`src/app/layout.tsx`, headers, sidebars).
  2. Dashboard overview page (`src/app/page.tsx`).
  3. Publications list page with search, filters (Department/Year/Type), and pagination.
  4. Publication creation & editing form with dynamic multi-author selection (Faculty vs External Author).
  5. Faculty Research Profile pages (`src/app/faculty/[id]/page.tsx`).
  6. Server Actions for database CRUD operations.

---

## 🛠️ 4. CODE CONVENTIONS & QUALITY

- **TypeScript:** Strict mode only. **NO `any` types.** Use inferred Drizzle types (`Faculty`, `Publication`, `PublicationAuthor`, etc.) exported from `@/db/schema`.
- **Styling:** Use Vanilla CSS or TailwindCSS v4 utilities.
- **Environment Variables:** Do NOT modify or remove `POSTGRES_URL` in `.env.local`.

---

## 📜 5. COMMAND QUICK-REFERENCE

| Command | Purpose |
| :--- | :--- |
| `npm run dev` | Start local Next.js development server |
| `npm run db:seed` | Re-seed live database idempotently |
| `npx tsc --noEmit` | Check TypeScript compilation errors |
