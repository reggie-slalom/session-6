# Data Model: Overdue Todo Items

## Entity: TodoItem (existing persisted entity)
- Description: A single task record stored in backend SQLite and rendered in frontend list/detail flows.
- Source: `todos` table and existing API payloads.

### Fields
- `id` (integer, required): Primary key.
- `title` (string, required, max 255): User-provided todo title.
- `dueDate` (string `YYYY-MM-DD` or null): Optional due date.
- `completed` (boolean-like, required): Stored as `0|1`, interpreted as incomplete/complete.
- `createdAt` (timestamp string, required): Creation timestamp.

### Validation Rules
- `title` must be non-empty and <=255 chars.
- `dueDate` may be null; invalid date values are treated as non-overdue for derivation.
- `completed` true/1 always suppresses overdue.

## Entity: TodoListItemView (derived response model)
- Description: List-specific API representation returned by `GET /api/todos`.
- Relationship: 1:1 projection from `TodoItem` plus derived overdue state.

### Fields
- All `TodoItem` fields, plus:
- `isOverdue` (boolean, required on list response): Derived flag for list presentation.

### Derivation Rule (`isOverdue`)
- `isOverdue = false` when `completed` is true/1.
- `isOverdue = false` when `dueDate` is null, empty, or invalid.
- `isOverdue = true` when `completed` is false/0 AND `dueDate` is before current local calendar date.
- `isOverdue = false` when `dueDate` is equal to current local calendar date.

## Entity: FrontendTodoViewModel (runtime normalized model)
- Description: Frontend-normalized todo shape used by components.
- Relationship: Created from API response in service/mapping layer.

### Fields
- Existing todo fields consumed by UI.
- `isOverdue` boolean, guaranteed after normalization.

### Fallback Rule
- If backend `isOverdue` is missing or invalid, frontend computes with the same local-date rule.

## State Transitions
- `NotOverdue -> Overdue`: Occurs when local date crosses past due date while todo remains incomplete.
- `Overdue -> NotOverdue`: Occurs when todo is marked complete.
- `NotOverdue -> NotOverdue`: No due date, due date today/future, or invalid due date.

## Relationships
- `TodoItem` (persisted) -> `TodoListItemView` (backend projection) -> `FrontendTodoViewModel` (frontend normalization).
- No schema/table changes required; `isOverdue` is computed at response/render time.
