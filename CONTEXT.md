CONTEXT.md

🎯 Purpose

This repo is the base site template for user projects.
It uses React + Vite + TailwindCSS + shadcn/ui. Bun is used only as a package manager.
Agents should extend this starter by adding reusable UI blocks in `src/blocks/` and composing them into pages under `src/pages/`. Puck has been removed from this template.

## 🤖 Agent Priorities

**CRITICAL**: Agents must follow this priority order when implementing features:

### 1. 🧱 Reusable Blocks First
- PREFER: Add or extend blocks in `src/blocks/` using shadcn/ui + Tailwind
- AVOID: Page-specific, one-off components
- WHY: Blocks are composable, testable, and reusable across pages

### 2. 🧩 Compose Pages from Blocks
- PREFER: Keep pages in `src/pages/` minimal and declarative
- PASS DATA: via simple, serializable props (strings, numbers, booleans)
- WHY: Keeps logic inside reusable primitives, pages stay thin

### 3. 📝 Implementation Strategy
When asked to add features:
1. Check if an existing block can be configured to achieve it
2. If not, create a new block in `src/blocks/`
3. Wire the block into the relevant page(s)
4. Keep styling consistent with Tailwind utilities

### 4. 🚫 What NOT to do
- Don't create page-specific components
- Don't add stateful, complex logic in pages
- Don't introduce configuration systems or visual editors

⸻

1. Use shadcn/ui for UI primitives.
2. Style using Tailwind classes (bg-accent, text-muted-foreground).
3. Keep props simple & serializable (strings, numbers, booleans).
4. Compose blocks into src/pages/\*
5. Add new blocks in src/blocks/
   ⸻

📂 Structure
• src/components/ui/ → shadcn/ui components (Button, Card, Input, etc).
• src/blocks/ → Prebuilt primitives (Hero, Navbar, Footer, Sections).
• src/pages/ → Example pages built with blocks.
• src/lib/ → Helpers and utils.
• src/assets/ → Static assets (images, svgs, fonts). Use alias `@assets/*`.
• src/constants.ts → Basic website configurations.


⸻

🧱 Adding a New Block 1. Create file in `src/blocks/`:

type BlockProps = { ... }

export function BlockName({ ...props }: BlockProps) {
return (/_ JSX _/)
}
⸻

🌐 Example Block

import { Button } from "../components/ui/button"

export function Hero({ title, subtitle, cta }: { title: string; subtitle?: string; cta?: string }) {
return (

<section className="py-20 text-center bg-accent text-accent-foreground">
<h1 className="text-4xl font-bold">{title}</h1>
{subtitle && <p className="mt-2 text-lg text-muted-foreground">{subtitle}</p>}
{cta && <Button className="mt-4">{cta}</Button>}
</section>
)
}

⸻

🛠️ Development Workflow
• Install deps: bun install
• Run dev server: bun run dev (Vite)
• Preview build: bun run preview
• Pre-deploy: bun run pre-deploy (use deploy tool after running pre-deploy) [IMPORTANT]
• Add UI components: `bun x shadcn@latest add <component>`
• Create new blocks under `src/blocks/`
• Compose blocks in `src/pages/`

⸻

🧭 Pages & Routing (SPA)

• Create pages in `src/pages/` (already scaffolded with `Home` and `About`).

- `src/pages/Home.tsx` and `src/pages/About.tsx` are minimal examples composed from blocks.
- Keep pages pure and pass data via props.

• Route wiring lives in `src/App.tsx` using React Router.

- Add a page: create `src/pages/YourPage.tsx`, then add a `<Route>` and a link in the `Navbar` block.
- Keep navigation simple and composable (e.g., use the `Navbar` block).

• Note: This template is SPA-only; additional HTML entrypoints (MPA) are not used here.

🖼️ Assets

• Store all static assets under `src/assets/`.
• Import assets via the alias `@assets/*` or relative paths from `src/`.

- Example: `import logo from "@assets/logo.svg"`
- Example CSS reference: `background: url("./assets/hero.jpg");`

✅ Principles
• Composable, not monolithic → break down into primitives.
• Schema-first → blocks should accept serializable props.
• Consistency → always use shadcn + Tailwind utilities.
• Minimal state → keep blocks pure and declarative.
⸻

🔌 APIs (Hono under `worker/`)

• Hono app in `worker/index.ts` exposes minimal endpoints (can be extended if needed)
• Auth (cookie JWT):
  - `POST /api/auth/register` { username, password }
  - `POST /api/auth/login` { username, password } → sets httpOnly `auth` cookie
  - `POST /api/auth/logout` → clears cookie
  - `GET /api/me` → protected, returns current user

• D1 is the datastore. Bind a D1 database as `D1` in `wrangler.jsonc`.

• Frontend `Auth` block lives in `src/blocks/Auth.tsx` for basic sign in/sign up UI.

• Keep additions minimal and composable; extend with more pages/blocks as needed.

⸻

📦 Migrations (Drizzle + D1)
[IMPORTANT] Migration flow:
• Define schema in `worker/db/schema.ts`.
• pre-deploy script will generate and stage the migrations.
• calling deploy script will apply the migrations.

When migrations fail, deploy tool will throw an error, in which case you are to drop the migration and follow the migration flow steps again.

⸻

💾 Database

• To implement.

⸻

⚡ Realtime & WebSockets

• To implement.
