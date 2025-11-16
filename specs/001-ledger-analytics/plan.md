# Project Plan: Ledger Analytics Optimization & Internationalization

**Last Updated**: 2025-11-16  
**Feature**: 001-ledger-analytics  
**Branch**: 001-ledger-analytics

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

### 5.1 Data Model Updates

**New Entities & Relationships**:
- **Translation Keys**: Organized by feature (common, transactions, home, summary, trends)
- **Language Configuration**: System locale detection + user override in settings
- **Form State**: Validation errors, touched fields, helper text from i18n

**No schema changes needed** - i18n is metadata, not data

### 5.2 Component Architecture

**New Folder Structure** (src/components/):
```
├── ui/                         # Reusable shadcn-like primitives
│   ├── Button.tsx             # Button with haptic feedback
│   ├── Input.tsx              # Text input with focus ring
│   ├── Select.tsx             # Dropdown/picker
│   ├── Card.tsx               # Container with shadow/radius
│   ├── Badge.tsx              # Category/tag display
│   └── Sheet.tsx              # Bottom sheet (already exists)
│
├── forms/                      # Form components
│   ├── FormField.tsx          # Unified form input wrapper
│   ├── FormValidation.ts      # Validation schemas + error messages
│   ├── TransactionForm.tsx    # Add/Edit transaction form (updated)
│   └── FormContext.ts         # Form state management
│
├── surfaces/                   # Layout & container components
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
├── layouts/                    # Screen-level layout
│   ├── TabLayout.tsx          # (tabs)/_layout.tsx wrapper
│   └── ScreenLayout.tsx       # Standard screen padding + header
│
└── screens/                    # Full-screen components (new location)
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

### 5.4 Artifacts to Generate

1. **data-model-i18n.md**: i18n translation structure and keys
2. **component-architecture.md**: New folder structure and component responsibilities
3. **contracts/i18n.ts**: TypeScript interfaces for translations
4. **contracts/navigation.ts**: Route params interfaces
5. **src/components/README.md**: Component patterns & usage guide

---

## 6. Phase 2: Implementation Tasks

### Batch 1: Foundation Setup
- [ ] Set up i18next with zh-CN and en locales
- [ ] Create translation files (transactions, home, summary, trends, common)
- [ ] Create i18n TypeScript hook (useTranslation)
- [ ] Create src/i18n/ folder structure

### Batch 2: Component Restructuring
- [ ] Reorganize existing components into new folder structure
- [ ] Create FormField unified wrapper component
- [ ] Create shadcn-like UI primitives (Button, Input, Select, Card, Badge)
- [ ] Update imports across all screen files

### Batch 3: i18n Integration
- [ ] Replace all hardcoded strings in components with t() calls
- [ ] Update TransactionForm to use FormField + i18n
- [ ] Update all screens (home, transactions, summary, trends) with i18n
- [ ] Test language switching in settings

### Batch 4: Navigation & UX
- [ ] Implement post-add navigation flow (add.tsx → transactions with params)
- [ ] Add scroll-to-item with animation in TransactionsScreen
- [ ] Add haptic feedback on successful submission
- [ ] Add highlight effect on newly created transaction

### Batch 5: Polish & Testing
- [ ] Add validation error messages with i18n + haptic feedback
- [ ] Test form field focus order and accessibility
- [ ] Verify dark mode with all components
- [ ] Write unit tests for FormField, validation, i18n hook
- [ ] Integration test for post-add flow

---

## 7. Implementation Timeline

**Estimated Duration**: 2 sprints (10 days)

| Phase | Duration | Status |
|-------|----------|--------|
| Phase 0: Research | 1 day | ✅ Complete |
| Phase 1: Design | 1.5 days | 🔄 In Progress |
| Phase 2: Implementation | 5 days | ⏳ Pending |
| Phase 3: Testing & Refinement | 2.5 days | ⏳ Pending |

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

1. **Complete Phase 1**: Finalize data-model-i18n.md and component-architecture.md
2. **Update Agent Context**: Run update-agent-context.sh to sync new technologies
3. **Generate Tasks**: Run /speckit.tasks to generate implementation tasks
4. **Begin Implementation**: Start with Foundation Setup (Batch 1)

---

## Appendix: Key Files & Locations

| File | Purpose |
|------|---------|
| `/src/i18n/config.ts` | i18next initialization |
| `/src/i18n/locales/zh-CN.json` | Chinese translations |
| `/src/i18n/locales/en.json` | English translations |
| `/src/i18n/useTranslation.ts` | Custom TypeScript-safe hook |
| `/src/components/README.md` | Component pattern guide |
| `/src/components/forms/FormField.tsx` | Unified form input wrapper |
| `/src/components/ui/` | shadcn-like primitives |
| `/specs/001-ledger-analytics/research-optimization.md` | Detailed research |
| `/specs/001-ledger-analytics/data-model-i18n.md` | i18n entity modeling |
| `/specs/001-ledger-analytics/component-architecture.md` | New structure documentation |
