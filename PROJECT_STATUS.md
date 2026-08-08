# Nexum Project Setup & Database Status

*Last Updated: August 8, 2026*

---

## 🛠️ 1. Project Setup Overview

The project **Nexum** is configured as a modern **Next.js 16 (App Router)** web application located in the [`nexum/`](file:///c:/Users/LENOVO/Desktop/Hackathon/nexum) directory.

### Core Stack & Dependencies
* **Framework:** Next.js `16.3.0` (App Router)
* **UI Library:** React `19.2.8` & React DOM `19.2.8`
* **Language:** TypeScript `5.x`
* **Styling:** TailwindCSS v4 (`@tailwindcss/postcss` & `tailwindcss`)
* **Linting & Tooling:** ESLint 9, PostCSS
* **ORM & Database Driver:**
  * `drizzle-orm`: `^0.45.2`
  * `postgres`: `^3.4.9` (PostgreSQL client driver)
  * `drizzle-kit`: `^0.31.10` (Dev Dependency for migrations and introspections)

---

## 📂 2. Current Code Base Structure

```text
nexum/
├── .env.local                    # Environment configuration & Neon DB Connection strings
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── test-db/
│   │   │       └── route.ts      # API route to test connection (`SELECT NOW()`)
│   │   ├── globals.css           # Global Tailwind CSS imports
│   │   ├── layout.tsx            # Root layout component
│   │   └── page.tsx              # Main homepage entry point
│   └── db/
│       └── index.ts              # Drizzle ORM client initialization
├── package.json                  # Dependencies & scripts
├── tsconfig.json                 # TypeScript compiler configuration
└── PROJECT_STATUS.md             # This status document
```

---

## 🗄️ 3. Database Architecture & Current Status

The application connects to a **Neon Serverless PostgreSQL** instance provisioned via Vercel integration.

### Connection Configuration ([`.env.local`](file:///c:/Users/LENOVO/Desktop/Hackathon/nexum/.env.local))
* **Provider:** Neon PostgreSQL (Serverless / AWS ap-southeast-1)
* **Pooled Endpoint:** `ep-old-union-az9evyn6-pooler.c-3.ap-southeast-1.aws.neon.tech`
* **Unpooled Endpoint:** `ep-old-union-az9evyn6.c-3.ap-southeast-1.aws.neon.tech`
* **Database Name:** `neondb`
* **Database User:** `neondb_owner`
* **Primary Connection URL:** `POSTGRES_URL` / `DATABASE_URL`

### DB Setup in Code ([`src/db/index.ts`](file:///c:/Users/LENOVO/Desktop/Hackathon/nexum/src/db/index.ts))
* Client connection created using `postgres(process.env.POSTGRES_URL!)`.
* Drizzle ORM instance exported as `db` via `drizzle(client)`.

### Verification Endpoint ([`src/app/api/test-db/route.ts`](file:///c:/Users/LENOVO/Desktop/Hackathon/nexum/src/app/api/test-db/route.ts))
* **GET `/api/test-db`**: Executes a raw query `SELECT NOW()` through Drizzle to verify connection health with Neon DB.

### Database Tables & Schemas
* **Schema Definition File:** *Not yet created* (e.g. `src/db/schema.ts` needs to be defined).
* **`drizzle.config.ts`:** *Not yet created*.
* **Tables in DB:** Currently no application tables exist in the `public` schema.

---

## 📋 4. Next Implementation Steps

1. **Create Drizzle Schema (`src/db/schema.ts`):**
   * Define table models (e.g., `users`, `profiles`, `posts`, etc.) using `drizzle-orm/pg-core`.
2. **Add `drizzle.config.ts`:**
   * Configure Drizzle Kit for schema migrations (`drizzle-kit generate` / `drizzle-kit push`).
3. **Execute Migrations:**
   * Run schema push to create the tables in Neon PostgreSQL.
4. **Build Core Application Features & Server Actions:**
   * Implement CRUD functions using `db` instance from `src/db/index.ts`.
