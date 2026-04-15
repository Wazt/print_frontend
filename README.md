# PrintFlow Frontend

> Print-shop order-management system. React 19 · Vite 6 · Tailwind CSS 4 · shadcn/ui

A Polished-Enterprise SaaS for managing print orders end-to-end: orders, clients,
stock, drive files, invoicing, payments. Built with a unified design system
(Authority Navy + Trust Blue) inspired by Notion / Stripe / Linear.

---

## Table of contents

1. [Quick start](#quick-start)
2. [Architecture at a glance](#architecture-at-a-glance)
3. [Design system](#design-system)
4. [Primitives reference](#primitives-reference)
5. [Project layout](#project-layout)
6. [Scripts](#scripts)
7. [Testing](#testing)
8. [Accessibility](#accessibility)
9. [Internationalization](#internationalization)
10. [Theming (light / dark)](#theming)
11. [Roles](#roles)
12. [Contributing](#contributing)

---

## Quick start

```bash
# Install
npm install

# Dev server (port 5173, proxies /api to localhost:8000)
npm run dev

# Build for production
npm run build

# Run the test suite (144 tests)
npm run test

# Lint (with jsx-a11y)
npx eslint 'src/**/*.{js,jsx}'
```

### Test credentials

- **Admin:** `admin@test.com` / `admin1234admin`
- **Client:** `client@test.com` / `client1234client`

---

## Architecture at a glance

The UI is organized as **five composable tiers** — every page composes top-down
from primitives, never the reverse.

```
┌──────────────────────────────────────────────────────────┐
│  L4 · Pages                          22 files            │
│  Auth · Dashboard · Orders · CRM · Users · Products      │
│  Stock · Drive · Finance                                 │
│  → Compose from L3 + L2 only — never raw shadcn          │
└──────────────────────────────────────────────────────────┘
                          ▲
┌──────────────────────────────────────────────────────────┐
│  L3 · Domain components               6 files            │
│  OrderDetails/*  ·  AppSideBar  ·  MobileBottomNav       │
│  ProfileHeader                                           │
└──────────────────────────────────────────────────────────┘
                          ▲
┌──────────────────────────────────────────────────────────┐
│  L2 · App primitives                 10 files            │
│  Button · DataCard · DataTable · PageHeader · StatCard   │
│  StatusPill · EmptyState · FormField · Toolbar           │
│  SectionTitle                                            │
│  → All consumed via single barrel: @/Components/primitives │
└──────────────────────────────────────────────────────────┘
                          ▲
┌──────────────────────────────────────────────────────────┐
│  L1 · shadcn wrappers                24 files            │
│  Dialog · Sheet · Select · AlertDialog · Tabs · ...      │
│  → Only used through L2 primitives, never directly       │
└──────────────────────────────────────────────────────────┘
                          ▲
┌──────────────────────────────────────────────────────────┐
│  L0 · Design tokens          src/styles/tokens.css       │
│  98 CSS variables — single source of truth               │
│  :root (light)   +   .dark class (dark mode overrides)   │
└──────────────────────────────────────────────────────────┘
```

**Rules of engagement**

1. Pages **must** import from `@/Components/primitives` — never from `@/Components/ui/*`.
2. Primitives **must** style via CSS variables — never hardcoded Tailwind colors (`slate-*`, `gray-*`, etc.).
3. Domain components go in `src/Components/<Domain>/` and also compose from primitives.
4. The shadcn wrapper layer is a vendor boundary — leave it alone.

---

## Design system

### Palette — Authority Navy + Trust Blue (light mode)

| Token | Value | Usage |
|---|---|---|
| `--bg` | `#F8FAFC` | Page background |
| `--surface` | `#FFFFFF` | Cards, modals |
| `--surface-2` | `#F1F5F9` | Table headers, hover, secondary |
| `--text` | `#020617` | Primary text |
| `--text-2` | `#334155` | Secondary text |
| `--text-3` | `#64748B` | Muted text |
| `--text-4` | `#94A3B8` | Hint |
| `--brand` | `#0F172A` | Authority Navy — primary brand |
| `--brand-fg` | `#FFFFFF` | Text on brand bg |
| `--accent` | `#0369A1` | Trust Blue — CTAs, links |
| `--accent-bg` | `#E0F2FE` | Accent backgrounds |
| `--success` | `#16A34A` | Success states |
| `--warning` | `#A16207` | Warning (WCAG AA verified ≥3:1 on `--warning-bg`) |
| `--danger` | `#DC2626` | Errors, destructive |
| `--info` | `#0284C7` | Informational |

### Dark mode

Activated by adding `.dark` class to `<html>`. Inverts ~15 base values. Everything else inherits.

```
--bg:        #020617   (slate-950)
--surface:   #0F172A   (slate-900)
--surface-2: #1E293B   (slate-800)
--text:      #F8FAFC
--accent:    #38BDF8   (sky-400 — brighter for contrast)
```

### Typography

- **Heading + body:** Inter (variable font, single family like Stripe/Linear)
- **Mono:** JetBrains Mono (for IDs, order numbers, codes)
- **Scale:** `12 · 14 · 15 · 17 · 20 · 24 · 30 px`
- **Weights:** `400 · 500 · 600 · 700`

### Radius, shadows, motion

| Token | Value |
|---|---|
| `--radius-sm` | `6px` |
| `--radius` | `8px` (default) |
| `--radius-lg` | `12px` (cards) |
| `--radius-pill` | `999px` |
| `--shadow-card` | `0 1px 3px rgba(15,23,42,.05)` |
| `--shadow-lift` | `0 4px 12px rgba(15,23,42,.08)` |
| `--shadow-modal` | `0 20px 40px rgba(15,23,42,.15)` |
| `--shadow-focus` | `0 0 0 3px rgba(3,105,161,.15)` |
| `--dur-fast` | `150ms` |
| `--dur` | `200ms` |
| `--dur-slow` | `300ms` |

### WCAG 2.1 AA contrast guarantee

The design tokens ship with a test suite (`src/test/TokenContrast.test.js`) that
parses `tokens.css` and asserts contrast ratios for every critical pair in both
light and dark modes. If a future token change breaks contrast, the build fails.

---

## Primitives reference

All primitives live in `src/Components/primitives/` and are re-exported from a
single barrel `@/Components/primitives`. Every primitive is tested, memoized
where it matters, and composes via CSS variables.

### `Button`

Unified button. 5 variants × 4 sizes + loading + icon-only.

```jsx
import { Button } from "@/Components/primitives";

<Button variant="primary" size="md" onClick={save}>Save</Button>
<Button variant="accent" loading={isSubmitting}>Submit</Button>
<Button variant="outline" size="icon" aria-label="Delete">
  <Trash2 size={14} />
</Button>
```

| Prop | Values |
|---|---|
| `variant` | `primary` · `accent` · `outline` (default) · `ghost` · `danger` |
| `size` | `sm` · `md` (default) · `lg` · `icon` |
| `loading` | `boolean` — shows spinner, disables |
| `disabled` | `boolean` |

### `DataCard`

Generic card with optional header (title + description + icon + action) and body.

```jsx
<DataCard
  title="Recent orders"
  description="Last 7 days"
  icon={Package}
  action={<Button size="sm">View all</Button>}
>
  <DataTable columns={cols} rows={rows} />
</DataCard>
```

### `DataTable`

Sortable-ready table with sticky header, loading skeleton, empty state, row click.

```jsx
<DataTable
  columns={[
    { key: "name", header: "Name" },
    { key: "total", header: "Total", align: "right", render: (r) => `${r.total} DZD` },
  ]}
  rows={orders}
  loading={isLoading}
  onRowClick={(row) => navigate(`/orders/${row.id}`)}
  empty={<EmptyState icon={Package} title="No orders yet" />}
/>
```

### `StatCard`

KPI card with label, value, delta, icon, tone, loading skeleton.

```jsx
<StatCard
  label="Revenue"
  value="12,450 DZD"
  hint="vs last month"
  delta="+12%"
  deltaPositive
  icon={DollarSign}
  tone="success"
  loading={isLoading}
/>
```

| `tone` | Use |
|---|---|
| `default` | Neutral KPI |
| `accent` | Primary metric |
| `success` | Positive state |
| `warning` | Needs attention |
| `danger` | Critical |

### `StatusPill`

Semantic status badge with **auto tone mapping** from status strings.

```jsx
<StatusPill status="PENDING" />           // auto → warning
<StatusPill status="PAID" />              // auto → success
<StatusPill status="REJECTED" />          // auto → danger
<StatusPill tone="info" label="Draft" />  // explicit tone
```

### `FormField` + `Input` / `Textarea` / `Select`

```jsx
<FormField label="Email" htmlFor="email" required hint="We'll never share.">
  <Input id="email" type="email" value={email} onChange={...} />
</FormField>

<FormField label="Notes" error="Too long">
  <Textarea rows={4} />
</FormField>

<FormField label="Status">
  <Select value={status} onChange={(e) => setStatus(e.target.value)}>
    <option value="active">Active</option>
    <option value="inactive">Inactive</option>
  </Select>
</FormField>
```

Error takes precedence over hint when both are set.

### `PageHeader`

Always the first child of every page (except LoginPage's intentional split-screen).

```jsx
<PageHeader
  title={t("orders.title")}
  subtitle={t("orders.subtitle")}
  icon={Package}
  actions={
    <Button variant="accent" onClick={create}>
      <Plus size={15} /> New order
    </Button>
  }
/>
```

### `Toolbar` + `FilterChip`

```jsx
<Toolbar
  search={searchTerm}
  onSearchChange={setSearchTerm}
  searchPlaceholder="Search orders..."
  actions={<Button variant="outline">Export</Button>}
/>

<FilterChip active={status === "PAID"} onClick={() => setStatus("PAID")} count={12}>
  Paid
</FilterChip>
```

### `EmptyState`

```jsx
<EmptyState
  icon={Package}
  title="No orders yet"
  description="Create your first order to get started."
  action={<Button variant="accent">New order</Button>}
/>
```

### `SectionTitle`

Lightweight h2 with optional action — use inside `DataCard` body for sub-sections.

---

## Project layout

```
src/
├── Components/
│   ├── primitives/         ★ The 10 L2 app primitives (this is your default import)
│   ├── OrderDetails/       Domain components for the order-details page
│   ├── ui/                 shadcn/ui wrappers (vendor — don't import directly)
│   ├── AppSideBar.jsx      Role-aware sidebar
│   ├── MobileBottomNav.jsx Mobile bottom navigation
│   ├── LanguageSwitcher.jsx
│   ├── ThemeSwitcher.jsx
│   └── Loading.jsx
│
├── Pages/
│   ├── Home.jsx            Dashboard
│   ├── Commandes.jsx       Orders list
│   ├── OrderDetails.jsx    Admin order detail (tabs)
│   ├── ClientOrderDetails.jsx  Client-facing order view
│   ├── CreateOrderPage.jsx
│   ├── LoginPage.jsx
│   ├── CRM/                Companies pages
│   ├── Users/              Users pages
│   ├── Products/           Products pages
│   ├── Stock/              Raw materials pages
│   ├── Drive/              Google Drive integration pages
│   └── Finance/            Payment pages
│
├── Services/               API clients (one file per domain)
├── contexts/               AuthContext · LanguageContext · ThemeContext · OrdersContext
├── config/                 axios setup
├── translations/           fr.json · en.json
├── styles/
│   └── tokens.css          ★ 98 CSS variables — design system source of truth
│
├── test/
│   ├── primitives/         Unit tests for each primitive (80 tests)
│   ├── pages/              Smoke + integration tests (30 tests)
│   ├── TokenContrast.test.js   WCAG 2.1 AA guard (25 tests)
│   ├── ErrorBoundary.test.jsx
│   ├── LanguageContext.test.jsx
│   └── ThemeContext.test.jsx
│
├── App.jsx                 Router + 19 lazy routes
├── Layout.jsx              Topbar + sidebar + main
├── PrivateRoute.jsx        Auth guard
└── main.jsx                Entry point
```

---

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Dev server on :5173, HMR, proxies `/api` → `localhost:8000` |
| `npm run build` | Production build → `dist/` (with code splitting) |
| `npm run build:prod` | Build with `prod` mode env |
| `npm run build:local` | Build with `local` mode env |
| `npm run preview` | Serve the built `dist/` locally |
| `npm run test` | Run Vitest suite once (144 tests) |
| `npm run test:watch` | Vitest watch mode |
| `npm run lint` | ESLint (with `jsx-a11y` rules) |

---

## Testing

Vitest + React Testing Library. Setup file is `src/test/setup.js` which imports
`@testing-library/jest-dom` matchers.

### Test layout

```
src/test/
├── primitives/        80 unit tests · 9 files (Button, StatusPill, DataCard, etc.)
├── pages/             30 smoke/integration tests · 4 files (Home, Commandes, Stock, Login)
├── TokenContrast.test.js    25 WCAG AA guards
├── ErrorBoundary.test.jsx   3 tests
├── LanguageContext.test.jsx 4 tests
└── ThemeContext.test.jsx    2 tests
                         ─────
                    Total: 144 tests
```

### Patterns

**Mocking a service module** — always hoist `vi.mock` above the component import:

```jsx
vi.mock("@/Services/OrdersService", () => ({
  getOrders: vi.fn(),
}));

import Commandes from "@/Pages/Commandes";
import { getOrders } from "@/Services/OrdersService";

beforeEach(() => {
  getOrders.mockResolvedValue([MOCK_ROWS, MOCK_PAGINATION]);
});
```

**Wrapping in providers** — every page test wraps in `MemoryRouter` + `LanguageProvider`:

```jsx
render(
  <MemoryRouter>
    <LanguageProvider>
      <MyPage />
    </LanguageProvider>
  </MemoryRouter>
);
```

**Context injection** — integration tests inject mock `AuthContext`:

```jsx
<AuthContext.Provider value={{ login, isLoading, ... }}>
  <LoginPage />
</AuthContext.Provider>
```

---

## Accessibility

The frontend ships **0 jsx-a11y warnings** (enforced by ESLint in CI).

### What's already in place

- **Skip-to-content link** in `Layout.jsx` (first focusable element)
- **Landmark roles** via semantic HTML: `<header>` · `<nav>` · `<main>` · `<aside>`
- **Modal semantics** on the mobile drawer: `role="dialog"` + `aria-modal="true"` + Escape key handler + focus restoration + body scroll lock
- **Breadcrumb nav** with `<nav aria-label="Breadcrumb">` + `<ol>`/`<li>` + `aria-current="page"` on leaf
- **All icon-only buttons** have FR/EN-aware `aria-label`
- **All nav links** get `aria-current="page"` when active
- **ThemeSwitcher + LanguageSwitcher** use `aria-pressed`
- **Focus rings** via `--shadow-focus` globally on `:focus-visible`
- **Language-aware accessible names** — everything uses `t("lang") === "fr"` to localize

### ESLint integration

`eslint.config.js` registers `eslint-plugin-jsx-a11y` with its recommended rule
set. A few rules are softened to `warn` for our patterns (`anchor-is-valid`,
`click-events-have-key-events`, `no-static-element-interactions`) — see the
config for the full list.

### Contrast guarantee

The `TokenContrast` test suite enforces WCAG 2.1 AA ratios at the token layer.
Modifying `tokens.css` runs through this check — any regression fails the build.

---

## Internationalization

- **Languages:** French (default) + English
- **Provider:** `LanguageProvider` from `src/contexts/LanguageContext.jsx`
- **Translation files:** `src/translations/fr.json` + `src/translations/en.json`
- **Hook:** `const { t, language, setLanguage } = useLanguage()`
- **Persistence:** language choice is stored in `localStorage`

```jsx
const { t } = useLanguage();
return <h1>{t("orders.title")}</h1>;
```

For one-off strings too small to add to translation files, the convention is:

```jsx
{t("lang") === "fr" ? "Telecharger" : "Download"}
```

---

## Theming

Light/dark mode is driven entirely by CSS. No JS re-render.

```jsx
// In ThemeSwitcher.jsx
const { isDark, toggle } = useTheme();
// toggle adds/removes .dark class on <html>
```

To reference a token from anywhere in the codebase:

```jsx
<div className="bg-[var(--surface)] text-[var(--text)] border-[var(--border)]">
```

Never write `bg-slate-*` or `text-gray-*` directly. The ESLint rules don't block
this yet, but the audit tooling does, and the design system reviewer will reject it.

---

## Roles

The app has three user roles with different UIs:

| Role | What they see |
|---|---|
| `ADMIN` | Full admin console: all orders, all clients, users management, stock, finance |
| `USER` (staff) | Same as admin minus user management and settings |
| `CLIENT` | Dedicated client portal: their orders only, invoices, messages, files |

Role-aware components:

- `AppSideBar` shows different nav items per role
- `OrderDetails.jsx` routes CLIENTs to `ClientOrderDetails.jsx` instead of the admin view
- `OrderDetailHeader` shows Accept/Reject buttons only for ADMINs on PENDING orders

---

## Contributing

See [`CONTRIBUTING.md`](./CONTRIBUTING.md) for the full guide. The short version:

1. **Never** import from `@/Components/ui/*` directly in a page — use `@/Components/primitives`.
2. **Never** use hardcoded colors (`bg-slate-*`, `text-gray-*`). Use CSS variables.
3. **Always** wrap form inputs in `<FormField>` so labels work with screen readers.
4. **Always** add `aria-label` to icon-only buttons.
5. **Always** wrap user-facing strings in `t(...)` or `t("lang") === "fr" ? ... : ...`.
6. **Write a test** when you add or change a primitive.

### Codeowners

Anything under `src/Components/primitives/`, `src/styles/tokens.css`, or
`src/Layout.jsx` is design-system-critical and requires a review from the
design-system maintainer (see `CODEOWNERS`).

---

## License

Internal / proprietary. Wazt organization.
