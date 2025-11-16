# Task Breakdown for Ledger Analytics

This document breaks down the work required for the Ledger Analytics feature, including the core functionality (completed), home dashboard, and visual refresh enhancements.

## Task Categories

- **Core-Dev**: Core feature development tasks
- **UI/UX**: Visual and interaction tasks leveraging the shared design system
- **Design-System**: Design tokens, theme system, animations
- **Home-Dashboard**: Central hub with financial overview widgets
- **Animation**: Reanimated 3, gesture handlers, physics-based animations
- **Charts**: Skia-based chart components with GPU acceleration
- **Quality**: Linting, typing, code reviews, API docs, refactoring
- **Testing**: Unit, integration, E2E tests; CI integration; coverage
- **Performance**: Budgets, SLO validation, profiling, regression prevention
- **Docs**: Documentation-related tasks

---

# PART 1: CORE FUNCTIONALITY (COMPLETED ✅)

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

## Phase 7 — Polish & Cross‑Cutting

- [X] T035 Accessibility pass (labels, focus, contrast) across screens `app/**/*`
- [X] T036 Performance validation per SLOs (measure, profile, optimize) `src/services/metrics.ts`
- [X] T037 Visual QA against iOS reference (spacing/hierarchy/states) `app/**/*`
- [X] T038 Docs: update `specs/001-ledger-analytics/quickstart.md` with latest flows
- [X] T039 Quality: add README sections for terminology and UX patterns `README.md`

---

# PART 2: VISUAL REFRESH & ANIMATIONS (NEW 🎨)

## Phase 8 — Enhanced Dependencies & Setup

- [X] T040 Install Reanimated 3 and Gesture Handler `package.json`, `babel.config.js`
- [X] T041 Install expo-haptics for tactile feedback `package.json`
- [X] T042 Install React Native Skia for GPU-accelerated charts `package.json`
- [X] T043 Install @shopify/flash-list for performant lists `package.json`
- [X] T044 Configure Reanimated plugin in Babel `babel.config.js`
- [X] T045 Update metro.config.js for Skia support `metro.config.js`
- [X] T046 Create app icon and splash screen assets `assets/`

---

## Phase 9 — Design System Enhancement

### Color & Theme
- [X] T047 Enhance color palette with gradient definitions `src/theme/colors.ts`
- [X] T048 Add glassmorphism and blur effect utilities `src/theme/effects.ts`
- [X] T049 Create animated color transition system `src/theme/animations.ts`
- [ ] T050 Update design tokens with iOS 18 values `src/theme/tokens.ts`
- [ ] T051 Create border radius constants `src/theme/radius.ts`

### Theme System
- [ ] T052 Implement ThemeProvider wrapper in root `app/_layout.tsx`
- [ ] T053 Create useTheme hook `src/hooks/useTheme.ts`
- [ ] T054 Create useColorScheme hook for dark mode detection `src/hooks/useColorScheme.ts`
- [ ] T055 Implement theme persistence to AsyncStorage `src/services/themeStorage.ts`
- [ ] T056 [P] Create color manipulation utilities `src/utils/colors.ts`
- [ ] T057 Implement system appearance listener `src/hooks/useColorScheme.ts`
- [ ] T058 Implement smooth theme transition animation (300ms) `src/contexts/ThemeContext.tsx`

### Animation System
- [X] T059 Create animation presets (spring configs) `src/theme/animations.ts`
- [X] T060 Create timing curve definitions `src/theme/easings.ts`
- [X] T061 Create useAnimation hook `src/hooks/useAnimation.ts`
- [ ] T062 Create animation helper utilities `src/utils/animations.ts`

### Haptics System
- [X] T063 Create haptics service wrapper `src/services/haptics.ts`
- [X] T064 Create useHaptics hook `src/hooks/useHaptics.ts`
- [X] T065 [P] Define haptic feedback taxonomy `src/constants/haptics.ts`

### Layout & Grid
- [ ] T066 Define dashboard grid layout system `src/theme/layout.ts`
- [ ] T067 Create responsive breakpoints for different screen sizes `src/theme/breakpoints.ts`
- [ ] T068 [P] Add illustration and icon asset loader `src/utils/assets.ts`

---

## Phase 10 — Primitive Components & Animations

### Animation Components
- [ ] T069 [P] Create FadeIn animation component `src/components/animations/FadeIn.tsx`
- [ ] T070 [P] Create SlideIn animation component `src/components/animations/SlideIn.tsx`
- [ ] T071 [P] Create ScaleIn animation component `src/components/animations/ScaleIn.tsx`
- [ ] T072 [P] Create Skeleton loading component `src/components/animations/Skeleton.tsx`
- [ ] T073 [P] Create count-up animation for amounts `src/components/animations/CountUp.tsx`
- [ ] T074 Create success animation after save `src/components/animations/SuccessCheck.tsx`

### Base Components
- [ ] T075 Create enhanced Button component with haptics `src/components/primitives/Button.tsx`
- [ ] T076 Create Card component with elevation `src/components/primitives/Card.tsx`
- [ ] T077 Create Sheet (bottom modal) component `src/components/primitives/Sheet.tsx`
- [ ] T078 [P] Create Pill (category chip) component `src/components/primitives/Pill.tsx`
- [ ] T079 [P] Create IconButton component `src/components/primitives/IconButton.tsx`
- [ ] T080 Create animated confirmation sheet `src/components/primitives/ConfirmSheet.tsx`

### Feedback Components
- [ ] T081 Create Toast notification component `src/components/feedback/Toast.tsx`
- [ ] T082 [P] Create ProgressBar component `src/components/feedback/ProgressBar.tsx`
- [ ] T083 [P] Create Spinner loading component `src/components/feedback/Spinner.tsx`
- [ ] T084 Create ToastProvider context `src/contexts/ToastContext.tsx`
- [ ] T085 [P] Create animated progress ring `src/components/summary/ProgressRing.tsx`

---

# PART 3: HOME DASHBOARD (NEW 🏠)

## Phase 11 — User Story US0: Home Dashboard (P0 - Highest Priority)

Story goal: Create a beautiful, information-rich home dashboard that serves as the central hub of the app, displaying financial overview, recent activity, and quick actions.

Independent test criteria:
- Home screen loads within 1s and displays current balance
- Widget cards have Level 2 elevation with smooth entry animation
- Quick action FAB expands to reveal 3-4 shortcuts
- Pull-to-refresh updates all data with spring animation
- Skeleton loaders appear while data is loading

### Home Screen Structure
- [ ] T086 [US0] Create home screen layout and add to tabs `app/(tabs)/home.tsx`
- [ ] T087 [US0] Implement scrollable dashboard container `app/(tabs)/home.tsx`
- [ ] T088 [US0] Add pull-to-refresh with spring animation `app/(tabs)/home.tsx`
- [ ] T089 [P] [US0] Create dashboard header with greeting `src/components/home/DashboardHeader.tsx`
- [ ] T090 [P] [US0] Create skeleton loader for dashboard `src/components/home/DashboardSkeleton.tsx`

### Financial Overview Widget
- [ ] T091 [US0] Create BalanceCard widget component `src/components/home/BalanceCard.tsx`
- [ ] T092 [US0] Add animated balance counter with count-up effect `src/components/home/BalanceCard.tsx`
- [ ] T093 [US0] Implement income/expense comparison mini-chart `src/components/home/BalanceCard.tsx`
- [ ] T094 [P] [US0] Add period selector (Today/Week/Month) `src/components/home/PeriodSelector.tsx`

### Recent Activity Widget
- [ ] T095 [US0] Create RecentTransactions widget `src/components/home/RecentTransactions.tsx`
- [ ] T096 [US0] Display last 5 transactions with category icons `src/components/home/RecentTransactions.tsx`
- [ ] T097 [US0] Add "See All" navigation to full transaction list `src/components/home/RecentTransactions.tsx`
- [ ] T098 [P] [US0] Create transaction item micro-component `src/components/home/TransactionMicroItem.tsx`

### Quick Insights Widget
- [ ] T099 [US0] Create QuickInsights widget `src/components/home/QuickInsights.tsx`
- [ ] T100 [US0] Show top spending category of the month `src/components/home/QuickInsights.tsx`
- [ ] T101 [US0] Display monthly savings rate (if positive) `src/components/home/QuickInsights.tsx`
- [ ] T102 [P] [US0] Add insight card with icon and label `src/components/home/InsightCard.tsx`

### Spending Breakdown Widget
- [ ] T103 [US0] Create SpendingBreakdown widget `src/components/home/SpendingBreakdown.tsx`
- [ ] T104 [US0] Show top 4 categories with progress bars `src/components/home/SpendingBreakdown.tsx`
- [ ] T105 [US0] Animate progress bars on mount `src/components/home/SpendingBreakdown.tsx`
- [ ] T106 [P] [US0] Add category color mapping `src/constants/categoryColors.ts`

### Quick Actions
- [ ] T107 [US0] Create expandable FAB (Floating Action Button) `src/components/home/QuickActionsFAB.tsx`
- [ ] T108 [US0] Add "Add Transaction" quick action `src/components/home/QuickActionsFAB.tsx`
- [ ] T109 [US0] Add "View Trends" quick action `src/components/home/QuickActionsFAB.tsx`
- [ ] T110 [US0] Add "View Summary" quick action `src/components/home/QuickActionsFAB.tsx`
- [ ] T111 [US0] Implement radial expansion animation with stagger `src/components/home/QuickActionsFAB.tsx`

---

## Phase 12 — Enhanced Transaction Recording (US1 Refresh)

Story goal: Improve transaction creation with bottom sheet, haptic feedback, and visual polish.

Independent test criteria:
- Bottom sheet slides up with spring animation (damping: 15)
- Form fields provide haptic feedback on tap and error states
- Category selection uses animated pill chips
- Save action triggers success haptic and animates sheet closure

Implementation tasks:
- [ ] T112 [US1] Rebuild add transaction as bottom sheet `app/transactions/add.tsx`
- [ ] T113 [P] [US1] Create animated form field component `src/components/forms/AnimatedFormField.tsx`
- [ ] T114 [US1] Add haptic feedback on form interactions `app/transactions/add.tsx`
- [ ] T115 [P] [US1] Create category selection with pill chips `src/components/forms/CategorySelector.tsx`
- [ ] T116 [US1] Implement spring-based sheet animations `app/transactions/add.tsx`
- [ ] T117 [US1] Add success/error toast notifications `app/transactions/add.tsx`
- [ ] T118 [P] [US1] Add amount input with currency formatting `src/components/forms/AmountInput.tsx`

---

## Phase 13 — Animated Transaction List (US2 Refresh)

Story goal: Enhance transaction list with smooth animations and swipe gestures.

Independent test criteria:
- List items fade in with staggered delay (50ms per item)
- Left swipe reveals delete action with red background
- Right swipe reveals edit action with blue background
- Pull-to-refresh shows spring animation
- Item deletion animates out smoothly

Implementation tasks:
- [ ] T119 [US2] Replace FlatList with FlashList `app/transactions/index.tsx`
- [ ] T120 [US2] Add staggered fade-in for list items `app/transactions/index.tsx`
- [ ] T121 [US2] Implement swipe-to-delete with haptic `src/components/transactions/SwipeableTransaction.tsx`
- [ ] T122 [US2] Implement swipe-to-edit action `src/components/transactions/SwipeableTransaction.tsx`
- [ ] T123 [US2] Add filter button with bottom sheet `app/transactions/index.tsx`
- [ ] T124 [P] [US2] Create transaction date section headers `src/components/transactions/DateSection.tsx`
- [ ] T125 [P] [US2] Create SwipeableRow component `src/components/gestures/SwipeableRow.tsx`
- [ ] T126 [US2] Add pull-to-refresh with spring animation `app/transactions/index.tsx`
- [ ] T127 [US2] Implement delete animation (slide-out + fade) `src/components/transactions/TransactionItem.tsx`

---

## Phase 14 — Widget-Style Summary (US3 Refresh)

Story goal: Redesign summary screen with elevated cards and glassmorphism.

Independent test criteria:
- Cards have Level 2 elevation with subtle shadows
- Amount values animate with count-up effect (800ms)
- Period toggle morphs between month/week/custom
- Glassmorphism overlay on card backgrounds
- Theme switch animates card colors smoothly

Implementation tasks:
- [ ] T128 [US3] Rebuild summary screen layout `app/summary/index.tsx`
- [ ] T129 [US3] Create elevated summary cards `src/components/summary/SummaryCard.tsx`
- [ ] T130 [US3] Add count-up animation for amounts `src/components/summary/SummaryCard.tsx`
- [ ] T131 [US3] Implement glassmorphism overlay `src/components/summary/SummaryCard.tsx`
- [ ] T132 [US3] Add period comparison widget `src/components/summary/PeriodComparison.tsx`
- [ ] T133 [US3] Animate period toggle with morph effect `src/components/PeriodFilter.tsx`
- [ ] T134 [US3] Add skeleton loader for summary screen `app/summary/index.tsx`
- [ ] T135 [US3] Implement refresh animation for summary data `app/summary/index.tsx`

---

## Phase 15 — Skia-Based Charts (US4 Refresh)

Story goal: Replace existing charts with GPU-accelerated Skia charts.

Independent test criteria:
- Bar chart bars grow from 0 with staggered spring (50ms delay)
- Donut chart segments draw clockwise with easeInOut
- Granularity toggle cross-fades charts (300ms)
- Legend fades in after chart animation completes
- Charts render at 60fps for 5000+ data points

Implementation tasks:
- [ ] T136 [US4] Create Skia BarChart component `src/components/charts/SkiaBarChart.tsx`
- [ ] T137 [US4] Implement bar growth animation with stagger `src/components/charts/SkiaBarChart.tsx`
- [ ] T138 [US4] Create Skia DonutChart component `src/components/charts/SkiaDonutChart.tsx`
- [ ] T139 [US4] Implement segment drawing animation `src/components/charts/SkiaDonutChart.tsx`
- [ ] T140 [US4] Create line chart for trends `src/components/charts/SkiaLineChart.tsx`
- [ ] T141 [P] [US4] Add chart tooltip on touch `src/components/charts/ChartTooltip.tsx`
- [ ] T142 [P] [US4] Create chart legend component `src/components/charts/ChartLegend.tsx`
- [ ] T143 [US4] Add cross-fade transition for granularity change `app/trends/index.tsx`
- [ ] T144 [US4] Implement chart skeleton loader `src/components/charts/ChartSkeleton.tsx`
- [ ] T145 [US4] Add lazy loading for chart components `app/trends/index.tsx`
- [ ] T146 [P] [US4] Create chart data transformation utilities `src/utils/chartData.ts`

---

## Phase 16 — Enhanced Edit/Delete Flow (US5)

Story goal: Improve edit screen with animations, haptic confirmations, and visual feedback.

Independent test criteria:
- Edit screen slides in from right with spring
- Form fields have focus animations
- Delete button shows confirmation sheet with warning haptic
- Save success triggers medium haptic and toast
- Changes reflect immediately in list with animation

Implementation tasks:
- [ ] T147 [US5] Add screen transition animation for edit flow `app/transactions/[id]/edit.tsx`
- [ ] T148 [US5] Implement focus animations for form fields `app/transactions/[id]/edit.tsx`
- [ ] T149 [US5] Replace Alert with animated confirmation sheet `app/transactions/[id]/edit.tsx`
- [ ] T150 [US5] Add warning haptic for destructive actions `app/transactions/[id]/edit.tsx`
- [ ] T151 [US5] Add save success haptic and toast `app/transactions/[id]/edit.tsx`
- [ ] T152 [US5] Animate list update after edit `app/transactions/index.tsx`

---

## Phase 17 — Navigation & Tab Bar Enhancement

- [ ] T153 Update tab bar with custom icons `app/(tabs)/_layout.tsx`
- [ ] T154 Add tab bar indicator animation `app/(tabs)/_layout.tsx`
- [ ] T155 Implement tab bar haptic feedback `app/(tabs)/_layout.tsx`
- [ ] T156 Create custom tab bar background `src/components/navigation/CustomTabBar.tsx`
- [ ] T157 [P] Add badge notifications for tabs `src/components/navigation/TabBadge.tsx`
- [ ] T158 Add haptics to navigation events `app/(tabs)/_layout.tsx`
- [ ] T159 Configure home as default tab `app/_layout.tsx`

---

## Phase 18 — Illustrations & Empty States

- [ ] T160 Create home dashboard empty state illustration `src/components/illustrations/EmptyDashboard.tsx`
- [ ] T161 Create transaction list empty state `src/components/illustrations/EmptyTransactions.tsx`
- [ ] T162 Create trends empty state `src/components/illustrations/EmptyTrends.tsx`
- [ ] T163 [P] Add onboarding welcome illustration `src/components/illustrations/Welcome.tsx`
- [ ] T164 [P] Create success celebration animation `src/components/animations/Celebration.tsx`
- [ ] T165 Create confetti effect for milestones `src/components/animations/Confetti.tsx`

---

## Phase 19 — Dark Mode Integration

- [ ] T166 Update all components to use theme colors `app/**/*.tsx`
- [ ] T167 Add theme toggle in settings/profile screen `app/settings/index.tsx`
- [ ] T168 Test WCAG AAA contrast compliance `scripts/testContrast.ts`
- [ ] T169 Test contrast ratios for WCAG AAA compliance `scripts/testContrast.ts`
- [ ] T170 Add theme preference persistence `src/services/themeStorage.ts`

---

## Phase 20 — Haptic Feedback Integration

- [ ] T171 Add haptics to all button presses `src/components/**/*.tsx`
- [ ] T172 Add haptics to swipe gestures `src/components/transactions/SwipeableTransaction.tsx`
- [ ] T173 Add haptics to form validation `app/transactions/add.tsx`
- [ ] T174 [P] Create haptic feedback preferences `src/services/preferences.ts`

---

## Phase 21 — Micro-Interactions & Polish

- [ ] T175 Add button press scale animation `src/components/primitives/Button.tsx`
- [ ] T176 Add card tap ripple effect `src/components/primitives/Card.tsx`
- [ ] T177 Implement loading shimmer effect `src/components/animations/Shimmer.tsx`
- [ ] T178 [P] Add typing indicators for forms `src/components/forms/TypingIndicator.tsx`

---

## Phase 22 — Accessibility & Motion Preferences

- [ ] T179 Implement reduced motion detection `src/hooks/useReducedMotion.ts`
- [ ] T180 Add conditional animation logic for reduced motion `src/utils/animations.ts`
- [ ] T181 Test dynamic type scaling (iOS) `app/**/*.tsx`
- [ ] T182 Add accessibility labels to all animated components `src/components/**/*.tsx`
- [ ] T183 Test VoiceOver/TalkBack navigation `app/**/*.tsx`
- [ ] T184 Verify focus indicators for keyboard navigation `src/components/**/*.tsx`

---

## Final Phase — Performance, QA & Documentation

### Performance Optimization
- [ ] T185 Profile animation frame rates (60fps validation) `scripts/profileAnimations.ts`
- [ ] T186 Optimize home dashboard render performance `app/(tabs)/home.tsx`
- [ ] T187 Implement lazy loading for widgets `app/(tabs)/home.tsx`
- [ ] T188 Add memoization to expensive calculations `src/utils/calculations.ts`
- [ ] T189 Optimize Skia chart rendering `src/components/charts/*.tsx`
- [ ] T190 Optimize Skia chart rendering for 5000+ points `src/components/charts/*.tsx`
- [ ] T191 Optimize bundle size (target: +500KB max) `package.json`
- [ ] T192 Test performance on low-end devices (iPhone 8, Android 8) `scripts/testPerformance.ts`

### Visual QA
- [ ] T193 Test light/dark mode across all screens `app/**/*.tsx`
- [ ] T194 Verify elevation shadows on iOS/Android `src/theme/elevation.ts`
- [ ] T195 Validate glassmorphism effects `src/theme/effects.ts`
- [ ] T196 Test animations on low-end devices `scripts/testPerformance.ts`
- [ ] T197 Screenshot tests for visual regression `tests/visual/*.test.ts`
- [ ] T198 Visual regression testing for light/dark mode `tests/visual/*.test.ts`
- [ ] T199 Verify elevation shadows on all platforms `app/**/*.tsx`
- [ ] T200 Test glassmorphism fallback on Android `src/components/primitives/Card.tsx`
- [ ] T201 Validate spring animation feel across interactions `app/**/*.tsx`
- [ ] T202 Test haptic timing for all interactions `src/services/haptics.ts`
- [ ] T203 Verify 60fps animations in production build `scripts/validateFPS.ts`

### Documentation
- [ ] T204 Update README with home dashboard screenshots `README.md`
- [ ] T205 Document widget system architecture `docs/widgets.md`
- [ ] T206 Create design system documentation `docs/design-system.md`
- [ ] T207 Add animation cookbook `docs/animations.md`
- [ ] T208 Update quickstart guide `specs/001-ledger-analytics/quickstart.md`
- [ ] T209 Update quickstart with animation examples `specs/001-ledger-analytics/quickstart.md`
- [ ] T210 Document theme system usage `README.md`
- [ ] T211 Document haptic feedback taxonomy `README.md`
- [ ] T212 Create animation cookbook with examples `docs/animations.md`
- [ ] T213 Update CODEBUDDY.md with new dependencies `CODEBUDDY.md`

---

## Dependencies (Story Completion Order)

### Critical Path
1. **Phase 1-7** (Core functionality) ✅ COMPLETED
2. **Phase 8-9** (Setup & Design System) → **Phase 10** (Primitives)
3. **Phase 10** (Primitives) → **Phase 11** (Home Dashboard)
4. **Phase 11** (Home Dashboard) → **Phase 12-16** (Feature Enhancements)
5. **Phase 17-22** (Integration & Polish) → **Final Phase** (Performance & QA)

### Parallel Opportunities
- **Phase 12, 13, 14, 15, 16** can run in parallel after Phase 11 completes
- **Phase 18** (Illustrations) can run independently after Phase 9
- **Phase 19** (Dark Mode) can start after Phase 9
- **Phase 20** (Haptics) can integrate throughout Phases 12-16

### User Story Dependencies
- **US0** (Home Dashboard): Foundation for enhanced experience
- **US1** (Transaction Recording): Depends on primitives (Button, Sheet, Toast)
- **US2** (Transaction List): Can parallel US1 after primitives ready
- **US3** (Summary): Can parallel US1-US2 after primitives ready
- **US4** (Charts): Can parallel US1-US3, depends on Skia setup
- **US5** (Edit/Delete): Depends on US1 (shares form components)

---

## Parallel Execution Examples

### Within Phase 10 (Primitives)
- T069-T074 (Animation components) can all run in parallel
- T078-T079 (Pill, IconButton) can run in parallel
- T082-T083, T085 (ProgressBar, Spinner, ProgressRing) can run in parallel

### Within Phase 11 (US0 - Home Dashboard)
- T089 (DashboardHeader) || T090 (DashboardSkeleton)
- T094 (PeriodSelector) || T098 (TransactionMicroItem) || T102 (InsightCard) || T106 (categoryColors)

### Within Phase 12 (US1 - Enhanced Transaction)
- T113 (AnimatedFormField) || T115 (CategorySelector) || T118 (AmountInput)

### Within Phase 13 (US2 - Transaction List)
- T124 (DateSection) || T125 (SwipeableRow)

### Within Phase 15 (US4 - Charts)
- T136-T137 (BarChart) || T138-T139 (DonutChart) || T140 (LineChart)
- T141 (ChartTooltip) || T142 (ChartLegend) || T146 (chartData utils)

### Cross-Phase
- Phase 18 (Illustrations) can run fully parallel once design tokens exist
- Phase 20 (Haptics) can integrate as components are built

---

## Implementation Strategy

### MVP - Week 1-2: Design System & Primitives
**Goal**: Foundation for visual refresh

1. **Week 1**: Phase 8-9 (Setup + Design System)
2. **Week 2**: Phase 10 (Primitives), Phase 17 (Navigation)

**Deliverable**: Core design system with theme, animations, primitives

### Incremental - Week 3-4: Home Dashboard
**Goal**: Launch beautiful home screen

1. **Week 3**: Phase 11 (Home Dashboard core widgets)
2. **Week 4**: Phase 18 (Illustrations), Phase 19 (Dark mode)

**Deliverable**: Working home dashboard with balance, recent transactions, quick actions

### Enhancement - Week 5-6: Feature Polish
**Goal**: Enhance existing features

1. **Week 5**: Phase 12 (Transaction form), Phase 13 (List animations), Phase 14 (Summary cards)
2. **Week 6**: Phase 15 (Skia charts), Phase 16 (Edit/Delete), Phase 20 (Haptics)

**Deliverable**: All user stories enhanced with animations

### Finalization - Week 7-8: Polish & QA
**Goal**: Production-ready quality

1. **Week 7**: Phase 21 (Micro-interactions), Phase 22 (Accessibility)
2. **Week 8**: Final Phase (Performance optimization, Visual QA, Documentation)

**Deliverable**: Production-ready app with 60fps animations, full accessibility

---

## Task Count Summary

- **Total Tasks**: 213
  - **Part 1 - Core Functionality (Completed)**: 39 tasks ✅
  - **Part 2 - Visual Refresh**: 46 tasks
  - **Part 3 - Home Dashboard**: 128 tasks

### Breakdown by Phase
- **Phase 1-7 (Core)**: 39 tasks ✅ COMPLETED
- **Phase 8 (Setup)**: 7 tasks (6 completed)
- **Phase 9 (Design System)**: 22 tasks
- **Phase 10 (Primitives)**: 17 tasks
- **Phase 11 (US0 - Home Dashboard)**: 26 tasks
- **Phase 12 (US1 - Transaction)**: 7 tasks
- **Phase 13 (US2 - List)**: 9 tasks
- **Phase 14 (US3 - Summary)**: 8 tasks
- **Phase 15 (US4 - Charts)**: 11 tasks
- **Phase 16 (US5 - Edit/Delete)**: 6 tasks
- **Phase 17 (Navigation)**: 7 tasks
- **Phase 18 (Illustrations)**: 6 tasks
- **Phase 19 (Dark Mode)**: 5 tasks
- **Phase 20 (Haptics)**: 4 tasks
- **Phase 21 (Micro-interactions)**: 4 tasks
- **Phase 22 (Accessibility)**: 6 tasks
- **Final Phase (Polish)**: 29 tasks

**Parallelizable Tasks**: ~60 (marked with [P])

**Estimated Timeline**: 8 weeks (1 developer)
- Week 1-2: Design System & Primitives
- Week 3-4: Home Dashboard
- Week 5-6: Feature Enhancement
- Week 7-8: Performance & Documentation

---

## Success Metrics

### Visual Quality
- ✅ Home dashboard loads in < 1s
- ✅ All animations run at 60fps
- ✅ Widgets have consistent elevation and spacing
- ✅ Glassmorphism effects render correctly on both platforms
- ✅ 95%+ alignment with iOS 18 design guidelines

### User Experience
- ✅ Balance count-up animation completes in 800ms
- ✅ Quick actions FAB expands with radial stagger
- ✅ Pull-to-refresh feels responsive and smooth
- ✅ All interactions have appropriate haptic feedback
- ✅ Smooth transitions between screens

### Performance
- ✅ Home screen renders within 1s (TTI)
- ✅ Widget animations don't drop frames
- ✅ Lazy loading keeps memory < 100MB
- ✅ Chart rendering: ≤ 1s for 5000 points
- ✅ All animations run at 60fps (validated with Reanimated Profiler)
- ✅ Screen load: ≤1.5s (TTI)
- ✅ Interaction response: ≤150ms

### Accessibility
- ✅ WCAG AAA contrast ratios maintained (21:1 for primary text)
- ✅ All widgets have accessibility labels
- ✅ Reduced motion preferences respected
- ✅ Dynamic type support (iOS)
- ✅ Screen reader compatibility (100% of UI)

---

## Home Dashboard Wireframe

```
┌─────────────────────────────────────┐
│ ☀️  Good morning, User!    [🌙]    │ ← Header with greeting & theme toggle
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │   💰 Current Balance            │ │ ← Balance Card (Level 2 elevation)
│ │   $12,450.00                    │ │   With count-up animation
│ │   ▲ $200 (2.3%) vs last month  │ │   
│ │   [Today] [Week] [Month]        │ │ ← Period selector
│ │   📊 Mini comparison chart      │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 📝 Recent Transactions          │ │ ← Recent widget
│ │ ├─ 🍔 Lunch         -$15.00    │ │   Last 5 transactions
│ │ ├─ 💼 Salary       +$3,000.00  │ │   with category icons
│ │ ├─ ☕ Coffee        -$5.50     │ │
│ │ └─ See all →                   │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 💡 Quick Insights               │ │ ← Insights widget
│ │ • Top spending: Food & Dining   │ │   AI-like summaries
│ │ • Savings rate: 15% this month  │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 📊 Spending Breakdown           │ │ ← Category breakdown
│ │ Food ████████░░ 45%  $450      │ │   Animated progress bars
│ │ Transport ████░░░░░░ 25%  $250  │ │
│ │ Shopping ██░░░░░░░░ 20%  $200   │ │
│ │ Other ██░░░░░░░░ 10%  $100      │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
                                    [➕] ← Expandable FAB
                                        └→ Add Transaction
                                        └→ View Trends
                                        └→ View Summary
```
