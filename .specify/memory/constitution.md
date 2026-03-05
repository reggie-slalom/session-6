<!--
Sync Impact Report
- Version change: template-placeholder -> 1.0.0
- Modified principles:
	- Principle 1 placeholder -> I. Simplicity and Single Responsibility
	- Principle 2 placeholder -> II. Consistent, Readable JavaScript Style
	- Principle 3 placeholder -> III. Test-First Quality Gates (NON-NEGOTIABLE)
	- Principle 4 placeholder -> IV. UX Consistency, Accessibility, and Theming
	- Principle 5 placeholder -> V. Monorepo and API Contract Discipline
- Added sections:
	- Implementation Constraints
	- Delivery Workflow and Quality Gates
- Removed sections:
	- Section 2 placeholder
	- Section 3 placeholder
- Templates requiring updates:
	- [updated] .specify/templates/plan-template.md
	- [updated] .specify/templates/spec-template.md
	- [updated] .specify/templates/tasks-template.md
	- [pending] .specify/templates/commands/*.md (directory not present in repository)
- Follow-up TODOs:
	- None
-->

# Session 6 Todo App Constitution

## Core Principles

### I. Simplicity and Single Responsibility
All code changes MUST preserve a simple, understandable design and MUST follow
single-responsibility boundaries for modules, components, and functions.
Developers MUST avoid speculative abstractions and MUST justify added complexity
in the implementation plan when no simpler approach satisfies requirements.

Rationale: The project is a teaching-oriented bootcamp codebase. Readability and
maintainability are more valuable than premature optimization or overengineering.

### II. Consistent, Readable JavaScript Style
Code MUST follow shared style rules across frontend and backend: 2-space
indentation, clear naming, grouped imports, and no trailing whitespace. Public
functions and non-obvious logic MUST include concise documentation where it
improves understanding. Linting and formatting checks MUST pass before merge.

Rationale: Consistent style reduces review friction, decreases bugs from
misunderstood code, and improves onboarding speed for contributors.

### III. Test-First Quality Gates (NON-NEGOTIABLE)
Behavior changes MUST start with tests that fail before implementation, then
pass after the change. Unit and integration tests MUST cover modified flows,
and overall coverage MUST be maintained at 80% or higher across packages unless
an explicit exception is approved and documented in the plan.

Rationale: Test-first delivery and strong coverage are the primary quality
controls for this monorepo and protect both learning outcomes and product
reliability.

### IV. UX Consistency, Accessibility, and Theming
UI work MUST adhere to the documented design system, including spacing, color
tokens, responsive breakpoints, keyboard accessibility, and visible focus
states. Light and dark theme behavior MUST remain functional, and destructive
actions MUST include explicit confirmation.

Rationale: The application is intentionally simple, so consistency and
accessibility quality are core product requirements, not optional polish.

### V. Monorepo and API Contract Discipline
Frontend and backend changes MUST preserve clear boundaries: business logic in
services, UI concerns in components, and HTTP contract behavior validated by
tests. Breaking API or data shape changes MUST include coordinated updates for
both packages in the same feature scope.

Rationale: The repository is a coupled full-stack monorepo. Contract drift is a
high-risk failure mode that must be controlled through structure and testing.

## Implementation Constraints

- Technology baseline MUST remain React frontend plus Node.js/Express backend
	unless a formally approved architecture change is documented.
- Scope MUST remain single-user todo management unless requirements are amended.
- Out-of-scope capabilities (authentication, advanced search/filtering,
	recurring todos, collaboration, and bulk operations) MUST NOT be introduced
	without a constitution amendment or approved feature exception.

## Delivery Workflow and Quality Gates

- Every feature spec MUST define independently testable user stories,
	measurable success criteria, and key edge cases.
- Every implementation plan MUST include a Constitution Check section that
	verifies compliance with all five core principles before implementation.
- Task plans MUST include explicit test tasks for each user story and a final
	verification step for linting, test pass status, and coverage impact.
- Pull requests MUST document behavior changes, test evidence, and any justified
	deviations from this constitution.

## Governance

This constitution supersedes conflicting local practices for this repository.
Amendments require: (1) a documented rationale, (2) updates to affected
templates and guidance files, and (3) review approval from project maintainers.

Versioning policy for this constitution MUST follow semantic versioning:

- MAJOR: Removing or redefining a principle in a backward-incompatible way.
- MINOR: Adding a new principle/section or materially expanding guidance.
- PATCH: Clarifications, wording improvements, or non-semantic refinements.

Compliance review expectations:

- During planning: Constitution Check MUST pass before implementation starts.
- During review: PR reviewers MUST verify tests, style checks, and scope
	alignment with this constitution.
- During maintenance: Supporting templates in `.specify/templates/` MUST stay
	synchronized with the current constitution version.

**Version**: 1.0.0 | **Ratified**: 2026-03-05 | **Last Amended**: 2026-03-05
