# Research: Component Restructuring & i18n Integration (2025-11-16)

## Context
Previous research (research.md) covered design system, animations, charts, and haptics. This document adds research for:
- Component organization restructuring with shadcn philosophy
- Chinese language (i18n) implementation
- Post-add navigation flow pattern
- Module UX improvements

---

## Decisions and Rationale

### 1. Component Organization Restructuring

**Decision**: Migrate from flat component structure to feature-based folder hierarchy using shadcn/Tamagui pattern

**Current State**:
```
src/components/
├── primitives/         # Button, Card, etc.
├── animations/         # FadeIn, SlideIn, etc.
├── charts/            # CategoryPie, TimeSeries
├── home/              # DashboardHeader, etc.
├── FormField.tsx
├── TransactionForm.tsx
├── SummaryCards.tsx
└── ... (10+ files in root)
```

**Proposed State**:
```
src/components/
├── ui/                 # shadcn-like reusable primitives
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Card.tsx
│   ├── Sheet.tsx
│   └── Badge.tsx
├── forms/              # Form-specific components
│   ├── FormField.tsx
│   ├── TransactionForm.tsx
│   └── FormValidation.tsx
├── surfaces/           # Containers and layout
│   ├── SummaryCards.tsx
│   ├── CardGrid.tsx
│   └── Container.tsx
├── charts/             # Data visualization
│   ├── CategoryPie.tsx
│   └── TimeSeries.tsx
├── animations/         # Animation wrappers
│   ├── FadeIn.tsx
│   ├── SlideIn.tsx
│   └── SuccessCheck.tsx
├── layouts/            # Screen layout components
│   ├── TabLayout.tsx
│   └── ScreenLayout.tsx
└── screens/            # Full-screen feature components
    ├── HomeScreen.tsx
    ├── TransactionsScreen.tsx
    └── SummaryScreen.tsx
```

**Rationale**:
- **Scalability**: Feature-based structure handles 50+ components without cluttering
- **Discoverability**: Related components grouped by functionality (forms, surfaces, etc.)
- **shadcn Philosophy**: Copyable, composable, non-opinionated component library pattern
- **Maintainability**: Clear separation of concerns reduces cognitive load
- **Reusability**: UI components easily found and composed into features

**Alternatives Considered**:
- **Flat structure**: Current approach, doesn't scale well beyond 15 components
- **Domain-driven**: Transaction, Summary, Trends domains - too complex for Expo app
- **Atomic design**: atoms/molecules/organisms - good but more process overhead

**Implementation Pattern** (shadcn-like):
```typescript
// src/components/ui/Button.tsx
// Copy-paste-able, minimal dependencies, TypeScript-first
export interface ButtonProps extends TouchableOpacityProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export function Button({ variant = 'primary', size = 'md', ...props }: ButtonProps) {
  // Implementation
}
```

---

### 2. Language Support: i18n Implementation

**Decision**: Implement i18n using i18next + react-i18next + react-native-localize with TypeScript

**Rationale**:
- **Mature Ecosystem**: i18next is industry-standard with 10+ years development
- **Type Safety**: react-i18next has excellent TypeScript support
- **Automatic Locale Detection**: react-native-localize reads system language
- **Namespace Support**: Can organize translations by feature (home, transactions, etc.)
- **Pluralization & Formatting**: Built-in support for complex pluralization and date/number formatting
- **Storage Integration**: Seamless with AsyncStorage for user language override

**Alternatives Considered**:
- **react-native-i18n**: Simpler but less TypeScript support, less maintained
- **Linguist**: Good but requires extra build steps, heavier
- **Manual translation objects**: No pluralization, harder to maintain

**Structure**:
```
src/i18n/
├── config.ts                    # i18next initialization
├── locales/
│   ├── en.json                  # English translations
│   └── zh-CN.json               # Simplified Chinese
└── useTranslation.ts            # Custom hook with TypeScript typing
```

**Key Implementation**:
```typescript
// src/i18n/locales/zh-CN.json (example)
{
  "common": {
    "ok": "确定",
    "cancel": "取消",
    "delete": "删除",
    "edit": "编辑"
  },
  "transactions": {
    "add": "添加交易",
    "income": "收入",
    "expense": "支出",
    "category": "分类",
    "amount": "金额",
    "date": "日期",
    "note": "备注",
    "success": "交易添加成功",
    "error": "操作失败，请重试"
  }
}
```

**Usage Pattern**:
```typescript
import { useTranslation } from 'react-i18next';

export function TransactionForm() {
  const { t } = useTranslation();
  return <Button title={t('transactions.add')} />;
}
```

---

### 3. Post-Add Navigation Flow

**Decision**: Use Expo Router route parameters with scroll positioning for smooth UX

**Pattern**:
```
1. User fills form in Add Transaction screen
2. Form submission creates transaction (local storage)
3. Navigate to /transactions with params { scrollToId: newTransactionId }
4. Transactions screen detects params, scrolls to new transaction with animation
5. Flash/highlight effect on new transaction row for 2 seconds (haptic feedback)
```

**Rationale**:
- **Leverages Expo Router**: Built-in parameter passing, type-safe with pathname-based routing
- **User Feedback**: Seeing new transaction immediately provides confirmation
- **Visual Continuity**: Scroll animation maintains context (no jarring jump)
- **Simple State Management**: No context/redux needed, params handle communication
- **Haptic Confirmation**: Vibration + visual highlight creates multi-sensory feedback

**Implementation Outline**:
```typescript
// screens/add.tsx
async function handleSubmit(formData) {
  const transaction = await createTransaction(formData);
  
  // Navigate with params
  router.push({
    pathname: '/transactions',
    params: { scrollToId: transaction.id, highlight: true }
  });
}

// screens/transactions/index.tsx
const { scrollToId, highlight } = useLocalSearchParams();

useEffect(() => {
  if (scrollToId) {
    const index = transactions.findIndex(t => t.id === scrollToId);
    if (index >= 0) {
      // Trigger haptic feedback
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      // Scroll with animation
      flatListRef.current?.scrollToIndex({ index, animated: true });
      
      // Trigger highlight effect if requested
      if (highlight) {
        highlightTransactionId.value = scrollToId;
        setTimeout(() => { highlightTransactionId.value = null; }, 2000);
      }
    }
  }
}, [scrollToId]);
```

**Alternatives Considered**:
- **Context API**: Over-engineered for single parameter passing
- **Navigation state listener**: Complex, harder to debug
- **Redux**: Too heavy for local-only app
- **Zustand/Jotai**: Adds dependency for simple task

---

### 4. Form & Module UX Improvements with shadcn

**Decision**: Restructure forms and module layouts using shadcn component patterns with consistent spacing, states, and feedback

**Improvements**:
1. **Form Consistency**: Use unified FormField wrapper with validation, error display, and haptic feedback
2. **Card Standardization**: All cards use consistent shadow, padding, border-radius from design tokens
3. **Button States**: Clear loading, disabled, active states with haptic feedback on interaction
4. **Input States**: Focus ring, error highlight, helper text positioning
5. **Modal Consistency**: Forms in sheets/modals have consistent header, footer, spacing
6. **Empty States**: Standardized empty state with icon, text, and primary action

**Form Structure**:
```typescript
<Form>
  <FormField
    label={t('transactions.amount')}
    value={amount}
    onChangeText={setAmount}
    keyboardType="decimal-pad"
    error={errors.amount}
    helperText="金额必须大于 0"
  />
  
  <FormField
    label={t('transactions.category')}
    value={categoryId}
    component="select"
    options={categories}
    error={errors.categoryId}
  />
  
  <Button
    title={t('common.save')}
    isLoading={isSubmitting}
    onPress={handleSubmit}
    hapticFeedback="medium"
  />
</Form>
```

**Rationale**:
- **shadcn Philosophy**: Components are examples to copy and customize, not rigid packages
- **Consistency**: Single FormField wrapper ensures consistent styling across all forms
- **Accessibility**: Proper label association, error announcements, focus management
- **Type Safety**: TypeScript interfaces for all component props
- **Haptic Integration**: Feedback patterns tied to interaction types (input validation, submission, etc.)

---

## Technology Stack Decisions Summary

| Aspect | Decision | Why | Fallback |
|--------|----------|-----|----------|
| **Component Structure** | Feature-based folders (shadcn pattern) | Scalable, maintainable | N/A |
| **i18n Library** | i18next + react-i18next | Mature, TypeScript, system locale detection | Manual translations |
| **Language Support** | Chinese (zh-CN) as primary | Per requirements | English fallback |
| **Post-Add Flow** | Expo Router params + scroll | Simple, built-in routing | Context + listener |
| **Form Consistency** | Unified FormField wrapper | shadcn approach | Individual field components |
| **Haptic in Forms** | expo-haptics on validation/submit | Tactile feedback for clarity | Silent fallback |
| **Module Organization** | /ui, /forms, /surfaces, /charts, /layouts | Feature-based discovery | Flat structure |

---

## Dependencies to Add

```json
{
  "i18next": "^23.7.0",
  "react-i18next": "^13.5.0",
  "react-native-localize": "^3.1.0"
}
```

Already present:
- expo-haptics (for haptic feedback)
- expo-router (for navigation params)
- react-native-reanimated (for animations)
- typescript (for type safety)

---

## Migration Path

1. **Phase 1**: Restructure component folders without changing functionality
2. **Phase 2**: Set up i18n config and create zh-CN translation files
3. **Phase 3**: Migrate existing components to new i18n structure (replace hardcoded strings)
4. **Phase 4**: Implement post-add navigation flow in TransactionForm and screens
5. **Phase 5**: Refactor forms with unified FormField wrapper and haptic feedback
6. **Phase 6**: Polish module UX (empty states, loading states, error states)

---

## Open Questions Resolved

| Question | Answer |
|----------|--------|
| How to structure components at scale? | Feature-based folders with shadcn patterns |
| Which i18n library for RN + TypeScript? | i18next + react-i18next + react-native-localize |
| How to handle post-add navigation? | Expo Router params + scroll with haptic feedback |
| How to ensure form consistency? | Unified FormField wrapper component |
| Where to add Chinese translations? | src/i18n/locales/zh-CN.json |
