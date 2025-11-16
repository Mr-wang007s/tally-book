# Implementation Plan: Ledger Analytics (Multi‑platform)

## 1. Overview

This plan covers the implementation of Ledger Analytics with core functionality (COMPLETED in Phase 1-7) plus visual refresh enhancements (Phases 8-22) and home dashboard integration (Phases 11+).

**Key Enhancement Areas:**
- Visual refresh with iOS 18-inspired design (Reanimated 3, Skia charts, haptic feedback)
- Home dashboard as a 4th navigation tab
- True black dark mode with system detection
- Reduced motion accessibility support
- Cross-platform consistency (Web, iOS, Android)

---

## 2. Goals

### Primary Goals
- **Visual Excellence**: Achieve iOS 18-level design polish with consistent design tokens, animations, and dark mode support
- **User Experience**: Implement intuitive home dashboard and enhanced transaction flows with haptic feedback
- **Performance**: Meet SLOs: primary screens ≤1.5s, interactions ≤150ms, 60fps animations
- **Accessibility**: Support reduced motion preferences, WCAG AAA contrast, dynamic type scaling
- **Multi-platform Parity**: Identical behavior and terminology across Web, iOS, Android

### Secondary Goals
- Bundle size optimization (target: +500KB for new dependencies)
- 100% TypeScript coverage with strict mode
- Comprehensive test coverage (unit, integration, E2E)
- Clear documentation and design system references

---

## 3. Constitution Check

### Principle 1: Code Quality ✅
**Compliance**: 
- ✅ ESLint + Prettier configured per constitution
- ✅ TypeScript strict mode enabled
- ✅ Clear naming conventions for animations, services, components
- ✅ Public API documentation for theme system, haptics service, animation helpers
- ✅ Code review checklists will include design system consistency

**Actions**:
- Phase 9-10: Generate design system documentation
- Final Phase: Complete README sections for new patterns

### Principle 2: Testing Standards ✅
**Compliance**:
- ✅ Unit tests for aggregates service (calculations)
- ✅ Component tests for primitives (Button, Card, Sheet)
- ✅ Animation tests via snapshot tests and performance profiling
- ✅ Integration tests for theme switching
- ✅ E2E tests via user scenario validation

**Actions**:
- Phase 10: Add animation timing tests
- Phase 19: Add dark mode switch tests
- Phase 22: Add reduced motion accessibility tests
- Final Phase: Enforce coverage thresholds in CI

### Principle 3: Visual Excellence ✅
**Compliance**:
- ✅ iOS 18-inspired design tokens (colors, typography, spacing, elevation)
- ✅ Component states clearly defined (hover, focus, disabled, loading, error)
- ✅ Dark mode support with true black (#000000) for OLED optimization
- ✅ WCAG AAA contrast ratios (21:1 for primary text)
- ✅ Accessibility helpers for focus, labels, motion preferences

**Actions**:
- Phase 9: Define complete design token system
- Phase 19: Validate contrast ratios across themes
- Final Phase: Visual regression testing (light/dark modes)

### Principle 4: UX Consistency ✅
**Compliance**:
- ✅ Shared terminology: Income, Expense, Balance, Trends, Dashboard
- ✅ Consistent navigation: 4 tabs (Home, Transactions, Summary, Trends)
- ✅ Uniform feedback patterns: haptics, toasts, skeletons, empty states
- ✅ Standardized error messages across platforms
- ✅ Consistent form validation with inline errors

**Actions**:
- Phase 11-16: Implement widget-based consistency
- Phase 21: Complete micro-interaction patterns
- Final Phase: Cross-platform acceptance tests

### Principle 5: Performance ✅
**Compliance**:
- ✅ SLOs defined: Home screen <1s, interactions <150ms, trends <1s for 5k txns
- ✅ Performance budgets: +500KB for new dependencies, <100MB memory
- ✅ 60fps animations via Reanimated native driver
- ✅ Lazy loading for charts and heavy widgets
- ✅ Memoization for expensive calculations

**Actions**:
- Phase 8: Profile baseline performance
- Phase 15: Validate Skia chart performance (5k+ data points)
- Final Phase: Regression monitoring with performance profiling

**Constitution Status**: ✅ **COMPLIANT** — All five principles are supported by the plan.

---

## 4. Technical Context

### Platform & Framework
- **Framework**: React Native 0.76.5 with Expo SDK ~52.0.0
- **Navigation**: Expo Router (file-based routing) with 4 tabs
- **Language**: TypeScript 5.3+ (strict mode)
- **Storage**: AsyncStorage for local persistence
- **Styling**: React Native StyleSheet with design tokens

### Animation & Interaction
- **Animation Engine**: React Native Reanimated 3.x (native thread, 60fps)
- **Gesture Handler**: react-native-gesture-handler 2.14+
- **Haptic Feedback**: expo-haptics (browser Vibration API fallback for web)
- **Chart Rendering**: React Native Skia 1.0+ (GPU-accelerated, Trends screen only)
- **List Virtualization**: @shopify/flash-list 1.6+ (performant transaction lists)

### Design System
- **Theme Management**: Custom ThemeProvider context with system detection
- **Color Modes**: Light and True Black dark (#000000) with OLED optimization
- **Design Tokens**: iOS 18-inspired spacing (8pt grid), typography (SF Pro-inspired), elevation (5-level shadow system)
- **Components**: Primitives (Button, Card, Sheet, Pill), animations (FadeIn, SlideIn, ScaleIn, CountUp), feedback (Toast, Spinner, ProgressBar)

### Code Quality Tools
- **Linting**: ESLint with expo config
- **Formatting**: Prettier 3.3+
- **Type Checking**: TypeScript compiler in strict mode
- **CI/CD**: GitHub Actions (lint, type-check, tests)

### Data Model
- **Transaction**: id, type, amount, date, categoryId, note?, paymentMethod?
- **Category**: id, name, type, isDefault (14 default categories)
- **Summary**: period, totalIncome, totalExpense, balance
- **TrendPoint**: periodKey, expenseTotal (day/week/month granularity)
- **Theme**: mode (light/dark/auto), reducedMotion, hapticsFeedback

### Dependencies Added (Part 2 & 3)
- react-native-reanimated: ^3.6.0
- react-native-gesture-handler: ^2.14.0
- expo-haptics: ~13.0.0
- @shopify/react-native-skia: ^1.0.0
- @shopify/flash-list: ^1.6.0

---

## 5. Architecture & File Structure

```
src/
├── theme/
│   ├── tokens.ts           # Core design tokens
│   ├── colors.ts           # Light/dark color palettes
│   ├── typography.ts       # SF Pro-inspired type scale
│   ├── spacing.ts          # 8pt grid system
│   ├── elevation.ts        # 5-level shadow system
│   ├── radius.ts           # Border radius constants
│   ├── animations.ts       # Spring configs, easing curves
│   ├── effects.ts          # Glassmorphism, blur utilities
│   ├── layout.ts           # Dashboard grid system
│   └── breakpoints.ts      # Responsive breakpoints
├── components/
│   ├── primitives/
│   │   ├── Button.tsx      # Enhanced with haptics
│   │   ├── Card.tsx        # Elevated with shadows
│   │   ├── Sheet.tsx       # Bottom modal
│   │   ├── Pill.tsx        # Category chips
│   │   ├── IconButton.tsx  # Icon-only action
│   │   └── ConfirmSheet.tsx # Confirmation modal
│   ├── animations/
│   │   ├── FadeIn.tsx
│   │   ├── SlideIn.tsx
│   │   ├── ScaleIn.tsx
│   │   ├── Skeleton.tsx
│   │   ├── CountUp.tsx
│   │   ├── SuccessCheck.tsx
│   │   ├── Shimmer.tsx
│   │   └── Celebration.tsx
│   ├── feedback/
│   │   ├── Toast.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── Spinner.tsx
│   │   └── ProgressRing.tsx
│   ├── forms/
│   │   ├── AnimatedFormField.tsx
│   │   ├── CategorySelector.tsx
│   │   ├── AmountInput.tsx
│   │   └── TypingIndicator.tsx
│   ├── charts/
│   │   ├── SkiaBarChart.tsx    # Skia-based, animated
│   │   ├── SkiaDonutChart.tsx  # Skia-based, animated
│   │   ├── SkiaLineChart.tsx   # Skia-based, trends
│   │   ├── ChartLegend.tsx
│   │   ├── ChartTooltip.tsx
│   │   ├── ChartSkeleton.tsx
│   │   ├── TimeSeries.tsx      # Existing SVG (summary)
│   │   └── CategoryPie.tsx     # Existing SVG (summary)
│   ├── home/
│   │   ├── DashboardHeader.tsx
│   │   ├── DashboardSkeleton.tsx
│   │   ├── BalanceCard.tsx
│   │   ├── RecentTransactions.tsx
│   │   ├── TransactionMicroItem.tsx
│   │   ├── QuickInsights.tsx
│   │   ├── InsightCard.tsx
│   │   ├── SpendingBreakdown.tsx
│   │   ├── QuickActionsFAB.tsx
│   │   └── PeriodSelector.tsx
│   ├── transactions/
│   │   ├── SwipeableTransaction.tsx
│   │   ├── DateSection.tsx
│   │   └── TransactionItem.tsx (enhanced)
│   ├── summary/
│   │   ├── SummaryCard.tsx (enhanced)
│   │   └── PeriodComparison.tsx
│   ├── navigation/
│   │   ├── CustomTabBar.tsx
│   │   └── TabBadge.tsx
│   ├── illustrations/
│   │   ├── EmptyDashboard.tsx
│   │   ├── EmptyTransactions.tsx
│   │   ├── EmptyTrends.tsx
│   │   ├── Welcome.tsx
│   │   └── Confetti.tsx
│   ├── gestures/
│   │   └── SwipeableRow.tsx
│   ├── A11y.ts             # Accessibility helpers
│   ├── EmptyStates.tsx     # Shared empty states
│   ├── FormField.tsx       # Base form field
│   ├── ChartContainer.tsx  # Chart wrapper
│   ├── TransactionForm.tsx # Transaction form
│   ├── PeriodFilter.tsx    # Period selector
│   ├── SummaryCards.tsx    # Summary widget
│   ├── TrendControls.tsx   # Trend controls
│   └── Confirm.tsx         # Confirmation dialog
├── hooks/
│   ├── useTheme.ts         # Theme context hook
│   ├── useColorScheme.ts   # System appearance detection
│   ├── useReducedMotion.ts # Motion preference hook
│   ├── useHaptics.ts       # Haptic feedback hook
│   ├── useAnimation.ts     # Animation utilities
│   ├── usePeriodFilter.ts
│   └── useDebounce.ts
├── contexts/
│   ├── ThemeContext.tsx    # Theme + dark mode
│   └── ToastContext.tsx    # Toast notifications
├── services/
│   ├── transactions.ts     # CRUD operations
│   ├── aggregates.ts       # Summaries, trends
│   ├── validation.ts       # Form validation
│   ├── haptics.ts          # Haptic feedback service
│   ├── themeStorage.ts     # Theme persistence
│   ├── preferences.ts      # User preferences
│   └── metrics.ts          # Performance metrics
├── constants/
│   ├── perf.ts             # SLO constants
│   ├── haptics.ts          # Haptic taxonomy
│   └── categoryColors.ts   # Category-color mapping
├── models/
│   ├── transaction.ts
│   ├── category.ts
│   ├── summary.ts
│   └── trend.ts
├── storage/
│   ├── storage.ts          # Adapter interface
│   ├── localAdapter.ts     # AsyncStorage implementation
│   └── seeds/
│       └── categories.json
└── utils/
    ├── colors.ts           # Color manipulation
    ├── animations.ts       # Animation helpers
    ├── calculations.ts     # Data calculations
    ├── chartData.ts        # Chart data transforms
    ├── assets.ts           # Asset loader
    └── formats.ts          # Formatting utilities

app/
├── _layout.tsx             # Root layout (with ThemeProvider)
├── (tabs)/
│   ├── _layout.tsx         # Tab navigation
│   ├── index.tsx           # Redirect to home
│   ├── home.tsx            # Home dashboard screen
│   ├── transactions.tsx    # Transactions tab (redirect)
│   ├── summary.tsx         # Summary tab (redirect)
│   └── trends.tsx          # Trends tab (redirect)
├── home/
│   └── index.tsx           # Dashboard detail
├── transactions/
│   ├── index.tsx           # List screen
│   ├── add.tsx             # Add screen (bottom sheet)
│   └── [id]/
│       └── edit.tsx        # Edit screen
├── summary/
│   └── index.tsx           # Summary screen
└── trends/
    └── index.tsx           # Trends screen

scripts/
├── profileAnimations.ts    # 60fps validation
├── testContrast.ts         # WCAG AAA validation
├── testPerformance.ts      # Low-end device profiling
└── validateFPS.ts          # Production build validation
```

---

## 6. Phases & Task Breakdown

### Phase 1-7: Core Functionality (✅ COMPLETED)
- Basic transaction CRUD, summaries, trends
- Default categories (14 total)
- Simple SVG charts
- Basic styling with design tokens

### Phase 8-10: Foundation (Visual Refresh)
- Reanimated 3, gesture handler, expo-haptics setup
- Enhanced design system (colors, typography, animations, haptics)
- Primitive components (Button, Card, Sheet, animations)

### Phase 11-16: Feature Enhancement
- Home dashboard (US0) - 4th tab
- Enhanced transaction recording (US1 refresh)
- Animated transaction list (US2 refresh)
- Widget-style summary (US3 refresh)
- Skia-based trends charts (US4 refresh)
- Enhanced edit/delete (US5)

### Phase 17-22: Integration & Polish
- Navigation & tab bar (custom icons, haptics)
- Illustrations & empty states
- Dark mode & theme integration
- Haptic feedback system-wide
- Micro-interactions (ripple, shimmer, toasts)
- Accessibility & motion preferences

### Final Phase: Performance & QA
- Frame rate profiling (60fps validation)
- Bundle size optimization
- Visual regression testing
- Performance profiling on low-end devices
- Documentation & guides

---

## 7. Key Implementation Decisions

| Decision | Rationale | Tradeoff |
|----------|-----------|----------|
| **Skia charts selective use** | GPU acceleration for trends animations | +500KB bundle, excluded from dashboard |
| **True black dark mode** | OLED battery optimization (15-30% savings) | Requires contrast testing |
| **Haptics on all platforms** | Consistent UX, graceful fallback on unsupported | Browser API unreliable on web |
| **Respect reduced motion** | Accessibility requirement (WCAG AAA) | Instant transitions feel less polished |
| **4-tab navigation** | Preserve existing tabs + add dashboard | Navigation becomes more complex |

---

## 8. Success Criteria

### Functional
- ✅ Home dashboard displays balance, last 5 transactions, top category, spending breakdown
- ✅ All 4 tabs (Home, Transactions, Summary, Trends) load in <1s
- ✅ Trend granularity switches update in <1s for ≤5k transactions
- ✅ Haptic feedback triggers consistently across platforms

### Performance
- ✅ Home screen TTI ≤1s (typical datasets)
- ✅ Interaction response ≤150ms
- ✅ Animations run at 60fps (validated with profiler)
- ✅ Chart rendering ≤1s for 5000 data points

### Quality
- ✅ Zero ESLint errors, TypeScript strict mode passes
- ✅ Unit test coverage ≥80% (aggregates, validation, utils)
- ✅ WCAG AAA contrast ratios (21:1 for primary text)
- ✅ Reduced motion preferences respected

### Cross-platform
- ✅ Identical terminology and behavior (Web, iOS, Android)
- ✅ Dark/light mode renders correctly on all platforms
- ✅ Touch targets ≥44pt on mobile, keyboard navigation on web

---

## 9. Risk Mitigation

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Reanimated 3 learning curve | Medium | 2-day team upskilling + documentation |
| Performance regression on low-end devices | High | Profile on iPhone 8, Android 8 weekly |
| Haptics API unreliability on web | Medium | Fallback to visual feedback only |
| Chart animations cause frame drops | High | Use native driver, lazy load charts |
| Dark mode contrast issues | Medium | Automated contrast testing in CI |
| Reduced motion breaks UX feel | Low | Maintain essential feedback visibility |

---

## 10. Dependencies & Constraints

### Tech Stack Locked
- React Native 0.76.5, Expo SDK ~52, TypeScript 5.3+
- All new dependencies approved: Reanimated 3, Gesture Handler, Skia, FlashList, expo-haptics

### Platform Constraints
- iOS 12+, Android API 21+, modern browsers (Chrome 90+, Safari 14+)
- Bundle size budget: +500KB for new libraries
- Memory footprint: <100MB typical, <120MB peak

### Accessibility Requirements
- WCAG AAA contrast (21:1 primary, 7:1 secondary)
- Dynamic type support (iOS)
- Keyboard navigation (web)
- Screen reader compatibility

---

## 11. Recommended Execution Order

1. **Week 1**: Phases 8-10 (Foundation + primitives)
2. **Week 2**: Phase 11 (Home dashboard MVP)
3. **Week 3**: Phases 12-14 (Transaction, summary, list enhancements)
4. **Week 4**: Phase 15-16 (Charts, edit/delete)
5. **Week 5-6**: Phases 17-22 (Navigation, dark mode, accessibility, micro-interactions)
6. **Week 7-8**: Final phase (Performance profiling, visual QA, documentation)

**Estimated Total**: 8 weeks (1 developer), 4-5 weeks (2 developers with parallel phases 12-16)

---

## 12. Next Steps

1. ✅ Constitution check: **PASSED**
2. ✅ Specification clarified: Home dashboard tab, haptics consistency, Skia selective use, motion accessibility, true black dark mode
3. ✅ Data model: Complete with new Theme entity
4. ✅ Research documented: Design decisions, tech rationale
5. ⏭️ **NEXT**: Execute Phase 8-10 (foundation), then proceed to Phase 11+ (home dashboard)

---

## Appendix: Related Documents

- `spec.md` — Complete feature specification with clarifications
- `research.md` — Technical decisions and rationale (iOS 18 design, Reanimated 3, Skia, haptics)
- `data-model.md` — Entity definitions and relationships
- `tasks.md` — 213 tasks across 22 phases (Part 1: completed, Part 2-3: in progress)
- `quickstart.md` — Development commands and key flows
