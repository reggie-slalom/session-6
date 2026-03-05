# Feature Specification: Support for Overdue Todo Items

**Feature Branch**: `001-overdue-todo-items`  
**Created**: 2026-03-05  
**Status**: Draft  
**Input**: User description: "Support for Overdue Todo Items"

## Clarifications

### Session 2026-03-05

- Q: Which timezone basis should define "current date" for overdue status? → A: User/device local calendar date.
- Q: When should overdue status be recalculated as time passes? → A: Recompute on render and trigger an automatic update at local midnight.
- Q: Where should overdue status be computed? → A: Compute in backend and return explicit `isOverdue` field.
- Q: How should frontend behave if `isOverdue` is missing or invalid? → A: Fallback to local date-based computation.
- Q: Which read responses should include `isOverdue`? → A: Include only on todo list responses.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Quickly spot overdue tasks (Priority: P1)

As a user viewing my todo list, I can immediately recognize tasks that are overdue through clear visual treatment so I can prioritize urgent work first.

**Why this priority**: This is the core value of the feature and directly addresses the stated user problem.

**Independent Test**: Can be fully tested by loading a list with past-due and non-past-due incomplete todos and verifying that only past-due incomplete items are visually marked as overdue.

**Acceptance Scenarios**:

1. **Given** an incomplete todo with a due date before today, **When** the list is displayed, **Then** that todo is shown with the overdue visual indicator.
2. **Given** an incomplete todo due today or in the future, **When** the list is displayed, **Then** that todo is not shown as overdue.
3. **Given** a completed todo with a due date in the past, **When** the list is displayed, **Then** that todo is not shown as overdue.

---

### User Story 2 - Distinguish urgency with confidence (Priority: P2)

As a user scanning my list, I can tell overdue todos apart from normal todos without opening details, reducing mental effort and date checking.

**Why this priority**: Builds on the core indicator by ensuring users can reliably differentiate overdue state during normal list scanning.

**Independent Test**: Can be tested by displaying mixed todo states and verifying users can identify overdue tasks from the list view alone.

**Acceptance Scenarios**:

1. **Given** a list containing overdue and non-overdue incomplete todos, **When** the user scans the list, **Then** overdue items are visibly distinct from other items.
2. **Given** a user returns to the list on a later day, **When** an item has crossed from not overdue to overdue, **Then** the overdue indicator is shown without requiring manual edits.

---

### User Story 3 - Keep overdue cues usable across themes and devices (Priority: P3)

As a user on different themes and screen sizes, I can still identify overdue tasks clearly so the feature remains useful in all supported viewing contexts.

**Why this priority**: The app supports theming and responsive usage; overdue visibility must remain consistent for all users.

**Independent Test**: Can be tested by checking overdue and non-overdue todos in both themes and at mobile and desktop viewport sizes.

**Acceptance Scenarios**:

1. **Given** overdue items are present, **When** the user switches between supported themes, **Then** overdue items remain clearly distinguishable in each theme.
2. **Given** overdue items are present, **When** the user views the list on small and large screens, **Then** overdue items remain clearly distinguishable without broken layout.

### Edge Cases

- Incomplete todos with no due date are never marked as overdue.
- A due date equal to the current date is treated as not overdue.
- Completed todos are never marked as overdue even if their due date is in the past.
- Overdue status updates correctly when the current date changes (for example, the next calendar day).
- Invalid or missing due date values do not break list rendering and are treated as not overdue.
- Missing or invalid `isOverdue` values do not break list rendering; frontend falls back to local overdue computation.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST determine overdue status in the backend by comparing each todo due date to the user's local current calendar date.
- **FR-002**: System MUST mark a todo as overdue only when it is incomplete and its due date is earlier than the user's local current calendar date.
- **FR-003**: System MUST present a clear visual overdue indicator directly in the todo list for overdue todos.
- **FR-004**: System MUST ensure non-overdue todos are visually distinguishable from overdue todos.
- **FR-005**: System MUST ensure completed todos are not shown with the overdue indicator.
- **FR-006**: System MUST ensure todos without a valid due date are not shown as overdue.
- **FR-007**: System MUST keep overdue indicators legible and distinguishable across supported themes and viewport sizes.
- **FR-008**: System MUST update overdue status whenever the todo list is refreshed, loaded, or re-rendered.
- **FR-009**: System MUST automatically re-evaluate overdue status at local midnight without requiring manual user action.
- **FR-010**: System MUST include an explicit boolean `isOverdue` field for each todo returned by todo list read responses.
- **FR-011**: System MUST fall back to frontend local-date overdue computation when backend `isOverdue` is missing or invalid.

### Key Entities *(include if feature involves data)*

- **Todo Item**: A user task with attributes including title, completion status, and optional due date.
- **Overdue Status (`isOverdue`)**: A backend-derived boolean indicating whether a todo item is incomplete and has a due date earlier than the user's local current calendar date.

### Assumptions & Dependencies

- The existing todo model already includes completion status and due date data.
- Date comparisons for overdue determination use the user/device local calendar date.
- Backend todo responses can be extended with additive fields without breaking existing clients.
- Detail-read responses do not need to include `isOverdue` for this feature.
- This feature applies to single-user todo management and does not add new permission models.

## Constitution Alignment *(mandatory)*

- **Simplicity and SRP**: Overdue behavior remains scoped to status derivation and list presentation without expanding into unrelated workflow features.
- **Code Style Consistency**: Existing naming, formatting, and repository linting conventions are maintained for any affected modules and tests.
- **Test-First Quality Gates**: Tests will be written first for overdue determination rules and list rendering behavior before implementation changes.
- **UX Accessibility and Theming**: Overdue indicators will remain clear in supported themes, maintain readable contrast, and preserve current keyboard and focus behavior.
- **API Contract Discipline**: Feature adds a non-breaking `isOverdue` field on todo list responses while preserving existing request/response compatibility.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In validation tests with mixed todo states, 100% of incomplete past-due todos are displayed as overdue.
- **SC-002**: In validation tests with mixed todo states, 0% of completed todos or non-past-due incomplete todos are incorrectly displayed as overdue.
- **SC-003**: In usability checks, at least 90% of users correctly identify overdue items in a sample list within 10 seconds.
- **SC-004**: In theme and responsive checks, overdue indicators remain clearly distinguishable in all supported themes and at both mobile and desktop viewport sizes.
