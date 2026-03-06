# Tasks: Support for Overdue Todo Items

**Input**: Design documents from `/specs/001-overdue-todo-items/`
**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/todos-list-overdue.md`, `quickstart.md`

**Tests**: Tests are REQUIRED for this behavior change and must be written to fail before implementation tasks.

**Organization**: Tasks are grouped by user story so each story can be implemented and validated independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Parallelizable task (different files, no dependency on incomplete tasks)
- **[Story]**: User story label (`[US1]`, `[US2]`, `[US3]`)
- Each task includes an exact file path

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare existing test surfaces and feature verification workflow for overdue work.

- [ ] T001 [P] Add backend overdue test fixture setup notes in `packages/backend/__tests__/app.test.js`
- [ ] T002 [P] Add frontend overdue test fixture setup notes in `packages/frontend/src/services/__tests__/todoService.test.js`
- [ ] T003 Align overdue implementation verification steps in `specs/001-overdue-todo-items/quickstart.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared overdue derivation and styling foundations required by all user stories.

**CRITICAL**: Complete this phase before starting user story implementation.

- [ ] T004 Create backend local-date overdue comparison helper in `packages/backend/src/services/todoService.js`
- [ ] T005 [P] Create frontend local-date overdue fallback helper in `packages/frontend/src/services/todoService.js`
- [ ] T006 [P] Add overdue design tokens for light/dark themes in `packages/frontend/src/styles/theme.css`
- [ ] T007 Add contract-level list response assertions scaffold for `isOverdue` in `packages/backend/__tests__/app.test.js`

**Checkpoint**: Backend/frontend shared overdue foundations are ready for story delivery.

---

## Phase 3: User Story 1 - Quickly spot overdue tasks (Priority: P1) 🎯 MVP

**Goal**: Show a clear overdue indicator for incomplete past-due todos in the list.

**Independent Test**: Load mixed todos and verify only incomplete past-due items are marked overdue.

### Tests for User Story 1 (REQUIRED)

- [ ] T008 [P] [US1] Add failing backend list/detail overdue behavior tests in `packages/backend/__tests__/app.test.js`
- [ ] T009 [P] [US1] Add failing overdue visual indicator tests for todo cards in `packages/frontend/src/components/__tests__/TodoCard.test.js`
- [ ] T010 [P] [US1] Add failing overdue filtering/render tests for todo list items in `packages/frontend/src/components/__tests__/TodoList.test.js`

### Implementation for User Story 1

- [ ] T011 [US1] Implement `isOverdue` derivation for todo list items in `packages/backend/src/services/todoService.js`
- [ ] T012 [US1] Return `isOverdue` only from `GET /api/todos` mapping in `packages/backend/src/app.js`
- [ ] T013 [US1] Render overdue indicator state in todo cards in `packages/frontend/src/components/TodoCard.js`
- [ ] T014 [US1] Pass and apply overdue item state in list rendering in `packages/frontend/src/components/TodoList.js`
- [ ] T015 [US1] Add overdue visual treatment styles for list items in `packages/frontend/src/App.css`

**Checkpoint**: User Story 1 is independently functional and testable.

---

## Phase 4: User Story 2 - Distinguish urgency with confidence (Priority: P2)

**Goal**: Preserve reliable overdue identification with fallback logic and automatic midnight re-evaluation.

**Independent Test**: Verify missing/invalid backend `isOverdue` still yields correct overdue state and overdue status updates after simulated local midnight.

### Tests for User Story 2 (REQUIRED)

- [ ] T016 [P] [US2] Add failing fallback normalization tests for missing/invalid `isOverdue` in `packages/frontend/src/services/__tests__/todoService.test.js`
- [ ] T017 [P] [US2] Add failing local-midnight refresh scheduling tests in `packages/frontend/src/__tests__/App.test.js`
- [ ] T018 [P] [US2] Add failing backend edge-case tests for due-today/invalid-date rules in `packages/backend/__tests__/app.test.js`

### Implementation for User Story 2

- [ ] T019 [US2] Normalize todo payloads and compute fallback overdue values in `packages/frontend/src/services/todoService.js`
- [ ] T020 [US2] Implement local-midnight refresh timer setup and cleanup in `packages/frontend/src/App.js`
- [ ] T021 [US2] Wire midnight-triggered todo reload path to refresh overdue rendering in `packages/frontend/src/App.js`

**Checkpoint**: User Stories 1 and 2 are independently testable and pass acceptance checks.

---

## Phase 5: User Story 3 - Keep overdue cues usable across themes and devices (Priority: P3)

**Goal**: Maintain clear overdue differentiation in supported themes and viewport sizes.

**Independent Test**: Verify overdue cues remain legible and distinguishable in light/dark themes and mobile/desktop widths.

### Tests for User Story 3 (REQUIRED)

- [ ] T022 [P] [US3] Add failing theme legibility assertions for overdue cues in `packages/frontend/src/components/__tests__/TodoCard.test.js`
- [ ] T023 [P] [US3] Add failing responsive overdue layout assertions in `packages/frontend/src/components/__tests__/TodoList.test.js`

### Implementation for User Story 3

- [ ] T024 [US3] Tune overdue contrast and theme token usage in `packages/frontend/src/styles/theme.css`
- [ ] T025 [US3] Adjust overdue badge/text layout behavior for small screens in `packages/frontend/src/components/TodoCard.js`
- [ ] T026 [US3] Add responsive overdue state CSS rules in `packages/frontend/src/App.css`

**Checkpoint**: All user stories are independently functional across required themes and viewports.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final consistency, verification, and coverage confidence across stories.

- [ ] T027 [P] Update overdue contract examples and frontend fallback notes in `specs/001-overdue-todo-items/contracts/todos-list-overdue.md`
- [ ] T028 Run backend and frontend overdue regression suites and record results in `specs/001-overdue-todo-items/quickstart.md`
- [ ] T029 [P] Record overdue feature coverage impact guidance in `docs/testing-guidelines.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies.
- **Phase 2 (Foundational)**: Depends on Phase 1 and blocks all user stories.
- **Phase 3 (US1)**: Depends on Phase 2.
- **Phase 4 (US2)**: Depends on Phase 2; can start after US1 contract behavior is available.
- **Phase 5 (US3)**: Depends on Phase 2 and benefits from US1 visual baseline.
- **Phase 6 (Polish)**: Depends on completion of targeted user stories.

### User Story Dependencies

- **US1 (P1)**: Independent after foundational phase.
- **US2 (P2)**: Independent after foundational phase, but validates behavior built in US1.
- **US3 (P3)**: Independent after foundational phase, refining presentation from US1.

### Within Each User Story

- Write tests first and confirm failure.
- Implement backend/frontend logic.
- Re-run targeted tests.
- Confirm story acceptance criteria before moving on.

## Parallel Opportunities

- Setup parallel tasks: `T001`, `T002`
- Foundational parallel tasks: `T005`, `T006`
- US1 parallel tests: `T008`, `T009`, `T010`
- US2 parallel tests: `T016`, `T017`, `T018`
- US3 parallel tests: `T022`, `T023`
- Polish parallel tasks: `T027`, `T029`

## Parallel Example: User Story 1

```bash
Task T008: Add failing backend list/detail overdue behavior tests in packages/backend/__tests__/app.test.js
Task T009: Add failing overdue visual indicator tests in packages/frontend/src/components/__tests__/TodoCard.test.js
Task T010: Add failing overdue filtering/render tests in packages/frontend/src/components/__tests__/TodoList.test.js
```

## Parallel Example: User Story 2

```bash
Task T016: Add failing fallback normalization tests in packages/frontend/src/services/__tests__/todoService.test.js
Task T017: Add failing local-midnight refresh scheduling tests in packages/frontend/src/__tests__/App.test.js
Task T018: Add failing backend edge-case tests in packages/backend/__tests__/app.test.js
```

## Parallel Example: User Story 3

```bash
Task T022: Add failing theme legibility assertions in packages/frontend/src/components/__tests__/TodoCard.test.js
Task T023: Add failing responsive overdue layout assertions in packages/frontend/src/components/__tests__/TodoList.test.js
```

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 and Phase 2.
2. Complete Phase 3 (US1).
3. Validate US1 independently against acceptance scenarios.
4. Demo/deploy MVP increment.

### Incremental Delivery

1. Deliver US1 as MVP.
2. Deliver US2 for fallback resiliency and midnight updates.
3. Deliver US3 for full theme/responsive quality.
4. Run Phase 6 cross-cutting validation before final merge.

### Parallel Team Strategy

1. Team completes Setup and Foundational phases together.
2. After Phase 2:
   - Engineer A: US1 backend + card/list UI tasks.
   - Engineer B: US2 service/timer tasks.
   - Engineer C: US3 theme/responsive refinement.
3. Rejoin for Phase 6 regression and documentation updates.
