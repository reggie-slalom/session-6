# Contract: Todo List Overdue Field

## Scope
This contract defines additive response behavior for overdue support.

## Endpoint
- Method: `GET`
- Path: `/api/todos`

## Request
- Body: none
- Query params: none

## Response: 200 OK
- Type: JSON array of todo objects.
- Each item MUST include existing todo fields and MUST include `isOverdue`.

### Response Item Schema
```json
{
  "id": 1,
  "title": "Learn React",
  "dueDate": "2026-03-01",
  "completed": 0,
  "createdAt": "2026-03-05 10:00:00",
  "isOverdue": true
}
```

### Field Rules
- `isOverdue` MUST be a boolean.
- `isOverdue` MUST be `true` only when:
  - todo is incomplete, and
  - `dueDate` is a valid date before the user/device local current calendar date.
- `isOverdue` MUST be `false` when:
  - todo is completed,
  - `dueDate` is missing/null,
  - `dueDate` is invalid,
  - `dueDate` is equal to today.

## Compatibility
- Change is additive and non-breaking for existing clients.
- Clients that do not use `isOverdue` remain compatible.

## Non-Goals / Explicit Exclusions
- `GET /api/todos/:id` does NOT include `isOverdue` for this feature.
- Write endpoints (`POST`, `PUT`, `PATCH`, `DELETE`) are unchanged.

## Frontend Consumer Contract
- Frontend SHOULD use backend `isOverdue` when it is a valid boolean.
- Frontend MUST fall back to local computation when `isOverdue` is missing or invalid.
