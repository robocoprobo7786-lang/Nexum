# V10 — Research, Publication & Professional Contribution
## Requirements & Implementation Brief

> **Purpose:** This file is the source of truth for implementing the V10 hackathon MVP.  
> Build the required MVP first. Add differentiation only when it does not put the acceptance test at risk.

---

## 1. Problem Statement

### Business / Accreditation Requirement

Institutions must document:

- research publications
- conference contributions
- patents/projects
- other professional contributions

of faculty.

### MVP Objective

Build a **research activity record system** covering publications and professional contributions.

---

## 2. Common Core Entities

The hackathon provides these conceptual core entities:

- Institution
- Department
- Program
- Academic Year
- Semester
- Student
- Faculty
- Course

Use the relevant core entities rather than unnecessarily recreating them.

For V10, **Faculty** and **Department** are especially relevant.

---

## 3. Mandatory Data to Capture

The system must capture:

| Data | Notes |
|---|---|
| Faculty | Internal faculty member associated with research |
| Publication | Research publication / contribution record |
| Publication type | Journal, conference, patent/project/etc. as appropriate |
| Authors | Multiple authors must be supported |
| Journal / conference | Venue for the publication |
| Year | Publication year |
| DOI / reference | DOI or other reference |
| Evidence | Supporting evidence/reference |

---

# 4. Critical ER Design Requirement

## Multiple Authors

This is the central ER challenge of V10.

A publication can have:

- multiple internal faculty authors
- external/non-faculty co-authors
- two or more authors in any combination

### Do NOT implement

Do not create fixed fields such as:

```text
author1
author2
author3
author4
```

Do not store all authors as one comma-separated text field.

### Required approach

Use an **association/junction entity** between publications and authors.

The design must support:

```text
Publication
    |
    | 1:N
    v
PublicationAuthor
    |
    +----> Faculty (internal author)
    |
    +----> ExternalAuthor (external author)
```

The exact implementation can vary, but the model must correctly represent multiple authors and both internal and external authors.

---

## 5. Recommended V10 Data Model

This is a recommended starting point, not a requirement to blindly copy.

### Faculty

Use the provided/common Faculty entity.

Relevant relationship:

```text
Department 1 ─── N Faculty
```

### Publication

Suggested fields:

```text
id
title
publicationTypeId
journalOrConference
year
doiOrReference
createdAt
updatedAt
```

### PublicationType

Reusable master/reference data:

```text
id
name
```

Examples:

```text
Journal
Conference
Patent
Project
Book Chapter
```

Keep the actual set appropriate to the MVP.

### ExternalAuthor

Suggested fields:

```text
id
name
affiliation
```

Do not require external authors to be Faculty.

### PublicationAuthor

Association entity.

Suggested fields:

```text
id
publicationId
facultyId        nullable
externalAuthorId nullable
authorOrder
```

Important rule:

> A PublicationAuthor record must represent exactly one author: either an internal Faculty or an ExternalAuthor.

The schema should enforce this where practical.

`authorOrder` should preserve publication author ordering.

Example:

```text
Publication:
"AI-Based Medical Imaging"

PublicationAuthor:

1 → Faculty: Dr Rao     → order 1
2 → Faculty: Dr Khan    → order 2
3 → External: John Smith → order 3
```

### Evidence

Suggested MVP fields:

```text
id
publicationId
evidenceType
reference
verificationStatus
```

For the hackathon, dummy evidence references are acceptable. Do not overbuild file storage unless it is necessary and time permits.

---

# 6. Required UI Flow

The official required flow is:

```text
Faculty
  ↓
Research Profile
  ↓
Publication / Contribution
  ↓
Details
  ↓
Evidence
```

The MVP must make this flow understandable and usable.

---

# 7. Required MVP Capabilities

The working MVP must demonstrate:

```text
Create
  ↓
View
  ↓
Search / Filter
  ↓
Update
  ↓
Report / Insight
```

### Publication Management

Users should be able to:

- create a publication/contribution
- select its publication type
- enter journal/conference
- enter year
- enter DOI/reference
- add multiple authors
- add internal faculty authors
- add at least one external/non-faculty author
- add evidence/reference
- view publication details
- update publication information
- search/filter publications

### Faculty Research Profile

For a faculty member, show their attributed publications/contributions.

A publication with multiple internal faculty authors must appear correctly in every relevant faculty research profile.

---

# 8. Required Reports / Insights

The MVP must provide:

### Publications by Year

Example:

```text
2024 → 8
2025 → 14
2026 → 19
```

### Faculty-wise Publication List

Allow viewing publications attributed to a particular faculty member.

### Department-wise Publications

Because publications are attributed to Faculty and Faculty belongs to Department, derive department publication information through those relationships.

### Publication-type Distribution

Example:

```text
Journal      55%
Conference   30%
Patent       10%
Project       5%
```

These are illustrative values only.

---

# 9. Acceptance Test

The reviewer must be able to:

1. Add a publication.
2. Add multiple co-authors.
3. Include at least one internal faculty author.
4. Include at least one external, non-faculty author.
5. Save the publication successfully.
6. Open the relevant faculty research profiles.
7. See the publication correctly attributed to each internal faculty author.
8. See the publication's author information correctly displayed.

The system must also produce the required reports/insights and update them correctly when records change.

---

# 10. Dummy Dataset

The official guidance requires at least:

- **15 faculty**
- **25+ publication records**
- several publications with **2 or more co-authors**
- at least **3 publication types**

The dataset should include:

- multiple departments
- multiple internal authors
- external authors
- different publication years
- different publication types
- evidence records

Make the data realistic enough to demonstrate relationships and reports.

---

# 11. Differentiation Layer

## Important

The following ideas are **not replacements for the MVP requirements**.

They are optional differentiation ideas to implement only after the mandatory flow is stable.

The strongest product framing is:

> **Research Intelligence & Accreditation Readiness**

Instead of presenting the application as only a publication CRUD system, show how continuously captured research data can help an institution understand its research activity and evidence readiness.

### A. Research Profile

Make the faculty research profile more useful than a plain table.

Potential sections:

```text
Research Output
Publications by Year
Publication Types
Research Areas
External Collaborations
Evidence Status
Recent Contributions
```

### B. Evidence Readiness

Derive an evidence completeness/readiness metric from the data.

For example:

```text
Evidence Readiness: 91%

Verified: 142
Pending: 18
Missing: 6
```

Do not invent an official accreditation scoring formula. This is an application-level indicator.

### C. Research Activity Trend

Turn the required publication-by-year report into an insight.

Example:

```text
Research output increased 38% over the last 2 years.
```

Only calculate claims from the actual dummy dataset.

### D. Collaboration Network

Because the database contains publication-author relationships, derive useful collaboration information.

Examples:

```text
Top Research Collaborators

Dr Rao ↔ Dr Khan       7 publications
Dr Rao ↔ External X    5 publications
```

Potentially show:

- cross-faculty collaboration
- cross-department collaboration
- external collaboration

This should be derived from actual publication-author records.

### E. Institution Research Overview

A possible high-level dashboard:

```text
Research Portfolio

Publications
Faculty Researchers
External Collaborators
Research Evidence Readiness
Publication Growth
```

The dashboard should answer:

> "What is the current research situation of the institution?"

rather than only displaying raw record counts.

---

# 12. Recommended Demo Story

The strongest demonstration should show that one correctly modeled publication affects multiple parts of the system.

Example publication:

```text
AI-Based Medical Imaging

Authors:
1. Dr Rao — CSE
2. Dr Khan — ECE
3. John Smith — External

Type:
Journal

Year:
2026

DOI:
10.xxxx/example

Evidence:
publication.pdf
```

After saving:

```text
Dr Rao's Research Profile
        ↓
Publication appears

Dr Khan's Research Profile
        ↓
Same publication appears

Research Dashboard
        ↓
2026 count increases

CSE Department
        ↓
Publication count updates

ECE Department
        ↓
Publication count updates

Journal Distribution
        ↓
Journal count updates

Evidence Readiness
        ↓
Evidence status updates

Collaboration
        ↓
Rao ↔ Khan relationship exists
```

This demonstrates that the ER model is actually driving the application.

---

# 13. UI / UX Direction

Use the existing project's UI stack and conventions.

Prefer:

- clean dashboard
- strong information hierarchy
- responsive layouts
- accessible forms
- clear empty/loading/error states
- reusable components
- concise forms
- useful detail views

Use Shadcn/ui components when applicable.

Do not recreate standard UI primitives unnecessarily.

Custom components should generally compose existing primitives into application-level components.

---

# 14. Engineering Rules

### Database

- Use PostgreSQL through Neon.
- Use Drizzle ORM.
- Keep relationships explicit.
- Use foreign keys where appropriate.
- Use unique constraints where appropriate.
- Use database constraints for important integrity rules where practical.
- Avoid duplicated master/reference data.
- Avoid comma-separated multi-value fields.
- Avoid fixed-number author columns.
- Do not over-normalize without a clear reason.

### TypeScript

- Strict TypeScript.
- Avoid `any`.
- Prefer inferred Drizzle types where appropriate.
- Keep database types and application types consistent.

### Validation

Validate user input at the server boundary.

At minimum validate:

- publication title
- publication type
- year
- DOI/reference where applicable
- author selection
- evidence/reference where applicable

### Server Actions

Use the project's established Server Action pattern for mutations unless there is a clear reason to use another approach.

### AI / Agent Usage

AI may generate implementation code, but all generated code must be understood, tested, and validated.

Do not accept an architectural decision simply because an AI agent suggested it.

---

# 15. Scope Control

## Must Build

```text
Faculty → Research Profile
Publication CRUD
Multiple authors
Internal faculty authors
External authors
Evidence/reference
Search/filter
Required reports
Seed data
ER diagram
Schema
Working acceptance test
```

## Build If Time Allows

```text
Evidence Readiness
Research Activity Trend
Collaboration Network
Cross-department collaboration
Institution Research Overview
Polished research profile
```

## Avoid Unless Clearly Necessary

```text
AI chatbot
Blockchain
Complex recommendation engine
Citation scraping
Google Scholar integration
ORCID integration
Complex predictive ML
Email/notification systems
Authentication/authorization beyond what the MVP requires
```

Do not add technology merely to make the project sound sophisticated.

---

# 16. Technology Decision Documentation

Create:

```text
docs/technology-decision.md
```

For important decisions document:

```text
Requirement
Options
Evaluation
Decision
Evidence
```

Important V10 decisions worth documenting include:

### Why PostgreSQL?

Because the system contains relational entities and many-to-many relationships requiring foreign-key constraints and integrity.

### Why PublicationAuthor?

Because a publication can have multiple internal and external authors.

### Why ExternalAuthor?

Because the acceptance test requires an external, non-faculty co-author.

### Why PublicationType as a reusable entity?

To maintain consistent publication-type values and support reporting.

### Why authorOrder?

To preserve the actual author ordering of a publication.

Keep the document concise and decision-focused.

---

# 17. Final Principle

Build the MVP first.

The winning differentiation should come from **making the required data useful**, not from making the database unnecessarily complicated.

The core idea is:

> **Don't just store research. Turn research records into a continuously maintained institutional research picture.**

The required ER relationships should directly power the UI, reports, and demo.
