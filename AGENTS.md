# AGENTS.md — FutsalInside

## What This Is

Angular 21 frontend for a futsal league app (TFM thesis project). Single package, no monorepo. All UI text is in Spanish. Currently mock-data only — no backend connected.

## Skills — LOAD FIRST

At the start of every conversation, load the `angular-developer` skill from `.agents/skills/angular-developer/SKILL.md`. This skill contains reference material for Angular 21 patterns (components, signals, DI, routing, forms, testing, etc.) used throughout this project. Read the SKILL.md file and its referenced docs before writing any Angular code.

Other available skills in `.agents/skills/`:
- `typescript-advanced-types` — advanced TS patterns
- `frontend-design` — frontend design guidelines
- `adev-writing-guide` — Angular docs writing style
- `accessibility` — WCAG and A11Y patterns
- `reference-core` — Angular core reference
- `reference-compiler-cli` — Angular compiler/CLI reference
- `reference-signal-forms` — Angular signal forms reference

Load the relevant skill(s) based on the task at hand.

## Commands

```bash
cd frontend
npm start          # ng serve → http://localhost:4200
npm run build      # production build → dist/futsalinside/
npm test           # Vitest via ng test
```

No lint, typecheck, or format scripts are configured. Run `npx ng build` to verify types compile. Prettier config lives in `package.json` (printWidth 100, singleQuote).

## Architecture

- **Standalone components** — no NgModules. Components declare their own `imports` array.
- **Signals-based stores** — custom state management in `src/app/stores/` using Angular signals (`signal()`, `computed()`, `asReadonly()`). No NgRx.
- **Lazy feature routes** — each feature under `src/app/features/` has its own `*.routes.ts`, loaded via `loadChildren` in `app.routes.ts`.
- **Three layouts** — `main-layout` (header+footer+router-outlet), `auth-layout` (router-outlet only), `blank-layout` (unused).
- **Functional guards/interceptors** — `auth.guard.ts`, `auth.interceptor.ts`, `error.interceptor.ts` are all functional, not class-based.

## Key Directory Layout

```
src/app/
  core/
    models/       # TypeScript interfaces (Team, Match, Player, Standing, etc.)
    mocks/        # Test data (MOCK_TEAMS, MOCK_MATCHES, MOCK_STANDINGS, MOCK_PLAYERS)
    auth/         # AuthService, AuthGuard
    interceptors/ # HTTP interceptors
    api/          # API config and service (stubs, not implemented)
  stores/         # Signal-based state stores
  features/       # Page components (home, live, matches, standings, teams, players, favorites, auth)
  shared/
    components/   # Reusable UI: header, footer, match-card, team-badge, tabs, etc.
    pipes/        # match-status, time-ago, stat-format (all output Spanish)
    directives/   # lazy-image (IntersectionObserver)
  layouts/        # Layout shell components
```

## Conventions

- **Angular 21** — uses `input()`, `input.required()`, `output()`, `computed()` signal APIs. No `@Input()`/`@Output()` decorators.
- **CSS** — pure CSS with custom properties (no Tailwind, no SCSS). Dark theme inspired by SofaScore/FlashScore. See `src/styles/_variables.css` for the full token set.
- **Utility classes** — hand-rolled Tailwind-like utilities in `_utilities.css` (`.flex`, `.gap-3`, `.text-sm`, `.container`, etc.).
- **Component style budget** — Angular enforces 6kB warning / 10kB error per component CSS (`angular.json`).
- **Barrel exports** — `core/models/index.ts` and `core/mocks/index.ts` re-export everything. Import from barrels, not individual files.
- **Pipes translate to Spanish** — `MatchStatusPipe`, `TimeAgoPipe` return Spanish strings.

## Gotchas

- Stores use `@Injectable({ providedIn: 'root' })`. If you create a new store and forget this, `inject()` will throw `NullInjectorError`.
- No ESLint or typecheck script — verify with `npx ng build` after changes.
- Only 1 test file exists (`app.spec.ts`). The test runner is Vitest, not Karma/Jasmine.
- `src/app/core/api/api.service.ts` is a stub (returns empty Observables). Real API integration is pending.
- `src/app/core/mocks/mock-data.service.ts` provides Observable-based mock data with a 300ms simulated delay — use this if you need async mock behavior.
- Environment config: dev API at `localhost:3000/api`, prod at `api.futsalinside.com/api` (neither is running).
