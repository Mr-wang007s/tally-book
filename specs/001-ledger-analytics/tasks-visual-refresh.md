# Task Breakdown: Visual & Interaction Refresh (iOS 18-Inspired)

This document breaks down the visual and interaction enhancement work for My Tally Book, implementing iOS 18 design language with fluid animations, haptic feedback, and Skia-based charts.

## Task Categories

- **Setup**: Project configuration, dependencies, tooling
- **Design-System**: Design tokens, theme system, color modes
- **Animation**: Reanimated 3 setup, gesture handlers, physics-based animations
- **Components**: Primitive UI components (Button, Card, Sheet, etc.)
- **Charts**: Skia-based chart components with animations
- **Integration**: Applying new design system to existing screens
- **Polish**: Performance optimization, accessibility, visual QA

---

## Phase 1 — Setup & Dependencies

- [X] T001 Install Reanimated 3 and Gesture Handler `package.json`, `babel.config.js`
- [X] T002 Install expo-haptics for tactile feedback `package.json`
- [X] T003 Install React Native Skia for GPU-accelerated charts `package.json`
- [X] T004 Install @shopify/flash-list for performant lists `package.json`
- [X] T005 Configure Reanimated plugin in Babel `babel.config.js`
- [X] T006 Update TypeScript config for strict mode `tsconfig.json`
- [X] T007 Create .prettierignore and .eslintignore for performance `.prettierignore`, `.eslintignore`
- [X] T008 Update metro.config.js for Skia support `metro.config.js`

---

## Phase 2 — Design System Foundation

### Theme & Colors

- [ ] T009 Create enhanced color system with light/dark modes `src/theme/colors.ts`
- [ ] T010 Update design tokens with iOS 18 values `src/theme/tokens.ts`
- [ ] T011 Create typography scale (SF Pro-inspired) `src/theme/typography.ts`
- [ ] T012 Create spacing constants (8pt grid) `src/theme/spacing.ts`
- [ ] T013 Create elevation/shadow definitions (5 levels) `src/theme/elevation.ts`
- [ ] T014 Create border radius constants `src/theme/radius.ts`

### Theme System

- [ ] T015 Implement ThemeProvider context `src/contexts/ThemeContext.tsx`
- [ ] T016 Create useTheme hook `src/hooks/useTheme.ts`
- [ ] T017 Create useColorScheme hook for dark mode detection `src/hooks/useColorScheme.ts`
- [ ] T018 Implement theme persistence to AsyncStorage `src/services/themeStorage.ts`
- [ ] T019 [P] Create color manipulation utilities `src/utils/colors.ts`

### Animation System

- [ ] T020 Create animation presets (spring configs) `src/theme/animations.ts`
- [ ] T021 Create timing curve definitions `src/theme/easings.ts`
- [ ] T022 Create useAnimation hook `src/hooks/useAnimation.ts`
- [ ] T023 Create animation helper utilities `src/utils/animations.ts`

### Haptics System

- [ ] T024 Create haptics service wrapper `src/services/haptics.ts`
- [ ] T025 Create useHaptics hook `src/hooks/useHaptics.ts`
- [ ] T026 [P] Define haptic feedback taxonomy (impact/notification/selection) `src/constants/haptics.ts`

---

## Phase 3 — Primitive Components

### Animation Components

- [ ] T027 [P] Create FadeIn animation component `src/components/animations/FadeIn.tsx`
- [ ] T028 [P] Create SlideIn animation component `src/components/animations/SlideIn.tsx`
- [ ] T029 [P] Create ScaleIn animation component `src/components/animations/ScaleIn.tsx`
- [ ] T030 [P] Create Skeleton loading component `src/components/animations/Skeleton.tsx`

### Base Components

- [ ] T031 Create enhanced Button component with haptics `src/components/primitives/Button.tsx`
- [ ] T032 Create Card component with elevation `src/components/primitives/Card.tsx`
- [ ] T033 Create Sheet (bottom modal) component `src/components/primitives/Sheet.tsx`
- [ ] T034 [P] Create Pill (category chip) component `src/components/primitives/Pill.tsx`
- [ ] T035 [P] Create IconButton component `src/components/primitives/IconButton.tsx`

### Feedback Components

- [ ] T036 Create Toast notification component `src/components/feedback/Toast.tsx`
- [ ] T037 [P] Create ProgressBar component `src/components/feedback/ProgressBar.tsx`
- [ ] T038 [P] Create Spinner loading component `src/components/feedback/Spinner.tsx`
- [ ] T039 Create ToastProvider context `src/contexts/ToastContext.tsx`

---

## Phase 4 — User Story US1: Enhanced Transaction Recording

Story goal: Rebuild transaction creation with iOS 18-style bottom sheet, haptic feedback, and smooth animations.

Independent test criteria:
- Bottom sheet slides up with spring animation (damping: 15)
- Form fields provide haptic feedback on tap and error states
- Category selection uses animated pill chips
- Save action triggers success haptic and animates sheet closure

Implementation tasks:

- [ ] T040 [US1] Rebuild Add Transaction as bottom sheet `app/transactions/add.tsx`
- [ ] T041 [P] [US1] Create animated form field component `src/components/forms/AnimatedFormField.tsx`
- [ ] T042 [US1] Add haptic feedback to form interactions `app/transactions/add.tsx`
- [ ] T043 [P] [US1] Create category pill selector with animations `src/components/forms/CategorySelector.tsx`
- [ ] T044 [US1] Implement spring-based sheet animations `app/transactions/add.tsx`
- [ ] T045 [US1] Add success/error toast notifications `app/transactions/add.tsx`
- [ ] T046 [P] [US1] Create empty state illustration for first transaction `src/components/EmptyStates.tsx`

---

## Phase 5 — User Story US2: Animated Transaction List

Story goal: Enhance transaction list with swipe gestures, staggered animations, and pull-to-refresh.

Independent test criteria:
- List items fade in with staggered delay (50ms per item)
- Left swipe reveals delete action with red background
- Right swipe reveals edit action with blue background
- Pull-to-refresh shows spring animation
- Item deletion animates out smoothly

Implementation tasks:

- [ ] T047 [US2] Replace FlatList with FlashList for performance `app/transactions/index.tsx`
- [ ] T048 [US2] Add staggered fade-in animation for list items `app/transactions/index.tsx`
- [ ] T049 [US2] Implement swipe-to-delete gesture `src/components/transactions/TransactionItem.tsx`
- [ ] T050 [US2] Implement swipe-to-edit gesture `src/components/transactions/TransactionItem.tsx`
- [ ] T051 [P] [US2] Create SwipeableRow component `src/components/gestures/SwipeableRow.tsx`
- [ ] T052 [US2] Add pull-to-refresh with spring animation `app/transactions/index.tsx`
- [ ] T053 [US2] Add haptic feedback for swipe actions `src/components/transactions/TransactionItem.tsx`
- [ ] T054 [US2] Implement delete animation (slide-out + fade) `src/components/transactions/TransactionItem.tsx`

---

## Phase 6 — User Story US3: Widget-Style Summary Cards

Story goal: Redesign summary cards with elevated shadows, glassmorphism, and count-up animations.

Independent test criteria:
- Cards have Level 2 elevation with subtle shadows
- Amount values animate with count-up effect (800ms)
- Period toggle morphs between month/week/custom
- Glassmorphism overlay on card backgrounds
- Theme switch animates card colors smoothly

Implementation tasks:

- [ ] T055 [US3] Rebuild SummaryCards with elevation system `src/components/SummaryCards.tsx`
- [ ] T056 [P] [US3] Create count-up animation for amounts `src/components/animations/CountUp.tsx`
- [ ] T057 [US3] Add glassmorphism effect to cards `src/components/SummaryCards.tsx`
- [ ] T058 [US3] Animate period toggle with morph effect `src/components/PeriodFilter.tsx`
- [ ] T059 [US3] Add skeleton loader for summary screen `app/summary/index.tsx`
- [ ] T060 [US3] Implement refresh animation for summary data `app/summary/index.tsx`

---

## Phase 7 — User Story US4: Skia-Based Animated Charts

Story goal: Replace SVG charts with Skia for GPU-accelerated, 60fps animated visualizations.

Independent test criteria:
- Bar chart bars grow from 0 with staggered spring (50ms delay)
- Donut chart segments draw clockwise with easeInOut
- Granularity toggle cross-fades charts (300ms)
- Legend fades in after chart animation completes
- Charts render at 60fps for 5000+ data points

Implementation tasks:

- [ ] T061 [US4] Create Skia BarChart component `src/components/charts/BarChart.tsx`
- [ ] T062 [US4] Implement bar growth animation with stagger `src/components/charts/BarChart.tsx`
- [ ] T063 [US4] Create Skia DonutChart component `src/components/charts/DonutChart.tsx`
- [ ] T064 [US4] Implement clockwise segment drawing animation `src/components/charts/DonutChart.tsx`
- [ ] T065 [P] [US4] Create chart legend component `src/components/charts/ChartLegend.tsx`
- [ ] T066 [US4] Add cross-fade transition for granularity change `app/trends/index.tsx`
- [ ] T067 [US4] Implement chart skeleton loader `src/components/charts/ChartSkeleton.tsx`
- [ ] T068 [US4] Add lazy loading for chart components `app/trends/index.tsx`
- [ ] T069 [P] [US4] Create chart data transformation utilities `src/utils/chartData.ts`

---

## Phase 8 — User Story US5: Enhanced Edit/Delete Flow

Story goal: Improve edit screen with animations, haptic confirmations, and visual feedback.

Independent test criteria:
- Edit screen slides in from right with spring
- Form fields have focus animations
- Delete button shows confirmation sheet with warning haptic
- Save success triggers medium haptic and toast
- Changes reflect immediately in list with animation

Implementation tasks:

- [ ] T070 [US5] Add screen transition animation for edit flow `app/transactions/[id]/edit.tsx`
- [ ] T071 [US5] Implement focus animations for form fields `app/transactions/[id]/edit.tsx`
- [ ] T072 [US5] Replace Alert with animated confirmation sheet `src/components/primitives/ConfirmSheet.tsx`
- [ ] T073 [US5] Add warning haptic for destructive actions `app/transactions/[id]/edit.tsx`
- [ ] T074 [US5] Add save success haptic and toast `app/transactions/[id]/edit.tsx`
- [ ] T075 [US5] Animate list update after edit `app/transactions/index.tsx`

---

## Phase 9 — Dark Mode & Theme Integration

- [ ] T076 Implement system appearance listener `src/hooks/useColorScheme.ts`
- [ ] T077 Add theme toggle to settings (if settings screen exists) `app/settings/index.tsx`
- [ ] T078 Update all screens to use theme colors `app/**/*.tsx`
- [ ] T079 Implement smooth theme transition animation (300ms) `src/contexts/ThemeContext.tsx`
- [ ] T080 Test contrast ratios for WCAG AAA compliance `scripts/testContrast.ts`
- [ ] T081 Add theme preference persistence `src/services/themeStorage.ts`

---

## Phase 10 — Accessibility & Motion Preferences

- [ ] T082 Implement reduced motion detection `src/hooks/useReducedMotion.ts`
- [ ] T083 Add conditional animation logic for reduced motion `src/utils/animations.ts`
- [ ] T084 Test dynamic type scaling (iOS) `app/**/*.tsx`
- [ ] T085 Add accessibility labels to all animated components `src/components/**/*.tsx`
- [ ] T086 Test VoiceOver/TalkBack navigation `app/**/*.tsx`
- [ ] T087 Verify focus indicators for keyboard navigation `src/components/**/*.tsx`

---

## Final Phase — Performance & Polish

### Performance Optimization

- [ ] T088 Profile animation frame rates with Reanimated Profiler `scripts/profileAnimations.ts`
- [ ] T089 Optimize Skia chart rendering for 5000+ points `src/components/charts/*.tsx`
- [ ] T090 Add memoization to expensive chart calculations `src/utils/chartData.ts`
- [ ] T091 Implement lazy loading for heavy animations `app/**/*.tsx`
- [ ] T092 Optimize bundle size (target: +500KB max) `package.json`
- [ ] T093 Test performance on low-end devices (iPhone 8, Android 8) `scripts/testPerformance.ts`

### Visual QA

- [ ] T094 Visual regression testing for light/dark mode `tests/visual/*.test.ts`
- [ ] T095 Verify elevation shadows on all platforms `app/**/*.tsx`
- [ ] T096 Test glassmorphism fallback on Android `src/components/primitives/Card.tsx`
- [ ] T097 Validate spring animation feel across interactions `app/**/*.tsx`
- [ ] T098 Test haptic timing for all interactions `src/services/haptics.ts`
- [ ] T099 Verify 60fps animations in production build `scripts/validateFPS.ts`

### Documentation

- [ ] T100 Update quickstart with animation examples `specs/001-ledger-analytics/quickstart.md`
- [ ] T101 Document theme system usage `README.md`
- [ ] T102 Document haptic feedback taxonomy `README.md`
- [ ] T103 Create animation cookbook with examples `docs/animations.md`
- [ ] T104 Update CODEBUDDY.md with new dependencies `CODEBUDDY.md`

---

## Dependencies (Story Completion Order)

### Parallel Phases
- Phase 2 (Design System) and Phase 3 (Primitives) can run in parallel after Phase 1

### Sequential Dependencies
1. **Phase 1** (Setup) → **Phase 2** (Design System) → **Phase 3** (Primitives)
2. **Phase 3** (Primitives) → **Phase 4-8** (User Stories - can run in parallel)
3. **Phase 4-8** (User Stories) → **Phase 9** (Dark Mode Integration)
4. **Phase 9** (Dark Mode) → **Phase 10** (Accessibility)
5. **Phase 10** (Accessibility) → **Final Phase** (Performance & Polish)

### User Story Independence
- **US1** (Transaction Recording): Depends on primitives (Button, Sheet, Toast)
- **US2** (Transaction List): Independent, can run parallel to US1
- **US3** (Summary Cards): Independent, can run parallel to US1-2
- **US4** (Charts): Independent, can run parallel to US1-3
- **US5** (Edit/Delete): Depends on US1 (shares form components)

---

## Parallel Execution Examples

### Within Phase 2 (Design System)
- T019 (color utils) parallel with T026 (haptics constants)

### Within Phase 3 (Primitives)
- T027-030 (Animation components) can all run in parallel
- T034-035 (Pill, IconButton) can run in parallel
- T037-038 (ProgressBar, Spinner) can run in parallel

### Within Phase 4 (US1)
- T041 (AnimatedFormField) parallel with T043 (CategorySelector)
- T046 (EmptyStates) can run independently

### Within Phase 5 (US2)
- T051 (SwipeableRow) parallel with T052 (pull-to-refresh)

### Within Phase 6 (US3)
- T056 (CountUp animation) parallel with T057 (glassmorphism)

### Within Phase 7 (US4)
- T061-062 (BarChart) parallel with T063-064 (DonutChart)
- T065 (ChartLegend) parallel with T067 (ChartSkeleton)
- T069 (chartData utils) can run independently

### Cross-Phase Parallelization
- All user story phases (4-8) can run in parallel once Phase 3 completes
- Dark mode integration (Phase 9) can begin once Phase 2 completes

---

## Implementation Strategy

### MVP Approach (Week 1-2)
**Goal**: Deliver core visual refresh with animations

1. **Phase 1-2**: Setup + Design System Foundation
2. **Phase 3**: Build primitive components
3. **Phase 4**: Enhance transaction creation (US1)
4. **Phase 6**: Widget-style summary cards (US3)

### Incremental Delivery (Week 3-4)
**Goal**: Add advanced features and polish

1. **Phase 5**: Animated transaction list (US2)
2. **Phase 7**: Skia-based charts (US4)
3. **Phase 8**: Enhanced edit/delete (US5)
4. **Phase 9-10**: Dark mode + Accessibility
5. **Final Phase**: Performance optimization + Visual QA

### Feature Flags (Optional)
- `ENABLE_SKIA_CHARTS`: Toggle Skia vs SVG charts
- `ENABLE_HAPTICS`: Toggle haptic feedback
- `ENABLE_ANIMATIONS`: Toggle all animations (accessibility)
- `ENABLE_GLASSMORPHISM`: Toggle glass effects

---

## Testing Strategy (If TDD Requested)

### Unit Tests
- Animation timing functions
- Spring physics calculations
- Color manipulation utilities
- Haptic taxonomy mappings

### Component Tests
- Button haptic triggers
- Card elevation rendering
- Sheet animation lifecycle
- Toast queue management

### Integration Tests
- Theme switching flow
- Chart data transformation
- Swipe gesture recognition
- Form validation with haptics

### Performance Tests
- 60fps animation validation
- Chart render time (<1s for 5k points)
- Memory usage (<100MB)
- Bundle size increase (<500KB)

### Accessibility Tests
- Reduced motion preferences
- Dynamic type scaling
- VoiceOver/TalkBack navigation
- Contrast ratio validation (WCAG AAA)

---

## Success Metrics

### Visual Quality
- 95%+ alignment with iOS 18 design guidelines
- All screens pass visual regression tests
- Elevation shadows render correctly on all platforms

### Performance
- All animations run at 60fps (validated with Reanimated Profiler)
- Chart rendering: ≤1s for 5000 data points
- Screen load: ≤1.5s (TTI)
- Interaction response: ≤150ms

### Accessibility
- WCAG AAA contrast ratios (21:1 for primary text)
- Reduced motion preferences respected
- Dynamic type support (iOS)
- Screen reader compatibility (100% of UI)

### User Experience
- Haptic feedback present for all primary actions
- Smooth transitions between screens
- Delightful micro-interactions
- Consistent visual language across platforms

---

## Task Count Summary

- **Total Tasks**: 104
- **Phase 1 (Setup)**: 8 tasks
- **Phase 2 (Design System)**: 18 tasks
- **Phase 3 (Primitives)**: 13 tasks
- **Phase 4 (US1)**: 7 tasks
- **Phase 5 (US2)**: 8 tasks
- **Phase 6 (US3)**: 6 tasks
- **Phase 7 (US4)**: 9 tasks
- **Phase 8 (US5)**: 6 tasks
- **Phase 9 (Dark Mode)**: 6 tasks
- **Phase 10 (Accessibility)**: 6 tasks
- **Final Phase (Polish)**: 17 tasks

**Parallelizable Tasks**: 32 (marked with [P])

**Estimated Timeline**: 4 weeks (1 developer)
- Week 1: Phases 1-3 (Foundation)
- Week 2: Phases 4-6 (Core UX enhancements)
- Week 3: Phases 7-8 (Advanced features)
- Week 4: Phases 9-Final (Integration & Polish)


**READ**
tasks-visual-refresh.mds