# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run start      # Dev server with HMR and TypeScript overlay
npm run build      # Type-check (tsc -b) then bundle
npm run lint       # ESLint
npm run preview    # Preview production build
```

There are no tests configured yet.

## Architecture

Early-stage React 19 + TypeScript + Vite SPA. All source lives in `src/`.

**UI:** MUI v7 (`@mui/material`) with Emotion for styling. Use MUI components rather than raw HTML where possible.

**React Compiler:** Enabled via `@rolldown/plugin-babel` + `babel-plugin-react-compiler`. This means manual `useMemo`/`useCallback` optimizations are generally unnecessary — the compiler handles memoization automatically.

**TypeScript:** Strict mode with `noUnusedLocals`, `noUnusedParameters`, and `erasableSyntaxOnly`. Use `import type` for type-only imports (`verbatimModuleSyntax` is on).

**Dev-time type checking:** `vite-plugin-checker` runs `tsc` in watch mode and surfaces type errors as a browser overlay during `npm run start`. Errors that don't block the browser build will still appear here.
