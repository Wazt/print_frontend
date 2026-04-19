# Contributing to PrintFlow Frontend

Thanks for working on PrintFlow. This guide will keep the codebase consistent
and make your changes land faster in review.

---

## Table of contents

1. [Golden rules](#golden-rules)
2. [Setup](#setup)
3. [Branching](#branching)
4. [Code style](#code-style)
5. [Design system usage](#design-system-usage)
6. [Accessibility](#accessibility)
7. [Internationalization](#internationalization)
8. [Testing](#testing)
9. [Commit messages](#commit-messages)
10. [Pull requests](#pull-requests)

---

## Golden rules

These are the non-negotiables. Reviewers will block PRs that break them.

1. **Never import from `@/Components/ui/*` in a page or domain component.**
   Always go through `@/Components/primitives`.

2. **Never hardcode Tailwind color classes** (`slate-*`, `gray-*`, `blue-*`,
   etc.). Always use CSS variables: `bg-[var(--surface)]`, `text-[var(--text)]`.

3. **Never skip `aria-label` on an icon-only button.** The ESLint plugin will
   warn, but the human reviewer is the backstop.

4. **Never ship user-facing strings without translating them.** Use `t("...")`
   or the inline pattern `t("lang") === "fr" ? "Fr" : "En"`.

5. **Always add a test** when you add or modify a primitive.

6. **Always run `npm run test` before opening a PR.**

---

## Setup

```bash
git clone https://github.com/Wazt/print_frontend.git
cd print_frontend
npm install
npm run dev
```

You'll also need the backend running on `localhost:8000` — the dev server
proxies `/api` to it. See `Wazt/print_api` for setup.

---

## Branching

- `main` — production, protected
- `feat/<topic>` — new features
- `fix/<topic>` — bug fixes
- `refactor/<topic>` — non-functional refactors
- `chore/<topic>` — dependencies, tooling, docs

Rebase onto `main` before opening your PR; no merge commits from main.

---

## Code style

### File naming

- **React components:** PascalCase (`DataCard.jsx`)
- **Pages:** PascalCase (`OrderDetails.jsx`) — legacy lowercase files like `stockPage.jsx` are being migrated
- **Services / utils:** camelCase (`axiosConfig.js`, `formatDate.js`)
- **Tests:** mirror the source filename with `.test.jsx` suffix (`Button.test.jsx`)

### Imports

Use the `@/` alias for anything inside `src/`:

```jsx
// ✅ Good
import { Button, DataCard } from "@/Components/primitives";
import { useLanguage } from "@/contexts/LanguageContext";

// ❌ Bad
import { Button } from "../../../Components/primitives/Button";
```

Import order:

1. React + React Router
2. Third-party libraries (`lucide-react`, `sonner`, etc.)
3. `@/Services`, `@/contexts`
4. `@/Components/primitives`
5. `@/Components/ui/*` (only for wrappers, like `Sheet` / `Dialog`)
6. Relative imports

### JSX formatting

- Prefer self-closing tags for empty elements
- Destructure props in the function signature
- Use `React.memo` on primitives and heavy components (see existing patterns)
- Arrow functions for local components, named functions for exports

---

## Design system usage

### ✅ DO

```jsx
import { PageHeader, DataCard, Button, StatCard } from "@/Components/primitives";

export default function MyPage() {
  const { t } = useLanguage();
  return (
    <div className="space-y-6">
      <PageHeader
        title={t("myPage.title")}
        subtitle={t("myPage.subtitle")}
        actions={<Button variant="accent">New item</Button>}
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <StatCard label={t("myPage.total")} value={42} tone="accent" />
      </div>
      <DataCard title={t("myPage.recent")}>
        {/* body */}
      </DataCard>
    </div>
  );
}
```

### ❌ DON'T

```jsx
import { Card, CardHeader, CardContent } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";

export default function MyPage() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">  {/* hardcoded! */}
      <h1 className="text-2xl font-bold text-slate-900">Title</h1>  {/* hardcoded! */}
      <Card className="bg-slate-50 border-slate-200">  {/* hardcoded! */}
        <CardHeader>
          <Button className="bg-blue-600 text-white">New</Button>  {/* raw shadcn! */}
        </CardHeader>
      </Card>
    </div>
  );
}
```

**Every** violation in the "don't" example fails review.

### Adding a new primitive

Before adding a new primitive, ask: **can this be composed from existing
primitives?** Most "new" needs are actually just:

- A `DataCard` with a custom body
- A slot or layout pattern — use a plain `div` with tokens
- A variant of `Button` or `StatusPill` — extend the existing primitive

If you genuinely need a new primitive:

1. Add the file to `src/Components/primitives/`
2. Style it with CSS variables only
3. Export it from `src/Components/primitives/index.js`
4. Add unit tests to `src/test/primitives/<Name>.test.jsx`
5. Add docs to the README's "Primitives reference" section
6. Request review from the design-system maintainer (see `CODEOWNERS`)

### Modifying a design token

Changing `tokens.css` affects the entire app. Always:

1. Run `npm run test` — the `TokenContrast` suite verifies WCAG AA ratios
2. Visually check every page in both light and dark mode
3. Verify dark-mode equivalents are also updated
4. Add a CHANGELOG entry
5. Flag the change as `breaking` in the PR title if it removes a token

---

## Accessibility

### Checklist for every new page

- [ ] Uses `<PageHeader>` with a proper `<h1>` title (via `t(...)`)
- [ ] Form inputs wrapped in `<FormField htmlFor="..." label="...">` + `<Input id="...">`
- [ ] Every icon-only button has `aria-label`
- [ ] Icons inside labeled buttons have `aria-hidden="true"`
- [ ] External links (`<a target="_blank">`) have `rel="noopener noreferrer"`
- [ ] Color is **never** the only way information is conveyed (pair color with text, icon, or pattern)
- [ ] Focus order is logical (tab through the page and check)
- [ ] `npx eslint` passes with 0 `jsx-a11y` warnings

### Testing keyboard navigation

Every interactive element must be reachable with `Tab` and operable with
`Enter` / `Space` / `Escape`. Mobile drawer? `Escape` must close it.

---

## Internationalization

### Adding new strings

1. Add keys to **both** `src/translations/fr.json` and `src/translations/en.json`
2. Reference them with `t("section.key")`:

   ```jsx
   const { t } = useLanguage();
   <h1>{t("dashboard.title")}</h1>
   ```

3. For one-off strings (too small to add to the JSON files), use the inline pattern:

   ```jsx
   {t("lang") === "fr" ? "Telecharger" : "Download"}
   ```

### Rules

- **Never** hardcode a user-facing English or French string
- **Never** concatenate translated strings — use template substitution
- **Do** use sentence case for headings and titles (matches the design language)
- **Do** write French without diacritics (é → e, à → a) for deployment-safety
- **Do** keep French as the default language (the product is Algerian/French-speaking)

---

## Testing

### Before pushing

```bash
npm run test       # must be 144+/144+ passing
npm run build      # must succeed
npx eslint 'src/**/*.{js,jsx}'  # 0 jsx-a11y warnings
```

### Writing primitive tests

Follow the existing `src/test/primitives/*.test.jsx` patterns. Cover:

- Default render
- Every variant / tone / size
- Loading state (if applicable)
- Disabled state
- All slots (title, description, icon, action)
- Event handlers (`onClick`, `onChange`)
- `aria-*` attributes

### Writing page tests

Use `src/test/pages/*.test.jsx` as templates. Remember to:

- `vi.mock("@/Services/...")` **above** the page import
- Wrap in `MemoryRouter` + `LanguageProvider`
- Mock `sonner` to avoid toast portal issues in jsdom
- Use `waitFor` for async state transitions
- Prefer `findByText` over `getByText` for async-rendered content

---

## Commit messages

Follow Conventional Commits. Examples:

```
feat(orders): add bulk status update
fix(stock): correct low-stock threshold calculation
refactor(primitives): extract InfoColumn from OrderDetailSummary
docs(readme): add contributing section
test(button): cover loading state
chore(deps): bump vite to 6.3.0
a11y(layout): add skip-to-content link
```

**Scopes** are optional but preferred for clarity.

**Bodies** are required for non-trivial changes. Explain the *why*, not the *what*.

**Co-Authored-By** is automatic when using `/commit` with Claude.

---

## Pull requests

### Required

- A summary of what changed and why
- A list of the pages/primitives affected
- Screenshots for any visual change (before/after)
- Confirmation that `npm run test` and `npm run build` pass
- Link to the issue being closed (if any)

### Template

```markdown
## Summary
- 1-3 bullet points

## Test plan
- [ ] npm run test passes
- [ ] npm run build passes
- [ ] Manual: visit every touched route
- [ ] Manual: toggle light/dark mode
- [ ] Manual: switch FR/EN
- [ ] Manual: resize to mobile
- [ ] Manual: test with keyboard only (if UI change)

## Screenshots (if visual)
| Before | After |
| ------ | ----- |
| ...    | ...   |
```

### What reviewers look for

1. **No raw shadcn imports** in pages
2. **No hardcoded colors**
3. **Tests exist** for new behavior
4. **FR/EN** coverage on new strings
5. **Accessible** — labels, focus, keyboard
6. **No regression** in existing pages

---

Thank you for contributing!
