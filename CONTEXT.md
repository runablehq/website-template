# CONTEXT.md

## 🎯 Purpose

This repo is the base site template for user projects using:
- React + Vite + TailwindCSS + shadcn/ui
- Bun (package manager only)

Agents should extend this starter by:
1. Adding reusable UI blocks in `src/blocks/`
2. Composing them into pages under `src/pages/`
3. Using semantic design tokens for styling (no hard-coded colors)

## 🚩 Mandatory First Step

Before doing anything else, you MUST rewrite the placeholder pages:
- `src/pages/Home.tsx`
- `src/pages/About.tsx`

These files are ONLY placeholders to help boot the app. Do not keep their content or styling. Replace them with your own design and content before building additional blocks or pages.

**IMPORTANT**: ALWAYS run `bun run pre-deploy` before calling deploy tool.

## 🤖 Agent Priorities

### 0. 📝 Implementation Strategy
- **THIS TEMPLATE IS JUST BOILERPLATE** - completely revamp the design to match user requirements. **MUST REWRITE `Home.tsx` and `About.tsx` BEFORE building anything else.**
- **DO NOT preserve the template look** - create something unique that doesn't resemble the starter
- Use semantic design tokens for all styling (no hard-coded colors)
- Feel free to modify any aspect: pages, navigation, blocks, layouts, themes, etc.

### 1. 🧱 Reusable Blocks First
- PREFER: Add/extend blocks in `src/blocks/` using shadcn/ui + Tailwind
- AVOID: Page-specific components unless they're small
- WHY: Blocks are composable, testable, reusable

### 2. 🧩 Compose Pages from Blocks
- PREFER: Keep pages in `src/pages/` minimal.
- First step: **Replace `src/pages/Home.tsx` and `src/pages/About.tsx` with your own versions**.
- PASS DATA: via serializable props (strings, numbers, booleans)
- WHY: Logic stays in reusable primitives

### 3. 📝 Implementation Strategy
1. Check if existing block can be configured
2. If not, create new block in `src/blocks/`
3. Wire block into relevant page(s)
4. Use consistent Tailwind styling with semantic tokens

### 4. 🚫 What NOT to do
- Don't introduce config systems/editors
- Don't use `dark:` variants or hard-coded colors; use tokens

## 📂 Project Structure

```
src/
├── components/ui/     → shadcn/ui components
├── components/        → App-level components (e.g., ThemeToggle)
├── blocks/            → Reusable UI primitives
├── pages/             → Pages composed from blocks
├── lib/               → Helpers and utilities
├── assets/            → Static assets (@assets/*)
├── styles/            → Global styles and theme tokens
├── theme/             → ThemeProvider + hooks
└── constants.ts       → Website configurations

worker/
├── index.ts           → Hono API endpoints
└── db/
    ├── index.ts       → Database interface
    └── schema.ts      → DB schema definitions
```

## 🧱 Creating New Blocks

1. Create file in `src/blocks/`
2. Define props interface
3. Export function component

```typescript
// Example block structure
interface BlockProps {
  title: string;
  subtitle?: string;
  cta?: string;
}

export function BlockName({ title, subtitle, cta }: BlockProps) {
  return (
    <section className="py-20 text-center bg-accent text-accent-foreground">
      <h1 className="text-4xl font-bold">{title}</h1>
      {subtitle && <p className="mt-2 text-lg text-muted-foreground">{subtitle}</p>}
      {cta && <Button className="mt-4">{cta}</Button>}
    </section>
  );
}
```

## 🛠️ Development Workflow

```bash
bun install           # Install dependencies
bun run dev           # Start dev server
bun run preview       # Preview production build
bun run pre-deploy    # Generate migrations (REQUIRED before deploy)
bun x shadcn@latest add <component>  # Add UI components
bun x tsc --noEmit -p ./tsconfig.app.json # Typecheck app
bun x tsc --noEmit -p ./tsconfig.worker.json # Typecheck worker
bun x tsc --noEmit -p ./tsconfig.node.json # Typecheck node

# Theming docs
# See THEMING.md for adding/editing themes and tokens
```

## 🧭 Pages & Routing (SPA)

- Pages: `src/pages/Home.tsx`, `src/pages/About.tsx`
- Routing: `src/App.tsx` (React Router)
- Navigation: Use `Navbar` block

> WARNING: `Home.tsx` and `About.tsx` are placeholders intended only to demonstrate routing and layout. **You must rewrite both files before adding new routes, blocks, or features.**

To add a page:
1. Create `src/pages/YourPage.tsx`
2. Add `<Route>` in `App.tsx`
3. Add link in `Navbar` block

## 🖼️ Assets

- Location: `src/assets/`
- Import: `import logo from "@assets/logo.svg"`
- CSS: `background: url("./assets/hero.jpg");`

## ✅ Design Principles

- Composable over monolithic
- Schema-first with serializable props
- Consistent shadcn/ui + Tailwind styling
- Minimal state in components
- Semantic tokens only: use `bg-background`, `text-foreground`, `text-muted-foreground`,
  `bg-card`, `border-input`, `bg-primary`, `text-primary-foreground`, `bg-accent`, etc.
  Avoid literal color utilities (e.g., `text-slate-500`) and `dark:`.

## 🎨 Theming & Design Tokens

- Tokens live in `src/styles/themes.css`. Themes are applied via `data-theme` on `<html>`.
- Tailwind color tokens map to CSS variables in `src/index.css` using `@theme inline`.
- At runtime, `src/theme/ThemeProvider.tsx` sets `data-theme` and persists the choice.
- `index.html` sets `data-theme` early to avoid FOUC.
- Use `ThemeToggle` (`src/components/ThemeToggle.tsx`) to switch themes.

Add a new theme

1. Copy a theme block in `src/styles/themes.css` and rename the selector to `[data-theme="my-theme"]`.
2. Adjust semantic variables (`--primary`, `--accent`, `--background`, etc.).
3. Select via `useTheme().setTheme('my-theme')` or the ThemeToggle.

## 🔌 API Endpoints (Hono in `worker/`)

Authentication:
- `POST /api/auth/register` { username, password }
- `POST /api/auth/login` { username, password } → sets httpOnly `auth` cookie
- `POST /api/auth/logout` → clears cookie
- `GET /api/me` → protected, returns current user

Database:
- D1 datastore
- Bind as `D1` in `wrangler.jsonc`
- Frontend: `src/blocks/Auth.tsx`

## 📦 Database Migrations (Drizzle + D1)

Process:
1. Define schema in `worker/db/schema.ts`
2. Run `bun run pre-deploy` (generates migrations)
3. Call deploy tool (applies migrations)

Error handling:
- If migrations fail, drop migration and repeat process

## ⚡ Realtime Features

- WebSockets: To implement
- Realtime updates: To implement
