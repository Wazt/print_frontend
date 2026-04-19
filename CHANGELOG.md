# Changelog

All notable changes to PrintFlow frontend are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and
this project adheres to [Semantic Versioning](https://semver.org/).

---

## [Unreleased]

Nothing pending.

---

## [2.0.0] — 2026-04-15

Major refactor. This is the "Polished Enterprise" rebuild that replaced the
legacy Obsidian theme with a clean design-token-driven system inspired by
Notion / Stripe / Linear.

### Added

- **Design token system** — 98 CSS variables in `src/styles/tokens.css` with
  light-mode defaults and `.dark` class overrides. Single source of truth.
- **10 app primitives** in `src/Components/primitives/`:
  Button, DataCard, DataTable, EmptyState, FormField, PageHeader, SectionTitle,
  StatCard, StatusPill, Toolbar (+FilterChip). All memoized where appropriate.
- **Accessibility foundation**
  - Skip-to-content link
  - Modal semantics on mobile drawer (role=dialog, aria-modal, Esc, focus trap)
  - Breadcrumb `<nav>` with `<ol>`/`<li>` and `aria-current="page"`
  - FR/EN-aware `aria-label` on 14 previously-unlabeled icon buttons
  - `eslint-plugin-jsx-a11y` wired into the ESLint config
  - 0 `jsx-a11y` warnings across the codebase
- **Test coverage** — 144 tests across 17 files (up from 15):
  - 80 unit tests for the 10 primitives
  - 25 WCAG 2.1 AA token-contrast tests (parses `tokens.css` at runtime)
  - 30 page/integration tests (Home, Commandes, stockPage, LoginPage)
- **Documentation** — comprehensive README, CONTRIBUTING guide, CHANGELOG, CODEOWNERS

### Changed

- **Typography** — replaced Plus Jakarta Sans + Syne + Fraunces with Inter
  (single variable font). JetBrains Mono for IDs and codes.
- **All 22 pages rewritten** to compose from primitives. Zero direct shadcn
  imports in the page layer.
- **Layout** — sticky topbar (60px) + collapsible sidebar (240px) + 1440px
  max-width content container. Mobile drawer + bottom nav.
- **All 6 OrderDetails/\* sub-components rewritten** from scratch:
  OrderDetailHeader, OrderDetailItems, OrderDetailItemDetails, OrderDetailSummary,
  OrderFinancialSection, OrderWorkflowTimeline.
- **`--warning` token** changed from `#CA8A04` → `#A16207` (yellow-700) to
  pass WCAG 2.1 AA contrast (2.64:1 → 4.45:1 on `--warning-bg`).
  Caught by the new `TokenContrast` test suite.

### Fixed

- **Invalid DOM bug** in `OrderDetailItemDetails.jsx` — component returned
  `<tr>` inside a `<div>` parent. Browsers were silently discarding the
  invalid structure. Now renders as a proper flex card.
- **Duplicate dialog bug** in `OrderDetailHeader.jsx` — two near-identical
  `<AlertDialog>` blocks both wired to `deleteOrder`. Consolidated.
- **Nested button HTML violation** in `DriveListPage.jsx` — a `<button>`
  inside a `<button>`. Restructured to `<article>` with a main action button
  and a proper `<a>` for the Drive link.
- **`<a href="#">`** in `LoginPage.jsx` forgot-password link replaced with
  a proper `<button>`.
- **Stale closure** in `OrderDetailItemDetails.jsx` useEffect —
  `getDownloadLink()` was inside empty-deps effect that logged stale state.
  Added cleanup guard and proper `[googleFileId]` dependency.

### Removed

- **Dead code** (568 LOC across 4 files):
  - `src/Components/login-form.jsx` — unreferenced legacy shadcn form
  - `src/Components/CustomTable.jsx` — replaced by `DataTable` primitive
  - `src/Components/CustomIconInput.jsx` — replaced by `FormField` + `Input`
  - `src/Components/StatusBadge.jsx` — replaced by `StatusPill` primitive
- **Unused `OrderItemCard`** function inside `OrderDetailItems.jsx` (200 LOC)
- **Plus Jakarta Sans + Syne + Fraunces** fonts (replaced by Inter)
- **Legacy Obsidian theme variables** (still available as `--ob-*` bridge for
  `ClientOrderDetails.jsx` only, for the animated stepper)

### Security

- No known security issues. Authentication flow unchanged.

---

## [1.x.x] — pre-2026

Legacy versions with the Obsidian theme and mixed styling. See the commit
history before `7923073` for details.

---

## Versioning policy

- **Major** — breaking changes to the public primitive API or token names
- **Minor** — new primitives, new pages, non-breaking feature additions
- **Patch** — bug fixes, visual tweaks, dependency bumps

### What counts as "breaking"

- Removing or renaming a CSS variable in `tokens.css`
- Removing or renaming a primitive's prop
- Removing a primitive from `src/Components/primitives/index.js`
- Changing the default value of an existing primitive prop
- Changing the aria-label or role of a primitive (affects test selectors)

### What does not count as breaking

- Adding new CSS variables
- Adding new primitive props (with sensible defaults)
- Adding new primitives
- Internal refactors that don't change the primitive API
- Adding new translations
- Visual tweaks that respect contrast and layout
