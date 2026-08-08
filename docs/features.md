# Implemented Features Matrix

| Feature | Implemented | Route / File | Description |
| :--- | :---: | :--- | :--- |
| **Institutional Dashboard** | ✓ | `/` (`src/app/page.tsx`) | Live KPI cards, recent contributions list, integrated analytical charts |
| **3-Step Creation Wizard** | ✓ | `/publications/new` | Multi-step guided creation flow for publication metadata, authors, and evidence |
| **Faculty Author Popover** | ✓ | Step 2 Component | Searchable command popover listing real faculty from database with department badges |
| **Inline External Author Creator** | ✓ | Step 2 Component | Mini-form and live search for external non-faculty authors with affiliation |
| **Author Reordering & Glyphs** | ✓ | Step 2 Component | 1-based order tracking, up/down buttons, visual distinction (`⦿` Faculty vs `◇` External) |
| **Evidence Attachment** | ✓ | Step 3 Component | URL/text reference input, type selection, verification status (`Verified`, `Pending`, `Missing`) |
| **Publications Directory** | ✓ | `/publications` | Full directory with search, multi-field filters, column sorting, and URL pagination |
| **Publication Details Page** | ✓ | `/publications/:id` | Full record view with ordered co-authors, profile links, and evidence badges |
| **Safe Cascade Deletion** | ✓ | `/publications/:id` | Confirmation modal warning about cascading removal of `publication_author` and `evidence` rows |
| **Faculty Research Directory** | ✓ | `/faculty` | Grid/table listing all internal faculty with department badges and pub counts |
| **Faculty Research Profile** | ✓ | `/faculty/:id` | Faculty KPIs (Pub Count, Active Years Range, Ext. Collaborators), Top Collaborators list |
| **Publications by Year Report** | ✓ | `/reports` | Bar chart of output by year + dynamic trend insight line |
| **Publication Type Distribution** | ✓ | `/reports` | Donut chart showing percentages across categories (Journal, Conference, Patent, etc.) |
| **Department-wise Publications** | ✓ | `/reports` | Relational aggregation (`department` → `faculty` → `publication_author` → `publication`) |
| **Evidence Readiness Detail** | ✓ | Dashboard & Reports | Application-level indicator (% ready + segmented bar for Verified, Pending, Missing) |
| **Cross-Department Collaboration** | ✓ | `/reports` | Inter-departmental co-authorship matrix derived from publication-author relations |
| **Automated E2E Test Suite** | ✓ | `scripts/e2e-test-suite.ts` | 13-point automated acceptance test verifying creation, filtering, editing, and cascade delete |
