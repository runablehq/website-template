AGENTS.md

🎯 Purpose

This repo is the base site template for user projects.
It uses React + Vite + TailwindCSS + shadcn/ui. Bun is used only as a package manager.
Agents should extend this starter by adding blocks (reusable UI components) that can be composed into pages for the user website. If a block doesn't exist, it maybe be created using shadcn/ui and TailwindCSS.

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
• src/lib/ → Helpers and utils (schema renderer, etc).
• src/assets/ → Static assets (images, svgs, fonts). Use alias `@assets/*`.
• src/constants.ts → Basic website configurations.


⸻

🧱 Adding a New Block 1. Create file in src/blocks/:

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
• Build production: bun run build (Vite)
• Preview build: bun run preview
• Deploy: bun run deploy
• Add UI components: bunx shadcn@latest add <component>
• Create new blocks under src/blocks/
• Test changes in src/App.tsx

⸻

🧭 Pages & Routing (SPA)

• Create pages in `src/pages/` (already scaffolded with `Home` and `About`).

- `src/pages/Home.tsx` and `src/pages/About.tsx` are minimal examples.
- Keep pages pure and pass data via props.

• Route wiring lives in `src/App.tsx` using React Router.

- Add a page: create `src/pages/YourPage.tsx`, then add a `<Route>` and a `<Link>` in `App.tsx`.
- Keep navigation simple and composable (e.g., a `Navbar` block).

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

📦 Migrations (D1 SQL)

• On first request, `worker/index.ts` calls `runMigrations(env)`.
• Edit `worker/db/index.ts` → `runMigrations` to add new entries to the `migrations` array (versioned SQL and optional seed).
• Schema version tracked in `__schema_migrations` table.
• The base migration creates a `users` table and a demo `admin` user.

⸻

💾 Database

• To implement.

⸻

⚡ Realtime & WebSockets

• To implement.
