---

description: "Task list template for feature implementation"
---

# Tasks: [FEATURE NAME]

**Input**: Design documents from `/specs/[###-feature-name]/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: The examples below include test tasks. Tests are OPTIONAL - only include them if explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Expo/React Native App**: `src/` (source), `__tests__/` (tests) at repository root
- Main groups: `components/`, `screens/`, `hooks/`, `services/`, `navigation/`, `theme/`
- Tests: `__tests__/components/`, `__tests__/hooks/`, `__tests__/screens/`, `__tests__/e2e/`
- Paths shown below assume Expo structure - adjust based on plan.md if using Expo Router (`app/` directory)

<!-- 
  ============================================================================
  IMPORTANT: The tasks below are SAMPLE TASKS for illustration purposes only.
  
  The /speckit.tasks command MUST replace these with actual tasks based on:
  - User stories from spec.md (with their priorities P1, P2, P3...)
  - Feature requirements from plan.md
  - Entities from data-model.md
  - Endpoints from contracts/
  
  Tasks MUST be organized by user story so each story can be:
  - Implemented independently
  - Tested independently
  - Delivered as an MVP increment
  
  DO NOT keep these sample tasks in the generated tasks.md file.
  ============================================================================
-->

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Expo project initialization and tooling setup

- [ ] T001 Initialize Expo project with TypeScript template (`npx create-expo-app --template expo-template-blank-typescript`)
- [ ] T002 Install core dependencies (React Navigation, Reanimated, Safe Area Context)
- [ ] T003 [P] Setup ESLint with `@expo/eslint-config` and TypeScript rules
- [ ] T004 [P] Configure TypeScript with `strict: true` in tsconfig.json
- [ ] T005 [P] Setup Jest and @testing-library/react-native
- [ ] T006 Create theme system with light/dark color variants (Constitution Principle VI)
- [ ] T007 [P] Configure app.json for iOS/Android settings and splash screen
- [ ] T008 Setup folder structure (src/, components/, screens/, hooks/, services/)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core React Native infrastructure that MUST be complete before ANY user story implementation

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

Examples of foundational tasks for Expo/React Native (adjust based on your project):

- [ ] T009 Setup React Navigation stack and configure screen options (Principle VII)
- [ ] T010 [P] Create base theme provider with `useColorScheme` hook (Principle VI)
- [ ] T011 [P] Create reusable UI components library (Button, Card, Input with accessibility)
- [ ] T012 Setup API service layer with axios/fetch and timeout handling (Principle V)
- [ ] T013 Configure SafeAreaProvider and create SafeArea wrapper components (Principle VII)
- [ ] T014 [P] Create custom hooks for common logic (useTheme, useApi, etc.)
- [ ] T015 Setup error handling patterns (error boundaries, toast notifications)
- [ ] T016 [P] Create accessibility helper utilities (for consistent `accessibilityLabel` patterns)
- [ ] T017 Setup performance monitoring (Expo performance monitor, Sentry if needed)
- [ ] T018 Configure storage layer (AsyncStorage, expo-secure-store, or SQLite)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - [Title] (Priority: P1) 🎯 MVP

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Tests for User Story 1 (OPTIONAL - only if tests requested) ⚠️

> **NOTE: Write these tests FIRST per Constitution Principle III (TDD), ensure they FAIL before implementation**

- [ ] T019 [P] [US1] Unit tests for custom hooks in __tests__/hooks/use[HookName].test.ts (target ≥90% coverage)
- [ ] T020 [P] [US1] Component tests for [Component] in __tests__/components/[Component].test.tsx
- [ ] T021 [US1] Screen integration test in __tests__/screens/[Screen].test.tsx (React Native Testing Library)

### Implementation for User Story 1

- [ ] T022 [P] [US1] Create TypeScript types in src/types/[entity].ts
- [ ] T023 [P] [US1] Create data service in src/services/[Service].ts (API calls, data fetching)
- [ ] T024 [US1] Create custom hook in src/hooks/use[Feature].ts (business logic, testable)
- [ ] T025 [US1] Create presentational components in src/components/features/[Feature]/
- [ ] T026 [US1] Create screen component in src/screens/[Screen].tsx (container)
- [ ] T027 [US1] Add accessibility props (`accessibilityLabel`, `accessibilityRole`) to all interactive elements (Principle IV)
- [ ] T028 [US1] Implement theme integration (`useColorScheme`, semantic colors) (Principle VI)
- [ ] T029 [US1] Add SafeAreaView or useSafeAreaInsets (Principle VII)
- [ ] T030 [US1] Optimize performance (use React.memo, useMemo, useCallback where needed) (Principle V)
- [ ] T031 [US1] Add error handling and loading states

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - [Title] (Priority: P2)

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Tests for User Story 2 (OPTIONAL - only if tests requested) ⚠️

- [ ] T032 [P] [US2] Unit tests for custom hooks in __tests__/hooks/use[HookName].test.ts
- [ ] T033 [P] [US2] Component tests in __tests__/components/[Component].test.tsx
- [ ] T034 [US2] Screen test in __tests__/screens/[Screen].test.tsx

### Implementation for User Story 2

- [ ] T035 [P] [US2] Create types in src/types/[entity].ts
- [ ] T036 [US2] Create service in src/services/[Service].ts
- [ ] T037 [US2] Create custom hook in src/hooks/use[Feature].ts
- [ ] T038 [US2] Create components in src/components/features/[Feature]/
- [ ] T039 [US2] Create screen in src/screens/[Screen].tsx
- [ ] T040 [US2] Add accessibility support (`accessibilityLabel`, touch targets ≥44pt, font scaling)
- [ ] T041 [US2] Verify HIG compliance (icons, theme integration, SafeAreaView)
- [ ] T042 [US2] Integrate with User Story 1 components (if needed)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - [Title] (Priority: P3)

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Tests for User Story 3 (OPTIONAL - only if tests requested) ⚠️

- [ ] T043 [P] [US3] Unit tests for hooks in __tests__/hooks/use[HookName].test.ts
- [ ] T044 [P] [US3] Component tests in __tests__/components/[Component].test.tsx
- [ ] T045 [US3] Screen test in __tests__/screens/[Screen].test.tsx

### Implementation for User Story 3

- [ ] T046 [P] [US3] Create types in src/types/[entity].ts
- [ ] T047 [US3] Create service in src/services/[Service].ts
- [ ] T048 [US3] Create hook in src/hooks/use[Feature].ts
- [ ] T049 [US3] Create components in src/components/features/[Feature]/
- [ ] T050 [US3] Create screen in src/screens/[Screen].tsx
- [ ] T051 [US3] Implement HIG compliance (icons, theme, font scaling, SafeAreaView)
- [ ] T052 [US3] Verify accessibility (labels, roles, touch targets, color contrast)

**Checkpoint**: All user stories should now be independently functional

---

[Add more user story phases as needed, following the same pattern]

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Quality improvements and Constitution compliance verification

- [ ] TXXX [P] Run accessibility audit with React Native Testing Library queries (Principle IV)
- [ ] TXXX [P] Verify all screens in Light + Dark Mode (Principle VI)
- [ ] TXXX Performance profiling with Expo Performance Monitor: verify 60fps (Principle V)
- [ ] TXXX [P] ESLint + TypeScript full project scan - resolve all errors/warnings (Principle II)
- [ ] TXXX Verify test coverage ≥90% with Jest coverage report (Principle III)
- [ ] TXXX [P] Test on physical devices: iPhone SE, iPhone Pro Max, various Androids
- [ ] TXXX [P] Screen reader testing (VoiceOver on iOS, TalkBack on Android) for P1 flows (Principle IV)
- [ ] TXXX Font scaling testing (100% to 310%) on all screens (Principle I)
- [ ] TXXX [P] Build production bundle and verify size <30MB (Principle V)
- [ ] TXXX [P] Test SafeAreaView on devices with notch/Dynamic Island (Principle VII)
- [ ] TXXX [P] Verify KeyboardAvoidingView works on all forms (Principle VII)
- [ ] TXXX [P] Documentation updates in README or docs/
- [ ] TXXX Code cleanup and refactoring (maintain component/hook separation)
- [ ] TXXX Security review (secure storage for sensitive data, API key protection)
- [ ] TXXX Setup EAS Build configuration for iOS and Android
- [ ] TXXX Run quickstart.md validation (if applicable)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable

### Within Each User Story

- Tests (if included) MUST be written and FAIL before implementation
- Models before services
- Services before endpoints
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Models within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together (if tests requested - per TDD Principle III):
Task: "Unit tests for custom hook in __tests__/hooks/use[Feature].test.ts"
Task: "Component tests in __tests__/components/[Component].test.tsx"
Task: "Screen test in __tests__/screens/[Screen].test.tsx"

# Launch all foundational pieces together:
Task: "Create types in src/types/[entity].ts"
Task: "Create service in src/services/[Service].ts"

# Launch all component work together:
Task: "Create hook in src/hooks/use[Feature].ts"
Task: "Create components in src/components/features/[Feature]/"

# Launch all HIG compliance tasks together:
Task: "Add accessibilityLabel to all interactive elements"
Task: "Implement theme integration with useColorScheme"
Task: "Add SafeAreaView or useSafeAreaInsets"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
