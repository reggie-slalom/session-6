# Phase 0 Research: Overdue Todo Items

## Decision 1: Overdue Derivation Rule and Date Comparison
- Decision: Derive `isOverdue` in backend list responses using local calendar-date comparison: overdue only when `completed` is false and `dueDate < todayLocal`.
- Rationale: This directly matches FR-001/FR-002, avoids frontend/backend drift for primary behavior, and keeps detail endpoint unchanged per clarification.
- Alternatives considered:
  - Parse due dates into UTC timestamps and compare Date objects: rejected due to timezone edge cases around midnight and "date-only" values.
  - Compute overdue only in frontend: rejected because clarification explicitly requires backend computation.

## Decision 2: Local-Date Helper Strategy
- Decision: Normalize to date-only values and compare against a local-date key (`YYYY-MM-DD`) computed from local date components (`getFullYear/getMonth/getDate`).
- Rationale: Date-only comparison aligns with business rules (calendar day semantics) and avoids off-by-one behavior caused by implicit timezone parsing.
- Alternatives considered:
  - `new Date('YYYY-MM-DD')` comparisons: rejected because implicit UTC parsing can produce incorrect local-day results.
  - `toISOString().slice(0, 10)` for "today": rejected as primary method because it is UTC-based, not local-day based.

## Decision 3: API Contract Introduction
- Decision: Add boolean `isOverdue` only to `GET /api/todos` list responses; do not add it to `GET /api/todos/:id`.
- Rationale: Matches explicit clarification, keeps contract change additive and backward compatible, and minimizes scope.
- Alternatives considered:
  - Include `isOverdue` on all todo read endpoints: rejected due to explicit requirement limiting field to list responses.
  - Add a separate overdue endpoint: rejected as unnecessary complexity for a simple derived field.

## Decision 4: Frontend Fallback Behavior
- Decision: Validate backend `isOverdue`; if missing or not a boolean, compute locally from `completed`, `dueDate`, and local current date.
- Rationale: Required by FR-011 and protects rendering from malformed or legacy responses.
- Alternatives considered:
  - Treat missing/invalid `isOverdue` as always false: rejected because it can silently hide genuinely overdue items.
  - Hard fail UI on missing field: rejected because requirement mandates resilient fallback.

## Decision 5: Midnight Re-evaluation Pattern
- Decision: Add a local-midnight scheduler in frontend (`setTimeout` until next local midnight, then reschedule) that triggers todo refresh/re-render.
- Rationale: Satisfies FR-009 while avoiding frequent polling overhead.
- Alternatives considered:
  - Poll every minute/hour: rejected due to unnecessary resource usage.
  - Only recompute on user action: rejected because automatic midnight update is mandatory.

## Decision 6: Testing Strategy
- Decision: Apply test-first coverage in both packages.
- Rationale: Constitution Principle III requires failing-first tests and maintaining >=80% coverage.
- Alternatives considered:
  - Frontend-only tests for visuals: rejected because backend derivation and contract behavior are core requirements.
  - Manual QA only: rejected as insufficient for regression prevention.

## Planned Test Additions
- Backend unit tests for overdue derivation edge cases (missing/invalid due date, completed items, due today, past due).
- Backend API tests confirming `isOverdue` exists and is boolean on list responses, and is absent from detail responses.
- Frontend service/mapper tests for fallback logic when backend field is missing/invalid.
- Frontend component tests for overdue visual state across completed/incomplete/date combinations.
- Frontend timer tests (fake timers) for midnight-triggered refresh behavior.
