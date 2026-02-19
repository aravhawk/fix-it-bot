# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

`fix-it-bot-react` is an npm-publishable React component library. It provides a drop-in `<FixItBot />` form that submits bug reports directly to a Kilo AI webhook. Kilo's cloud agent then analyzes the repo and creates a pull request. Originally built as a Next.js app for Kilo League Challenge #1, it was converted to a standalone library.

## Build Commands

```bash
pnpm build          # Full build (JS + CSS)
pnpm build:js       # tsup: ESM + CJS + .d.ts
pnpm build:css      # @tailwindcss/cli: compile to dist/fix-it-bot.css
pnpm dev            # tsup --watch (JS only)
```

There are no tests or lint scripts configured.

## Build Output

`dist/` contains: `index.js` (CJS), `index.mjs` (ESM), `index.d.ts`, `index.d.mts`, `fix-it-bot.css`. The package.json `exports` field maps these for consumers. CSS is built separately from JS via `@tailwindcss/cli` (not bundled through tsup).

## Architecture

**Two-layer component structure:**
- `FixItBot.tsx` — outer wrapper that applies theme CSS variables to a `.fix-it-bot` div, renders the form + Toaster
- `BugReportForm.tsx` — the actual form, receives `config`, `labels`, `callbacks` as props

**Data flow:** Form submission calls `submitToKilo()` (in `lib/webhook.ts`) which does a direct browser `fetch` to the configured Kilo webhook URL. No server-side middleman.

**Support Portal Mode:** When `config.repoUrl` is set, the repo/branch fields are hidden and the UI switches to a simpler "Support Portal" style. This is determined by `!!config.repoUrl` inside BugReportForm.

**Theming:** CSS variables are scoped under `.fix-it-bot` (dark default) and `.fix-it-bot.light`. The `theme` prop on `<FixItBot>` injects overrides as inline `style` on the wrapper div. All colors use raw HSL values (e.g. `"45 100% 50%"` not `hsl(45 100% 50%)`).

**Barrel export (`src/index.ts`):** Exports the component (named + default), all prop types, and the Zod validation schema.

## Key Conventions

- UI components in `src/components/ui/` follow the shadcn/ui pattern (Radix primitives + CVA + `cn()` utility)
- All import paths are relative (no `@/` aliases) — the tsconfig has no path mappings
- `react` and `react-dom` are peer dependencies, externalized from the bundle
- tsup adds `"use client"` banner to all JS output for Next.js App Router compatibility
- The `pnpm.onlyBuiltDependencies` field in package.json allowlists `esbuild` and `@parcel/watcher`

## Validation

Form validation uses Zod (`lib/validation.ts`). The schema (`bugReportSchema`) accepts GitHub repos as `owner/repo` or full URLs, requires 10+ char descriptions, and enforces a priority enum.
