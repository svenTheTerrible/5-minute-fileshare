# Agent Instructions for this Repo

## Repository Layout

- `frontend/` — React 19 + TypeScript + Vite SPA (MUI v7, Emotion)
- `backend/` — Go signaling server (gorilla/websocket), serves static files from `./static/` on port 8080
- Root Dockerfile orchestrates both builds; no CI configured yet.

## Development Commands (run from the respective directory)

**Frontend:**
```bash
npm run start       # Vite dev server at :5173 with HMR and TS overlay
npm run build       # tsc -b && vite build
npm run lint        # ESLint
npm run preview     # Preview production build (Vite, port 4173)
```

**Backend:**
```bash
cd backend && go run main.go   # Runs on :8080; serves static + /ws signaling
cd backend && go build main.go  # Produces ./main binary
```

## Important Context for Agents

- `npm run start` alone is insufficient during development. The Vite dev server proxies `/ws` to `localhost:8080`, so the Go backend must also be running (`go run main.go`) for WebSocket connections to work.
- Production build order: `cd frontend && npm run build` → copy `frontend/dist/*` into `backend/static/` → `cd backend && go build main.go`. The root Dockerfile does exactly this in multi-stage form.
- React Compiler is enabled via `babel-plugin-react-compiler`. Do **not** add manual `useMemo`, `useCallback`, or similar — the compiler handles it, and hoisting them can conflict with its analysis.
- TypeScript strict mode: `noUnusedLocals` and `noUnusedParameters` are enforced; use `import type` for type-only imports (`verbatimModuleSyntax` is on).
- No tests configured yet (per CLAUDE.md in frontend/); do not assume test scripts exist.
- Backend depends only on gorilla/websocket — no other Go module dependencies beyond the standard library.
