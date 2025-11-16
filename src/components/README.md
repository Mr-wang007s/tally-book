# Components Guide: Ledger Analytics

**Status**: ✅ Phase 1 Design  
**Last Updated**: 2025-11-16  

---

## Overview

This guide documents component organization, patterns, and best practices for the Ledger Analytics feature. Components are organized by responsibility and reusability level.

**Key Features**:
- ✅ Feature-based organization (not type-based)
- ✅ Atomic design principles
- ✅ Type-safe component interfaces
- ✅ Performance optimization built-in
- ✅ Accessibility by default

---

## Directory Structure

```
src/components/
├── ui/                      # Design system primitives
├── forms/                   # Form components & validation
├── surfaces/               # Layout containers
├── charts/                 # Data visualization
├── animations/             # Animation wrappers
├── layouts/                # Screen-level layouts
├── screens/                # Full-screen features
└── README.md              # This file
```

**See** `specs/001-ledger-analytics/component-architecture.md` for detailed structure.

---

## Component Categories

### 1. UI Primitives (`/ui`)

Reusable design system components matching shadcn patterns.

#### Button Component

**Purpose**: Styled button with haptic feedback and loading state

**Props**:
```typescript
interface ButtonProps {
  title: string;                                    // Button label
  onPress: () => void | Promise<void>;             // Click handler
  variant?: 'primary' | 'secondary' | 'destructive'; // Style variant
  size?: 'sm' | 'md' | 'lg';                       // Button size
  disabled?: boolean;                              // Disabled state
  loading?: boolean;                               // Loading spinner
  hapticFeedback?: 'light' | 'medium' | 'heavy';  // Haptic intensity
}
```

**Usage**:
```typescript
import { Button } from '@/components/ui';

export function MyScreen() {
  const handleSubmit = async () => {
    // Process submission
  };

  return (
    <Button
      title="Save"
      onPress={handleSubmit}
      variant="primary"
      hapticFeedback="medium"
    />
  );
}
```

**Accessibility**: Includes accessibilityLabel, proper focus order, haptic feedback for confirmation

---

#### Input Component

**Purpose**: Text input with validation feedback and error display

**Props**:
```typescript
interface InputProps {
  value: string;                                    // Current value
  onChangeText: (text: string) => void;           // Change handler
  placeholder?: string;                           // Placeholder text
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
  error?: string;                                 // Error message
  editable?: boolean;                             // Disabled state
  multiline?: boolean;                            // Multi-line input
}
```

**Usage**:
```typescript
import { Input } from '@/components/ui';

export function MyForm() {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  return (
    <Input
      value={amount}
      onChangeText={setAmount}
      placeholder="Enter amount"
      keyboardType="numeric"
      error={error}
    />
  );
}
```

---

#### Select Component (Picker)

**Purpose**: Dropdown/picker for selecting from options

**Props**:
```typescript
interface SelectProps {
  options: Array<{ label: string; value: string }>;
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  error?: string;
}
```

**Usage**:
```typescript
import { Select } from '@/components/ui';

const categoryOptions = [
  { label: 'Food', value: 'food' },
  { label: 'Transport', value: 'transport' },
];

export function MyForm() {
  const [category, setCategory] = useState('');

  return (
    <Select
      options={categoryOptions}
      value={category}
      onValueChange={setCategory}
      placeholder="Select category"
    />
  );
}
```

---

#### Card Component

**Purpose**: Container with shadow, elevation, and press handling

**Props**:
```typescript
interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;                     // Optional press handler
  elevation?: 0 | 1 | 2 | 3 | 4 | 5;      // Shadow depth
  bordered?: boolean;                       // Show border
  padding?: keyof typeof spacing;           // Token-based padding
}
```

**Usage**:
```typescript
import { Card } from '@/components/ui';
import { spacing } from '@/tokens';

export function TransactionItem({ transaction }) {
  return (
    <Card
      elevation={2}
      padding="md"
      onPress={() => editTransaction(transaction.id)}
    >
      <Text>{transaction.description}</Text>
      <Text>{formatCurrency(transaction.amount)}</Text>
    </Card>
  );
}
```

---

#### Badge Component

**Purpose**: Tag/badge for category or status display

**Props**:
```typescript
interface BadgeProps {
  text: string;
  variant?: 'default' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md';
}
```

**Usage**:
```typescript
import { Badge } from '@/components/ui';

export function CategoryLabel({ category }) {
  return (
    <Badge
      text={category}
      variant="default"
      size="md"
    />
  );
}
```

---

### 2. Form Components (`/forms`)

Complex form handling with validation and state management.

#### FormField Component (CRITICAL - USE EVERYWHERE)

**Purpose**: Unified wrapper for all form inputs with validation feedback

**Props**:
```typescript
interface FormFieldProps<T> {
  name: keyof T;                                   // Field name
  label: string;                                  // Display label
  value: string;                                  // Current value
  onChangeText: (text: string) => void;          // Change handler
  error?: string;                                // Error message (from validation)
  touched?: boolean;                             // Field touched state
  onBlur?: () => void;                           // Blur handler
  required?: boolean;                            // Show required indicator
  hint?: string;                                 // Helper text
  component: 'input' | 'select' | 'datepicker'; // Component type
  componentProps?: Record<string, any>;          // Passed to component
  hapticOnError?: boolean;                       // Haptic feedback on error
}
```

**Usage**:
```typescript
import { FormField } from '@/components/forms';
import { useTranslation } from '@/i18n';

export function AddTransactionForm() {
  const { t } = useTranslation();
  const [amount, setAmount] = useState('');
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleValidate = () => {
    const newErrors = {};
    if (!amount) {
      newErrors.amount = t('transactions.validation.amountRequired');
    }
    setErrors(newErrors);
  };

  return (
    <FormField
      name="amount"
      label={t('transactions.amount')}
      value={amount}
      onChangeText={setAmount}
      error={errors.amount}
      touched={touched.amount}
      onBlur={() => {
        setTouched({ ...touched, amount: true });
        handleValidate();
      }}
      required
      component="input"
      componentProps={{ keyboardType: 'numeric' }}
      hapticOnError
    />
  );
}
```

**Key Rules**:
1. **Always use FormField** for form inputs (not raw Input)
2. **Wrap with validation logic** in parent form component
3. **Show i18n error messages** via error prop
4. **Track touched state** for UX (show errors only when user has interacted)
5. **Enable haptic feedback** for validation errors

---

#### TransactionForm Component

**Purpose**: Complete Add/Edit transaction form

**Usage**:
```typescript
import { TransactionForm } from '@/components/forms';

export function AddTransactionScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  const handleSubmit = async (data) => {
    try {
      const transaction = await createTransaction(data);
      // Navigate back to transactions with scroll-to-item
      router.push('/(tabs)/transactions', {
        scrollToId: transaction.id,
        highlight: true,
      });
    } catch (error) {
      // Show error message
    }
  };

  return (
    <TransactionForm
      onSubmit={handleSubmit}
    />
  );
}
```

---

### 3. Surface Components (`/surfaces`)

Layout containers and data display surfaces.

#### SummaryCard Component

**Purpose**: Display single financial metric (income/expense/balance)

**Usage**:
```typescript
import { SummaryCard } from '@/components/surfaces';

export function SummaryScreen() {
  const { summary } = useSummaryStore();

  return (
    <>
      <SummaryCard
        title="Total Income"
        value={summary.income}
        format="currency"
      />
      <SummaryCard
        title="Total Expense"
        value={summary.expense}
        format="currency"
        trendArrow="up"
      />
      <SummaryCard
        title="Balance"
        value={summary.balance}
        format="currency"
      />
    </>
  );
}
```

---

#### TransactionCard Component

**Purpose**: Display single transaction item in list

**Usage**:
```typescript
import { TransactionCard } from '@/components/surfaces';

export function TransactionItem({ transaction, isHighlighted }) {
  const router = useRouter();

  return (
    <TransactionCard
      transaction={transaction}
      onPress={() => router.push(`/(tabs)/transactions/${transaction.id}`)}
      onDelete={() => deleteTransaction(transaction.id)}
      highlighted={isHighlighted}
    />
  );
}
```

---

#### TransactionList Component

**Purpose**: Virtualized list of transactions with scroll-to-item

**Usage**:
```typescript
import { TransactionList } from '@/components/surfaces';
import { useRoute } from '@react-navigation/native';

export function TransactionsScreen() {
  const { transactions } = useTransactionStore();
  const route = useRoute();
  const { scrollToId, highlight } = route.params || {};

  return (
    <TransactionList
      transactions={transactions}
      onItemPress={(id) => router.push(`/(tabs)/transactions/${id}`)}
      onItemDelete={(id) => deleteTransaction(id)}
      highlightedId={highlight ? scrollToId : undefined}
      scrollToId={scrollToId}
    />
  );
}
```

---

### 4. Chart Components (`/charts`)

Data visualization using React Native Skia (GPU-accelerated).

#### TimeSeries Chart

**Purpose**: Time-series visualization (line/bar chart)

**Usage**:
```typescript
import { TimeSeries } from '@/components/charts';

export function TrendsByTimeScreen() {
  const { data } = useTrendsStore();

  return (
    <TimeSeries
      data={data}
      granularity="month"
      height={300}
    />
  );
}
```

---

#### CategoryPie Chart

**Purpose**: Category breakdown visualization

**Usage**:
```typescript
import { CategoryPie } from '@/components/charts';

export function TrendsByCategory() {
  const { categoryData } = useTrendsStore();

  return (
    <CategoryPie
      data={categoryData}
      height={300}
      showLegend
    />
  );
}
```

---

### 5. Animation Components (`/animations`)

Animation wrappers using React Native Reanimated 3.

#### FadeIn Animation

**Purpose**: Fade in entrance effect

**Usage**:
```typescript
import { FadeIn } from '@/components/animations';

export function MyScreen() {
  return (
    <FadeIn duration={300}>
      <Text>Content fades in</Text>
    </FadeIn>
  );
}
```

---

#### SuccessCheck Animation

**Purpose**: Success checkmark with haptic feedback

**Usage**:
```typescript
import { SuccessCheck } from '@/components/animations';

export function TransactionAddedScreen() {
  const router = useRouter();

  const handleAnimationComplete = () => {
    router.push('/(tabs)/transactions');
  };

  return (
    <SuccessCheck onComplete={handleAnimationComplete} />
  );
}
```

---

## Patterns & Best Practices

### 1. Component Composition

**✅ Do**: Compose complex components from simpler ones
```typescript
export function SummaryCards() {
  return (
    <Container padding="lg">
      <SummaryCard title="Income" value={100} />
      <SummaryCard title="Expense" value={50} />
      <SummaryCard title="Balance" value={50} />
    </Container>
  );
}
```

**❌ Don't**: Create monolithic components
```typescript
// Avoid this - too much logic in one component
export function SummaryCardGroup() {
  // 200+ lines of code handling all three cards
}
```

---

### 2. Type Safety

**✅ Do**: Use TypeScript interfaces
```typescript
interface MyProps {
  value: number;
  onChange: (value: number) => void;
  variant?: 'default' | 'error';
}

export const MyComponent: React.FC<MyProps> = ({ value, onChange, variant }) => {
  // Component code
};
```

**❌ Don't**: Use any types
```typescript
export function MyComponent(props: any) {
  // No type checking
}
```

---

### 3. Memoization for Performance

**✅ Do**: Memoize expensive components
```typescript
export const TransactionCard = React.memo(
  ({ transaction, onPress }) => {
    return <Card onPress={onPress}>...</Card>;
  },
  (prev, next) => prev.transaction.id === next.transaction.id
);
```

**❌ Don't**: Re-render unnecessarily
```typescript
// No memoization = re-renders on every parent render
export function TransactionCard({ transaction }) {
  return <Card>...</Card>;
}
```

---

### 4. Accessibility

**✅ Do**: Include accessibility props
```typescript
<Button
  title="Save"
  onPress={handleSave}
  accessibilityLabel="Save transaction"
  accessibilityRole="button"
/>
```

**❌ Don't**: Ignore accessibility
```typescript
<Pressable onPress={handleSave}>
  <Text>Save</Text>
</Pressable>
```

---

### 5. i18n Integration

**✅ Do**: Use translated strings
```typescript
const { t } = useTranslation();

return <Text>{t('common.ok')}</Text>;  // Type-safe
```

**❌ Don't**: Hardcode strings
```typescript
return <Text>OK</Text>;  // Not translated
```

---

### 6. Form Validation with FormField

**✅ Do**: Wrap all form inputs
```typescript
<FormField
  name="amount"
  label={t('transactions.amount')}
  value={amount}
  onChangeText={setAmount}
  error={errors.amount}
  component="input"
  required
  hapticOnError
/>
```

**❌ Don't**: Use raw Input for forms
```typescript
<Input
  value={amount}
  onChangeText={setAmount}
  // No error handling, no i18n
/>
```

---

## Token Usage

### Colors
```typescript
import { colors } from '@/tokens';

<View style={{ backgroundColor: colors.primary }} />
```

### Typography
```typescript
import { typography } from '@/tokens';

<Text style={typography.headline}>Title</Text>
```

### Spacing
```typescript
import { spacing } from '@/tokens';

<View style={{ padding: spacing.md, marginTop: spacing.lg }} />
```

### Elevation
```typescript
import { elevation } from '@/tokens';

<View style={elevation[2]} />
```

### Animations
```typescript
import { springs, durations } from '@/tokens';

Animated.timing(value, {
  toValue: 1,
  duration: durations.normal,
  ...springs.default,
}).start();
```

---

## Adding New Components

### Step 1: Determine Category
- Reusable & simple → `/ui`
- Form-related → `/forms`
- Layout → `/surfaces` or `/layouts`
- Visualization → `/charts`
- Animation wrapper → `/animations`
- Full screen → `/screens`

### Step 2: Create Component File
```typescript
// src/components/ui/MyButton.tsx
import React from 'react';
import { colors, spacing, typography } from '@/tokens';

interface MyButtonProps {
  title: string;
  onPress: () => void;
}

export const MyButton: React.FC<MyButtonProps> = ({ title, onPress }) => {
  return (
    <Pressable onPress={onPress} style={styles.button}>
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  text: {
    ...typography.body,
    color: colors.white,
  },
});
```

### Step 3: Add to Index File
```typescript
// src/components/ui/index.ts
export { MyButton } from './MyButton';
export { Button } from './Button';
// ... other exports
```

### Step 4: Update This README
Document component, props, and usage example

### Step 5: Add Types to Contracts (if needed)
```typescript
// src/contracts/components.ts
export interface MyButtonProps {
  title: string;
  onPress: () => void;
}
```

---

## Testing Components

### Unit Test Example
```typescript
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '@/components/ui';

describe('Button', () => {
  it('calls onPress when tapped', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <Button title="Click" onPress={onPress} />
    );
    fireEvent.press(getByText('Click'));
    expect(onPress).toHaveBeenCalled();
  });
});
```

---

## Performance Checklist

- [ ] Components use React.memo where appropriate
- [ ] Lists use virtualization (FlashList)
- [ ] Charts are lazy-loaded
- [ ] Images are optimized and sized
- [ ] Expensive calculations use useMemo
- [ ] Event handlers use useCallback
- [ ] No inline object/array creation in props
- [ ] State updates batched when possible

---

## Accessibility Checklist

- [ ] All interactive elements have accessibilityLabel
- [ ] Color contrast meets WCAG AA (4.5:1)
- [ ] Focus order is logical
- [ ] Touch targets are ≥ 44pt × 44pt
- [ ] All form fields have labels
- [ ] Error messages are clear and actionable
- [ ] Haptic feedback confirms important actions
- [ ] Reduced motion preference respected

---

## Common Issues & Solutions

### Issue: Form field validation errors not showing
**Solution**: Ensure `touched` state is tracked and FormField error prop is set from validation

### Issue: List items not updating when data changes
**Solution**: Use React.memo correctly with proper comparison function based on data that matters

### Issue: Navigation params not passed correctly
**Solution**: Use type-safe contracts from `src/contracts/navigation.ts`

### Issue: Translations not loading
**Solution**: Ensure i18n config is initialized before app renders; check key spelling

---

## Resources

- **Component Architecture**: See `specs/001-ledger-analytics/component-architecture.md`
- **i18n Setup**: See `src/i18n/config.ts` and `src/i18n/locales/`
- **Design Tokens**: See `src/tokens/`
- **Type Contracts**: See `src/contracts/`

---

**Last Updated**: 2025-11-16  
**Maintainer**: Ledger Analytics Team
