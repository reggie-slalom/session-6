# Implementation Plan: Support for Overdue Todo Items

**Branch**: `001-overdue-todo-items` | **Date**: 2026-03-05 | **Spec**: `/workspaces/session-6/specs/001-overdue-todo-items/spec.md`
**Input**: Feature specification from `/specs/001-overdue-todo-items/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Add backend-derived overdue status for todo list reads and render a clear overdue
indicator in the frontend list. Backend will compute and return `isOverdue`
only for `GET /api/todos` using local-calendar-date rules; frontend will trust
valid backend booleans and fall back to local computation if missing/invalid.
Frontend will also schedule an automatic local-midnight refresh so overdue state
changes without manual user action.

## Technical Context

**Language/Version**: JavaScript (Node.js backend + React 18 frontend)  
**Primary Dependencies**: Express 4, better-sqlite3, React 18, react-scripts 5, fetch API  
**Storage**: In-memory SQLite via better-sqlite3 (`:memory:`)  
**Testing**: Jest + Supertest (backend), Jest + React Testing Library + MSW (frontend)  
**Target Platform**: Local Node server + modern desktop browsers (Chrome/Firefox/Safari latest)  
**Project Type**: Monorepo web application (frontend + backend packages)  
**Performance Goals**: Preserve current list responsiveness; overdue derivation remains O(n) over returned list  
**Constraints**: Maintain non-breaking API behavior; include `isOverdue` only on list responses; preserve theme/accessibility behavior; maintain >=80% coverage  
**Scale/Scope**: Single-user todo list with small-to-medium lists (tens to low hundreds of items)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] Principle I: Solution keeps design simple, avoids speculative complexity,
  and documents any required complexity tradeoff.
- [x] Principle II: Coding style plan enforces naming, import organization,
  linting, and formatting consistency.
- [x] Principle III: Test-first approach is defined with failing-first tests,
  required unit/integration coverage for changed behavior, and coverage
  impact plan (target >= 80%).
- [x] Principle IV: UI impact is assessed for theme compatibility,
  accessibility, responsive behavior, and destructive-action confirmation.
- [x] Principle V: Frontend/backend contract impact is identified; coordinated
  updates and contract verification tests are included when needed.

## Project Structure

### Documentation (this feature)

```text
specs/001-overdue-todo-items/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)
```text
packages/
├── backend/
│   ├── src/
│   │   ├── app.js
│   │   └── services/
│   │       └── todoService.js
│   └── __tests__/
│       └── app.test.js
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── TodoCard.js
    │   │   └── TodoList.js
    │   ├── services/
    │   │   └── todoService.js
    │   ├── styles/
    │   │   └── theme.css
    │   └── __tests__/
    │       └── App.test.js
    └── src/components/__tests__/
        └── TodoCard.test.js
```

**Structure Decision**: Use the existing monorepo web-app structure in
`packages/backend` and `packages/frontend`, keeping overdue computation logic in
backend response shaping and overdue visual/fallback logic in frontend service
and list/card presentation layers.

## Post-Design Constitution Check

- [x] Principle I: Design remains additive and focused (one derived field + one visual state).
- [x] Principle II: Planned changes stay in existing module boundaries and style conventions.
- [x] Principle III: Plan includes failing-first unit/integration tests for backend rules, frontend fallback, and midnight refresh behavior.
- [x] Principle IV: Overdue indicator design will be validated for light/dark themes, responsive layouts, and existing keyboard/focus behavior.
- [x] Principle V: API contract update is additive and explicitly documented/tested across backend and frontend.

## Complexity Tracking

No constitution violations expected.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|

