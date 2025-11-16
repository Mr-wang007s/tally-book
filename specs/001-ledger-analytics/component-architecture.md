# Component Architecture: Restructuring & Organization

**Version**: 1.0  
**Date**: 2025-11-16  
**Feature**: 001-ledger-analytics Optimization

---

## 1. Overview

This document defines the new component organization structure following **shadcn philosophy**: copyable, composable, non-opinionated components with clear type definitions and minimal abstractions.

**Goals**:
- Support 50+ components without clutter
- Enable developers to quickly locate and customize components
- Reduce cognitive load through consistent patterns
- Leverage existing design tokens from theme system

---

## 2. Folder Structure & Responsibilities

```
src/components/
├── ui/                          # Reusable UI primitives (shadcn-like)
│   ├── Button.tsx               # Multi-variant button with states
│   ├── Input.tsx                # Text input field
│   ├── Select.tsx               # Dropdown selector
│   ├── Card.tsx                 # Container with shadow/radius
│   ├── Badge.tsx                # Label/tag component
│   ├── Sheet.tsx                # Bottom sheet modal
│   ├── Checkbox.tsx             # Checkbox input
│   ├── Radio.tsx                # Radio button group
│   ├── Switch.tsx               # Toggle switch
│   ├── Divider.tsx              # Visual separator
│   ├── Skeleton.tsx             # Loading placeholder
│   ├── Spinner.tsx              # Loading indicator
│   └── Modal.tsx                # Dialog/modal wrapper
│
├── forms/                       # Form-specific components & logic
│   ├── FormField.tsx            # Unified input field wrapper (NEW)
│   ├── FormContainer.tsx        # Form wrapper with context (NEW)
│   ├── FormValidation.ts        # Validation schemas & error messages
│   ├── TransactionForm.tsx      # Add/Edit transaction form (UPDATED)
│   ├── useForm.ts               # Form state management hook
│   └── FormContext.ts           # Form context provider
│
├── surfaces/                    # Containers & layout surfaces
│   ├── SummaryCard.tsx          # Single summary metric card
│   ├── SummaryCards.tsx         # Grid of summary cards
│   ├── CardGrid.tsx             # Reusable grid layout
│   ├── Container.tsx            # Screen-level padding wrapper
│   ├── Header.tsx               # Screen header component
│   └── Footer.tsx               # Screen footer/action bar
│
├── charts/                      # Data visualization
│   ├── CategoryPie.tsx          # Pie chart (by category)
│   ├── TimeSeries.tsx           # Line chart (by time)
│   ├── ChartContainer.tsx       # Chart wrapper (existing)
│   └── ChartLegend.tsx          # Legend for charts
│
├── animations/                  # Animation wrappers & effects
│   ├── FadeIn.tsx               # Fade-in entrance
│   ├── SlideIn.tsx              # Slide-in entrance
│   ├── ScaleIn.tsx              # Scale-in entrance
│   ├── CountUp.tsx              # Number counter animation
│   ├── SuccessCheck.tsx         # Success checkmark animation
│   ├── Skeleton.tsx             # Loading skeleton
│   └── useAnimation.ts          # Animation utilities
│
├── layouts/                     # Layout & navigation wrappers
│   ├── TabLayout.tsx            # Wrapper for (tabs)/_layout.tsx
│   ├── ScreenLayout.tsx         # Standard screen with header + safe area
│   ├── ModalLayout.tsx          # Modal/dialog layout wrapper
│   └── StackLayout.tsx          # Stack navigation wrapper
│
├── inputs/                      # Form input components (detailed)
│   ├── TextInput.tsx            # Text field
│   ├── NumberInput.tsx          # Number/currency input
│   ├── DateInput.tsx            # Date picker
│   ├── TimeInput.tsx            # Time picker
│   ├── CategoryPicker.tsx       # Category dropdown
│   ├── PaymentMethodPicker.tsx  # Payment method picker
│   └── NotesInput.tsx           # Multi-line text input
│
├── feedback/                    # User feedback components (NEW)
│   ├── Toast.tsx                # Toast notification
│   ├── Alert.tsx                # Alert message
│   ├── Loading.tsx              # Loading indicator with message
│   ├── EmptyState.tsx           # Empty state placeholder
│   └── ConfirmDialog.tsx        # Confirmation dialog
│
├── lists/                       # List & table components (NEW)
│   ├── TransactionList.tsx      # Transaction FlatList wrapper
│   ├── ListItem.tsx             # Reusable list item
│   ├── ListSection.tsx          # Grouped list section
│   └── ListEmpty.tsx            # Empty list placeholder
│
├── controls/                    # User controls & inputs (NEW)
│   ├── PeriodFilter.tsx         # Date range/period selector
│   ├── CategoryFilter.tsx       # Category multi-select
│   ├── SortControl.tsx          # Sort order control
│   ├── ViewModeToggle.tsx       # View mode switcher (list/grid)
│   └── TrendControls.tsx        # Trend granularity control
│
├── screens/                     # Full-screen components (NEW location)
│   ├── HomeScreen.tsx           # Home/Dashboard (extracted from (tabs)/home.tsx)
│   ├── TransactionsScreen.tsx   # Transaction list (extracted from (tabs)/transactions.tsx)
│   ├── SummaryScreen.tsx        # Summary view (extracted from (tabs)/summary.tsx)
│   ├── TrendsScreen.tsx         # Trends view (extracted from (tabs)/trends.tsx)
│   ├── AddTransactionScreen.tsx # Add transaction form (extracted from /transactions/add.tsx)
│   └── EditTransactionScreen.tsx# Edit transaction form (extracted from /transactions/[id]/edit.tsx)
│
├── README.md                    # Component pattern guide
└── index.ts                     # Barrel export (optional)
```

---

## 3. Component Patterns & Examples

### 3.1 UI Primitives (shadcn-like)

**Philosophy**: Copyable, not installable. Components should be easy to understand and modify.

```typescript
// src/components/ui/Button.tsx
import React from 'react';
import { TouchableOpacity, Text, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '@/src/hooks/useTheme';
import * as Haptics from 'expo-haptics';

export interface ButtonProps {
  title: string;
  onPress: () => void | Promise<void>;
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  isDisabled?: boolean;
  hapticFeedback?: 'light' | 'medium' | 'heavy';
  testID?: string;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  isDisabled = false,
  hapticFeedback = 'medium',
  testID
}: ButtonProps) {
  const { colors } = useTheme();

  const containerStyle: ViewStyle = {
    paddingVertical: size === 'sm' ? 8 : size === 'lg' ? 16 : 12,
    paddingHorizontal: size === 'sm' ? 12 : size === 'lg' ? 24 : 16,
    borderRadius: 8,
    opacity: isDisabled || isLoading ? 0.5 : 1
  };

  const backgroundColor = {
    primary: colors.primary,
    secondary: colors.secondary,
    ghost: 'transparent',
    destructive: colors.error
  }[variant];

  const textColor = {
    primary: 'white',
    secondary: colors.primary,
    ghost: colors.primary,
    destructive: 'white'
  }[variant];

  const textStyle: TextStyle = {
    fontSize: size === 'sm' ? 14 : size === 'lg' ? 18 : 16,
    fontWeight: '600',
    color: textColor
  };

  const handlePress = async () => {
    if (hapticFeedback && !isDisabled && !isLoading) {
      try {
        const style = {
          light: Haptics.ImpactFeedbackStyle.Light,
          medium: Haptics.ImpactFeedbackStyle.Medium,
          heavy: Haptics.ImpactFeedbackStyle.Heavy
        }[hapticFeedback];
        await Haptics.impactAsync(style);
      } catch (e) {
        // Graceful fallback for devices without haptics
      }
    }
    await onPress();
  };

  return (
    <TouchableOpacity
      style={[containerStyle, { backgroundColor }]}
      onPress={handlePress}
      disabled={isDisabled || isLoading}
      testID={testID}
      activeOpacity={0.8}
    >
      {isLoading ? (
        <Spinner size="small" color={textColor} />
      ) : (
        <Text style={textStyle}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}
```

**Key Characteristics**:
- Minimal dependencies (only theme hook + haptics)
- Clear prop interface with defaults
- Copyable and easy to customize
- Type-safe with TypeScript
- Haptic feedback built-in

### 3.2 Form Components (Unified Pattern)

```typescript
// src/components/forms/FormField.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/src/hooks/useTheme';
import * as Haptics from 'expo-haptics';
import { Input } from '@/src/components/ui/Input';
import { Button } from '@/src/components/ui/Button';

export interface FormFieldProps {
  label: string;
  value: string | number;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  helperText?: string;
  keyboardType?: 'default' | 'decimal-pad' | 'email-address' | 'phone-pad';
  isRequired?: boolean;
  isDisabled?: boolean;
  multiline?: boolean;
  maxLength?: number;
  testID?: string;
}

export function FormField({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  helperText,
  keyboardType = 'default',
  isRequired = false,
  isDisabled = false,
  multiline = false,
  maxLength,
  testID
}: FormFieldProps) {
  const { colors, spacing } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  const handleChangeText = (text: string) => {
    // Haptic feedback on input (optional)
    onChangeText(text);
  };

  const handleBlur = async () => {
    setIsFocused(false);
    if (error) {
      // Haptic feedback on error
      try {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      } catch (e) {
        // Graceful fallback
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={[styles.label, { color: colors.text }]}>
          {label}
          {isRequired && <Text style={{ color: colors.error }}> *</Text>}
        </Text>
        {error && <Text style={[styles.error, { color: colors.error }]}>{error}</Text>}
      </View>

      <Input
        value={String(value)}
        onChangeText={handleChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
        editable={!isDisabled}
        multiline={multiline}
        maxLength={maxLength}
        onFocus={() => setIsFocused(true)}
        onBlur={handleBlur}
        testID={testID}
        style={{
          borderColor: error ? colors.error : isFocused ? colors.primary : colors.border,
          borderWidth: 1
        }}
      />

      {helperText && !error && (
        <Text style={[styles.helperText, { color: colors.textSecondary }]}>
          {helperText}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  label: { fontSize: 14, fontWeight: '600' },
  error: { fontSize: 12 },
  helperText: { fontSize: 12, marginTop: 4 }
});
```

### 3.3 Form with Context

```typescript
// src/components/forms/FormContainer.tsx
import React from 'react';
import { ScrollView } from 'react-native';
import { FormProvider } from './FormContext';

export interface FormContainerProps {
  children: React.ReactNode;
  onSubmit?: () => void;
  testID?: string;
}

export function FormContainer({ children, onSubmit, testID }: FormContainerProps) {
  return (
    <FormProvider>
      <ScrollView style={{ flex: 1 }} testID={testID}>
        {children}
      </ScrollView>
    </FormProvider>
  );
}
```

### 3.4 Surface Components (Cards & Grids)

```typescript
// src/components/surfaces/SummaryCard.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '@/src/hooks/useTheme';
import { Card } from '@/src/components/ui/Card';

export interface SummaryCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  type?: 'income' | 'expense' | 'balance';
  testID?: string;
}

export function SummaryCard({
  title,
  value,
  subtitle,
  icon,
  type = 'balance',
  testID
}: SummaryCardProps) {
  const { colors } = useTheme();

  const iconColor = {
    income: colors.success,
    expense: colors.error,
    balance: colors.primary
  }[type];

  return (
    <Card testID={testID}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        {icon && <View style={{ tintColor: iconColor }}>{icon}</View>}
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 12, color: colors.textSecondary }}>{title}</Text>
          <Text style={{ fontSize: 20, fontWeight: '700', color: colors.text }}>
            {value}
          </Text>
          {subtitle && <Text style={{ fontSize: 10, color: colors.textSecondary }}>{subtitle}</Text>}
        </View>
      </View>
    </Card>
  );
}
```

---

## 4. Migration Path from Existing Structure

### Current → New Mapping

| Current File | New Location | Status |
|--------------|--------------|--------|
| primitives/* | ui/* | Reorganize |
| animations/* | animations/* | Keep (organized) |
| charts/* | charts/* | Keep (organized) |
| home/* | screens/HomeScreen.tsx | Extract + consolidate |
| FormField.tsx | forms/FormField.tsx | Move |
| TransactionForm.tsx | forms/TransactionForm.tsx | Move |
| SummaryCards.tsx | surfaces/SummaryCards.tsx | Move |
| PeriodFilter.tsx | controls/PeriodFilter.tsx | Move |
| ChartContainer.tsx | charts/ChartContainer.tsx | Move |
| EmptyStates.tsx | feedback/EmptyState.tsx | Rename + move |
| Confirm.tsx | feedback/ConfirmDialog.tsx | Rename + move |
| TrendControls.tsx | controls/TrendControls.tsx | Move |
| (tabs)/home.tsx | screens/HomeScreen.tsx | Extract |
| (tabs)/transactions.tsx | screens/TransactionsScreen.tsx | Extract |
| (tabs)/summary.tsx | screens/SummaryScreen.tsx | Extract |
| (tabs)/trends.tsx | screens/TrendsScreen.tsx | Extract |
| /transactions/add.tsx | screens/AddTransactionScreen.tsx | Extract |
| /transactions/[id]/edit.tsx | screens/EditTransactionScreen.tsx | Extract |

### Import Updates Required
```typescript
// BEFORE
import { Button } from '@/src/components/primitives/Button';
import { TransactionForm } from '@/src/components/TransactionForm';

// AFTER
import { Button } from '@/src/components/ui/Button';
import { TransactionForm } from '@/src/components/forms/TransactionForm';
```

---

## 5. Component Export Pattern

### Barrel Export (Optional)
```typescript
// src/components/index.ts
export * from './ui/Button';
export * from './ui/Input';
export * from './ui/Card';
// ... etc

// Usage
import { Button, Input, Card } from '@/src/components';
```

### Or Direct Import (Recommended)
```typescript
// Preferred: Direct imports for better tree-shaking
import { Button } from '@/src/components/ui/Button';
import { TransactionForm } from '@/src/components/forms/TransactionForm';
```

---

## 6. Type Definitions

### Shared UI Props Interface
```typescript
// src/components/types.ts
export interface BaseComponentProps {
  testID?: string;
  style?: StyleProp<ViewStyle>;
}

export interface FormControlProps extends BaseComponentProps {
  isDisabled?: boolean;
  isRequired?: boolean;
  error?: string;
}

export interface LayoutProps extends BaseComponentProps {
  children: React.ReactNode;
}
```

---

## 7. Accessibility Guidelines

### Each Component MUST Include
- [ ] Semantic labels (`accessibilityLabel`)
- [ ] Proper focus order (`accessible`, `accessibilityRole`)
- [ ] Screen reader hints for images/icons
- [ ] Keyboard navigation support
- [ ] Sufficient color contrast (4.5:1 for text, 3:1 for UI components)

### Example
```typescript
<Button
  title="Delete"
  accessibilityLabel="Delete transaction (requires confirmation)"
  onPress={handleDelete}
/>
```

---

## 8. Testing Strategy

### Unit Tests Per Component
```typescript
// src/components/ui/__tests__/Button.test.ts
import { render, screen } from '@testing-library/react-native';
import { Button } from '../Button';

describe('Button', () => {
  it('renders with title', () => {
    render(<Button title="Click me" onPress={() => {}} />);
    expect(screen.getByText('Click me')).toBeTruthy();
  });

  it('triggers haptic feedback on press', async () => {
    const { getByRole } = render(
      <Button title="Press" onPress={() => {}} hapticFeedback="medium" />
    );
    fireEvent.press(getByRole('button'));
    // Assert haptic was called
  });
});
```

### Snapshot Tests
```typescript
// src/components/forms/__tests__/FormField.snapshot.test.ts
it('matches snapshot with error state', () => {
  const { toJSON } = render(
    <FormField
      label="Amount"
      value=""
      onChangeText={() => {}}
      error="Amount is required"
    />
  );
  expect(toJSON()).toMatchSnapshot();
});
```

---

## 9. Documentation Requirements

### Component README Template
```markdown
# Component: Button

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| title | string | - | Button label |
| onPress | () => void | - | Press handler |
| variant | 'primary' \| 'secondary' \| 'ghost' \| 'destructive' | 'primary' | Button style |
| size | 'sm' \| 'md' \| 'lg' | 'md' | Button size |
| isLoading | boolean | false | Show loading state |
| hapticFeedback | 'light' \| 'medium' \| 'heavy' | 'medium' | Haptic pattern |

## Usage

```typescript
<Button
  title="Save"
  onPress={handleSave}
  variant="primary"
  isLoading={isSubmitting}
/>
```

## Accessibility

- Announced as button by screen readers
- Full keyboard support
- Clear focus indicator
```

---

## 10. Code Style & Conventions

### Naming
- **Components**: PascalCase (Button, FormField, TransactionList)
- **Props**: camelCase (isLoading, onPress, testID)
- **Internal functions**: camelCase (handlePress, formatValue)
- **Constants**: UPPER_SNAKE_CASE (MAX_LENGTH, DEFAULT_PADDING)

### File Organization
- One component per file (unless tightly coupled)
- Co-locate styles and types in same file
- Use barrel exports for feature folders
- Keep test files next to components (`__tests__` folder)

### Props Order
1. Children (if applicable)
2. Data props (value, label, etc.)
3. Event handlers (onPress, onChange, etc.)
4. State props (isLoading, isDisabled, etc.)
5. Style props (variant, size, etc.)
6. Accessibility/Testing props (testID, accessibilityLabel, etc.)

---

## 11. Related Documents

- **Implementation Plan**: `/data/workspace/my-tally-book/specs/001-ledger-analytics/plan.md`
- **Data Model (i18n)**: `/data/workspace/my-tally-book/specs/001-ledger-analytics/data-model-i18n.md`
- **Research**: `/data/workspace/my-tally-book/specs/001-ledger-analytics/research-optimization.md`
- **Spec**: `/data/workspace/my-tally-book/specs/001-ledger-analytics/spec.md`
