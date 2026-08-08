# Nexum — UI/UX Design Plan
### Research, Publication & Professional Contribution Tracker (V10)

---

## 0. Grounding

**Product:** Nexum is an internal accreditation tool, not a marketing site. Its job is to make three things trivially easy: record a publication with correct multi-author attribution, find/verify that record later, and read the resulting institutional research picture (by year, department, type, evidence status).

**Audience:** Faculty and admin staff entering data under time pressure, plus reviewers/accreditors skimming reports. Not a public-facing research network — closer to an internal registry + lightweight BI dashboard.

**Design source:** The uploaded ResearchGate extraction is a *brand reference*, not a literal template. ResearchGate's own site is a marketing/discovery surface (big rounded CTAs, generous whitespace, hero storytelling). Nexum is a records-and-reports app — dense tables, multi-step forms, status badges. So this plan **borrows the palette, type pairing, and rounded/friendly character** from the ResearchGate system, but **re-derives spacing, radius, and component density** for an admin context. Copying 60px card radii and hero-scale type onto a data table would misapply the brand, not honor it.

**Single job per surface:** every screen in this plan answers one question only — that discipline is the throughline (see §3).

---

## 1. Design Tokens

### 1.1 Color

Reusing the extracted palette, with usage roles reassigned for an application context:

| Token | Hex | Application role |
|---|---|---|
| `--color-primary` | `#0080ff` | Primary actions (Save, Add author), active nav item, links, focus ring |
| `--color-secondary` | `#40ba9b` | Success / verified state, positive trend indicators |
| `--color-bg` | `#ffffff` | Page canvas |
| `--color-bg-secondary` | `#fafbfb` | Card surfaces, table zebra, sidebar |
| `--color-text` | `#111111` | Headings, primary body, data values |
| `--color-text-secondary` | `#666666` | Labels, captions, helper text, table secondary columns |
| `--color-border` | `#ebefee` | Dividers, input borders, table rules |
| `--color-warning` | `#e8a33d` *(new, minimal addition)* | Pending evidence status only |
| `--color-danger` | `#d64545` *(new, minimal addition)* | Missing evidence, validation errors only |

Warning/danger are the one deliberate departure from "don't add colors outside the palette" — justified because the app has a required tri-state status (verified / pending / missing) that the marketing site never needed. They're kept low-saturation so `#0080ff` and `#40ba9b` remain the dominant accents.

**Rule:** one accent does the talking per screen. Primary blue = "act on this." Secondary teal = "this is good/complete." Never both as CTA color on the same view.

### 1.2 Typography

Keep the pairing, shrink the scale — a hero H1 at 38px has no place next to an 11-column table.

- **Heading font:** Montserrat 700 (headings, KPI numbers, nav section labels)
- **Body font:** Roboto 400/500 (body text, table cells, form inputs, badges)

| Role | Font | Size | Weight | Use |
|---|---|---|---|---|
| Page title | Montserrat | 24px | 700 | Top of each screen ("Publications", "Dr. Rao — Research Profile") |
| Section heading | Montserrat | 16px | 700 | Card/section headers |
| KPI figure | Montserrat | 32px | 700 | Dashboard stat numbers only |
| Body | Roboto | 14px | 400 | Table cells, descriptions, form values |
| Label / caption | Roboto | 12px | 500 | Field labels, table headers, badges, timestamps |
| Micro | Roboto | 11px | 500 | Author order tags, tooltips |

No 38–40px display type anywhere in the app — that scale belongs to the marketing hero this product doesn't have.

### 1.3 Spacing & Radius

5px base unit is kept (it's a genuinely useful discipline), but the radius scale is re-derived: 60px card corners read as "friendly social app," not "records system." Nexum uses a **quiet, mostly-square** language with rounding only on small interactive controls — inverting the source site's radius emphasis on purpose, because a dense form full of 60px-rounded inputs becomes illegible.

| Token | Value | Use |
|---|---|---|
| `space-1` | 5px | icon-to-label gaps |
| `space-2` | 10px | input padding, chip padding |
| `space-3` | 15px | form field gaps |
| `space-4` | 20px | card padding |
| `space-5` | 30px | section gaps |
| `space-6` | 40px | page margins (desktop) |
| `radius-control` | 8px | buttons, inputs, badges |
| `radius-card` | 12px | cards, modals |
| `radius-pill` | 999px | status badges only (verified/pending/missing) |

### 1.4 Elevation

Source site is flat (borders over shadows) — kept as-is, it suits a records app well: `1px solid var(--color-border)` for all card/table separation. Reserve a single soft shadow (`0 2px 8px rgba(0,0,0,0.06)`) for floating elements only: modals, dropdowns, the author-picker popover.

---

## 2. Information Architecture

```
Nexum
├── Dashboard                     (institution research overview)
├── Publications
│   ├── List / Search / Filter
│   ├── New Publication           (multi-step form)
│   └── Publication Detail        (view / edit / evidence)
├── Faculty
│   ├── Faculty Directory
│   └── Faculty Research Profile  (per-faculty rollup)
└── Reports
    ├── By Year
    ├── By Department
    ├── By Type
    └── Evidence Readiness
```

Left sidebar, persistent, matches the required flow order (**Faculty → Research Profile → Publication → Details → Evidence** stays reachable in ≤2 clicks from anywhere via the faculty profile's publication list).

---

## 3. Screen-by-Screen Plan

Each screen states its one job first, then layout.

### 3.1 Dashboard — *"What is the institution's research situation right now?"*

```
┌─────────────────────────────────────────────────────────────┐
│ Research Portfolio                              [+ New Pub]  │
├─────────────────────────────────────────────────────────────┤
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│ │    28    │ │    16    │ │    10    │ │   79%    │          │
│ │  Pubs    │ │ Faculty  │ │ External │ │ Evidence │          │
│ │          │ │Researchers│ │ Collabs │ │ Readiness│          │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘          │
│                                                                │
│ ┌─ Publications by Year ──────┐ ┌─ Type Distribution ───────┐ │
│ │  ▂ ▄ ▆ ▇  (bar, 2023–2026)  │ │  ◔ donut: Journal/Conf/   │ │
│ │                              │ │    Patent/Project         │ │
│ └──────────────────────────────┘ └────────────────────────────┘ │
│                                                                │
│ ┌─ Department Breakdown ──────┐ ┌─ Recent Contributions ────┐ │
│ │  CSE  ████████ 11           │ │  • AI-Based Medical...     │ │
│ │  ECE  █████ 7                │ │  • ... (last 5, w/ author) │ │
│ │  MECH █████ 6                │ │                            │ │
│ │  MBA  ███ 4                  │ │                            │ │
│ └──────────────────────────────┘ └────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

- 4 KPI cards use `radius-card` (12px), `--color-bg-secondary` fill, Montserrat 32px figures.
- Charts stay strictly two-color (`primary` + `secondary`) plus neutral grays — never introduce a rainbow palette for department bars.
- Evidence Readiness card: this is the differentiation ask from the brief (§11B). Render as a horizontal segmented bar (verified/pending/missing) rather than a generic percentage ring — a ring implies one composite score is being invented; a segmented bar honestly shows the three real counts it's built from.

### 3.2 Publications List — *"Find a specific publication fast."*

```
┌─────────────────────────────────────────────────────────────┐
│ Publications                                    [+ New Pub]  │
│ [ Search title/DOI...  ] [Dept ▾] [Type ▾] [Year ▾] [Status▾]│
├─────────────────────────────────────────────────────────────┤
│ Title                    Type      Authors        Year  Ev.  │
│ ─────────────────────────────────────────────────────────── │
│ AI-Based Medical Imaging Journal   Rao, Khan +1    2026  ●   │
│ Smart Grid Optimization  Conference Sharma          2025  ◐   │
│ ...                                                           │
├─────────────────────────────────────────────────────────────┤
│                    ‹ 1  2  3 ›                                │
└─────────────────────────────────────────────────────────────┘
```

- Row click → Publication Detail. No modal-in-list editing — keeps this screen purely a finder.
- Evidence column uses the pill-radius status dot: solid teal = verified, half-filled amber = pending, hollow red outline = missing. Color + shape both encode state (not color alone — accessibility).
- Author column: first author + "+N" chip, never a raw comma list (the schema explicitly rejects comma-separated authors — the UI shouldn't reintroduce that pattern visually).

### 3.3 New / Edit Publication — *"Capture one publication correctly, including mixed internal/external authorship."*

This is the highest-risk screen (the acceptance test lives here) and gets the most deliberate design attention — it's the **signature interaction** of the product.

```
┌─────────────────────────────────────────────────────────────┐
│ New Publication                                    Step 1/3  │
│ ● Details    ○ Authors    ○ Evidence                          │
├─────────────────────────────────────────────────────────────┤
│ Title *          [_______________________________]           │
│ Type *           [ Journal ▾ ]                                │
│ Journal/Conf.    [_______________________________]           │
│ Year *           [ 2026 ▾ ]                                   │
│ DOI / Reference  [_______________________________]           │
│                                                                │
│                                       [Cancel]  [Next: Authors]│
└─────────────────────────────────────────────────────────────┘
```

Step 2 — Authors (the core ER concept made tangible):

```
┌─────────────────────────────────────────────────────────────┐
│ Authors                                             Step 2/3  │
│ ● Details    ● Authors    ○ Evidence                          │
├─────────────────────────────────────────────────────────────┤
│ 1  ⦿ Dr. Rao (CSE, Faculty)                    [Remove] ⠿    │
│ 2  ⦿ Dr. Khan (ECE, Faculty)                   [Remove] ⠿    │
│ 3  ◇ John Smith (External — Stanford)          [Remove] ⠿    │
│                                                                │
│ [+ Add internal faculty author]   [+ Add external author]     │
│                                                                │
│                                  [Back]  [Next: Evidence]      │
└─────────────────────────────────────────────────────────────┘
```

Design decisions on this step specifically:

- **Two distinct add buttons, not one dropdown with a type toggle inside.** The XOR constraint in the schema (`author_type_check`) is a first-class business rule — the UI should make "internal vs external" a decision the user makes *before* search, not a field they fill in after picking a name. This prevents the exact data-entry ambiguity the schema was built to forbid.
- **Different glyphs, not just color, for faculty vs external** (`⦿` filled circle for internal, `◇` diamond for external) — so the composition of an author list is scannable at a glance and colorblind-safe.
- **`⠿` drag handle reorders `authorOrder` directly** — dragging is the natural mental model for "who's first author," better than a numeric input per row.
- Faculty add opens a searchable popover (name + department, live filter) since faculty is a bounded list; external author add opens an inline mini-form (name + affiliation) since externals are open-ended and may not exist yet.
- Minimum-one-of-each validation surfaces inline, plainly: *"Add at least one internal faculty author to continue"* — stated as what's needed, not as an apology.

Step 3 — Evidence: single reference field + type selector + verification status (defaults to `pending`), same input density as Step 1. Final action is **"Save Publication"** (not "Submit") — the button always names the actual outcome.

### 3.4 Publication Detail — *"See everything about this record, and where it fans out."*

```
┌─────────────────────────────────────────────────────────────┐
│ AI-Based Medical Imaging                        [Edit] [···] │
│ Journal · 2026 · DOI 10.xxxx/example                          │
├─────────────────────────────────────────────────────────────┤
│ Authors                                                       │
│  1. Dr. Rao   (CSE)  → View research profile                  │
│  2. Dr. Khan  (ECE)  → View research profile                  │
│  3. John Smith (External, Stanford)                           │
├─────────────────────────────────────────────────────────────┤
│ Evidence                                    ● Verified        │
│  publication.pdf                                               │
└─────────────────────────────────────────────────────────────┘
```

Each faculty author name is a direct link into their Research Profile — this is the concrete demonstration that one record powers multiple views (per the brief's demo story in §12).

### 3.5 Faculty Research Profile — *"What has this person contributed?"*

```
┌─────────────────────────────────────────────────────────────┐
│ Dr. Rao — Computer Science & Engineering                      │
├─────────────────────────────────────────────────────────────┤
│ ┌────┐ ┌────┐ ┌────┐ ┌────┐                                  │
│ │ 9  │ │2023│ │ 4  │ │ 3  │  Output · Active since · Journals │
│ │Pubs│ │–26 │ │Ext.│ │Coll│           · External co-authors   │
│ └────┘ └────┘ └────┘ └────┘           · Top collaborators     │
├─────────────────────────────────────────────────────────────┤
│ Publications                                    [Filter ▾]    │
│  AI-Based Medical Imaging   Journal   2026   ● Verified        │
│  ... (chronological, newest first)                             │
├─────────────────────────────────────────────────────────────┤
│ Top Collaborators           Evidence Status                    │
│  Dr. Khan — 7 pubs           ●●●●●●●●●●○○  9/11 verified        │
│  External X — 5 pubs                                           │
└─────────────────────────────────────────────────────────────┘
```

This screen carries the "differentiation" ask (§11A) without inventing UI: research-area tags and collaborator list are both directly derivable from `publication_author` joins, nothing fabricated.

### 3.6 Reports — *"Answer accreditation questions at a glance, exportable."*

Single page, four stacked report cards (Year, Department, Type, Evidence Readiness), each with a chart + a one-line plain-English insight underneath it, e.g. *"Research output increased 38% over the last two years"* — computed, never hard-coded, and only rendered when the underlying trend is real for the current dataset (empty/flat data shows no invented claim).

---

## 4. Component Language

| Component | Spec |
|---|---|
| Button (primary) | `--color-primary` fill, white text, `radius-control` 8px, 14px Montserrat 700 — reserved for the one committing action per screen |
| Button (secondary/ghost) | Transparent, `--color-text` or `--color-primary` text, 1px border `--color-border` |
| Input | White fill, 1px `--color-border`, `radius-control`, focus → 2px `--color-primary` ring (never color-only focus state) |
| Status badge | `radius-pill`, 12px Roboto 500, dot + label (Verified / Pending / Missing) |
| Author chip | `radius-control`, glyph + name + role tag, remove (×) on hover/focus |
| Card | `radius-card`, `--color-bg-secondary`, 1px border, `space-4` padding |
| Table row | 1px bottom border only, `--color-bg-secondary` on hover, no zebra striping (keeps dense tables calm) |

---

## 5. States

- **Empty:** Publications list with zero results states the actual condition and the fix — *"No publications match these filters. Clear filters or add a new publication."* Faculty profile with zero pubs: *"No publications recorded yet for Dr. Rao."* Never a generic illustration; text-first, action-first.
- **Loading:** Skeleton blocks matching final layout shape (KPI cards, table rows) — no spinners on data-heavy screens.
- **Error (validation):** Inline under the field, `--color-danger`, states what's wrong and how to fix it — e.g. *"Year must be between 1990 and 2026."*
- **Error (save failure):** Toast in `--color-danger`, plain statement of what happened, no apology copy.

---

## 6. Responsive Behavior

- **Desktop (≥1024px):** Sidebar + content, KPI cards 4-across, tables full-width.
- **Tablet (640–1024px):** Sidebar collapses to icon rail; KPI cards 2×2; charts stack.
- **Mobile (<640px):** Bottom nav replaces sidebar; publications list becomes stacked cards (title, type/year, author chip row, evidence dot) instead of a table — a table with 6 columns cannot survive 375px, so it's restructured rather than shrunk; multi-step publication form becomes full-screen steps with a persistent progress bar.

---

## 7. Accessibility Floor

- All status information (evidence, author type) encoded in shape/icon **and** color, not color alone.
- Visible 2px focus ring (`--color-primary`) on every interactive element, including drag handles and chip removes.
- Minimum 44×44px touch targets on mobile for row actions and the author-chip remove control.
- Form errors are associated to fields via `aria-describedby`, announced on submit attempt.
- Color contrast: `#111111` on `#ffffff`/`#fafbfb` and white text on `#0080ff` both clear WCAG AA for body text.

---

## 8. Signature Element

The one place this app takes a real point of view: **the two-button author step** (§3.3) instead of a generic "add author" + type dropdown. It's the screen where the entire ER decision the brief centers on (§4 of the requirements doc) becomes a visible, unambiguous interaction — internal and external authorship are structurally different actions, not a field flip. Everything else in the app (badges, cards, tables) stays deliberately quiet so this moment reads clearly.

---

## 9. Build Order (maps to MVP scope in the requirements doc)

1. Publication List + Detail (read paths first — proves schema/query layer)
2. New Publication form, all 3 steps, including the author XOR interaction
3. Faculty Research Profile
4. Dashboard KPIs + Publications-by-Year / Type-distribution charts
5. Search/filter on the list
6. Evidence Readiness card + Reports page
7. Collaboration network / cross-department views (build-if-time, §15 "Build If Time Allows")
