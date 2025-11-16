# Component Migration Guide

## Overview

This document provides a comprehensive guide for using the newly reorganized component structure in the Ledger Analytics application.

## New Component Structure

All components are now organized in `/src/components/` with the following hierarchy:

```
src/components/
├── ui/                          # Base UI components
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Input.tsx
│   ├── Select.tsx
│   ├── Badge.tsx
│   ├── Checkbox.tsx
│   ├── Radio.tsx
│   ├── Switch.tsx
│   ├── Divider.tsx
│   └── Spinner.tsx
├── inputs/                      # Specialized input components
│   ├── TextInput.tsx
│   ├── NumberInput.tsx
│   ├── DateInput.tsx
│   ├── CategoryPicker.tsx
│   ├── PaymentMethodPicker.tsx
│   ├── NotesInput.tsx
│   └── index.ts
├── forms/                       # Form-related components
│   ├── FormField.tsx
│   ├── FormContainer.tsx
│   ├── TransactionForm.tsx
│   ├── FormContext.ts
│   └── useForm.ts
├── feedback/                    # User feedback components
│   ├── Toast.tsx
│   ├── Alert.tsx
│   ├── Loading.tsx
│   ├── EmptyState.tsx
│   └── index.ts
├── lists/                       # List and item components
│   ├── TransactionList.tsx
│   ├── ListItem.tsx
│   ├── ListSection.tsx
│   ├── ConfirmDialog.tsx
│   └── index.ts
├── controls/                    # Control and filter components
│   ├── PeriodFilter.tsx
│   ├── CategoryFilter.tsx
│   ├── SortControl.tsx
│   ├── ViewModeToggle.tsx
│   └── index.ts
├── layouts/                     # Layout wrapper components
│   ├── ScreenLayout.tsx
│   ├── ModalLayout.tsx
│   ├── TabLayout.tsx
│   └── index.ts
├── surfaces/                    # Surface/card components
│   ├── SummaryCard.tsx
│   ├── SummaryCards.tsx
│   ├── Container.tsx
│   └── index.ts
├── animations/                  # Animation components
│   ├── FadeIn.tsx
│   ├── SlideIn.tsx
│   ├── ScaleIn.tsx
│   ├── CountUp.tsx
│   ├── Skeleton.tsx
│   ├── SuccessCheck.tsx
│   └── index.ts
├── charts/                      # Chart components
│   ├── CategoryPie.tsx
│   ├── TimeSeries.tsx
│   └── index.ts
└── index.ts                     # Central export hub
```

## Import Patterns

### Method 1: Import from Central Hub (Recommended)

```typescript
// Import from the central components index
import { Button, Card, TextInput } from '@/components';
import { PeriodFilter, CategoryFilter } from '@/components';
import { Toast, Alert } from '@/components';
import { TransactionList, ListItem } from '@/components';
import { ScreenLayout, ModalLayout } from '@/components';
```

### Method 2: Import from Subfolder

```typescript
// Import directly from subfolders
import { Button } from '@/components/ui';
import { TextInput, NumberInput, DateInput } from '@/components/inputs';
import { PeriodFilter, SortControl } from '@/components/controls';
import { Toast, Alert, Loading } from '@/components/feedback';
import { TransactionList, ListItem } from '@/components/lists';
import { ScreenLayout, TabLayout } from '@/components/layouts';
```

### Method 3: Import Specific Component

```typescript
// Import directly from the component file
import { Button } from '@/components/ui/Button';
import { TextInput } from '@/components/inputs/TextInput';
```

## Component Categories

### UI Components (`/ui`)
**Purpose**: Basic, reusable UI building blocks

- **Button**: Multi-variant button with haptic feedback
- **Card**: Container with shadow and rounded corners
- **Input**: Single-line text input
- **Select**: Dropdown selector
- **Badge**: Small label/badge component
- **Checkbox**: Checkbox input
- **Radio**: Radio button
- **Switch**: Toggle switch
- **Divider**: Visual separator
- **Spinner**: Loading spinner

**Usage**:
```typescript
import { Button, Card } from '@/components/ui';

<Button title="Save" onPress={handleSave} variant="primary" />
<Card style={{ padding: 16 }}>
  <Text>Card content</Text>
</Card>
```

### Input Components (`/inputs`)
**Purpose**: Specialized input components for common data types

- **TextInput**: Text input with label, error state, helper text
- **NumberInput**: Numeric input with +/- buttons, min/max validation
- **DateInput**: Date picker with formatted display
- **CategoryPicker**: Dropdown picker for transaction categories
- **PaymentMethodPicker**: Picker for payment methods with descriptions
- **NotesInput**: Multi-line text area with character counter

**Usage**:
```typescript
import { NumberInput, CategoryPicker } from '@/components/inputs';

<NumberInput
  label="Amount"
  value={amount}
  onChangeValue={setAmount}
  prefix="¥"
  decimals={2}
/>

<CategoryPicker
  label="Category"
  value={categoryId}
  categories={categories}
  onChangeCategory={setCategoryId}
/>
```

### Form Components (`/forms`)
**Purpose**: Complete form building and management

- **FormField**: Unified input wrapper with label, error, helper text
- **FormContainer**: Form wrapper with provider
- **TransactionForm**: Pre-built transaction form
- **FormContext**: State management context
- **useForm**: Form state and validation hook

**Usage**:
```typescript
import { FormContainer, useForm } from '@/components/forms';

const MyForm = () => {
  const form = useForm({
    initialValues: { amount: '', category: '' },
    validate: (values) => ({/* validation logic */}),
    onSubmit: (values) => {/* handle submit */}
  });

  return (
    <FormContainer>
      <FormField label="Amount" value={form.values.amount} />
    </FormContainer>
  );
};
```

### Feedback Components (`/feedback`)
**Purpose**: Display feedback messages and states

- **Toast**: Non-intrusive notification with auto-dismiss
- **Alert**: Prominent alert with optional actions
- **Loading**: Loading states (spinner, skeleton, progress)
- **EmptyState**: Empty state display with action

**Usage**:
```typescript
import { Toast, Alert, Loading, EmptyState } from '@/components/feedback';

<Toast message="Saved successfully" type="success" />
<Alert type="error" title="Error" message="Something went wrong" />
<Loading visible={isLoading} message="Loading..." />
<EmptyState title="No transactions" action={{ label: 'Add', onPress: () => {} }} />
```

### List Components (`/lists`)
**Purpose**: Display and manage lists of items

- **TransactionList**: Virtualized list of transactions
- **ListItem**: Individual transaction item with actions
- **ListSection**: Grouped list section with header/footer
- **ConfirmDialog**: Confirmation dialog for destructive actions

**Usage**:
```typescript
import { TransactionList, ListSection } from '@/components/lists';

<TransactionList
  data={transactions}
  onSelectTransaction={handleSelect}
  onRefresh={handleRefresh}
/>

<ListSection title="Today" subtitle="2 transactions">
  {/* items */}
</ListSection>
```

### Control Components (`/controls`)
**Purpose**: User controls for filtering and sorting

- **PeriodFilter**: Time period selector (today, week, month, year, custom)
- **CategoryFilter**: Multi-select category filter
- **SortControl**: Sort order selector
- **ViewModeToggle**: Toggle between view modes (list, grid, chart)

**Usage**:
```typescript
import { PeriodFilter, CategoryFilter, SortControl } from '@/components/controls';

<PeriodFilter value="month" onChangePeriod={(period) => {}} />
<CategoryFilter
  categories={categories}
  selectedIds={selected}
  onChangeSelection={setSelected}
/>
<SortControl value="date-desc" onChangeSort={(sort) => {}} />
```

### Layout Components (`/layouts`)
**Purpose**: Screen and modal layout structures

- **ScreenLayout**: Base screen layout with header, content, footer
- **ModalLayout**: Modal/sheet layout with actions
- **TabLayout**: Tab navigation with swipeable content

**Usage**:
```typescript
import { ScreenLayout, TabLayout } from '@/components/layouts';

<ScreenLayout
  header={<Text>Header</Text>}
  footer={<Button title="Save" />}
>
  {/* content */}
</ScreenLayout>

<TabLayout
  tabs={[
    { id: 'tab1', label: 'Tab 1' },
    { id: 'tab2', label: 'Tab 2' }
  ]}
>
  {
    tab1: <View>Content 1</View>,
    tab2: <View>Content 2</View>,
  }
</TabLayout>
```

### Surface Components (`/surfaces`)
**Purpose**: Card and container components

- **SummaryCard**: Individual summary/metric card
- **SummaryCards**: Grid of summary cards (income, expense, balance)
- **Container**: Screen-level padding container

**Usage**:
```typescript
import { SummaryCards } from '@/components/surfaces';

<SummaryCards
  income={1000}
  expense={500}
  balance={500}
/>
```

### Animation Components (`/animations`)
**Purpose**: Animated transitions and effects

- **FadeIn**: Fade-in animation
- **SlideIn**: Slide-in animation
- **ScaleIn**: Scale animation
- **CountUp**: Number counter animation
- **Skeleton**: Skeleton loader animation
- **SuccessCheck**: Success checkmark animation

**Usage**:
```typescript
import { FadeIn, CountUp } from '@/components/animations';

<FadeIn delay={100}>
  <Text>Faded in text</Text>
</FadeIn>

<CountUp value={1000} duration={500} />
```

### Chart Components (`/charts`)
**Purpose**: Data visualization components

- **CategoryPie**: Pie chart for category distribution
- **TimeSeries**: Time series line chart

**Usage**:
```typescript
import { CategoryPie, TimeSeries } from '@/components/charts';

<CategoryPie data={categoryData} />
<TimeSeries data={timeData} xAxisLabel="Date" />
```

## Migration Checklist

When updating existing code to use new components:

- [ ] Replace old component imports with new paths
- [ ] Use central export hub (`@/components`) when possible
- [ ] Update component names if they've changed
- [ ] Check component props for API changes
- [ ] Test all form validation and error messages
- [ ] Verify all screen layouts render correctly
- [ ] Test responsive behavior across screen sizes
- [ ] Verify touch and haptic feedback works
- [ ] Check i18n translations for new components

## Type Safety

All components are fully TypeScript typed:

```typescript
// All component props are properly typed
import { Button, ButtonProps } from '@/components';

const MyButton: React.FC<ButtonProps> = (props) => {
  return <Button {...props} />;
};
```

## Breaking Changes

### Removed Components

- Old `PeriodFilter` (replaced with new version in `controls/`)
- Old `TrendControls` (use `ViewModeToggle` + `SortControl`)
- Old `EmptyStates` (use `EmptyState` from `feedback/`)
- Old `Confirm` dialog (use `ConfirmDialog` from `lists/`)

### Updated Components

- **FormField**: Now in `forms/` subfolder (was directly in `components/`)
- **TransactionForm**: Now in `forms/` subfolder
- **SummaryCards**: Now in `surfaces/` subfolder

## Performance Considerations

- `TransactionList` uses FlatList for virtualization
- All animations use `react-native-reanimated` for 60fps performance
- Modals use native Modal for better performance
- Lazy loading supported where applicable

## Accessibility

All components include:
- Proper touch targets (minimum 44x44pt)
- Clear focus states
- Haptic feedback on interactions
- Semantic HTML-like structure
- Color contrast compliance
- Screen reader support (pending)

## Testing

Each component includes TypeScript type definitions for testing:

```typescript
import { render } from '@testing-library/react-native';
import { Button, ButtonProps } from '@/components';

const defaultProps: ButtonProps = {
  title: 'Test',
  onPress: jest.fn(),
};

test('renders button', () => {
  const { getByText } = render(<Button {...defaultProps} />);
  expect(getByText('Test')).toBeDefined();
});
```

## Next Steps

1. Update all screen files to use new import paths
2. Test all functionality across iOS, Android, and Web
3. Update component documentation
4. Add unit tests for each component
5. Create Storybook stories for component showcase

## Questions?

For more information on specific components, check their individual TypeScript files for detailed JSDoc comments and prop definitions.
