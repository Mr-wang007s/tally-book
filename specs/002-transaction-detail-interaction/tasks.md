# Tasks: Transaction Detail and Filter Interactions

**Input**: Design documents from `/specs/002-transaction-detail-interaction/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/types.ts, quickstart.md

**Tests**: Per Constitution Principle III (TDD), all test tasks are included and MUST be completed BEFORE implementation.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4, US5)
- Include exact file paths in descriptions

## Path Conventions

- **Expo Router App**: `app/` (screens with file-based routing), `src/` (source code)
- Main groups: `src/components/`, `src/hooks/`, `src/services/`, `src/types/`, `src/theme/`
- Tests: `__tests__/components/`, `__tests__/hooks/`, `__tests__/screens/`, `__tests__/e2e/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install dependencies and configure Expo project for this feature

- [X] T001 Install @gorhom/bottom-sheet library (`npx expo install @gorhom/bottom-sheet`)
- [X] T002 [P] Install react-native-reanimated v3 (`npx expo install react-native-reanimated`)
- [X] T003 [P] Install expo-image-picker (`npx expo install expo-image-picker`)
- [X] T004 [P] Verify react-native-gesture-handler is installed (dependency of bottom-sheet)
- [X] T005 [P] Verify react-native-safe-area-context is installed
- [X] T006 [P] Verify @expo/vector-icons is installed
- [X] T007 Configure babel.config.js to include react-native-reanimated/plugin as last plugin
- [X] T008 [P] Add GestureHandlerRootView wrapper in App.tsx root component
- [X] T009 [P] Add BottomSheetModalProvider wrapper in App.tsx (inside GestureHandlerRootView)
- [ ] T010 Clear Expo cache and restart dev server (`npx expo start -c`)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core types, services, and utilities that MUST be complete before ANY user story implementation

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T011 Copy TypeScript type definitions from specs/002-transaction-detail-interaction/contracts/types.ts to src/types/transaction.ts
- [x] T012 [P] Create transactionStorage service in src/services/transactionStorage.ts (AsyncStorage CRUD operations)
- [x] T013 [P] Create validation utilities in src/utils/validation.ts (validateTransaction, validateFilterCriteria functions from data-model.md)
- [x] T014 [P] Add transaction-related theme colors to src/theme/colors.ts (FAB: primary/accent, FilterPanel: cardBackground/border)
- [x] T015 [P] Create ConfirmDialog reusable component in src/components/ui/ConfirmDialog.tsx (for delete confirmation)
- [ ] T016 [P] Create mock transaction data generator in src/utils/mockData.ts (for testing, optional)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - View Transaction Details (Priority: P1) 🎯 MVP

**Goal**: 用户可以从主页交易列表点击一笔交易,查看完整的交易详情(金额、日期、类型、账户、描述、附件),并可返回列表或触发删除确认对话框。

**Independent Test**: 打开应用 → 点击任意交易 → 验证详情页显示所有字段(金额、日期、类型、账户、描述、附件) → 点击返回按钮返回列表 → 点击删除按钮显示确认对话框。

### Tests for User Story 1 (TDD - Write FIRST, Verify FAIL)

- [ ] T017 [P] [US1] Write unit tests for useTransactionCRUD hook in __tests__/hooks/useTransactionCRUD.test.tsx (test getTransaction by ID)
- [ ] T018 [P] [US1] Write component tests for TransactionDetailView in __tests__/components/TransactionDetailView.test.tsx (verify all fields render correctly)
- [ ] T019 [US1] Write screen integration test in __tests__/screens/TransactionDetailScreen.test.tsx (navigation, delete button, back button)
- [ ] T020 [US1] Run tests and verify they FAIL (no implementation yet) - document in PR description

### Implementation for User Story 1

- [x] T021 [P] [US1] Create useTransactionCRUD hook in src/hooks/useTransactionCRUD.ts (getTransaction, createTransaction, updateTransaction, deleteTransaction using transactionStorage service)
- [x] T022 [P] [US1] Create TransactionDetailView presentational component in src/components/features/TransactionDetailView.tsx (display amount, date, type, accounts, description, attachments)
- [x] T023 [US1] Create TransactionDetailScreen container in app/transaction/[id].tsx (Expo Router dynamic route, fetch transaction by ID, handle navigation)
- [x] T024 [US1] Add accessibilityLabel to all interactive elements in TransactionDetailView (Edit button: "编辑交易", Delete button: "删除交易", Back button: "返回")
- [x] T025 [US1] Add SafeAreaView to TransactionDetailScreen (use react-native-safe-area-context)
- [x] T026 [US1] Integrate theme colors (useColorScheme hook) for Light/Dark Mode support in TransactionDetailView
- [x] T027 [US1] Add ConfirmDialog integration for delete button (onDelete prop triggers dialog)
- [x] T028 [US1] Handle attachment image display (use Image component with placeholder for loading/error states)
- [x] T029 [US1] Add navigation back to transaction list from detail screen (React Navigation goBack)
- [ ] T030 [US1] Run tests and verify they PASS - achieve ≥90% coverage for this story's code

**Checkpoint**: User Story 1 complete - users can view transaction details independently

---

## Phase 4: User Story 2 - Edit Transaction Information (Priority: P1)

**Goal**: 用户可以在交易详情页点击"Edit"按钮进入编辑模式,修改所有字段(金额、日期、类型、账户、描述、附件),保存后更新持久化数据并返回详情页显示更新内容。

**Independent Test**: 进入交易详情页 → 点击Edit按钮 → 修改金额和描述 → 点击保存 → 验证详情页显示更新后的值 → 重新打开详情页验证数据持久化。

### Tests for User Story 2 (TDD - Write FIRST, Verify FAIL)

- [ ] T031 [P] [US2] Write unit tests for useTransactionCRUD.updateTransaction in __tests__/hooks/useTransactionCRUD.test.tsx (test update operation)
- [ ] T032 [P] [US2] Write component tests for TransactionEditForm in __tests__/components/TransactionEditForm.test.tsx (test form validation, onChange, onSubmit)
- [ ] T033 [US2] Write screen integration test in __tests__/screens/TransactionEditScreen.test.tsx (navigation, save, cancel, validation errors)
- [ ] T034 [US2] Run tests and verify they FAIL - document in PR description

### Implementation for User Story 2

- [x] T035 [P] [US2] Create TransactionEditForm component in src/components/features/TransactionEditForm.tsx (editable fields for amount, date, type, accounts, description, attachments)
- [x] T036 [US2] Create TransactionEditScreen container in app/transaction/edit/[id].tsx (Expo Router dynamic route, load transaction, handle save/cancel)
- [x] T037 [US2] Implement form validation using validateTransaction from src/utils/validation.ts (display error messages for invalid data)
- [x] T038 [US2] Add expo-image-picker integration for attachment editing (add, replace, delete images)
- [x] T039 [US2] Add KeyboardAvoidingView to TransactionEditScreen for iOS keyboard handling (Principle VII)
- [x] T040 [US2] Add SafeAreaView to TransactionEditScreen
- [x] T041 [US2] Implement save logic: call useTransactionCRUD.updateTransaction, show loading state, navigate back on success
- [x] T042 [US2] Implement cancel logic: discard changes, navigate back to detail screen
- [x] T043 [US2] Add accessibilityLabel to form inputs (Amount: "交易金额", Date: "交易日期", Description: "交易描述")
- [x] T044 [US2] Add Dynamic Type support: allowFontScaling={true}, maxFontSizeMultiplier={2} for all text inputs (Principle I)
- [x] T045 [US2] Integrate theme colors for Light/Dark Mode in TransactionEditForm
- [x] T046 [US2] Add Edit button to TransactionDetailView that navigates to edit screen (onEdit prop)
- [ ] T047 [US2] Run tests and verify they PASS - achieve ≥90% coverage for this story's code

**Checkpoint**: User Stories 1 AND 2 complete - users can view AND edit transactions independently

---

## Phase 5: User Story 3 - Filter and Sort Transactions (Priority: P2)

**Goal**: 用户可以在主页点击筛选按钮打开底部抽屉面板,选择类型/排序/分类筛选条件,点击Apply后交易列表根据条件实时更新,支持Reset清除所有条件。

**Independent Test**: 主页 → 点击筛选按钮 → 底部抽屉弹出 → 选择"Expense"类型 → 选择"Highest"排序 → 点击Apply → 验证列表只显示支出交易按金额降序排列 → 点击Reset恢复默认。

### Tests for User Story 3 (TDD - Write FIRST, Verify FAIL)

- [ ] T048 [P] [US3] Write unit tests for useTransactionFilter hook in __tests__/hooks/useTransactionFilter.test.tsx (test type filter, sort, category filter, reset)
- [ ] T049 [P] [US3] Write component tests for FilterBottomSheet in __tests__/components/FilterBottomSheet.test.tsx (test Apply, Reset, dismiss)
- [ ] T050 [US3] Run tests and verify they FAIL - document in PR description

### Implementation for User Story 3

- [x] T051 [P] [US3] Create useTransactionFilter hook in src/hooks/useTransactionFilter.ts (useMemo-cached filtering logic per research.md)
- [x] T052 [P] [US3] Create FilterBottomSheet component in src/components/features/FilterBottomSheet.tsx (type selector, sort selector, category selector, Apply/Reset buttons)
- [x] T053 [US3] Integrate @gorhom/bottom-sheet in FilterBottomSheet (snapPoints: ['50%', '80%'], enablePanDownToClose, backdrop)
- [x] T054 [US3] Add filter button to app/(tabs)/index.tsx home screen (right navigation header, opens FilterBottomSheet)
- [x] T055 [US3] Connect useTransactionFilter to home screen transaction list (apply filtered transactions to FlatList data)
- [x] T056 [US3] Add accessibilityRole="radio" to type/sort selectors, accessibilityRole="button" to Apply/Reset (Principle IV)
- [x] T057 [US3] Add accessibilityLabel to filter options ("收入", "支出", "转账", "最高金额", "最低金额", "最新", "最旧")
- [x] T058 [US3] Add touch target hitSlop to ensure ≥44x44pt for all filter options (Principle IV)
- [x] T059 [US3] Integrate theme colors for FilterBottomSheet background and text (Light/Dark Mode support)
- [x] T060 [US3] Implement Reset functionality: clear all filter criteria, close sheet, update list to show all transactions
- [x] T061 [US3] Implement Apply functionality: save filter criteria to state, close sheet, update list with filtered results
- [ ] T062 [US3] Add "Choose Category" navigation to category selection screen (if not already implemented - mark as optional dependency)
- [ ] T063 [US3] Display selected category count ("0 Selected", "2 Selected") in FilterBottomSheet
- [ ] T064 [US3] Optimize performance: ensure useMemo caching in useTransactionFilter, verify <500ms response time for 10k transactions
- [ ] T065 [US3] Run tests and verify they PASS - achieve ≥90% coverage for this story's code

**Checkpoint**: User Stories 1, 2, AND 3 complete - full CRUD + filtering功能

---

## Phase 6: User Story 4 - Quick Add Transaction via FAB (Priority: P2)

**Goal**: 用户可以在主页点击底部中央紫色圆形FAB按钮,动画展开显示三个快捷按钮(蓝色转账、绿色收入、红色支出),点击任意按钮进入对应的添加交易表单页面。

**Independent Test**: 主页 → 点击FAB → 验证按钮旋转45度变为× → 验证三个子按钮以动画扩散显示 → 点击绿色收入按钮 → 进入收入添加表单 → 验证FAB菜单收起。

### Tests for User Story 4 (TDD - Write FIRST, Verify FAIL)

- [ ] T066 [P] [US4] Write unit tests for useFABAnimation hook in __tests__/hooks/useFABAnimation.test.tsx (test toggle, rotation animation)
- [ ] T067 [P] [US4] Write component tests for FloatingActionButton in __tests__/components/FloatingActionButton.test.tsx (test expand/collapse, sub-button press)
- [ ] T068 [US4] Run tests and verify they FAIL - document in PR description

### Implementation for User Story 4

- [x] T069 [P] [US4] Create useFABAnimation hook in src/hooks/useFABAnimation.ts (Reanimated 3 SharedValue, useAnimatedStyle, withSpring for rotation)
- [x] T070 [P] [US4] Create FloatingActionButton component in src/components/ui/FloatingActionButton.tsx (main button + 3 sub-buttons with Reanimated animations)
- [x] T071 [US4] Implement FAB rotation animation: 0deg → 45deg on expand (Reanimated withSpring, 60fps per Principle V)
- [x] T072 [US4] Implement sub-button expand animation: translate from main button position upward with stagger effect (Reanimated)
- [x] T073 [US4] Add FloatingActionButton to app/(tabs)/index.tsx home screen (position: absolute, bottom with useSafeAreaInsets)
- [x] T074 [US4] Connect sub-buttons to navigation: Income → /expense/create?type=income, Expense → /expense/create?type=expense, Transfer → /expense/create?type=transfer
- [x] T075 [US4] Add accessibilityLabel to main button ("添加交易") and sub-buttons ("添加收入交易", "添加支出交易", "添加转账交易") (Principle IV)
- [x] T076 [US4] Ensure FAB touch target ≥56x56pt (main), sub-buttons ≥48x48pt with hitSlop (Principle IV)
- [x] T077 [US4] Integrate theme colors: main button = primary (purple), income = green accent, expense = red accent, transfer = blue accent
- [x] T078 [US4] Handle FAB dismiss: click main button when expanded, or tap outside overlay (add backdrop pressable)
- [x] T079 [US4] Optimize animation performance: verify 60fps with Expo Performance Monitor (Principle V)
- [ ] T080 [US4] Run tests and verify they PASS - achieve ≥90% coverage for this story's code

**Checkpoint**: User Stories 1-4 complete - full CRUD + filtering + quick add

---

## Phase 7: User Story 5 - Delete Transaction (Priority: P3)

**Goal**: 用户可以在交易详情页点击右上角垃圾桶图标,显示确认删除对话框,点击确认后永久删除交易并返回列表,统计数据相应更新。

**Independent Test**: 进入交易详情页 → 点击删除按钮 → 验证确认对话框显示 → 点击确认 → 验证返回列表页 → 验证交易不再显示 → 验证账户余额更新(如有统计模块)。

### Tests for User Story 5 (TDD - Write FIRST, Verify FAIL)

- [x] T081 [P] [US5] Write unit tests for useTransactionCRUD.deleteTransaction in __tests__/hooks/useTransactionCRUD.test.tsx (test delete operation)
- [x] T082 [P] [US5] Write component tests for ConfirmDialog in __tests__/components/ConfirmDialog.test.tsx (test confirm/cancel callbacks)
- [x] T083 [US5] Write screen test for delete flow in __tests__/screens/TransactionDetailScreen.test.tsx (delete button → dialog → confirm → navigate back)
- [ ] T084 [US5] Run tests and verify they FAIL - document in PR description

### Implementation for User Story 5

- [x] T085 [US5] Ensure ConfirmDialog component supports customizable title, message, confirm/cancel button text (already created in T015, enhance if needed)
- [x] T086 [US5] Add delete button to TransactionDetailScreen header (right navigation header, trash icon from @expo/vector-icons)
- [x] T087 [US5] Implement delete button press: show ConfirmDialog with message "确定要删除这笔交易吗?" (integrate with US1 TransactionDetailScreen)
- [x] T088 [US5] Implement confirm callback: call useTransactionCRUD.deleteTransaction, show loading indicator, navigate back to transaction list on success
- [x] T089 [US5] Implement cancel callback: close ConfirmDialog, stay on detail screen
- [x] T090 [US5] Update transaction list in home screen to re-fetch/refresh after navigation back from detail (React Navigation focus listener or global state update)
- [x] T091 [US5] Add accessibilityLabel to delete button ("删除交易"), ConfirmDialog confirm button ("确认删除"), cancel button ("取消") (Principle IV)
- [x] T092 [US5] Add error handling: if delete fails, show error toast/alert, do not navigate away
- [x] T093 [US5] Integrate theme colors for ConfirmDialog in Light/Dark Mode
- [ ] T094 [US5] Run tests and verify they PASS - achieve ≥90% coverage for this story's code

**Checkpoint**: All 5 user stories complete - full feature implementation done

---

## Phase 8: E2E Tests & Polish

**Purpose**: End-to-end testing and Constitution compliance verification

### E2E Tests (Detox - Optional but Recommended)

- [ ] T095 [P] Setup Detox configuration for iOS simulator (detox init -r jest)
- [ ] T096 [P] Write E2E test in __tests__/e2e/transactionDetailFlow.e2e.ts (full flow: view → edit → save → filter → delete)
- [ ] T097 Build iOS app for Detox (`npx detox build --configuration ios.sim.debug`)
- [ ] T098 Run E2E tests (`npx detox test --configuration ios.sim.debug`)

### Constitution Compliance Verification

- [ ] T099 [P] Run ESLint + TypeScript full project scan: `npm run lint && npx tsc --noEmit` - resolve all errors/warnings (Principle II)
- [ ] T100 [P] Run Jest coverage report: `npm test -- --coverage` - verify ≥90% coverage (Principle III)
- [ ] T101 [P] Accessibility audit: verify all interactive elements have accessibilityLabel using React Native Testing Library queries (Principle IV)
- [ ] T102 [P] Test all screens in Light + Dark Mode: take screenshots, verify color contrast ≥4.5:1 (Principle VI)
- [ ] T103 Performance profiling: use Expo Performance Monitor, verify all animations at 60fps (Principle V)
- [ ] T104 [P] VoiceOver testing on iOS simulator: navigate all P1 flows (view detail, edit, save) with screen reader (Principle IV)
- [ ] T105 [P] Font scaling testing: test all screens at 100%, 200%, 310% text size (Settings → Accessibility → Larger Text) (Principle I)
- [ ] T106 [P] SafeArea testing: run app on iPhone SE, iPhone 14 Pro (notch), iPhone 15 Pro Max (Dynamic Island) - verify no content clipping (Principle VII)
- [ ] T107 [P] Test KeyboardAvoidingView on edit screen: verify keyboard doesn't obscure input fields (Principle VII)
- [ ] T108 [P] Build production bundle: `eas build --platform ios` - verify size <30MB (Principle V)
- [ ] T109 [P] Test filter performance with 10,000 mock transactions: verify response time <500ms (research.md performance benchmark)
- [ ] T110 [P] Test FAB animation performance: verify smooth 60fps expansion/collapse with Performance Monitor (Principle V)

### Code Quality & Documentation

- [ ] T111 [P] Code cleanup: remove console.logs, unused imports, commented code
- [ ] T112 [P] Refactoring: ensure all components follow container/presentational separation (Principle II)
- [ ] T113 [P] Verify all async operations have proper error handling and loading states
- [ ] T114 [P] Update CODEBUDDY.md if any new technologies/patterns were added (already done by Phase 1, verify)
- [ ] T115 [P] Verify quickstart.md instructions work: fresh clone → setup → run → test (manual validation)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup (Phase 1) - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational (Phase 2) - MVP
- **User Story 2 (Phase 4)**: Depends on Foundational (Phase 2) - integrates with US1 but independently testable
- **User Story 3 (Phase 5)**: Depends on Foundational (Phase 2) - independent of US1/US2
- **User Story 4 (Phase 6)**: Depends on Foundational (Phase 2) - independent of US1/US2/US3
- **User Story 5 (Phase 7)**: Depends on Foundational (Phase 2) AND User Story 1 (uses TransactionDetailScreen) - can implement earlier if US1 complete
- **E2E & Polish (Phase 8)**: Depends on all desired user stories being complete

### User Story Dependencies

- **US1 (View Details)**: No dependencies on other stories - can start after Foundational
- **US2 (Edit)**: Depends on US1 (adds Edit button to detail screen) - can parallelize implementation but integrates at end
- **US3 (Filter)**: Independent - can parallelize with US1/US2
- **US4 (FAB Quick Add)**: Independent - can parallelize with US1/US2/US3
- **US5 (Delete)**: Depends on US1 (uses detail screen) - can parallelize implementation but integrates at end

### Within Each User Story (TDD Workflow)

1. Write all tests for the story - marked [P] can run in parallel
2. Verify tests FAIL (no implementation yet)
3. Implement types/services - marked [P] can run in parallel
4. Implement hooks - depends on types/services
5. Implement components - marked [P] can run in parallel after hooks
6. Implement screens - depends on components
7. Add HIG compliance (accessibility, theme, SafeArea) - marked [P] can run in parallel
8. Verify tests PASS
9. Integration with other stories (if needed)

### Parallel Opportunities

**Phase 1 (Setup)**: T001-T006 can run in parallel, T007-T010 sequential  
**Phase 2 (Foundational)**: T011-T016 all marked [P] can run in parallel  
**Phase 3 (US1) Tests**: T017-T018 can run in parallel  
**Phase 3 (US1) Implementation**: T021-T022 can run in parallel  
**Phase 4 (US2) Tests**: T031-T032 can run in parallel  
**Phase 4 (US2) Implementation**: T035-T036 can run in parallel initially  
**Phase 5 (US3) Tests**: T048-T049 can run in parallel  
**Phase 5 (US3) Implementation**: T051-T052 can run in parallel  
**Phase 6 (US4) Tests**: T066-T067 can run in parallel  
**Phase 6 (US4) Implementation**: T069-T070 can run in parallel  
**Phase 7 (US5) Tests**: T081-T082 can run in parallel  
**Phase 8 (E2E & Polish)**: T095-T096, T099-T115 most can run in parallel

**Cross-Story Parallelism**:
- Once Foundational (Phase 2) completes, US1, US3, US4 can start in parallel (different files, independent)
- US2 and US5 should wait for US1 to complete integration points (detail screen)
- With 3 developers: Dev A → US1+US2, Dev B → US3, Dev C → US4, then all converge for US5

---

## Parallel Example: User Story 1

```bash
# Test Phase (TDD - write first, verify fail):
Parallel Task 1: "Write useTransactionCRUD tests in __tests__/hooks/useTransactionCRUD.test.tsx"
Parallel Task 2: "Write TransactionDetailView tests in __tests__/components/TransactionDetailView.test.tsx"
Sequential Task: "Run all tests, verify they FAIL"

# Implementation Phase:
Parallel Task 1: "Create useTransactionCRUD hook in src/hooks/useTransactionCRUD.ts"
Parallel Task 2: "Create TransactionDetailView component in src/components/features/TransactionDetailView.tsx"
Sequential Task: "Create TransactionDetailScreen in app/transaction/[id].tsx" (needs hook + component)

# HIG Compliance Phase:
Parallel Task 1: "Add accessibilityLabel to all elements"
Parallel Task 2: "Add SafeAreaView"
Parallel Task 3: "Integrate theme colors"
Sequential Task: "Run tests, verify PASS, check coverage ≥90%"
```

---

## Implementation Strategy

### MVP First (User Story 1 + 2 Only)

1. Complete Phase 1: Setup → Install dependencies
2. Complete Phase 2: Foundational → Types, storage service, validation
3. Complete Phase 3: User Story 1 → View transaction details
4. Complete Phase 4: User Story 2 → Edit transaction
5. **STOP and VALIDATE**: Test US1+US2 independently, verify TDD coverage ≥90%
6. Deploy/demo if ready

### Incremental Delivery

1. Foundation (Phase 1+2) → Development environment ready
2. MVP (US1+US2) → Test independently → Deploy/Demo ✅
3. +US3 (Filter) → Test independently → Deploy/Demo ✅
4. +US4 (FAB Quick Add) → Test independently → Deploy/Demo ✅
5. +US5 (Delete) → Test independently → Deploy/Demo ✅
6. Polish (Phase 8) → Final quality check → Production release

### Parallel Team Strategy (3 Developers)

1. **All devs**: Complete Setup + Foundational together (Phase 1+2)
2. **Once Foundational done**:
   - **Developer A**: User Story 1 (T017-T030) → User Story 2 (T031-T047)
   - **Developer B**: User Story 3 (T048-T065)
   - **Developer C**: User Story 4 (T066-T080)
3. **Convergence**: Developer A completes US1 → All devs can integrate
4. **Developer A or B**: User Story 5 (T081-T094) after US1 complete
5. **All devs**: E2E & Polish (Phase 8)

---

## Task Count Summary

- **Setup**: 10 tasks
- **Foundational**: 6 tasks (BLOCKING)
- **User Story 1**: 14 tasks (3 tests + 11 implementation)
- **User Story 2**: 17 tasks (4 tests + 13 implementation)
- **User Story 3**: 18 tasks (3 tests + 15 implementation)
- **User Story 4**: 15 tasks (3 tests + 12 implementation)
- **User Story 5**: 14 tasks (4 tests + 10 implementation)
- **E2E & Polish**: 21 tasks (4 E2E + 17 compliance/quality)
- **TOTAL**: 115 tasks

**Parallel Opportunities**: 42 tasks marked [P] across all phases

**Suggested MVP Scope**: Phase 1 + Phase 2 + Phase 3 (US1) + Phase 4 (US2) = 47 tasks → Deliverable: View + Edit transactions

**Independent Test Criteria Met**: Each user story has clear "Independent Test" verification steps that can be executed without other stories being complete.

---

## Format Validation

✅ **All tasks follow checklist format**: `- [ ] [TaskID] [P?] [Story?] Description with file path`  
✅ **Task IDs**: Sequential T001-T115  
✅ **[P] markers**: 42 tasks marked as parallelizable  
✅ **[Story] labels**: All user story tasks labeled (US1-US5)  
✅ **File paths**: Included in all implementation tasks  
✅ **TDD compliance**: Test tasks precede implementation, verify FAIL before implementation per Constitution Principle III

---

## Notes

- [P] tasks = different files, no dependencies - can run in parallel
- [Story] label maps task to specific user story for traceability and independent testing
- Each user story is independently completable and testable (per spec.md "Independent Test" criteria)
- Tests MUST be written first and verified to FAIL before implementation (TDD - Constitution Principle III)
- Commit after each task or logical group for better Git history
- Stop at any checkpoint to validate story independently before proceeding
- Avoid vague tasks, same-file conflicts, or cross-story dependencies that break independence
- All tasks comply with Tally Book Constitution v2.0.0 (HIG, Code Quality, TDD, Accessibility, Performance, Dark Mode, Safe Areas)
