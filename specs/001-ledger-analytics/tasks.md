# Task Breakdown for Ledger Analytics

This document breaks down the work required for the Ledger Analytics feature, in alignment with the updated constitution principles.

## Task Categories

- **Core-Dev**: Core feature development tasks.
- **UI/UX**: Visual and interaction tasks leveraging the shared design system.
- **Quality**: Linting, typing, code reviews, API docs, and refactoring for clarity.
- **Testing**: Unit, integration, and E2E tests; CI integration; coverage threshold enforcement.
- **Performance**: Budgets, SLO validation, profiling, and regression prevention.
- **Docs**: Documentation-related tasks.

---

## Phase 1 — Setup (Project Initialization)

- [X] T001 Initialize Expo RN project with web support (create app structure) at project root
- [X] T002 Configure TypeScript, ESLint, Prettier per constitution in `package.json` and `.eslintrc.*`
- [X] T003 Create base folders: `app/`, `src/models/`, `src/services/`, `src/storage/`, `src/theme/`, `src/components/`
- [X] T004 Seed design tokens file `src/theme/tokens.ts` (spacing, colors, typography) aligned to iOS visual language
- [X] T005 Create navigation structure `app/_layout.tsx` and tabs scaffolding `app/(tabs)/index.tsx`
- [X] T006 Add accessibility helpers `src/components/A11y.ts`
- [X] T007 Add storage adapter interface `src/storage/storage.ts`
- [X] T008 Add constants for SLOs `src/constants/perf.ts`
- [X] T009 Docs: update quickstart with run commands `specs/001-ledger-analytics/quickstart.md`

## Phase 2 — Foundational (Blocking Prerequisites)

- [X] T010 Implement data entities in code `src/models/transaction.ts`, `src/models/category.ts`
- [X] T011 Implement local persistence (e.g., async storage adapter) `src/storage/localAdapter.ts`
- [X] T012 Implement aggregates service `src/services/aggregates.ts` (summaries, trends calculations)
- [X] T013 Implement validation utilities `src/services/validation.ts`
- [X] T014 Base UI components `src/components/FormField.tsx`, `src/components/ChartContainer.tsx`
- [X] T015 Seed default categories `src/storage/seeds/categories.json`

---

## Phase 3 — User Story US1 (P1): Record Transactions

Story goal: As a user, I can add income/expense with amount, date, category, note, payment method.

Independent test criteria:
- Creating a valid transaction updates the list immediately.
- Invalid amount/date/category is rejected with actionable error.

Implementation tasks:
- [X] T016 [US1] Screen: Add Transaction `app/transactions/add.tsx`
- [X] T017 [P] [US1] Component: Amount/Type/Date inputs `src/components/TransactionForm.tsx`
- [X] T018 [US1] Wire persistence: create transaction `src/services/transactions.ts`
- [X] T019 [US1] Transaction list (by date, latest first) `app/transactions/index.tsx`
- [X] T020 [P] [US1] Period filter (month/week/custom) `src/components/PeriodFilter.tsx`
- [X] T021 [US1] Validation rules hook `src/services/validation.ts` (extend for form)
- [X] T022 [US1] Empty states & errors copy `src/components/EmptyStates.tsx`

---

## Phase 4 — User Story US2 (P1): View Summaries

Story goal: As a user, I can view total income, expense, and balance for a selected period.

Independent test criteria:
- Summary totals equal the sum of matching transactions in the period.
- Changing period updates totals instantly.

Implementation tasks:
- [X] T023 [US2] Summary screen `app/summary/index.tsx`
- [X] T024 [P] [US2] Aggregates service: totals by period `src/services/aggregates.ts`
- [X] T025 [US2] Summary widgets `src/components/SummaryCards.tsx`
- [X] T026 [US2] Period selector integration `src/components/PeriodFilter.tsx`

---

## Phase 5 — User Story US3 (P2): Spending Trends

Story goal: As a user, I can see expense trends over time and by category with selectable ranges.

Independent test criteria:
- Switching granularity (day/week/month) updates chart under 1s for ≤5k txns.
- Category breakdown equals sum of category totals for the selected period.

Implementation tasks:
- [X] T027 [US3] Trends screen `app/trends/index.tsx`
- [X] T028 [P] [US3] Time‑series calculation `src/services/aggregates.ts` (granularity)
- [X] T029 [US3] Category distribution calculation `src/services/aggregates.ts`
- [X] T030 [P] [US3] Chart renderers `src/components/charts/TimeSeries.tsx`, `src/components/charts/CategoryPie.tsx`
- [X] T031 [US3] Range/Granularity controls `src/components/TrendControls.tsx`

---

## Phase 6 — User Story US4 (P2): Edit/Delete Transactions

Story goal: As a user, I can edit or delete a transaction and see updates reflected immediately in lists and aggregates.

Independent test criteria:
- Editing type/amount/category/date updates affected aggregates.
- Deleting the last transaction in a period shows an informative empty state.

Implementation tasks:
- [X] T032 [US4] Edit flow `app/transactions/[id]/edit.tsx`
- [X] T033 [P] [US4] Update & delete in service `src/services/transactions.ts`
- [X] T034 [US4] Confirm dialogs & undo affordance `src/components/Confirm.tsx`

---

## Final Phase — Polish & Cross‑Cutting

- [X] T035 Accessibility pass (labels, focus, contrast) across screens `app/**/*`
- [X] T036 Performance validation per SLOs (measure, profile, optimize) `src/services/metrics.ts`
- [X] T037 Visual QA against iOS reference (spacing/hierarchy/states) `app/**/*`
- [X] T038 Docs: update `specs/001-ledger-analytics/quickstart.md` with latest flows
- [X] T039 Quality: add README sections for terminology and UX patterns `README.md`

---

## Dependencies (Story Order)
1) US1 Record Transactions → 2) US2 View Summaries → 3) US3 Spending Trends → 4) US4 Edit/Delete

## Parallel Execution Examples
- In US1: T017 (form component) and T020 (period filter) in parallel
- In US3: T028 (time‑series calc) and T030 (chart renderers) in parallel
- In US4: T033 (service) can proceed while T032 (screen shell) is scaffolded

## Implementation Strategy
- MVP: Deliver US1 (Record Transactions) end‑to‑end first
- Iteratively add US2 (Summaries) and US3 (Trends), then US4 (Edit/Delete)
- Keep feature flags or incremental navigation entries to ship value early
