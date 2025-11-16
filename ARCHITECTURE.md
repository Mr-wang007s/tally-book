# Architecture Documentation: My Tally Book

**Last Updated**: 2025-11-16  
**Version**: 1.0.0

---

## Table of Contents

1. [Overview](#overview)
2. [Component Organization](#component-organization)
3. [Design Token System](#design-token-system)
4. [Internationalization (i18n)](#internationalization-i18n)
5. [Form Handling Patterns](#form-handling-patterns)
6. [Navigation Architecture](#navigation-architecture)
7. [Data Flow & State Management](#data-flow--state-management)
8. [Adding New Components](#adding-new-components)

---

## Overview

My Tally Book is a multi-platform personal finance tracker built with **React Native**, **Expo**, and **TypeScript**. The architecture follows these key principles:

- **Type Safety**: All code uses TypeScript with strict mode enabled
- **Component Reusability**: shadcn-inspired component patterns for maximum flexibility
- **Performance**: Optimized for 60 FPS with virtualized lists and memoization
- **Accessibility**: WCAG 2.1 Level AA compliance for all UI components
- **Internationalization**: Full i18n support with Chinese and English
- **Testability**: Components designed for isolated unit and integration testing

### Technology Stack

- **Framework**: React Native 0.76.5 with Expo SDK 52
- **Language**: TypeScript 5.3
- **Navigation**: Expo Router (file-based routing)
- **Storage**: AsyncStorage for local persistence
- **Internationalization**: i18next + react-i18next + react-native-localize
- **Animation**: React Native Reanimated 3.6
- **UI**: Custom design system with shadcn-inspired patterns

---

## Component Organization

Components are organized by **feature and responsibility**, not by file type. This enables scaling to 50+ components without clutter.

### Directory Structure

```
src/components/
├── ui/                  # Design system primitives
├── forms/               # Form components and validation
├── surfaces/            # Layout and container components
├── charts/              # Data visualization
├── animations/          # Animation wrappers
├── layouts/             # Screen-level layouts
└── screens/             # Full-screen feature components
```

### Component Categories

#### 1. UI Primitives (`ui/`)

**Purpose**: Foundational, reusable design system components  
**Pattern**: shadcn-inspired (copy-paste, not package-based)

**Key Components**:
- `Button.tsx` - Pressable with haptic feedback, variants (primary/secondary/destructive), loading states
- `Input.tsx` - Text input with validation states, focus ring, error display
- `Select.tsx` - Dropdown/picker with options array and value binding
- `Card.tsx` - Container with elevation, padding variants, dark mode
- `Badge.tsx` - Category/tag display with variant support

**Usage Pattern**:
```tsx
import { Button, Input, Card } from '@/components/ui';

<Card variant="elevated">
  <Input 
    label="Amount" 
    value={amount} 
    error={errors.amount}
  />
  <Button 
    variant="primary" 
    onPress={handleSubmit}
    loading={isSubmitting}
  >
    Save
  </Button>
</Card>
```

#### 2. Forms (`forms/`)

**Purpose**: Unified form handling with validation and i18n integration

**Key Components**:
- `FormField.tsx` - **CRITICAL** - Unified wrapper for all form inputs with validation display
- `FormValidation.ts` - Validation schemas (currently manual, Zod integration planned)
- `FormTypes.ts` - TypeScript types for form state, errors, touched fields
- `TransactionForm.tsx` - Example form implementation

**Pattern**: All forms use `FormField` wrapper for consistency:
```tsx
import { FormField } from '@/components/forms';
import { Input } from '@/components/ui';

<FormField
  label={t('transactions.amount')}
  error={errors.amount}
  touched={touched.amount}
  required
>
  <Input
    value={amount}
    onChangeText={setAmount}
    keyboardType="decimal-pad"
  />
</FormField>
```

#### 3. Surfaces (`surfaces/`)

**Purpose**: Layout and container components for consistent spacing and structure

**Key Components**:
- `SummaryCard.tsx` - Income/expense/balance display cards
- `TransactionCard.tsx` - Individual transaction item
- `CardGrid.tsx` - Responsive grid layout
- `Container.tsx` - Screen padding wrapper

#### 4. Charts (`charts/`)

**Purpose**: Data visualization with @shopify/react-native-skia

**Key Components**:
- `CategoryPie.tsx` - Category breakdown pie chart
- `TimeSeries.tsx` - Trend line/bar charts

#### 5. Animations (`animations/`)

**Purpose**: Reusable animation wrappers using React Native Reanimated

**Key Components**:
- `FadeIn.tsx` - Fade in animation wrapper
- `SlideIn.tsx` - Slide in animation wrapper
- `SuccessCheck.tsx` - Success checkmark animation

#### 6. Layouts (`layouts/`)

**Purpose**: Screen-level layout components for consistent structure

**Key Components**:
- `ScreenLayout.tsx` - Standard screen padding + safe area
- `TabLayout.tsx` - Tab navigation wrapper

#### 7. Screens (`screens/`)

**Purpose**: Full-screen feature components that compose smaller components

**Key Components**:
- `HomeScreen.tsx` - Dashboard with summary cards
- `TransactionsScreen.tsx` - Virtualized transaction list with scroll-to-item
- `SummaryScreen.tsx` - Financial summary with period filtering
- `TrendsScreen.tsx` - Trend analysis with charts

---

## Design Token System

All visual design values are centralized in `src/tokens/` for consistency and easy customization.

### Token Categories

#### Colors (`tokens/colors.ts`)

```typescript
import { colors, lightColors, darkColors, getColors } from '@/tokens';

// Get current theme colors
const themeColors = getColors(colorScheme);

// Use specific color
<View style={{ backgroundColor: themeColors.background.primary }} />
```

**Color Palettes**:
- `background`: Primary, secondary, tertiary backgrounds
- `surface`: Card and container surfaces
- `primary`, `secondary`: Brand colors
- `success`, `error`, `warning`, `info`: Semantic colors
- `text`: Primary, secondary, tertiary, disabled text colors
- `border`: Dividers and borders

**Accessibility**: All colors meet WCAG AA contrast ratios (AAA where possible)

#### Typography (`tokens/typography.ts`)

```typescript
import { typography, getTypography, getVariant } from '@/tokens';

// Get typography style
const titleStyle = getTypography('title1');
const bodyStyle = getVariant('body');

<Text style={titleStyle}>Transactions</Text>
<Text style={bodyStyle}>View all your transactions</Text>
```

**Type Scale** (SF Pro-inspired):
- `largeTitle`: 34px - Screen headers
- `title1`, `title2`, `title3`: 28/22/20px - Section headers
- `headline`: 17px semibold - List headers
- `body`: 17px regular - Main content
- `callout`: 16px - Secondary content
- `subhead`: 15px - Supporting text
- `footnote`: 13px - Captions
- `caption1`, `caption2`: 12/11px - Labels

#### Spacing (`tokens/spacing.ts`)

```typescript
import { spacing, getSpacing, createPadding } from '@/tokens';

// Use spacing value
<View style={{ padding: spacing.md }} />

// Create padding/margin helpers
<View style={createPadding({ horizontal: 'md', vertical: 'sm' })} />
```

**8pt Grid System**:
- `xxxs`: 2px
- `xxs`: 4px
- `xs`: 8px
- `sm`: 12px
- `md`: 16px (base)
- `lg`: 24px
- `xl`: 32px
- `xxl`: 48px
- `xxxl`: 64px

#### Elevation (`tokens/elevation.ts`)

```typescript
import { getElevation, elevations } from '@/tokens';

// Apply elevation to card
<View style={[styles.card, getElevation(2)]} />
```

**5-Level System**:
- Level 0: No shadow (flat)
- Level 1: Subtle shadow (cards on background)
- Level 2: Medium shadow (raised cards)
- Level 3: Prominent shadow (dialogs)
- Level 4: High elevation (modals)
- Level 5: Maximum elevation (floating elements)

#### Animations (`tokens/animations.ts`)

```typescript
import { springs, durations, getSpring, getDuration } from '@/tokens';

// Use spring configuration with Reanimated
const animatedValue = useSharedValue(0);

animatedValue.value = withSpring(1, getSpring('default'));
animatedValue.value = withTiming(1, { duration: getDuration('fast') });
```

**Spring Presets**:
- `gentle`: Slow, smooth spring (damping 20, stiffness 90)
- `default`: Balanced spring (damping 15, stiffness 150)
- `snappy`: Quick spring (damping 12, stiffness 300)
- `bouncy`: Playful spring (damping 10, stiffness 250)

**Duration Presets**:
- `instant`: 0ms
- `fast`: 150ms
- `normal`: 300ms
- `slow`: 500ms
- `deliberate`: 800ms

---

## Internationalization (i18n)

Full internationalization support with **Chinese (zh-CN)** as primary language and **English (en)** fallback.

### Configuration

**Setup**: `src/i18n/config.ts`
- Automatic device locale detection via `react-native-localize`
- Namespace organization for code splitting
- Missing key logging in development

**Translation Files**: `src/i18n/locales/`
- `zh-CN.json` - Chinese translations
- `en.json` - English translations

### Namespaces

Translations are organized by feature:
- `common`: Shared UI (OK, Cancel, Save, Delete, etc.)
- `transactions`: Transaction screens and forms
- `home`: Home dashboard
- `summary`: Financial summary
- `trends`: Trend analysis
- `categories`: Category management
- `messages`: Success/error notifications

### Type-Safe Translation Hook

```typescript
import { useTranslation } from '@/i18n/useTranslation';

function MyComponent() {
  const { t, language, i18n } = useTranslation();
  
  // Type-safe translation with autocomplete
  const okLabel = t('common.ok');
  const amountLabel = t('transactions.amount');
  const errorMsg = t('transactions.validation.amountRequired');
  
  // Get current language
  console.log(language); // 'zh-CN' or 'en'
  
  // Change language
  await i18n.changeLanguage('en');
  
  return <Text>{t('common.ok')}</Text>;
}
```

### Translation Contract

Type definitions in `src/contracts/i18n.ts` ensure:
- All translation keys exist in both languages
- Autocomplete for translation keys in IDE
- Compile-time error if key is missing or misspelled

### Best Practices

1. **Never hardcode strings** - Always use `t()` function
2. **Use namespaces** - Prefix keys with namespace (e.g., `transactions.amount`)
3. **Keep keys in sync** - zh-CN.json and en.json must have matching keys
4. **Use meaningful keys** - Keys should describe content, not UI position
5. **Test both languages** - Verify UI works with both Chinese and English

---

## Form Handling Patterns

### Unified FormField Wrapper

**All forms must use** `FormField` component for consistency:

```typescript
import { FormField } from '@/components/forms';
import { Input } from '@/components/ui';
import { useTranslation } from '@/i18n/useTranslation';

function MyForm() {
  const { t } = useTranslation();
  const [amount, setAmount] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  
  return (
    <FormField
      label={t('transactions.amount')}
      error={errors.amount}
      touched={touched.amount}
      required
      helpText={t('transactions.amountHint')}
    >
      <Input
        value={amount}
        onChangeText={setAmount}
        onBlur={() => setTouched({ ...touched, amount: true })}
        keyboardType="decimal-pad"
      />
    </FormField>
  );
}
```

### Validation Pattern

**Current**: Manual validation with helper functions  
**Planned**: Zod schema validation (T015)

```typescript
import { validateTransaction } from '@/components/forms/FormValidation';

function handleSubmit() {
  const errors = validateTransaction({ amount, categoryId, date });
  
  if (Object.keys(errors).length > 0) {
    setErrors(errors);
    return;
  }
  
  // Submit form
  await saveTransaction({ amount, categoryId, date });
}
```

### Validation Messages

Messages are **i18n-integrated** via `src/components/forms/validationMessages.ts`:

```typescript
import { getValidationMessage } from '@/components/forms/validationMessages';

const error = getValidationMessage('amountRequired', language);
// Returns: "金额必填" (zh-CN) or "Amount is required" (en)
```

### Haptic Feedback

Forms integrate haptic feedback for better UX:
- **Light impact**: Field focus/blur
- **Medium impact**: Successful submission
- **Error notification**: Validation failure

```typescript
import * as Haptics from 'expo-haptics';

// On error
Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

// On success
Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
```

---

## Navigation Architecture

Uses **Expo Router** with file-based routing.

### Route Structure

```
app/
├── (tabs)/
│   ├── index.tsx          # Home screen (/)
│   ├── transactions.tsx   # Transactions list (/transactions)
│   ├── summary.tsx        # Summary (/summary)
│   └── trends.tsx         # Trends (/trends)
├── transactions/
│   ├── add.tsx           # Add transaction (/transactions/add)
│   └── [id].tsx          # Edit transaction (/transactions/:id)
```

### Type-Safe Navigation

Route parameters are defined in `src/contracts/navigation.ts`:

```typescript
import { useRouter } from 'expo-router';
import type { TransactionsScreenParams } from '@/contracts/navigation';

// Navigate with typed params
function navigateToTransactions(params: TransactionsScreenParams) {
  router.push({
    pathname: '/transactions',
    params: {
      scrollToId: params.scrollToId,
      highlight: params.highlight ? 'true' : undefined,
    },
  });
}

// Post-add navigation flow
async function handleAddTransaction() {
  const result = await saveTransaction(data);
  
  // Navigate to transactions list and scroll to new item
  router.push({
    pathname: '/transactions',
    params: {
      scrollToId: result.id,
      highlight: 'true',
    },
  });
}
```

### Navigation Patterns

1. **Tab Navigation**: Bottom tabs for primary sections
2. **Stack Navigation**: Push/pop for detail views
3. **Modal Navigation**: Sheets for quick actions
4. **Post-Action Navigation**: Navigate + scroll-to-item after creation

---

## Data Flow & State Management

### Data Layer

```
User Action → Service Layer → Storage Layer → State Update → UI Re-render
```

**Service Layer** (`src/services/`):
- `TransactionService`: CRUD operations, validation
- `CategoryService`: Category management
- `AggregateService`: Summary calculations, trend analysis

**Storage Layer** (`src/storage/`):
- `TransactionStorage`: AsyncStorage wrapper for transactions
- `CategoryStorage`: Category persistence
- `StorageService`: Generic storage utilities

**Models** (`src/models/`):
- `Transaction.ts`: Transaction entity and types
- `Category.ts`: Category entity and types

### State Management

**Current**: Local component state with React hooks  
**Pattern**: Lift state up to screen level, pass props down

```typescript
// Screen-level state
function TransactionsScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  useEffect(() => {
    loadTransactions().then(setTransactions);
  }, []);
  
  return (
    <TransactionList 
      transactions={transactions}
      onDelete={(id) => {
        deleteTransaction(id);
        setTransactions(transactions.filter(t => t.id !== id));
      }}
    />
  );
}
```

### Performance Optimizations

1. **Memoization**: `React.memo` for expensive components
2. **Virtualization**: `FlashList` for long lists (5000+ items)
3. **Lazy Loading**: Load data on demand, not upfront
4. **Debouncing**: Debounce search/filter inputs
5. **Reanimated**: Use `worklet` for 60 FPS animations

---

## Adding New Components

Follow this checklist when adding new components:

### 1. Choose the Right Directory

- **Reusable primitive?** → `ui/`
- **Form-related?** → `forms/`
- **Layout/container?** → `surfaces/`
- **Data visualization?** → `charts/`
- **Animation wrapper?** → `animations/`
- **Screen-level layout?** → `layouts/`
- **Full screen?** → `screens/`

### 2. File Naming Convention

- Use **PascalCase** for component files: `Button.tsx`, `TransactionCard.tsx`
- Use **camelCase** for utility files: `validationMessages.ts`, `formatters.ts`
- Include `.test.tsx` suffix for tests: `Button.test.tsx`

### 3. Component Template

```typescript
/**
 * ComponentName - Brief description
 * 
 * @module src/components/category/ComponentName
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from '@/i18n/useTranslation';
import { colors, spacing, typography } from '@/tokens';

export interface ComponentNameProps {
  /** Prop description */
  title: string;
  /** Optional prop */
  onPress?: () => void;
  /** Variant */
  variant?: 'default' | 'primary';
}

/**
 * ComponentName component
 * 
 * @example
 * ```tsx
 * <ComponentName title="Hello" variant="primary" />
 * ```
 */
export function ComponentName({ 
  title, 
  onPress,
  variant = 'default',
}: ComponentNameProps) {
  const { t } = useTranslation();
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
  },
  title: {
    ...typography.headline,
    color: colors.text.primary,
  },
});
```

### 4. Export from Index

Add export to `src/components/category/index.ts`:

```typescript
export { ComponentName } from './ComponentName';
export type { ComponentNameProps } from './ComponentName';
```

### 5. Write Tests

Create `ComponentName.test.tsx`:

```typescript
import { render, screen } from '@testing-library/react-native';
import { ComponentName } from './ComponentName';

describe('ComponentName', () => {
  it('renders title correctly', () => {
    render(<ComponentName title="Test" />);
    expect(screen.getByText('Test')).toBeTruthy();
  });
});
```

### 6. Document Usage

Add usage example to `src/components/README.md` if component is reusable.

### 7. Design Token Compliance

- Use tokens instead of hardcoded values
- ✅ `colors.text.primary` ❌ `'#000000'`
- ✅ `spacing.md` ❌ `16`
- ✅ `typography.headline` ❌ `{ fontSize: 17, fontWeight: '600' }`

### 8. Accessibility

- Add `accessibilityLabel` and `accessibilityHint`
- Use semantic colors (not just visual)
- Ensure touch targets ≥ 44x44 pt
- Test with screen reader (TalkBack/VoiceOver)

### 9. i18n Integration

- Never hardcode strings
- Use `t()` function for all text
- Add translation keys to `zh-CN.json` and `en.json`

### 10. Performance

- Use `React.memo` for components with complex props
- Avoid inline functions in render (use `useCallback`)
- Use `useMemo` for expensive calculations
- Profile with React DevTools Profiler

---

## Best Practices Summary

### Code Quality
- ✅ TypeScript strict mode enabled
- ✅ ESLint + Prettier for formatting
- ✅ No `any` types (use `unknown` if needed)
- ✅ Export types alongside components

### Component Design
- ✅ Single Responsibility Principle
- ✅ Composable and reusable
- ✅ Props interface with JSDoc comments
- ✅ Default prop values where appropriate

### Styling
- ✅ Use design tokens (colors, spacing, typography)
- ✅ StyleSheet.create for performance
- ✅ Platform-specific styles when needed
- ✅ Dark mode compatibility

### Performance
- ✅ Virtualized lists for >50 items
- ✅ Memoization for expensive components
- ✅ Reanimated for 60 FPS animations
- ✅ Lazy load heavy screens

### Accessibility
- ✅ WCAG 2.1 Level AA compliance
- ✅ Screen reader labels
- ✅ Touch target sizes ≥ 44pt
- ✅ Color contrast ratios

### Testing
- ✅ Unit tests for business logic
- ✅ Component tests with React Testing Library
- ✅ Integration tests for critical flows
- ✅ E2E tests for user journeys

---

## Additional Resources

- **Component Patterns**: `src/components/README.md`
- **Feature Specifications**: `specs/001-ledger-analytics/`
- **Design Tokens Reference**: `src/tokens/`
- **TypeScript Contracts**: `src/contracts/`
- **Contributing Guide**: `CONTRIBUTING.md`

---

**Questions or suggestions?** See `CONTRIBUTING.md` for development guidelines.
