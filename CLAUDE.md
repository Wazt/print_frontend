# CLAUDE.md — print_frontend

## Project Context

React frontend for a print shop management system. Handles orders, companies, users, products, stock, finance, and Google Drive file management.

**Stack:** React 19, Vite 6, Tailwind CSS 4, shadcn/ui (Radix), React Router 7, Axios, Framer Motion

**Run:** `npm run dev` (serves at localhost:5173, proxies /api to localhost:8000)

### Key conventions
- Components in `src/Components/`, pages in `src/Pages/`
- API services in `src/Services/` — all use Axios instance from `src/config/axiosConfig.js`
- Auth via cookie-based JWT, managed in `src/contexts/AuthContext.jsx`
- UI built with shadcn/ui components (`src/Components/ui/`)
- Path alias: `@/*` maps to `src/*`
- Environment config via `import.meta.env.VITE_API_URL`

---

## Behavioral Guidelines

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" -> "Write tests for invalid inputs, then make them pass"
- "Fix the bug" -> "Write a test that reproduces it, then make it pass"
- "Refactor X" -> "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] -> verify: [check]
2. [Step] -> verify: [check]
3. [Step] -> verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.

---

## UI/UX Design Intelligence

This project uses the **UI/UX Pro Max** skill (`.claude/skills/ui-ux-pro-max/`) for design decisions.

### Product context for design reasoning
- **Product type:** Print Shop Management (B2B SaaS Dashboard)
- **Target users:** Print shop owners, employees, and their clients
- **UI category:** SaaS / Business Management
- **Style priority:** Clean minimalism, professional, data-oriented
- **Color mood:** Trust, reliability, professionalism
- **Typography mood:** Professional, clear, readable

### Design principles for this project
- Use shadcn/ui components from `src/Components/ui/` — do not introduce new component libraries
- Follow Tailwind CSS 4 utility-first patterns
- Respect the existing dark sidebar + light content area layout
- Animations: subtle, 150-300ms, use Framer Motion for complex transitions
- Accessibility: 4.5:1 contrast ratio, 44x44px touch targets, visible focus states
- Mobile-first responsive design with Tailwind breakpoints
- Use the design data in `.claude/skills/ui-ux-pro-max/data/` for style, color, and typography decisions
