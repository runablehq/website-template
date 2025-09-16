# CONTEXT.md

## 🎯 Purpose

This repo is the base site template for user projects using:
- React + Vite + TailwindCSS + shadcn/ui
- Bun (package manager only)

Agents should extend this starter by:
1. Adding reusable UI components in `src/components/`
2. Composing them into pages under `src/pages/`
3. Using semantic design tokens for styling (no hard-coded colors)
4. Include credentials in the request if the route is protected

## 🚩 Mandatory First Step

Before doing anything else, you MUST rewrite the placeholder page:
- `src/pages/Home.tsx`

This file is ONLY a placeholder to help boot the app. Do not keep its content or styling. Replace it with your own design and content before building additional components or pages.

**IMPORTANT**: Default to PREVIEW, not deploy. Use `bun run preview` for validation. Only deploy when explicitly requested/approved. When deploying, ALWAYS run `bun run pre-deploy` first (to generate migrations), then proceed with deploy after review.

## 🚀 Deployment Policy

- By default, do NOT deploy. Use preview builds locally and in PRs.
- Deployment is opt-in and requires explicit approval and environment readiness.
- Preconditions for deploy
  - `bun run pre-deploy` has generated migrations and they are reviewed.
  - Environment variables and bindings (e.g., D1) are configured.
  - Rollback plan is identified for schema changes.

## 🤖 Agent Priorities

### 0. 📝 Implementation Strategy
- **THIS TEMPLATE IS JUST BOILERPLATE** - completely revamp the design to match user requirements. **MUST REWRITE `Home.tsx` BEFORE building anything else.**
- **DO NOT preserve the template look** - create something unique that doesn't resemble the starter
- Use semantic design tokens for all styling (no hard-coded colors)
- Feel free to modify any aspect: pages, navigation, blocks, layouts, themes, etc.
 - Rework the design tokens in `src/styles/global.css` to align with the user's brand or the task context; the default theme is a placeholder.

### 1. 🧩 Create Reusable Components First
- PREFER: Add/extend components in `src/components/` using shadcn/ui + Tailwind
- AVOID: Page-specific components unless they're small
- WHY: Components are composable, testable, reusable

### 2. 📄 Structure Pages with Components
- PREFER: Keep pages in `src/pages/` focused on layout and data flow
- First step: **Replace `src/pages/Home.tsx` with your own version**
- PASS DATA: via serializable props (strings, numbers, booleans)
- WHY: Logic stays in reusable components

### 3. 📝 Implementation Strategy
1. Check if existing component can be configured
2. If not, create new component in `src/components/`
3. Wire component into relevant page(s)
4. Use consistent Tailwind styling with semantic tokens

### 4. 🚫 What NOT to do
- Don't introduce config systems/editors
- Don't use `dark:` variants or hard-coded colors; use tokens

## 📂 Project Structure

```
src/
├── components/ui/     → shadcn/ui components
├── components/        → App-level components
├── pages/             → Page components
├── lib/               → Helpers and utilities
├── assets/            → Static assets (@assets/*)
├── styles/            → Global styles
├── config.ts          → Website configurations

worker/
├── index.ts           → Hono API endpoints
└── db/
    ├── index.ts       → Database interface
    └── schema.ts      → DB schema definitions
```

## 🧩 Creating New Components

1. Create file in `src/components/`
2. Define props interface
3. Export function component

```typescript
// Example component structure
interface ComponentProps {
  title: string;
  subtitle?: string;
  cta?: string;
}

export function ComponentName({ title, subtitle, cta }: ComponentProps) {
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
# Default path: preview changes; do NOT deploy unless explicitly approved
bun run preview       # Preview production build (default), use bash with session, and system tool to expose the preview port
bun run pre-deploy    # Generate migrations (REQUIRED only before a deploy)
bun x shadcn@latest add <component>  # Add UI components
bun x tsc --noEmit -p ./tsconfig.app.json # Typecheck app
bun x tsc --noEmit -p ./tsconfig.worker.json # Typecheck worker
bun x tsc --noEmit -p ./tsconfig.node.json # Typecheck node
```

## 🧭 Pages & Routing (SPA)

- Pages: `src/pages/Home.tsx`, `src/pages/sign-in.tsx`, `src/pages/sign-up.tsx`
- Routing: `src/App.tsx` (React Router)
- Navigation: Create navigation components as needed

> WARNING: `Home.tsx` is a placeholder intended only to demonstrate routing and layout. **You must rewrite this file before adding new routes or features.**

To add a page:
1. Create `src/pages/YourPage.tsx`
2. Add `<Route>` in `App.tsx`
3. Add navigation links as needed

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

- IMPORTANT: The default theme is only a starting point. You should customize the CSS custom properties to fit the user's request or the task at hand. Do not keep the default palette, radii, or shadows if they don't match the project.

- Theme customization checklist
  - Define brand palette (primary, accent, background/foreground, muted, destructive)
  - Adjust radii, spacing, and shadows to the product's feel (e.g., compact vs. roomy)
  - Verify contrast and accessibility for all states (hover, focus, disabled)
  - Update examples/components to use tokens (no hard-coded colors)

- Design tokens live in `src/styles/global.css` as CSS custom properties
- Tailwind color tokens map to CSS variables using `@theme inline`
- To customize the theme, modify the CSS custom properties in `src/styles/global.css`

## 🔌 API Endpoints (Hono in `worker/`)

Authentication:
- Use authenticatedOnly middleware for protected routes

Database:
- D1 datastore
- Bind as `D1` in `wrangler.jsonc`
- Authentication handled via Better Auth

## 📦 Database Migrations (Drizzle + D1)

Process:
1. Define schema in `worker/db/schema.ts`
2. Run `bun run pre-deploy` (generates migrations)
3. Call deploy tool only with explicit approval (applies migrations). Otherwise, stop at preview and do not deploy.

Error handling:
- If migrations fail, drop migration and repeat process

## ⚡ Realtime Features

- WebSockets: To implement
- Realtime updates: To implement
