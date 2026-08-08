# Database Documentation & Integrity Constraints

## Engine & Connection

Nexum uses a Neon Serverless PostgreSQL database managed via Drizzle ORM. Database schemas are declared in TypeScript (`src/db/schema/`) and migrations are handled via `drizzle-kit`.

---

## Schema Architecture

```text
department (1) ───< faculty (N) ───< publication_author (N) >─── publication (1)
                                             │                         │
external_author (1) ─────────────────────────┘                         └───< evidence (N)
```

---

## Detailed Table Definitions

### 1. `department`
Defines academic departments within the institution.
```ts
export const department = pgTable("department", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
});
```

### 2. `faculty`
Defines internal faculty researchers linked to a department.
```ts
export const faculty = pgTable("faculty", {
  id: serial("id").primaryKey(),
  departmentId: integer("department_id").notNull().references(() => department.id),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
});
```

### 3. `publication_type`
Defines publication categories (e.g. Journal, Conference, Patent, Project, Book Chapter).
```ts
export const publicationType = pgTable("publication_type", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
});
```

### 4. `external_author`
Defines non-faculty co-authors from external institutions.
```ts
export const externalAuthor = pgTable("external_author", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  affiliation: varchar("affiliation", { length: 255 }),
});
```

### 5. `publication`
Primary publication record.
```ts
export const publication = pgTable("publication", {
  id: serial("id").primaryKey(),
  publicationTypeId: integer("publication_type_id").notNull().references(() => publicationType.id),
  title: varchar("title", { length: 500 }).notNull(),
  journalOrConference: varchar("journal_or_conference", { length: 255 }),
  year: integer("year").notNull(),
  doiOrReference: varchar("doi_or_reference", { length: 500 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
```

### 6. `publication_author` (Junction Table with Unique Constraints & Cascade Delete)
Junction table enforcing ordered co-authorship.
```ts
export const publicationAuthor = pgTable(
  "publication_author",
  {
    id: serial("id").primaryKey(),
    publicationId: integer("publication_id").notNull().references(() => publication.id, { onDelete: 'cascade' }),
    facultyId: integer("faculty_id").references(() => faculty.id),
    externalAuthorId: integer("external_author_id").references(() => externalAuthor.id),
    authorOrder: integer("author_order").notNull(),
  },
  (table) => [
    unique("unique_pub_faculty").on(table.publicationId, table.facultyId),
    unique("unique_pub_external_author").on(table.publicationId, table.externalAuthorId),
    unique("unique_pub_order").on(table.publicationId, table.authorOrder),
  ]
);
```

### 7. `evidence` (With Cascade Delete)
Verification document or reference link.
```ts
export const evidence = pgTable("evidence", {
  id: serial("id").primaryKey(),
  publicationId: integer("publication_id").notNull().references(() => publication.id, { onDelete: 'cascade' }),
  evidenceType: varchar("evidence_type", { length: 100 }).notNull(),
  reference: varchar("reference", { length: 500 }).notNull(),
  verificationStatus: varchar("verification_status", { length: 50 }).notNull().default('pending'),
});
```

---

## Cascading Deletion Verification
In `publicationAuthor` and `evidence`, `publicationId` is configured with `onDelete: 'cascade'`.
When a publication is deleted via `db.delete(publication).where(eq(publication.id, id))`, PostgreSQL automatically purges:
1. All linked `publication_author` rows.
2. All linked `evidence` rows.

This behavior is explicitly tested and verified by `scripts/e2e-test-suite.ts`.
