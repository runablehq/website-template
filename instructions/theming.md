Theming overview

- Centralize all colors, radii, and surfaces in `src/styles/themes.css`.
- Components must use semantic Tailwind tokens (e.g., `bg-background`, `text-muted-foreground`, `border-input`) and avoid hardcoded colors and `dark:` variants.

Files

- `src/styles/themes.css`: Defines light, dark, and example `ocean` themes via CSS variables.
- `src/index.css`: Wires CSS variables to Tailwind tokens and sets base styles.
- `src/theme/ThemeProvider.tsx`: Stores current theme and applies `data-theme` on `<html>`.
- `src/components/ThemeToggle.tsx`: Simple selector to switch themes at runtime.

How to add a theme

1. Copy one of the blocks in `src/styles/themes.css` and rename the selector to `[data-theme="my-theme"]`.
2. Adjust only semantic variables (e.g., `--primary`, `--accent`, etc.). Avoid changing neutrals unless you need a different surface.
3. Use the ThemeToggle, or programmatically call `setTheme('my-theme')` from the `useTheme()` hook.

Tokens you can rely on in components

- Colors: `background`, `foreground`, `card`, `popover`, `primary`, `secondary`, `muted`, `accent`, `destructive`, `border`, `input`, `ring`
- Extras: `sidebar-*`, `chart-1..5`
- Radii: `--radius` plus computed `--radius-sm|md|lg|xl` via `@theme inline`.

Notes

- Prefer semantic tokens over brand hues. Example: use `text-muted-foreground` instead of a gray class.
- If you need transparency, use `/` opacity on the token class (e.g., `bg-accent/50`).
- To ensure a consistent experience, do not use `dark:` classes. Themes switch by `data-theme` instead.