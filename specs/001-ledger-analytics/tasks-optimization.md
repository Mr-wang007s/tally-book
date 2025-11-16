# Implementation Tasks: Ledger Analytics Optimization & Internationalization

**Feature**: 001-ledger-analytics  
**Version**: 2.0 (Optimization Update)  
**Generated**: 2025-11-16  
**Scope**: Component restructuring, i18n integration, post-add navigation, form UX improvements

---

## Overview

This tasks document breaks down the optimization work into executable phases and tasks. All tasks follow the strict checklist format with IDs, dependency tracking, and file paths.

### Scope: 4 Primary Objectives

1. **Component Restructuring** (Feat 1.0): Reorganize from flat to feature-based folder structure
2. **Internationalization** (Feat 2.0): Implement i18n with Chinese (zh-CN) + English (en)
3. **Navigation Improvements** (Feat 3.0): Fix post-add flow with scroll-to-item + haptic feedback
4. **Form Consistency** (Feat 4.0): Unified FormField wrapper + standardized validation feedback

### Total Task Count: ~85 tasks organized in 5 phases

---

## Phase 1: Foundation & Setup (Blocking Prerequisites)

**Goal**: Set up infrastructure and dependencies needed for all features

**Must Complete Before**: Phase 2

### P1.1 Dependencies & Configuration

- [ ] T001 Install i18n dependencies (i18next, react-i18next, react-native-localize) in package.json
- [ ] T002 Create i18n configuration file at `/src/i18n/config.ts` with system locale detection
- [ ] T003 Create i18n TypeScript hook wrapper at `/src/i18n/useTranslation.ts` with type safety
- [ ] T004 Create translation type definitions at `/src/i18n/types.ts` (Translations interface)
- [ ] T005 Create i18n configuration provider wrapper in App.tsx or root layout

### P1.2 Project Structure Setup

- [ ] T006 Create new component folder structure under `/src/components/`:
  - [ ] `/ui` (primitives)
  - [ ] `/forms` (form-specific)
  - [ ] `/surfaces` (containers)
  - [ ] `/charts` (visualization)
  - [ ] `/animations` (effects)
  - [ ] `/layouts` (screen layouts)
  - [ ] `/inputs` (detailed inputs)
  - [ ] `/feedback` (user feedback)
  - [ ] `/lists` (lists/tables)
  - [ ] `/controls` (user controls)
  - [ ] `/screens` (full-screen components)
- [ ] T007 Create `/src/components/README.md` with component patterns and usage guide
- [ ] T008 Create i18n locale files at `/src/i18n/locales/zh-CN.json` and `/src/i18n/locales/en.json` (templates)

### P1.3 Translation Foundation

- [ ] T009 Populate `/src/i18n/locales/zh-CN.json` with all Chinese translations (common, transactions, home, summary, trends, validation)
- [ ] T010 Populate `/src/i18n/locales/en.json` with all English translations (mirrors zh-CN structure)
- [ ] T011 Create i18n formatter utilities at `/src/i18n/formatters.ts` (formatCurrency, formatDate, formatPercent)
- [ ] T012 Create i18n constants file at `/src/i18n/keys.ts` with typed translation keys (optional but recommended for type safety)

### P1.4 Validation & Testing

- [ ] T013 Create unit test for i18n initialization: `/src/i18n/__tests__/config.test.ts`
- [ ] T014 Create unit test for translation key validation: `/src/i18n/__tests__/keys.test.ts` (verify all keys exist in both locales)
- [ ] T015 Verify npm install succeeds and i18n dependencies are installed
- [ ] T016 Verify TypeScript compilation passes with new i18n types

---

## Phase 2: Core Component Restructuring

**Goal**: Reorganize existing components into new feature-based structure without changing functionality

**Depends On**: Phase 1  
**Must Complete Before**: Phase 3

### P2.1 UI Primitives Migration (shadcn-like components)

- [ ] T017 [P] Move `/src/components/primitives/Button.tsx` → `/src/components/ui/Button.tsx` with haptic feedback support
- [ ] T018 [P] Move `/src/components/primitives/Card.tsx` → `/src/components/ui/Card.tsx`
- [ ] T019 [P] Move `/src/components/primitives/IconButton.tsx` → `/src/components/ui/IconButton.tsx`
- [ ] T020 [P] Move `/src/components/primitives/Pill.tsx` → `/src/components/ui/Badge.tsx` (rename)
- [ ] T021 [P] Move `/src/components/primitives/Sheet.tsx` → `/src/components/ui/Sheet.tsx`
- [ ] T022 [P] Create new UI primitive: `/src/components/ui/Input.tsx` (extract from FormField or new)
- [ ] T023 [P] Create new UI primitive: `/src/components/ui/Select.tsx` (dropdown/picker)
- [ ] T024 [P] Create new UI primitive: `/src/components/ui/Checkbox.tsx` (if not exists)
- [ ] T025 [P] Create new UI primitive: `/src/components/ui/Radio.tsx` (if not exists)
- [ ] T026 [P] Create new UI primitive: `/src/components/ui/Switch.tsx` (toggle)
- [ ] T027 [P] Create new UI primitive: `/src/components/ui/Divider.tsx` (separator)
- [ ] T028 [P] Create new UI primitive: `/src/components/ui/Spinner.tsx` (loading indicator)
- [ ] T029 [P] Create new UI primitive: `/src/components/ui/Modal.tsx` (dialog wrapper if not in Sheet)

### P2.2 Animation Components Organization

- [ ] T030 [P] Verify `/src/components/animations/FadeIn.tsx` exists and is correct
- [ ] T031 [P] Verify `/src/components/animations/SlideIn.tsx` exists and is correct
- [ ] T032 [P] Verify `/src/components/animations/ScaleIn.tsx` exists and is correct
- [ ] T033 [P] Verify `/src/components/animations/CountUp.tsx` exists and is correct
- [ ] T034 [P] Verify `/src/components/animations/SuccessCheck.tsx` exists and is correct
- [ ] T035 [P] Verify `/src/components/animations/Skeleton.tsx` exists and is correct

### P2.3 Chart Components Organization

- [ ] T036 [P] Verify `/src/components/charts/CategoryPie.tsx` exists and is correct
- [ ] T037 [P] Verify `/src/components/charts/TimeSeries.tsx` exists and is correct
- [ ] T038 [P] Move `/src/components/ChartContainer.tsx` → `/src/components/charts/ChartContainer.tsx`
- [ ] T039 [P] Create `/src/components/charts/ChartLegend.tsx` (legend component if not exists)

### P2.4 Surface Components Organization

- [ ] T040 [P] Move `/src/components/SummaryCards.tsx` → `/src/components/surfaces/SummaryCards.tsx`
- [ ] T041 [P] Create `/src/components/surfaces/SummaryCard.tsx` (single card component, extracted from SummaryCards if needed)
- [ ] T042 [P] Create `/src/components/surfaces/CardGrid.tsx` (reusable grid layout)
- [ ] T043 [P] Create `/src/components/surfaces/Container.tsx` (screen-level padding wrapper)
- [ ] T044 [P] Create `/src/components/surfaces/Header.tsx` (screen header)
- [ ] T045 [P] Create `/src/components/surfaces/Footer.tsx` (screen footer/action bar)

### P2.5 Form Components Setup

- [ ] T046 Create `/src/components/forms/FormField.tsx` (unified form input wrapper with validation, error display, haptic feedback)
- [ ] T047 Create `/src/components/forms/FormContext.ts` (form state management context)
- [ ] T048 Create `/src/components/forms/FormContainer.tsx` (form wrapper with context provider)
- [ ] T049 Create `/src/components/forms/FormValidation.ts` (validation schemas and error messages with i18n)
- [ ] T050 Move `/src/components/TransactionForm.tsx` → `/src/components/forms/TransactionForm.tsx` (update to use FormField + i18n)
- [ ] T051 Create `/src/components/forms/useForm.ts` (form state management hook)

### P2.6 Input Components Detail

- [ ] T052 [P] Create `/src/components/inputs/TextInput.tsx` (basic text field)
- [ ] T053 [P] Create `/src/components/inputs/NumberInput.tsx` (currency/amount input)
- [ ] T054 [P] Create `/src/components/inputs/DateInput.tsx` (date picker)
- [ ] T055 [P] Create `/src/components/inputs/TimeInput.tsx` (time picker)
- [ ] T056 [P] Create `/src/components/inputs/CategoryPicker.tsx` (category selector, uses i18n category list)
- [ ] T057 [P] Create `/src/components/inputs/PaymentMethodPicker.tsx` (payment method selector, uses i18n)
- [ ] T058 [P] Create `/src/components/inputs/NotesInput.tsx` (multi-line text)

### P2.7 Feedback Components

- [ ] T059 [P] Create `/src/components/feedback/Toast.tsx` (toast notification with i18n support)
- [ ] T060 [P] Create `/src/components/feedback/Alert.tsx` (alert message)
- [ ] T061 [P] Create `/src/components/feedback/Loading.tsx` (loading state with message)
- [ ] T062 [P] Move `/src/components/EmptyStates.tsx` → `/src/components/feedback/EmptyState.tsx` (rename)
- [ ] T063 [P] Move `/src/components/Confirm.tsx` → `/src/components/feedback/ConfirmDialog.tsx` (rename)

### P2.8 List Components

- [ ] T064 [P] Create `/src/components/lists/TransactionList.tsx` (FlatList wrapper for transactions)
- [ ] T065 [P] Create `/src/components/lists/ListItem.tsx` (reusable list item)
- [ ] T066 [P] Create `/src/components/lists/ListSection.tsx` (grouped list section with header)
- [ ] T067 [P] Create `/src/components/lists/ListEmpty.tsx` (empty list placeholder)

### P2.9 Control Components

- [ ] T068 [P] Move `/src/components/PeriodFilter.tsx` → `/src/components/controls/PeriodFilter.tsx`
- [ ] T069 [P] Create `/src/components/controls/CategoryFilter.tsx` (category multi-select, uses i18n)
- [ ] T070 [P] Create `/src/components/controls/SortControl.tsx` (sort order control)
- [ ] T071 [P] Create `/src/components/controls/ViewModeToggle.tsx` (list/grid toggle)
- [ ] T072 [P] Move `/src/components/TrendControls.tsx` → `/src/components/controls/TrendControls.tsx`

### P2.10 Layout Components

- [ ] T073 Create `/src/components/layouts/ScreenLayout.tsx` (standard screen with header + safe area)
- [ ] T074 Create `/src/components/layouts/ModalLayout.tsx` (modal/dialog layout)
- [ ] T075 Update `/src/components/layouts/TabLayout.tsx` if it exists, or create wrapper for (tabs)/_layout.tsx

### P2.11 Import Updates (Critical)

- [ ] T076 Update all imports across screen files for moved components:
  - [ ] `/app/(tabs)/_layout.tsx` - Update component imports
  - [ ] `/app/(tabs)/home.tsx` - Update component imports
  - [ ] `/app/(tabs)/transactions.tsx` - Update component imports
  - [ ] `/app/(tabs)/summary.tsx` - Update component imports
  - [ ] `/app/(tabs)/trends.tsx` - Update component imports
  - [ ] `/app/transactions/add.tsx` - Update component imports
  - [ ] `/app/transactions/[id]/edit.tsx` - Update component imports

### P2.12 Verification

- [ ] T077 Verify all moved components are properly imported and used
- [ ] T078 Verify TypeScript compilation passes with new folder structure
- [ ] T079 Run app and verify no runtime errors from missing imports
- [ ] T080 Update component exports/barrel export in `/src/components/index.ts` if using

---

## Phase 3: Internationalization Integration

**Goal**: Replace all hardcoded strings with i18n keys and ensure Chinese language support

**Depends On**: Phase 1, Phase 2  
**Must Complete Before**: Phase 4

### P3.1 Core Translation Integration

- [ ] T081 Update `/src/components/forms/TransactionForm.tsx` to use i18n for all labels and messages
  - [ ] Replace hardcoded "添加交易", "金额", "分类", etc. with t() calls
  - [ ] Use i18n for form validation error messages
  - [ ] Use i18n for success/error toast messages
- [ ] T082 Update `/app/(tabs)/home.tsx` (HomeScreen) to use i18n for all labels
  - [ ] Replace "首页", "余额", "收入", "支出", etc.
- [ ] T083 Update `/app/(tabs)/transactions.tsx` (TransactionsScreen) to use i18n
  - [ ] Replace "交易", "添加", "筛选", etc.
- [ ] T084 Update `/app/(tabs)/summary.tsx` (SummaryScreen) to use i18n
  - [ ] Replace "统计", "时期", "收入总计", "支出总计", etc.
- [ ] T085 Update `/app/(tabs)/trends.tsx` (TrendsScreen) to use i18n
  - [ ] Replace "趋势", "按时间", "按分类", "最近7天", etc.

### P3.2 Category Translations

- [ ] T086 Update `/src/services/transactions.ts` or category seeds to reference i18n category keys
- [ ] T087 Update CategoryPicker and CategoryFilter components to use i18n category names
- [ ] T088 Verify default categories display in Chinese:
  - [ ] Income categories: 工资, 奖金, 投资收益, 其他收入
  - [ ] Expense categories: 食物, 交通, 购物, 娱乐, 生活费, 医疗, 教育, 其他支出

### P3.3 Button & Navigation Texts

- [ ] T089 [P] Update all Button components to use i18n for titles:
  - [ ] "保存" (Save)
  - [ ] "取消" (Cancel)
  - [ ] "删除" (Delete)
  - [ ] "编辑" (Edit)
  - [ ] "添加" (Add)
- [ ] T090 [P] Update all navigation labels to use i18n
- [ ] T091 [P] Update all confirmation dialogs to use i18n

### P3.4 Error & Validation Messages

- [ ] T092 Update FormField wrapper to display i18n error messages from validation
- [ ] T093 Update FormValidation schemas to return i18n keys instead of hardcoded messages
- [ ] T094 Create error message display tests (verify error shown in correct language)

### P3.5 Empty States & Feedback

- [ ] T095 Update EmptyState component to use i18n for titles and descriptions
- [ ] T096 Update Toast/Alert components to use i18n for messages
- [ ] T097 Update all loading states to show i18n loading messages if needed

### P3.6 Verification

- [ ] T098 Verify app displays all UI in Chinese
- [ ] T098 Test language switching (change to English in settings, verify UI updates)
- [ ] T099 Verify translation keys don't have missing interpolation variables
- [ ] T100 Run unit tests for i18n (T013-T014) and verify all keys exist in both locales

---

## Phase 4: Navigation & Post-Add Flow Improvements

**Goal**: Implement smooth post-add transaction flow with scroll-to-item and haptic feedback

**Depends On**: Phase 2, Phase 3  
**Must Complete Before**: Phase 5

### P4.1 Navigation Flow Setup

- [ ] T101 Create navigation types/contracts at `/specs/001-ledger-analytics/contracts/navigation.ts`:
  - [ ] Define TransactionsScreenParams interface (scrollToId, highlight)
  - [ ] Define AddTransactionResult interface
- [ ] T102 Update `/app/transactions/add.tsx` to implement post-add navigation:
  - [ ] After successful form submission, navigate to /transactions with params
  - [ ] Pass scrollToId = transactionId and highlight = true
  - [ ] Example: `router.push({ pathname: '/transactions', params: { scrollToId: newId, highlight: true } })`
- [ ] T103 Update `/src/components/forms/TransactionForm.tsx` to return transactionId on success
  - [ ] Ensure form submission callback receives and returns new transaction ID

### P4.2 Transactions Screen Scroll Implementation

- [ ] T104 Update `/app/(tabs)/transactions.tsx` (TransactionsScreen) to:
  - [ ] Read route params (scrollToId, highlight) via useLocalSearchParams()
  - [ ] Maintain ref to FlatList component: `const flatListRef = useRef<FlatList>(null)`
  - [ ] In useEffect, when scrollToId changes:
    - [ ] Find index of transaction with matching ID
    - [ ] Call `flatListRef.current?.scrollToIndex({ index, animated: true })`
    - [ ] Trigger haptic feedback: `Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)`

### P4.3 Highlight Effect

- [ ] T105 Implement highlight animation in TransactionList or ListItem component:
  - [ ] Create Reanimated shared value: `highlightTransactionId`
  - [ ] When scrollToId received and highlight=true, set highlightTransactionId to that ID
  - [ ] Animate list item background color or scale for 2 seconds
  - [ ] Clear highlight after animation completes

### P4.4 Haptic Integration

- [ ] T106 Add haptic feedback in form submission success:
  - [ ] In TransactionForm onSuccess callback: `Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)`
- [ ] T107 Add haptic feedback on list scroll:
  - [ ] Optional: light haptic when scroll begins (impactLight)
- [ ] T108 Verify haptic feedback works on all platforms (iOS, Android, web with graceful fallback)

### P4.5 Testing

- [ ] T109 Create integration test: "Add transaction → Navigate to list → Scroll to item"
  - [ ] Test file: `/src/__tests__/flows/add-transaction.test.ts`
  - [ ] Verify: form submission → navigation → scroll → highlight
- [ ] T110 Verify navigation params are correctly passed and received
- [ ] T111 Test on simulator/device to verify haptic feedback triggers

---

## Phase 5: Form Consistency & UX Polish

**Goal**: Implement unified FormField wrapper with standardized validation, error display, and haptic feedback

**Depends On**: Phase 1, Phase 2, Phase 3  
**Must Complete Before**: Completion

### P5.1 FormField Unified Wrapper

- [ ] T112 Finalize `/src/components/forms/FormField.tsx` implementation with:
  - [ ] Label with required indicator
  - [ ] Input field with focus ring styling
  - [ ] Error message display below input (in error color)
  - [ ] Helper text (only shown when no error)
  - [ ] Haptic feedback on error (warning vibration)
  - [ ] Full width, consistent padding/margins
  - [ ] Accessibility: proper accessibilityLabel, accessibilityHint, accessibilityRole

### P5.2 Form Context & State Management

- [ ] T113 Implement FormContext for managing form-wide state:
  - [ ] Track touched fields
  - [ ] Track validation errors
  - [ ] Provide methods: setFieldValue, setFieldTouched, setFieldError
  - [ ] Provide hook: useFormField(fieldName) to access field-specific state
- [ ] T114 Implement FormContainer wrapper with FormContext provider
- [ ] T115 Update TransactionForm to use FormContext instead of inline state (if applicable)

### P5.3 Validation Schemas & Error Messages

- [ ] T116 Create comprehensive validation schemas in `/src/components/forms/FormValidation.ts`:
  - [ ] Amount validation: required, positive, max decimal places (2)
  - [ ] Date validation: required, not in future, within reasonable bounds
  - [ ] Category validation: required
  - [ ] Type validation: required
  - [ ] All error messages use i18n keys
- [ ] T117 Create validation utility function: `validateField(fieldName, value, schema)` → error message or null
- [ ] T118 Update FormField to accept validation schema and auto-validate on blur

### P5.4 Input Components Polish

- [ ] T119 Ensure TextInput (`/src/components/inputs/TextInput.tsx`) has:
  - [ ] Focus ring (border color change)
  - [ ] Error state (red border + red text)
  - [ ] Clear button (optional, for empty)
  - [ ] Character counter (if maxLength set)
- [ ] T120 Ensure NumberInput (`/src/components/inputs/NumberInput.tsx`) has:
  - [ ] Decimal-pad keyboard type
  - [ ] Automatic formatting (currency symbol, thousands separator based on locale)
  - [ ] Min/max validation
- [ ] T121 Ensure DateInput (`/src/components/inputs/DateInput.tsx`) has:
  - [ ] Date picker UI (native or custom)
  - [ ] Display format: Chinese date format (e.g., "2025年11月16日")
  - [ ] Validation for future dates
- [ ] T122 Ensure CategoryPicker (`/src/components/inputs/CategoryPicker.tsx`) has:
  - [ ] Dropdown with all categories from i18n
  - [ ] Selected item highlighted
  - [ ] Search/filter optional

### P5.5 Add Transaction Form Refactoring

- [ ] T123 Update `/src/components/forms/TransactionForm.tsx` to use FormField for all inputs:
  - [ ] Type field (radio or segmented control): Income / Expense
  - [ ] Amount field (NumberInput wrapped in FormField)
  - [ ] Date field (DateInput wrapped in FormField)
  - [ ] Category field (CategoryPicker wrapped in FormField)
  - [ ] Payment Method field (PaymentMethodPicker wrapped in FormField)
  - [ ] Note field (NotesInput wrapped in FormField)
  - [ ] All fields show validation errors consistently
- [ ] T124 Add form submission loading state:
  - [ ] Save button shows spinner during submission
  - [ ] Other buttons disabled during submission
- [ ] T125 Add success/error feedback:
  - [ ] Success: haptic feedback + success message + navigate
  - [ ] Error: haptic warning + error message (from i18n)

### P5.6 Empty States & Error Recovery

- [ ] T126 Update EmptyState component for transaction list:
  - [ ] Icon + title + description (from i18n)
  - [ ] Primary action: "Add Transaction" button
  - [ ] Secondary text: "No transactions yet"
- [ ] T127 Add error recovery UI for form errors:
  - [ ] Display general error message with retry button
  - [ ] Log errors to console for debugging

### P5.7 Dark Mode & Accessibility

- [ ] T128 Verify all form components work in dark mode:
  - [ ] Input border color visible in dark mode
  - [ ] Error text color (red) has sufficient contrast
  - [ ] Labels readable in dark mode
- [ ] T129 Verify accessibility:
  - [ ] Form fields have proper labels (not just placeholder text)
  - [ ] Error messages announced by screen readers
  - [ ] Required indicator visible (asterisk or aria-required)
  - [ ] Tab order is logical

### P5.8 Testing

- [ ] T130 Unit tests for FormField component:
  - [ ] Render with label, value, onChangeText
  - [ ] Show error message when error prop provided
  - [ ] Trigger haptic feedback on error
  - [ ] Display helper text when no error
- [ ] T131 Unit tests for validation schemas:
  - [ ] Valid inputs pass validation
  - [ ] Invalid inputs return appropriate error key
  - [ ] Localized error messages match schema
- [ ] T132 Integration test for complete form submission flow:
  - [ ] Fill form with valid data → submit → success message + navigation
  - [ ] Fill form with invalid data → submit → validation errors shown + no navigation
  - [ ] Test with different currencies/locales

---

## Phase 6: Final Verification & Polish

**Goal**: Cross-platform testing, accessibility verification, and documentation

**Depends On**: Phase 3, Phase 4, Phase 5

### P6.1 Cross-Platform Testing

- [ ] T133 Test on Web platform:
  - [ ] Add transaction flow works end-to-end
  - [ ] Chinese language displays correctly
  - [ ] Form validation and error messages shown
  - [ ] Dark mode works
  - [ ] Haptic feedback gracefully skipped (no errors)
- [ ] T134 Test on iOS simulator:
  - [ ] Add transaction flow complete
  - [ ] Haptic feedback triggers on button presses and form submission
  - [ ] Language setting respects system locale or app setting
  - [ ] Safe area handled correctly
- [ ] T135 Test on Android emulator/device:
  - [ ] Add transaction flow complete
  - [ ] Haptic feedback (vibration) triggers
  - [ ] Keyboard appearance/dismissal smooth
  - [ ] Language setting respected

### P6.2 Accessibility Verification

- [ ] T136 Run accessibility audit on all screens:
  - [ ] Home screen: balance readable, quick actions accessible
  - [ ] Transactions screen: list items readable, add button accessible
  - [ ] Add Transaction form: all fields properly labeled, error messages announced
- [ ] T137 Verify keyboard navigation works:
  - [ ] Tab through form fields in correct order
  - [ ] Can submit form via keyboard (Enter or spacebar on button)
- [ ] T138 Verify color contrast:
  - [ ] Text on light background: 4.5:1 ratio
  - [ ] UI elements: 3:1 ratio
  - [ ] Error messages: red color tested with color blindness simulator

### P6.3 Performance Verification

- [ ] T139 Measure form submission latency:
  - [ ] Submit form → navigation → scroll → highlight ≤ 1 second
  - [ ] Verify no layout shifts during scroll
- [ ] T140 Profile component rendering:
  - [ ] FormField re-render only when value/error changes
  - [ ] TransactionForm no unnecessary re-renders
  - [ ] Use React DevTools Profiler if needed

### P6.4 Documentation & Examples

- [ ] T141 Update `/src/components/README.md` with:
  - [ ] Component folder structure explanation
  - [ ] shadcn philosophy: copy/paste, type-safe, minimal deps
  - [ ] Usage examples for FormField, Button, Input, etc.
  - [ ] Accessibility checklist per component
  - [ ] Testing patterns (unit tests, snapshots)
- [ ] T142 Create Storybook stories (optional) for:
  - [ ] FormField variants (default, error, disabled, loading)
  - [ ] TransactionForm with sample data
  - [ ] Button variants and haptic states

### P6.5 Code Quality

- [ ] T143 Run TypeScript strict mode check:
  - [ ] All files compile with --strict flag
  - [ ] No `any` types used without comment
- [ ] T144 Run ESLint on all components:
  - [ ] No unused imports
  - [ ] No console.log left in code
  - [ ] React hooks dependencies correct
- [ ] T145 Run Prettier on all files:
  - [ ] Consistent formatting across project

### P6.6 Final Sanity Tests

- [ ] T146 Smoke test: Create transaction → View in list → Edit → Delete → Verify aggregates updated
- [ ] T147 Verify all Chinese strings display correctly (no encoding issues)
- [ ] T148 Verify dark mode toggle works and theme persists
- [ ] T149 Verify haptic feedback on:
  - [ ] Button presses (light)
  - [ ] Form submission (medium)
  - [ ] Errors (warning)
  - [ ] Success (notification)
- [ ] T150 Run full app flow:
  - [ ] App loads → Home dashboard visible
  - [ ] Navigate to add transaction
  - [ ] Fill form with Chinese input → submit
  - [ ] Navigate to transactions list → scroll to new transaction
  - [ ] See newly created transaction highlighted
  - [ ] Navigate to summary → verify totals updated
  - [ ] Navigate to trends → verify charts updated

---

## Task Dependencies & Execution Order

### Critical Path (Must be sequential)

```
Phase 1: Foundation (T001-T016)
  ↓
Phase 2: Component Restructuring (T017-T080)
  ↓
Phase 3: i18n Integration (T081-T100)
  ↓
Phase 4: Navigation Flow (T101-T111)
  ↓
Phase 5: Form Consistency (T112-T132)
  ↓
Phase 6: Verification (T133-T150)
```

### Parallelizable Tasks (Can run simultaneously within phase)

**Phase 1**:
- T002-T005 can run in parallel (separate files)
- T009-T012 can run in parallel (translation population)

**Phase 2**:
- T017-T029 (UI primitives) - all in /ui folder, can parallel
- T030-T035 (animations) - verification tasks, can parallel
- T036-T039 (charts) - verification/organization, can parallel
- T040-T045 (surfaces) - move/create tasks, can parallel
- T052-T058 (inputs) - create new components, can parallel
- T059-T067 (feedback, lists) - create new components, can parallel
- T068-T072 (controls) - move/create tasks, can parallel

**Phase 3**:
- T081-T085 (screen translations) - can parallel if no shared state
- T089-T091 (button/navigation texts) - can parallel

**Phase 4**:
- T104-T107 (scroll + haptic) - somewhat dependent but can start in parallel

**Phase 5**:
- T119-T122 (input polish) - can parallel
- T126-T127 (UI polish) - can parallel

**Phase 6**:
- T133-T135 (platform testing) - can parallel
- T136-T138 (accessibility) - can parallel

---

## MVP Scope & Phasing Strategy

### MVP (Minimum Viable Product) - Estimated 2-3 days

Focus on highest-impact features:

1. **Phase 1: Foundation** (0.5 day)
   - i18n setup
   - Translation files created

2. **Phase 2: Partial Component Restructuring** (0.5 day)
   - UI primitives moved to /ui
   - Forms folder created
   - Critical imports updated

3. **Phase 3: Core i18n Integration** (1 day)
   - TransactionForm translated
   - HomeScreen translated
   - Category names translated

4. **Phase 4: Post-Add Navigation** (0.5 day)
   - Add transaction redirect to list
   - Scroll-to-item implemented
   - Haptic feedback on success

5. **Phase 5: FormField Wrapper** (0.5 day)
   - Basic FormField component created
   - TransactionForm refactored to use FormField
   - Validation errors displayed

### Full Implementation - Estimated 5-7 days

Complete all phases including:
- All component migrations
- Full i18n coverage (all screens)
- Complete form consistency
- Full testing & verification

---

## Success Criteria

### Phase 1: Foundation
- ✅ i18n dependencies installed
- ✅ TypeScript compilation passes
- ✅ Translation files created with correct structure
- ✅ Unit tests for i18n pass

### Phase 2: Component Restructuring
- ✅ All components moved to new folder structure
- ✅ All imports updated
- ✅ App runs without errors
- ✅ No functionality broken

### Phase 3: i18n Integration
- ✅ All UI text in Chinese
- ✅ Language can be switched to English (test purpose)
- ✅ All translation keys present in both locales
- ✅ No missing interpolation variables

### Phase 4: Navigation Flow
- ✅ Add transaction → returns to list
- ✅ Scroll-to-item with animation
- ✅ Haptic feedback on success
- ✅ Integration test passes

### Phase 5: Form Consistency
- ✅ FormField wrapper used across all forms
- ✅ Validation errors displayed consistently
- ✅ Haptic feedback on validation errors
- ✅ Form submission <500ms
- ✅ Dark mode works

### Phase 6: Verification
- ✅ Cross-platform testing passed (Web, iOS, Android)
- ✅ Accessibility audit passed
- ✅ Performance benchmarks met
- ✅ All 150 tasks completed
- ✅ Documentation updated

---

## Related Documents

- **Implementation Plan**: `/data/workspace/my-tally-book/specs/001-ledger-analytics/plan.md`
- **Data Model (i18n)**: `/data/workspace/my-tally-book/specs/001-ledger-analytics/data-model-i18n.md`
- **Component Architecture**: `/data/workspace/my-tally-book/specs/001-ledger-analytics/component-architecture.md`
- **Research**: `/data/workspace/my-tally-book/specs/001-ledger-analytics/research-optimization.md`
- **Feature Spec**: `/data/workspace/my-tally-book/specs/001-ledger-analytics/spec.md`
