# Quickstart: Implement Overdue Todo Items

## Prerequisites
- Install dependencies from repo root:
```bash
npm install
```

## 1. Write Failing Tests First

### Backend
- Update `packages/backend/__tests__/app.test.js` to cover:
  - `GET /api/todos` includes boolean `isOverdue`.
  - Overdue derivation rules (past due + incomplete only).
  - `GET /api/todos/:id` does not include `isOverdue`.

### Frontend
- Update/add tests under:
  - `packages/frontend/src/services/__tests__/todoService.test.js` for fallback behavior.
  - `packages/frontend/src/components/__tests__/TodoCard.test.js` or `TodoList.test.js` for overdue visual indicator.
  - `packages/frontend/src/__tests__/App.test.js` for midnight auto-refresh scheduling behavior (fake timers).

Run tests and confirm failures:
```bash
npm run test:backend
npm run test:frontend
```

## 2. Implement Backend Derivation
- Add overdue derivation helper in backend service/response layer.
- Apply helper in `GET /api/todos` response mapping.
- Keep detail endpoint unchanged.

## 3. Implement Frontend Mapping + UI
- Validate incoming `isOverdue`.
- Apply fallback local computation when backend value is missing/invalid.
- Add overdue styling hook/class in todo list/card rendering.
- Ensure indicator remains clear in light/dark themes and at mobile/desktop sizes.

## 4. Add Midnight Auto-Update
- Schedule update for next local midnight and re-fetch/re-render todos.
- Clean up timers to avoid leaks.

## 5. Verify
Run full test suite:
```bash
npm test
```

Manual checks:
- Incomplete past-due todo is visibly overdue.
- Due-today/future or completed items are not shown as overdue.
- Missing/invalid due date and missing/invalid `isOverdue` do not break rendering.
- Overdue state updates after simulated/local midnight transition.
