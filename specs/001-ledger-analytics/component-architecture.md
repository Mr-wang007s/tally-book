# Component Architecture: Ledger Analytics

**Feature**: 001-ledger-analytics  
**Pattern**: Feature-based organization following shadcn design system  
**Last Updated**: 2025-11-16  

---

## Overview

This document defines the component organization strategy for the Ledger Analytics feature. Components are organized into logical groupings by responsibility, enabling scalability to 50+ components without clutter.

**Key Principles**:
1. **Feature-based structure**: Organize by function, not by type
2. **Atomic design**: Build complex components from simpler primitives
3. **Reusability**: UI primitives used across multiple features
4. **Testability**: Each component independently testable
5. **Performance**: Lazy loading and memoization where appropriate

---

## Folder Structure

```
src/components/
├── ui/                           # Reusable design system primitives
│   ├── Button.tsx               # Base button with haptic feedback
│   ├── Input.tsx                # Text input with validation state
│   ├── Select.tsx               # Picker/dropdown component
│   ├── Card.tsx                 # Container with shadow/radius
│   ├── Badge.tsx                # Category/tag display
│   ├── Sheet.tsx                # Bottom sheet (modal container)
│   └── index.ts                 # Re-export all UI primitives
│
├── forms/                        # Form-related components
│   ├── FormField.tsx            # Unified form input wrapper (CRITICAL)
│   ├── FormValidation.ts        # Zod/Yup validation schemas
│   ├── FormTypes.ts             # TypeScript types for forms
│   ├── TransactionForm.tsx      # Add/Edit transaction form
│   ├── DatePicker.tsx           # Date selection component
│   ├── CategoryPicker.tsx       # Category selection component
│   ├── FormContext.ts           # Form state management (optional)
│   └── index.ts                 # Re-export form components
│
├── surfaces/                     # Layout and container components
│   ├── SummaryCard.tsx          # Income/expense/balance card
│   ├── SummaryCards.tsx         # Grid of summary cards
│   ├── CardGrid.tsx             # Reusable grid layout
│   ├── Container.tsx            # Screen padding/margins wrapper
│   ├── TransactionCard.tsx      # Single transaction item
│   ├── TransactionList.tsx      # Virtualized transaction list
│   └── index.ts                 # Re-export surface components
│
├── charts/                       # Data visualization
│   ├── CategoryPie.tsx          # Category breakdown pie chart
│   ├── TimeSeries.tsx           # Time-series line/bar chart
│   ├── ChartSkeleton.tsx        # Loading placeholder for charts
│   └── index.ts                 # Re-export chart components
│
├── animations/                   # Animation wrappers
│   ├── FadeIn.tsx               # Fade in animation wrapper
│   ├── SlideIn.tsx              # Slide in animation wrapper
│   ├── SuccessCheck.tsx         # Success checkmark animation
│   ├── LoadingIndicator.tsx     # Spinner/loading animation
│   └── index.ts                 # Re-export animation components
│
├── layouts/                      # Screen-level layout components
│   ├── TabLayout.tsx            # Tab navigation wrapper
│   ├── ScreenLayout.tsx         # Standard screen padding + header
│   └── index.ts                 # Re-export layout components
│
├── screens/                      # Full-screen feature components
│   ├── HomeScreen.tsx           # Home dashboard screen
│   ├── TransactionsScreen.tsx   # Transactions list screen
│   ├── SummaryScreen.tsx        # Financial summary screen
│   ├── TrendsScreen.tsx         # Trends analysis screen
│   ├── AddTransactionScreen.tsx # Add/edit transaction screen
│   └── index.ts                 # Re-export screen components
│
└── README.md                     # Component patterns & usage guide
```

---

## Component Categories & Responsibilities

### 1. UI Primitives (`/ui`)

**Purpose**: Foundational, reusable design system components matching shadcn patterns

#### Button.tsx
```typescript
// Wraps React Native Button with haptic feedback and loading state
interface ButtonProps {
  title: string;
  onPress: () => void | Promise<void>;
  variant?: 'primary' | 'secondary' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  hapticFeedback?: 'light' | 'medium' | 'heavy';
}
```
- **Features**: Haptic feedback on press, loading state, accessibility
- **Usage**: CTA buttons, form submissions, navigation
- **Props**: title, onPress, variant, size, disabled, loading

#### Input.tsx
```typescript
// Text input with focus ring, error state, and accessibility
interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: 'numeric' | 'email-address' | 'phone-pad' | 'default';
  error?: string;
  editable?: boolean;
  multiline?: boolean;
}
```
- **Features**: Focus indicator, error display, keyboard types
- **Usage**: Form fields, search inputs
- **Props**: value, onChangeText, placeholder, keyboardType, error

#### Select.tsx
```typescript
// Picker/dropdown for selecting from options
interface SelectProps {
  options: Array<{ label: string; value: string }>;
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  error?: string;
}
```
- **Features**: Customizable options, error state
- **Usage**: Category selection, type selection, period filtering
- **Props**: options, value, onValueChange, placeholder, error

#### Card.tsx
```typescript
// Container with shadow, border radius, and elevation
interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  elevation?: 0 | 1 | 2 | 3 | 4 | 5;
  bordered?: boolean;
  padding?: keyof typeof spacing;
}
```
- **Features**: Elevation system, press handling, flexible styling
- **Usage**: Summary cards, transaction items, data containers
- **Props**: children, onPress, elevation, bordered, padding

#### Badge.tsx
```typescript
// Tag/badge for category or status display
interface BadgeProps {
  text: string;
  variant?: 'default' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md';
}
```
- **Features**: Semantic color variants, size options
- **Usage**: Category labels, status indicators
- **Props**: text, variant, size

#### Sheet.tsx
```typescript
// Bottom sheet modal (already exists, document interface)
interface SheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}
```
- **Features**: Snap points, gesture handling
- **Usage**: Add/edit transaction modal, date picker
- **Props**: isOpen, onClose, children, title

---

### 2. Form Components (`/forms`)

**Purpose**: Complex form handling with validation and state management

#### FormField.tsx (CRITICAL - USE EVERYWHERE)
```typescript
// Unified wrapper for all form inputs with validation and i18n
interface FormFieldProps<T> {
  name: keyof T;
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  touched?: boolean;
  onBlur?: () => void;
  required?: boolean;
  hint?: string;
  component: 'input' | 'select' | 'datepicker';
  componentProps?: Record<string, any>;
  hapticOnError?: boolean;
}
```
- **Features**: 
  - Unified error display with i18n
  - Touched field tracking
  - Haptic feedback on validation error
  - Required field indication
  - Hint text support
- **Usage**: Every form field in TransactionForm
- **Key Pattern**: Always wrap form inputs with FormField

#### TransactionForm.tsx
```typescript
// Add/Edit transaction form using FormField components
interface TransactionFormProps {
  initialValues?: Partial<Transaction>;
  onSubmit: (data: Transaction) => Promise<void>;
  loading?: boolean;
}
```
- **Features**:
  - Type selection (income/expense)
  - Amount input with currency formatting
  - Date picker
  - Category selector (income-aware/expense-aware)
  - Note optional field
  - Payment method optional field
  - Form-level validation
  - Haptic feedback on submit
- **Usage**: Add transaction flow, Edit transaction flow
- **Dependencies**: FormField, DatePicker, CategoryPicker, validation schemas

#### DatePicker.tsx
```typescript
// Date selection component wrapping native or custom picker
interface DatePickerProps {
  value: Date;
  onChange: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  error?: string;
}
```
- **Features**: Min/max date constraints, error state
- **Usage**: Transaction date field
- **Platform**: Native picker on iOS, custom on Android/Web

#### CategoryPicker.tsx
```typescript
// Category selection component with income/expense awareness
interface CategoryPickerProps {
  type: 'income' | 'expense';
  value?: string;
  onChange: (categoryId: string) => void;
  error?: string;
}
```
- **Features**: Type-aware categories, filtered list
- **Usage**: Transaction category field
- **Dependencies**: categories.json translations

---

### 3. Surface Components (`/surfaces`)

**Purpose**: Layout containers and data display surfaces

#### SummaryCard.tsx
```typescript
// Single metric card (income/expense/balance)
interface SummaryCardProps {
  title: string;
  value: number;
  format?: 'currency' | 'percentage';
  trendArrow?: 'up' | 'down' | 'neutral';
}
```
- **Usage**: Income card, expense card, balance card
- **Features**: Currency formatting, trend arrow
- **Dependencies**: Card UI primitive

#### SummaryCards.tsx
```typescript
// Grid container for summary metrics
interface SummaryCardsProps {
  period: Period;
  data: SummaryData;
}
```
- **Usage**: Summary screen layout
- **Features**: Responsive grid (2-3 columns)
- **Dependencies**: SummaryCard × 3

#### TransactionCard.tsx
```typescript
// Single transaction item in list
interface TransactionCardProps {
  transaction: Transaction;
  onPress?: () => void;
  onDelete?: () => void;
  highlighted?: boolean;
}
```
- **Usage**: Transaction list items
- **Features**: Swipe to delete, press to edit, highlight animation
- **Dependencies**: Card, Badge, animations

#### TransactionList.tsx
```typescript
// Virtualized list of transactions
interface TransactionListProps {
  transactions: Transaction[];
  onItemPress: (id: string) => void;
  onItemDelete: (id: string) => void;
  highlightedId?: string;
  scrollToId?: string;
}
```
- **Usage**: Transactions screen
- **Features**: 
  - Virtualization (FlashList)
  - Estimated item size optimization
  - Scroll-to-item with animation
  - Swipe actions
- **Performance**: Handles 5000+ items at 60fps

---

### 4. Chart Components (`/charts`)

**Purpose**: Data visualization using Skia for performance

#### TimeSeries.tsx
```typescript
// Time-series chart (line or bar)
interface TimeSeriesProps {
  data: Array<{ date: string; value: number }>;
  granularity: 'day' | 'week' | 'month';
  height?: number;
  loading?: boolean;
}
```
- **Usage**: Trends → By Time screen
- **Features**: GPU-accelerated (Skia), animated transitions
- **Lazy Load**: Only load when Trends screen is active

#### CategoryPie.tsx
```typescript
// Pie/donut chart for category breakdown
interface CategoryPieProps {
  data: Array<{ category: string; amount: number }>;
  height?: number;
  showLegend?: boolean;
  loading?: boolean;
}
```
- **Usage**: Trends → By Category screen
- **Features**: Animated segments, tap to highlight
- **Lazy Load**: Only load when Trends screen is active

#### ChartSkeleton.tsx
```typescript
// Loading skeleton for charts
interface ChartSkeletonProps {
  height?: number;
}
```
- **Usage**: Chart loading state
- **Features**: Animated shimmer effect

---

### 5. Animation Components (`/animations`)

**Purpose**: Animation wrappers using React Native Reanimated 3

#### FadeIn.tsx
```typescript
// Fade in animation wrapper
interface FadeInProps {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
}
```
- **Usage**: Screen entrance, data load
- **Features**: Customizable duration and delay

#### SlideIn.tsx
```typescript
// Slide in animation wrapper
interface SlideInProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  duration?: number;
}
```
- **Usage**: Modal entrance, navigation
- **Features**: Directional slide, spring physics

#### SuccessCheck.tsx
```typescript
// Success checkmark animation
interface SuccessCheckProps {
  onComplete?: () => void;
  duration?: number;
}
```
- **Usage**: Form submission success feedback
- **Features**: Animated checkmark, haptic integration

#### LoadingIndicator.tsx
```typescript
// Spinner/loading animation
interface LoadingIndicatorProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}
```
- **Usage**: Data loading states
- **Features**: Smooth rotation, size variants

---

### 6. Layout Components (`/layouts`)

**Purpose**: Screen-level container logic

#### ScreenLayout.tsx
```typescript
// Standard screen wrapper with padding and header
interface ScreenLayoutProps {
  title?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  onBack?: () => void;
}
```
- **Usage**: Every screen (home, transactions, summary, trends)
- **Features**: 
  - Standard padding (lg = 24pt)
  - Safe area handling
  - Header with back button
  - Header action slot
- **Subcomponent**: Contains Container

#### Container.tsx
```typescript
// Padding wrapper matching design tokens
interface ContainerProps {
  children: React.ReactNode;
  padding?: keyof typeof spacing;
  horizontal?: boolean;
  vertical?: boolean;
}
```
- **Usage**: Inner content padding
- **Features**: Responsive padding using token system
- **Example**: All children of ScreenLayout wrapped in Container

#### TabLayout.tsx
```typescript
// Tab navigation wrapper
interface TabLayoutProps {
  tabs: Array<{ label: string; icon?: string }>;
  activeTab: number;
  onTabChange: (index: number) => void;
  children: React.ReactNode;
}
```
- **Usage**: Main app layout (Home, Transactions, Summary, Trends)
- **Features**: Tab switching, haptic on change, smooth transitions

---

### 7. Screen Components (`/screens`)

**Purpose**: Full-screen feature implementations (logic heavy)

#### HomeScreen.tsx
```typescript
// Home dashboard
// Features:
// - Current balance display
// - Recent 5 transactions
// - Top spending category
// - Spending breakdown (top 4 categories)
// - Quick action buttons
```
- **Dependencies**: SummaryCard, TransactionCard, CategoryPie
- **Data**: useTransactionStore(), useCategoryStore()

#### TransactionsScreen.tsx
```typescript
// Transactions list with filtering
// Features:
// - Full transaction list (virtualized)
// - Period filter (month/week/custom)
// - Category filter
// - Swipe to delete
// - Tap to edit
// - Scroll-to-item animation (post-add flow)
```
- **Dependencies**: TransactionList, TransactionCard, FilterBar
- **Data**: useTransactionStore(), useFilterStore()

#### SummaryScreen.tsx
```typescript
// Financial summary with period selection
// Features:
// - Income/Expense/Balance cards
// - Period selector
// - Category breakdown
// - Comparison to previous period
```
- **Dependencies**: SummaryCards, CategoryBreakdown
- **Data**: useSummaryStore()

#### TrendsScreen.tsx
```typescript
// Spending trends analysis
// Features:
// - By Time chart (line/bar)
// - By Category chart (pie/donut)
// - Granularity selector (day/week/month)
// - Period selector
// - Legend interaction
```
- **Dependencies**: TimeSeries, CategoryPie, SelectionControls
- **Data**: useTrendsStore()

#### AddTransactionScreen.tsx
```typescript
// Add or edit transaction screen
// Features:
// - TransactionForm component
// - Form validation with i18n errors
// - Haptic feedback on validation error
// - Success animation on submit
// - Post-add navigation (return to transactions with scrollToId param)
```
- **Dependencies**: TransactionForm, SuccessCheck
- **Navigation**: router.push('/(tabs)/transactions', { scrollToId, highlight: true })

---

## Component Communication Patterns

### Props Drilling (Allowed for <3 Levels)
```typescript
// ✅ Good: Direct props for simple cases
<Screen>
  <Card>
    <Text>{value}</Text>
  </Card>
</Screen>
```

### Context API (For Global State)
```typescript
// ✅ Use for: Theme, Language, Authentication
<ThemeProvider>
  <LanguageProvider>
    <AppContent />
  </LanguageProvider>
</ThemeProvider>
```

### State Management (For Feature State)
```typescript
// ✅ Use Zustand stores for transaction, summary, trends data
const { transactions } = useTransactionStore();
const { summary } = useSummaryStore();
```

---

## Import Organization

### Absolute Imports (Configure in tsconfig.json)
```typescript
// ✅ Preferred
import { Button } from '@/components/ui';
import { TransactionForm } from '@/components/forms';
import { Container } from '@/components/surfaces';

// ❌ Avoid
import Button from '../../../components/ui/Button';
```

### Index Files for Clean Exports
```typescript
// src/components/ui/index.ts
export { Button } from './Button';
export { Input } from './Input';
export { Select } from './Select';
export { Card } from './Card';
export { Badge } from './Badge';
export { Sheet } from './Sheet';
```

---

## Performance Guidelines

### Memoization Strategy
```typescript
// Use React.memo for expensive renders
export const TransactionCard = React.memo(
  ({ transaction, onPress }) => {
    // Only re-render if transaction.id changes
    return <Card onPress={onPress}>...</Card>;
  },
  (prev, next) => prev.transaction.id === next.transaction.id
);
```

### Lazy Loading
```typescript
// Lazy load chart components (loaded only on Trends screen)
const TimeSeries = lazy(() => import('@/components/charts/TimeSeries'));

<Suspense fallback={<ChartSkeleton />}>
  <TimeSeries data={data} />
</Suspense>
```

### Virtualization for Lists
```typescript
// Use FlashList for large lists (TransactionList)
<FlashList
  data={transactions}
  renderItem={renderTransaction}
  estimatedItemSize={72}  // Height of each item
/>
```

---

## Adding New Components

### 1. Determine Category
- **Reusable & Simple** → `/ui`
- **Form-related** → `/forms`
- **Layout/Container** → `/surfaces` or `/layouts`
- **Visualization** → `/charts`
- **Animation wrapper** → `/animations`
- **Full screen** → `/screens`

### 2. Create Component File
```typescript
// src/components/ui/NewButton.tsx
import React from 'react';
import { View, Pressable } from 'react-native';
import { colors, spacing, typography } from '@/tokens';

interface NewButtonProps {
  title: string;
  onPress: () => void;
  // ... more props
}

export const NewButton: React.FC<NewButtonProps> = ({ title, onPress }) => {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Text>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: spacing.md,
    backgroundColor: colors.primary,
  }
});
```

### 3. Add to Index File
```typescript
// src/components/ui/index.ts
export { NewButton } from './NewButton';
```

### 4. Update README.md
Document the new component's purpose, props, and usage example

### 5. Add TypeScript Types to `/contracts`
If component has complex props, add types to `/src/contracts/components.ts`

---

## Testing Strategy

### Unit Tests (Per Component)
```typescript
// src/components/ui/__tests__/Button.test.tsx
describe('Button', () => {
  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(<Button title="Click" onPress={onPress} />);
    fireEvent.press(getByText('Click'));
    expect(onPress).toHaveBeenCalled();
  });
});
```

### Integration Tests (Features)
```typescript
// tests/integration/AddTransaction.test.tsx
describe('Add Transaction Flow', () => {
  it('submits form and navigates to transactions list', async () => {
    // Complete user flow test
  });
});
```

---

## Accessibility Requirements

- **Color Contrast**: WCAG AA minimum (4.5:1 for text)
- **Touch Targets**: 44pt × 44pt minimum (iOS HIG)
- **Focus Order**: Logical tab order through FormField components
- **Labels**: All inputs have accessible labels (via FormField)
- **Reduced Motion**: Respect `prefers-reduced-motion` system setting
- **Screen Reader**: All interactive elements have accessibilityLabel

---

**Next Step**: Create `src/contracts/navigation.ts` and `src/contracts/i18n.ts` with TypeScript interfaces
