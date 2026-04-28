# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start Vite dev server (http://localhost:5173)
npm run build        # TypeScript check + production build
npm run lint         # Run ESLint
npm run lint-fix     # Auto-fix ESLint issues
npm run preview      # Preview production build

# E2E tests (requires dev server running)
npm run playwright:start        # Start dev server then run all Playwright tests
npm run playwright:start-debug  # Start dev server then run tests in debug mode
npx playwright test --project=chromium --debug  # Run single test in debug mode
```

## Architecture

**Data flow:**
```
Firebase (Auth + Firestore)
  → Services (src/app/services/)
    → Zustand stores (src/app/state/)
      → React components (src/app/pages/, src/app/components/)
```

**Wiring pattern** (`src/app/wiring.ts`): The `initWiring()` function (called from `main.tsx`) wires Firebase service callbacks into Zustand store updates using `subscribeWithSelector` middleware. This creates reactive chains:
- Firebase auth state change → `auth-store` → triggers Firestore list subscription
- Selected list change → triggers Firestore items subscription (with add/remove callbacks)
- Online status → `ui-store`

**Services** (`src/app/services/`): Each service class takes Firebase `db`/`auth` instances via constructor (dependency injection through `services/index.ts`). Services expose subscription methods returning unsubscribe functions.

**Stores** (`src/app/state/`): Four Zustand stores — `auth-store`, `list-store`, `item-store`, `ui-store`. Each store follows this pattern:
- State and actions are defined in separate interfaces (`XState` / `XActions`)
- Actions are nested under an `actions` key inside the store state (not at the top level)
- A `useXActions()` hook is exported as a selector shortcut: `() => useXStore((s) => s.actions)`
- `auth-store` and `list-store` use `subscribeWithSelector` middleware (required for `wiring.ts` subscriptions); `item-store` and `ui-store` do not
- Store-level selectors (e.g. `isConnected`, `displayName`) are exported as plain functions typed against the state interface

**Anonymous auth fallback**: If Firebase returns `null` for the current user, `authService.signInAnonymously()` is called automatically in wiring.

## Tech Stack

- React 19 + TypeScript 5.6, Vite 6
- Zustand 5 (state management)
- Firebase 11 (Auth + Firestore)
- Material-UI 6, TailwindCSS 3, SCSS
- React Router 7
- Playwright (E2E tests only — no unit test framework)

## Key Files

| File | Purpose |
|------|---------|
| `src/app/wiring.ts` | Service-to-store subscriptions (core data flow) |
| `src/app/services/index.ts` | Firebase init + service instantiation |
| `src/app/firebase.config.ts` | Firebase project config |
| `src/app/model/` | TypeScript interfaces (auth, list, item, dto, message) |
