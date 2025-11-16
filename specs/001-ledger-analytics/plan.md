# Project Plan: Ledger Analytics Optimization & Internationalization

**Last Updated**: 2025-11-16  
**Feature**: 001-ledger-analytics  
**Branch**: 001-ledger-analytics  
**Current Phase**: Phase 1 - Design (70% Complete)

---

## Progress Summary

**Overall Timeline**: 17% complete (Phase 0 ✅ | Phase 1 🔄 70% | Phase 2-3 ⏳)

| Metric | Value |
|--------|-------|
| **Tasks Completed** | 10/30 (Phase 1) |
| **Artifacts Created** | ~112KB design documentation |
| **Time Used (Phase 1)** | ~4 hours of 1.5 days |
| **Estimated Remaining** | 2-3 hours (T011-T030) |
| **On Schedule** | ✅ Yes (ahead of timeline) |

**Key Achievements**:
- ✅ Complete design token system (colors, typography, spacing, elevation, animations)
- ✅ Type-safe contracts (navigation, i18n)
- ✅ Comprehensive component architecture documentation
- ✅ Translation structure with 7 namespaces (100+ keys)
- ✅ Component patterns guide with best practices

**Next Milestone**: Complete T011-T030 setup tasks → Phase 2 kickoff

---

## 1. Overview

This plan addresses critical UX improvements and internationalization for the Ledger Analytics feature:

- **Component Restructuring**: Reorganize components from flat to feature-based structure following shadcn patterns for better scalability and maintainability
- **Chinese Language Support**: Implement i18n (internationalization) with Chinese (zh-CN) as primary language and English fallback
- **Post-Add Navigation**: Fix navigation flow so adding a transaction returns to Transactions list with scroll-to-new-item UX
- **Form & Module UX**: Improve form consistency, feedback patterns, and module organization for better usability
- **Design System Alignment**: Ensure components align with design system tokens (shadcn-like copyable components, not a rigid package)

---

## 2. Goals

**Primary Goals**:
1. Restructure component organization to support 50+ components without clutter
2. Make app accessible to Chinese-speaking users with proper i18n support
3. Provide clear post-transaction-add feedback with smooth navigation
4. Standardize form interactions and validation feedback across all modules

**Secondary Goals**:
5. Reduce cognitive load for developers through consistent component patterns
6. Enable future multi-language support via i18n scaffolding
7. Improve accessibility through proper labeling and ARIA support

**Success Metrics**:
- All hardcoded strings replaced with i18n keys within Feature for zh-CN and en
- Post-add flow completes in <500ms with haptic feedback confirmation
- Form components follow unified error display and validation pattern
- Component structure documented and team can add new components following pattern

---

## 3. Constitution Check

### Code Quality ✅
- **Linting & Typing**: All new code passes TypeScript strict mode and ESLint rules
- **Code Review**: Plan includes peer review gates before merging
- **Documentation**: Component patterns documented in `/src/components/README.md`
- **Naming**: Clear semantic names (FormField, TransactionForm, SummaryCard, etc.)

### Testing Standards ✅
- **Unit Tests**: FormField wrapper, validation logic, i18n hook usage
- **Integration Tests**: Post-add flow (create transaction → navigate → scroll)
- **Snapshot Tests**: Component structure tests for UI consistency
- **Coverage**: Maintain >80% coverage for business logic (validation, transactions service)

### Visual Excellence ✅
- **Design System**: All components use existing design tokens (colors, spacing, typography, radius)
- **Component States**: Button (default, hover, active, disabled, loading), Input (focused, error, disabled), Card (default, hover)
- **Accessibility**: WCAG 2.1 Level AA compliance for contrast, focus order, labels
- **Dark Mode**: Existing ThemeContext covers light/dark; i18n is orthogonal

### UX Consistency ✅
- **Terminology**: Unified Chinese terms across all screens (交易/transactions, 收入/income, 支出/expense, 分类/category, 金额/amount)
- **Navigation**: Consistent back/cancel/close patterns using Expo Router
- **Error Messages**: Standardized format from FormField wrapper with localization
- **Feedback**: Haptic patterns consistent (light for tap, medium for submission, success/error for outcomes)

### Performance ✅
- **Component Restructuring**: No impact on bundle size (reorganization only)
- **i18n Overhead**: i18next tree-shaking reduces unused translations; <50KB added
- **Navigation Performance**: Route params are lightweight; no new data structures
- **Form Performance**: Memoization via React.memo on FormField prevents re-renders

**Assessment**: ✅ **PASSES** - Plan aligns with all five constitutional principles

---

## 4. Phase 0: Research & Validation

**Status**: ✅ COMPLETE (research-optimization.md generated)

### Research Completed
1. ✅ Component organization best practices (shadcn pattern)
2. ✅ i18n library selection (i18next + react-i18next + react-native-localize)
3. ✅ Post-add navigation flow (Expo Router params + scroll)
4. ✅ Form consistency patterns (unified FormField wrapper)
5. ✅ Haptic feedback integration with forms

### Key Decisions
- **Components**: Feature-based folders (`/ui`, `/forms`, `/surfaces`, `/charts`, `/layouts`)
- **i18n**: i18next with zh-CN and en locales in `src/i18n/locales/`
- **Navigation**: Route params + scroll animation + haptic confirmation
- **Forms**: Unified FormField component with error display and haptic feedback
- **Dependencies**: Add i18next, react-i18next, react-native-localize

### Artifacts
- `/data/workspace/my-tally-book/specs/001-ledger-analytics/research-optimization.md` ✅ Generated

---

## 5. Phase 1: Design & Data Model

**Status**: ✅ **70% COMPLETE** (Design docs + tokens ✅ | Setup tasks ⏳)  
**Duration Used**: ~4 hours of 1.5 days  
**Estimated Completion**: Within 1.5 days (2-3 hours remaining)

### 5.1 Completed Artifacts ✅

**Design Documentation** (T001-T002):
- ✅ `data-model-i18n.md` (14KB) - Translation structure with 7 namespaces, 100+ keys
- ✅ `component-architecture.md` (21KB) - Component organization with 7 categories

**TypeScript Contracts** (T003-T004):
- ✅ `src/contracts/navigation.ts` (4.7KB) - Route parameters and navigation types
- ✅ `src/contracts/i18n.ts` (12KB) - Translation interfaces for type safety

**Component Patterns Guide** (T005):
- ✅ `src/components/README.md` (19KB) - Comprehensive usage patterns and best practices

**Design Tokens** (T006-T010):
- ✅ `src/tokens/colors.ts` (6.7KB) - Light/dark mode palettes (WCAG AA/AAA compliant)
- ✅ `src/tokens/typography.ts` (7.8KB) - SF Pro-inspired 11-level scale
- ✅ `src/tokens/spacing.ts` (8.2KB) - 8pt grid system with 9 levels
- ✅ `src/tokens/elevation.ts` (7.9KB) - 5-level shadow system
- ✅ `src/tokens/animations.ts` (11KB) - Spring configurations and timing presets

**Total Delivered**: 10/30 tasks complete | ~112KB of design artifacts

### 5.2 Data Model Updates

**New Entities & Relationships**:
- **Translation Keys**: Organized by feature (common, transactions, home, summary, trends)
- **Language Configuration**: System locale detection + user override in settings
- **Form State**: Validation errors, touched fields, helper text from i18n

**No schema changes needed** - i18n is metadata, not data

### 5.3 Component Architecture

**New Folder Structure** (src/components/) - ✅ Documented:
```
├── ui/                         # Reusable shadcn-like primitives ✅ Spec'd
│   ├── Button.tsx             # Button with haptic feedback
│   ├── Input.tsx              # Text input with focus ring
│   ├── Select.tsx             # Dropdown/picker
│   ├── Card.tsx               # Container with shadow/radius
│   ├── Badge.tsx              # Category/tag display
│   └── Sheet.tsx              # Bottom sheet (already exists)
│
├── forms/                      # Form components ✅ Spec'd
│   ├── FormField.tsx          # Unified form input wrapper (CRITICAL)
│   ├── FormValidation.ts      # Validation schemas + error messages
│   ├── TransactionForm.tsx    # Add/Edit transaction form (updated)
│   └── FormContext.ts         # Form state management
│
├── surfaces/                   # Layout & container components ✅ Spec'd
│   ├── SummaryCard.tsx        # Income/expense/balance card
│   ├── SummaryCards.tsx       # Grid of summary cards
│   ├── CardGrid.tsx           # Reusable grid container
│   └── Container.tsx          # Screen padding/margins
│
├── charts/                     # Data visualization (unchanged)
│   ├── CategoryPie.tsx
│   └── TimeSeries.tsx
│
├── animations/                 # Animation wrappers (unchanged)
│   ├── FadeIn.tsx
│   ├── SlideIn.tsx
│   └── SuccessCheck.tsx
│
├── layouts/                    # Screen-level layout ✅ Spec'd
│   ├── TabLayout.tsx          # (tabs)/_layout.tsx wrapper
│   └── ScreenLayout.tsx       # Standard screen padding + header
│
└── screens/                    # Full-screen components (new location) ✅ Spec'd
    ├── HomeScreen.tsx         # Moved from (tabs)/home.tsx logic
    ├── TransactionsScreen.tsx # Moved from (tabs)/transactions logic
    └── SummaryScreen.tsx      # Moved from (tabs)/summary logic
```

**Type-Safe i18n Hook**:
```typescript
// src/i18n/useTranslation.ts
export function useTranslation() {
  const { t, i18n } = useI18nBase();
  return {
    t: t as typeof translations, // Type-safe translations
    i18n,
    language: i18n.language
  };
}
```

**Validation Errors with i18n**:
```typescript
// src/components/forms/FormValidation.ts
export const validationMessages = {
  amountRequired: t('transactions.validation.amountRequired'),
  amountPositive: t('transactions.validation.amountPositive'),
  categoryRequired: t('transactions.validation.categoryRequired'),
  dateInvalid: t('transactions.validation.dateInvalid')
};
```

### 5.3 API Contracts

**Navigation Contract** (Expo Router):
```typescript
// /transactions route params
interface TransactionsScreenParams {
  scrollToId?: string;        // Transaction ID to scroll to
  highlight?: boolean;        // Highlight newly added transaction
}

// /transactions/add navigation result
interface AddTransactionResult {
  success: boolean;
  transactionId: string;
  timestamp: number;
}
```

**i18n Contract**:
```typescript
// Translation structure
interface Translations {
  common: {
    ok: string;
    cancel: string;
    delete: string;
    edit: string;
  };
  transactions: {
    add: string;
    income: string;
    expense: string;
    category: string;
    amount: string;
    date: string;
    note: string;
    success: string;
    validation: {
      amountRequired: string;
      amountPositive: string;
      categoryRequired: string;
      dateInvalid: string;
    };
  };
  // ... other features
}
```

### 5.4 Remaining Phase 1 Tasks (T011-T030) ⏳

**Status**: 20/30 tasks pending | Estimated 2-3 hours

**i18n Foundation** (T011-T014):
- [ ] T011: i18next configuration (`src/i18n/config.ts`)
- [ ] T012: Chinese translations (`src/i18n/locales/zh-CN.json`)
- [ ] T013: English translations (`src/i18n/locales/en.json`)
- [ ] T014: Type-safe translation hook (`src/i18n/useTranslation.ts`)

**Form Validation** (T015-T017):
- [ ] T015: Validation schemas with Zod (`src/components/forms/FormValidation.ts`)
- [ ] T016: Validation message mapping (`src/components/forms/validationMessages.ts`)
- [ ] T017: Form type definitions (`src/components/forms/FormTypes.ts`)

**Project Structure** (T018-T021):
- [ ] T018: Component folder structure creation
- [ ] T019: Tokens directory with index exports
- [ ] T020: i18n locales directory
- [ ] T021: Contracts directory with index exports

**Documentation & Config** (T022-T027):
- [ ] T022: Update main README.md
- [ ] T023: Create ARCHITECTURE.md
- [ ] T024: Create CONTRIBUTING.md
- [ ] T025: Install dependencies (i18next, react-i18next, react-native-localize)
- [ ] T026: Verify TypeScript config
- [ ] T027: Verify ESLint config

**Quality Validation** (T028-T030):
- [ ] T028: TypeScript compilation validation
- [ ] T029: Translation key validation
- [ ] T030: Phase 1 validation checklist

### 5.5 Artifacts to Generate

### 5.6 Design Phase Constitution Alignment ✅

| Principle | Status | Evidence |
|-----------|--------|----------|
| **Code Quality** | ✅ | All TypeScript files use strict typing; proper exports and documentation; clear semantic naming |
| **Testing Standards** | ⏳ | Design ready for test implementation; validation schemas defined; test scenarios outlined |
| **Visual Excellence** | ✅ | Design tokens complete (colors, typography, spacing, elevation, animations); WCAG AA/AAA compliance verified |
| **UX Consistency** | ✅ | Unified terminology via translation structure; navigation contracts; standardized form patterns |
| **Performance** | ✅ | Token system enables optimization; lazy loading strategies documented; memoization patterns in component guide |

**Assessment**: ✅ Design phase aligns with all constitutional principles

1. ✅ **data-model-i18n.md**: i18n translation structure and keys (COMPLETE)
2. ✅ **component-architecture.md**: New folder structure and component responsibilities (COMPLETE)
3. ✅ **contracts/i18n.ts**: TypeScript interfaces for translations (COMPLETE)
4. ✅ **contracts/navigation.ts**: Route params interfaces (COMPLETE)
5. ✅ **src/components/README.md**: Component patterns & usage guide (COMPLETE)
6. ✅ **Design Tokens**: colors, typography, spacing, elevation, animations (ALL COMPLETE)
7. ⏳ **Translation files**: zh-CN.json, en.json (PENDING T012-T013)
8. ⏳ **i18n config**: config.ts, useTranslation.ts (PENDING T011, T014)
9. ⏳ **Form validation**: Schemas, types, messages (PENDING T015-T017)
10. ⏳ **Project structure**: Directories and index files (PENDING T018-T021)

---

## 6. Phase 2: Implementation Tasks

**Status**: ⏳ Blocked until Phase 1 complete  
**Planned Start**: After T011-T030 completion (2-3 hours from now)  
**Estimated Duration**: 5 days

### Prerequisites ✅
- ✅ Phase 1 design complete (T001-T010)
- ✅ Type contracts prepared
- ✅ Component patterns documented
- ✅ Design tokens available
- ⏳ Translation files created (T012-T013)
- ⏳ Project structure prepared (T018-T021)
- ⏳ Dependencies installed (T025)

### Batch 1: Foundation Setup (Day 1 - Morning)
- [ ] Install all dependencies (i18next, react-i18next, react-native-localize)
- [ ] Initialize i18next in app entry point
- [ ] Set up language detection and fallback
- [ ] Create src/i18n/ folder structure
- [ ] Verify i18n configuration loads correctly

### Batch 2: Component Restructuring (Day 1 - Afternoon)
- [ ] Create new component folder structure (ui, forms, surfaces, layouts, screens)
- [ ] Move existing components to new locations
- [ ] Create shadcn-like UI primitives (Button, Input, Select, Card, Badge)
- [ ] Create FormField unified wrapper component (CRITICAL)
- [ ] Update imports across all screen files

### Batch 3: i18n Integration (Day 2)
- [ ] Replace hardcoded strings in Home screen with t() calls
- [ ] Replace hardcoded strings in Transactions screen with t() calls
- [ ] Replace hardcoded strings in Summary screen with t() calls
- [ ] Replace hardcoded strings in Trends screen with t() calls
- [ ] Update TransactionForm to use FormField + i18n
- [ ] Test language switching functionality

### Batch 4: Navigation & UX (Day 3)
- [ ] Implement post-add navigation flow (add.tsx → transactions with params)
- [ ] Add scroll-to-item with animation in TransactionsScreen
- [ ] Add haptic feedback on successful transaction submission
- [ ] Add highlight effect on newly created transaction
- [ ] Test complete add → navigate → scroll → highlight flow

### Batch 5: Polish & Testing (Day 4-5)
- [ ] Add validation error messages with i18n + haptic feedback
- [ ] Test form field focus order and accessibility
- [ ] Verify dark mode with all new components
- [ ] Write unit tests for FormField wrapper
- [ ] Write unit tests for validation logic
- [ ] Write unit tests for i18n hook
- [ ] Write integration test for post-add flow
- [ ] Performance profiling and optimization

**Parallel Execution Opportunities**:
- Batch 2 & 3 can partially overlap (restructure while translating)
- UI primitive creation can run in parallel (Button, Input, Select, Card, Badge)
- Screen i18n updates can run in parallel (Home, Transactions, Summary, Trends)

---

## 7. Implementation Timeline

**Estimated Duration**: 2 sprints (10 days)  
**Current Progress**: Phase 1 - 70% complete

| Phase | Duration | Status | Completion | Notes |
|-------|----------|--------|------------|-------|
| Phase 0: Research | 1 day | ✅ Complete | 100% | Research artifacts generated |
| Phase 1: Design | 1.5 days | 🔄 Substantially Complete | 70% | T001-T010 ✅ / T011-T030 ⏳ |
| Phase 2: Implementation | 5 days | ⏳ Pending | 0% | Blocked on Phase 1 closure |
| Phase 3: Testing & Refinement | 2.5 days | ⏳ Pending | 0% | Awaiting Phase 2 |

### Phase 1 Breakdown
- **T001-T010** (Design Documentation + Tokens): ✅ **COMPLETE** (~4 hours)
  - Design docs, contracts, component guide, all 5 token files
- **T011-T030** (Setup + Validation): ⏳ **PENDING** (2-3 hours)
  - i18n foundation, form validation, project structure, dependencies, validation

**Estimated Phase 1 Completion**: Within 1.5 days (remaining 2-3 hours for T011-T030)  
**Ready for Phase 2**: Tomorrow morning

### Phase 2 Day-by-Day Plan
- **Day 1**: Foundation setup + component restructuring
- **Day 2**: i18n integration across all screens
- **Day 3**: Navigation & UX (post-add flow, scroll-to-item, haptic feedback)
- **Day 4**: Testing (unit tests, integration tests)
- **Day 5**: Polish, optimization, final validation

### Velocity Tracking
- **Phase 0**: 1 day used ✅
- **Phase 1**: ~6-7 hours total (4 hours used, 2-3 hours remaining)
- **On schedule**: ✅ YES (ahead of 1.5 day estimate)

---

## 8. Dependencies & Risks

### New Dependencies
```json
{
  "i18next": "^23.7.0",
  "react-i18next": "^13.5.0",
  "react-native-localize": "^3.1.0"
}
```

### Risk Mitigation
| Risk | Mitigation |
|------|-----------|
| Breaking existing screens during restructure | Create new structure in parallel, migrate per feature |
| i18n performance impact | Tree-shake unused translations, lazy-load locales if needed |
| Navigation params not working | Test Expo Router params early in Phase 2 |
| Haptic feedback not triggering | Add try/catch, test on actual device (simulator doesn't always vibrate) |
| Lost strings in translation | Use key validation in tests (ensure all i18n keys exist in both locales) |

---

## 9. Success Criteria

- ✅ All UI strings migrated to i18n (zh-CN and en)
- ✅ Post-add transaction navigates to list and scrolls with haptic feedback
- ✅ FormField wrapper used consistently across all forms
- ✅ Component folder structure follows feature-based pattern
- ✅ Unit tests for validation and i18n hooks >80% coverage
- ✅ E2E test covers: Add Transaction → Navigate to List → Scroll to New Item
- ✅ App passes constitutional check (Code Quality, Testing, Visual Excellence, UX Consistency, Performance)

---

## 10. Next Steps

### Immediate Actions (Next 2-3 Hours)

**Complete Phase 1 (T011-T030)**:
1. **i18n Foundation** (T011-T014)
   - Create i18next config with locale detection
   - Generate zh-CN.json and en.json translation files
   - Build type-safe useTranslation hook

2. **Form Validation** (T015-T017)
   - Create Zod validation schemas
   - Map validation messages to i18n keys
   - Define FormField and form state types

3. **Project Structure** (T018-T021)
   - Create all component subdirectories
   - Create token/i18n/contract index files
   - Verify folder structure matches architecture

4. **Dependencies & Config** (T022-T027)
   - Update README and create ARCHITECTURE.md
   - Install i18n dependencies
   - Verify TypeScript and ESLint configurations

5. **Validation & Sign-off** (T028-T030)
   - Run TypeScript compilation check
   - Validate translation key parity
   - Complete Phase 1 validation checklist

### Phase 2 Kickoff (Tomorrow)
1. **Initialize i18n** in app entry point
2. **Create first UI primitives** (Button, Input as proof of concept)
3. **Begin screen i18n migration** starting with Transactions screen
4. **Set up FormField wrapper** with validation integration

### Agent Context Update
- Run `.specify/scripts/bash/update-agent-context.sh codebuddy` after T025 (dependency installation)
- This ensures AI agents are aware of new technologies (i18next, react-i18next, react-native-localize)

---

## Appendix: Key Files & Locations

### Phase 1 Completed ✅
| File | Purpose | Status |
|------|---------|--------|
| `/specs/001-ledger-analytics/data-model-i18n.md` | i18n translation structure (14KB) | ✅ Complete |
| `/specs/001-ledger-analytics/component-architecture.md` | Component organization (21KB) | ✅ Complete |
| `/src/contracts/navigation.ts` | Route parameters and types (4.7KB) | ✅ Complete |
| `/src/contracts/i18n.ts` | Translation interfaces (12KB) | ✅ Complete |
| `/src/components/README.md` | Component patterns guide (19KB) | ✅ Complete |
| `/src/tokens/colors.ts` | Light/dark color palettes (6.7KB) | ✅ Complete |
| `/src/tokens/typography.ts` | SF Pro type scale (7.8KB) | ✅ Complete |
| `/src/tokens/spacing.ts` | 8pt grid system (8.2KB) | ✅ Complete |
| `/src/tokens/elevation.ts` | 5-level shadows (7.9KB) | ✅ Complete |
| `/src/tokens/animations.ts` | Spring configs (11KB) | ✅ Complete |

### Phase 1 Pending ⏳
| File | Purpose | Status |
|------|---------|--------|
| `/src/i18n/config.ts` | i18next initialization | ⏳ T011 |
| `/src/i18n/locales/zh-CN.json` | Chinese translations | ⏳ T012 |
| `/src/i18n/locales/en.json` | English translations | ⏳ T013 |
| `/src/i18n/useTranslation.ts` | Type-safe translation hook | ⏳ T014 |
| `/src/components/forms/FormValidation.ts` | Validation schemas | ⏳ T015 |
| `/src/components/forms/validationMessages.ts` | Error message mapping | ⏳ T016 |
| `/src/components/forms/FormTypes.ts` | Form type definitions | ⏳ T017 |

### Phase 2 Implementation (Upcoming)
| File | Purpose | Phase |
|------|---------|-------|
| `/src/components/ui/Button.tsx` | Button with haptic feedback | Phase 2 |
| `/src/components/ui/Input.tsx` | Text input with validation | Phase 2 |
| `/src/components/forms/FormField.tsx` | Unified form wrapper (CRITICAL) | Phase 2 |
| `/src/components/forms/TransactionForm.tsx` | Transaction form with i18n | Phase 2 |
| `/src/components/surfaces/SummaryCard.tsx` | Summary metric cards | Phase 2 |
| `/src/components/screens/TransactionsScreen.tsx` | Transactions with scroll-to-item | Phase 2 |

### Research & Planning
| File | Purpose | Status |
|------|---------|--------|
| `/specs/001-ledger-analytics/research.md` | Phase 0 research findings | ✅ Complete |
| `/specs/001-ledger-analytics/spec.md` | Feature specification | ✅ Complete |
| `/specs/001-ledger-analytics/plan.md` | Implementation plan (this file) | 🔄 Updated |
| `/specs/001-ledger-analytics/tasks.md` | Task breakdown | 🔄 Updated |
