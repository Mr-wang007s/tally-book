# Contributing Guide: My Tally Book

**Last Updated**: 2025-11-16  
**Version**: 1.0.0

---

## Table of Contents

1. [Code Style Guidelines](#code-style-guidelines)
2. [TypeScript Standards](#typescript-standards)
3. [Component Naming Conventions](#component-naming-conventions)
4. [i18n Key Naming](#i18n-key-naming)
5. [Form Validation Patterns](#form-validation-patterns)
6. [Haptic Feedback Guidelines](#haptic-feedback-guidelines)
7. [Testing Requirements](#testing-requirements)
8. [Git Workflow](#git-workflow)
9. [Pull Request Process](#pull-request-process)

---

## Code Style Guidelines

### General Rules

- **Line Length**: Maximum 100 characters per line
- **Indentation**: 2 spaces (no tabs)
- **Quotes**: Single quotes for strings (except JSX attributes use double quotes)
- **Semicolons**: Always use semicolons
- **Trailing Commas**: Always use trailing commas in multi-line objects/arrays

### Formatting Tools

- **Prettier**: Auto-format all code
  ```bash
  npm run format
  ```

- **ESLint**: Lint JavaScript/TypeScript
  ```bash
  npm run lint
  ```

- **Pre-commit Hook**: Automatically formats and lints staged files

### File Organization

```typescript
// 1. External imports (React, libraries)
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

// 2. Internal imports (@/ aliases)
import { Button, Input } from '@/components/ui';
import { useTranslation } from '@/i18n/useTranslation';
import { colors, spacing, typography } from '@/tokens';

// 3. Type imports
import type { Transaction } from '@/models/Transaction';

// 4. Constants
const MAX_AMOUNT = 999999;

// 5. Component definition
export function MyComponent() {
  // ...
}

// 6. Styles (at bottom of file)
const styles = StyleSheet.create({
  // ...
});
```

---

## TypeScript Standards

### Strict Mode

**Always use TypeScript strict mode**. The following settings are enabled in `tsconfig.json`:

```json
{
  "strict": true,
  "noImplicitAny": true,
  "strictNullChecks": true,
  "strictFunctionTypes": true,
  "noUnusedLocals": true,
  "noUnusedParameters": true
}
```

### Type Definitions

**Always define types** for component props, function parameters, and return values.

✅ **Good**:
```typescript
interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
}

export function Button({ title, onPress, variant = 'primary' }: ButtonProps) {
  // ...
}
```

❌ **Bad**:
```typescript
export function Button(props: any) {
  // Never use 'any'
}
```

### Avoid `any`

- **Never use `any`** - use `unknown` if type is truly unknown
- Use **type guards** to narrow `unknown` types

```typescript
// ✅ Good
function parseJSON(input: string): unknown {
  return JSON.parse(input);
}

function isTransaction(value: unknown): value is Transaction {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'amount' in value
  );
}

// ❌ Bad
function parseJSON(input: string): any {
  return JSON.parse(input);
}
```

### Export Types

Always export types alongside components:

```typescript
export interface ButtonProps {
  title: string;
}

export function Button(props: ButtonProps) {
  // ...
}
```

### Use Type Inference

Let TypeScript infer types when obvious:

```typescript
// ✅ Good (inference)
const [count, setCount] = useState(0); // inferred as number

// ❌ Unnecessary
const [count, setCount] = useState<number>(0);

// ✅ Good (explicit when needed)
const [user, setUser] = useState<User | null>(null);
```

---

## Component Naming Conventions

### File Names

- **Components**: PascalCase - `Button.tsx`, `TransactionCard.tsx`
- **Utilities**: camelCase - `formatters.ts`, `validators.ts`
- **Tests**: Component name + `.test.tsx` - `Button.test.tsx`
- **Types**: PascalCase + `Types` - `FormTypes.ts`

### Component Names

- Use **PascalCase** for component names
- Name should describe **what it is**, not **what it does**

✅ **Good**:
```typescript
export function TransactionCard() { }
export function SummaryCard() { }
export function CategoryPicker() { }
```

❌ **Bad**:
```typescript
export function ShowTransaction() { }  // Verb in name
export function transactionCard() { }  // camelCase
export function TCard() { }  // Abbreviation
```

### Props Interface Names

- **Pattern**: `{ComponentName}Props`

```typescript
export interface ButtonProps {
  title: string;
}

export function Button(props: ButtonProps) { }
```

### Hook Names

- **Pattern**: `use{FeatureName}`

```typescript
export function useTranslation() { }
export function useForm() { }
export function useTransactions() { }
```

---

## i18n Key Naming

### Namespace Organization

Translation keys are organized by **feature namespace**:

- `common.*` - Shared UI elements
- `transactions.*` - Transaction screens/forms
- `home.*` - Home dashboard
- `summary.*` - Summary screens
- `trends.*` - Trend analysis
- `categories.*` - Category management
- `messages.*` - Success/error messages

### Key Naming Convention

- Use **camelCase** for keys
- Be **descriptive** but **concise**
- Group related keys with dot notation

```json
{
  "transactions": {
    "title": "交易记录",
    "addTransaction": "添加交易",
    "amount": "金额",
    "date": "日期",
    "validation": {
      "amountRequired": "金额必填",
      "amountPositive": "金额必须大于0",
      "dateInvalid": "日期格式不正确"
    }
  }
}
```

### Key Structure

**Pattern**: `namespace.feature.key`

✅ **Good**:
```typescript
t('transactions.validation.amountRequired')
t('common.save')
t('home.greeting')
```

❌ **Bad**:
```typescript
t('ERROR_AMOUNT')  // Too generic
t('transactions_amount_required')  // Snake case
t('validationErrorForAmountField')  // Too verbose
```

### Adding New Translation Keys

**Process**:
1. Add key to **both** `zh-CN.json` and `en.json`
2. Use the same key structure in both files
3. Verify keys match by running validation (T029)

**Example**:

```json
// zh-CN.json
{
  "transactions": {
    "newFeature": "新功能"
  }
}

// en.json
{
  "transactions": {
    "newFeature": "New Feature"
  }
}
```

### Translation Best Practices

1. **Never hardcode strings** - Always use `t()` function
2. **Keep keys synchronized** - zh-CN and en must have matching keys
3. **Use interpolation** for dynamic values:
   ```typescript
   // Translation
   "greeting": "你好，{{name}}"
   
   // Usage
   t('home.greeting', { name: userName })
   ```
4. **Pluralization** (if needed):
   ```json
   "items": "{{count}} 个项目",
   "items_plural": "{{count}} items"
   ```

---

## Form Validation Patterns

### Validation Rules

All forms must:
1. Use **FormField** wrapper component
2. Integrate **i18n** for error messages
3. Display errors only after field is **touched**
4. Trigger **haptic feedback** on validation failure

### Validation Schema Pattern

Located in `src/components/forms/FormValidation.ts`:

```typescript
export interface ValidationErrors {
  [key: string]: string;
}

export function validateTransaction(data: {
  amount: string;
  categoryId: string;
  date: string;
}): ValidationErrors {
  const errors: ValidationErrors = {};
  
  // Amount validation
  if (!data.amount || data.amount.trim() === '') {
    errors.amount = 'amountRequired';
  } else if (parseFloat(data.amount) <= 0) {
    errors.amount = 'amountPositive';
  }
  
  // Category validation
  if (!data.categoryId) {
    errors.categoryId = 'categoryRequired';
  }
  
  // Date validation
  if (!data.date) {
    errors.date = 'dateRequired';
  } else if (isNaN(Date.parse(data.date))) {
    errors.date = 'dateInvalid';
  }
  
  return errors;
}
```

### Error Message Mapping

Located in `src/components/forms/validationMessages.ts`:

```typescript
import { useTranslation } from '@/i18n/useTranslation';

export function useValidationMessages() {
  const { t } = useTranslation();
  
  return {
    amountRequired: t('transactions.validation.amountRequired'),
    amountPositive: t('transactions.validation.amountPositive'),
    categoryRequired: t('transactions.validation.categoryRequired'),
    dateInvalid: t('transactions.validation.dateInvalid'),
  };
}
```

### FormField Usage Pattern

```typescript
import { FormField } from '@/components/forms';
import { Input } from '@/components/ui';
import { useTranslation } from '@/i18n/useTranslation';

function MyForm() {
  const { t } = useTranslation();
  const [amount, setAmount] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  
  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true });
  };
  
  return (
    <FormField
      label={t('transactions.amount')}
      error={errors.amount ? t(`transactions.validation.${errors.amount}`) : undefined}
      touched={touched.amount}
      required
    >
      <Input
        value={amount}
        onChangeText={setAmount}
        onBlur={() => handleBlur('amount')}
        keyboardType="decimal-pad"
      />
    </FormField>
  );
}
```

### Validation Error Display Rules

1. **Show error** only when:
   - Field has been **touched** (user focused + blurred)
   - AND field has validation error
2. **Hide error** when:
   - Field is pristine (never touched)
   - OR field is valid
3. **Trigger haptic feedback** when:
   - User tries to submit with validation errors
   - Error notification: `Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)`

---

## Haptic Feedback Guidelines

Haptic feedback enhances UX by providing tactile confirmation of actions.

### When to Use Haptics

| Action | Haptic Type | When to Trigger |
|--------|-------------|-----------------|
| Button press | `impactAsync(ImpactFeedbackStyle.Light)` | On press (not on release) |
| Form submission success | `notificationAsync(NotificationFeedbackType.Success)` | After successful save |
| Form validation error | `notificationAsync(NotificationFeedbackType.Error)` | On submit with errors |
| Delete confirmation | `notificationAsync(NotificationFeedbackType.Warning)` | Before showing confirm dialog |
| Item selection | `selectionAsync()` | On picker/dropdown selection |
| Scroll to item | `impactAsync(ImpactFeedbackStyle.Medium)` | When scroll animation starts |

### Haptic Feedback Pattern

```typescript
import * as Haptics from 'expo-haptics';

// Light impact - for subtle interactions
async function handlePress() {
  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  // Perform action
}

// Medium impact - for important actions
async function handleSubmit() {
  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  // Submit form
}

// Success notification - for successful operations
async function handleSuccess() {
  await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  // Show success message
}

// Error notification - for validation errors
async function handleError() {
  await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  // Show error message
}
```

### Best Practices

1. **Don't overuse** - Only trigger haptics for meaningful interactions
2. **Trigger early** - Fire haptic on press, not on action completion
3. **Test on device** - Simulators don't always support haptics
4. **Make it optional** - Consider user preference for haptic feedback
5. **Use appropriate intensity** - Match haptic strength to action importance

---

## Testing Requirements

### Coverage Requirements

- **Business Logic**: ≥ 80% coverage (services, validation)
- **Components**: ≥ 70% coverage (UI components)
- **Integration**: Critical user flows must have E2E tests

### Test File Organization

```
src/components/ui/
├── Button.tsx
├── Button.test.tsx        # Unit tests
└── index.ts

src/services/
├── TransactionService.ts
└── TransactionService.test.ts
```

### Unit Test Pattern

```typescript
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Button } from './Button';

describe('Button', () => {
  it('renders title correctly', () => {
    render(<Button title="Click me" onPress={() => {}} />);
    expect(screen.getByText('Click me')).toBeTruthy();
  });
  
  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    render(<Button title="Click me" onPress={onPress} />);
    
    fireEvent.press(screen.getByText('Click me'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
  
  it('disables button when disabled prop is true', () => {
    render(<Button title="Click me" onPress={() => {}} disabled />);
    const button = screen.getByText('Click me').parent;
    
    // Verify button is disabled
    expect(button?.props.accessibilityState?.disabled).toBe(true);
  });
});
```

### Integration Test Pattern

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { TransactionForm } from './TransactionForm';
import { saveTransaction } from '@/services/TransactionService';

jest.mock('@/services/TransactionService');

describe('TransactionForm Integration', () => {
  it('submits valid transaction', async () => {
    const onSuccess = jest.fn();
    render(<TransactionForm onSuccess={onSuccess} />);
    
    // Fill form
    fireEvent.changeText(screen.getByLabelText('Amount'), '100');
    fireEvent.press(screen.getByText('Income'));
    fireEvent.press(screen.getByText('Salary'));
    
    // Submit
    fireEvent.press(screen.getByText('Save'));
    
    await waitFor(() => {
      expect(saveTransaction).toHaveBeenCalledWith({
        amount: 100,
        type: 'income',
        categoryId: 'salary',
      });
      expect(onSuccess).toHaveBeenCalled();
    });
  });
  
  it('shows validation errors for invalid input', async () => {
    render(<TransactionForm onSuccess={() => {}} />);
    
    // Submit without filling form
    fireEvent.press(screen.getByText('Save'));
    
    // Check for validation errors
    await waitFor(() => {
      expect(screen.getByText('金额必填')).toBeTruthy();
      expect(screen.getByText('分类必选')).toBeTruthy();
    });
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test Button.test.tsx
```

---

## Git Workflow

### Branch Naming

- **Feature**: `feature/description` (e.g., `feature/add-category-picker`)
- **Bug Fix**: `fix/description` (e.g., `fix/amount-validation`)
- **Refactor**: `refactor/description` (e.g., `refactor/form-components`)
- **Docs**: `docs/description` (e.g., `docs/update-contributing`)

### Commit Message Format

Follow **Conventional Commits** specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code refactoring (no behavior change)
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `test`: Adding or updating tests
- `chore`: Build process, dependencies, tooling

**Examples**:

```
feat(transactions): add category filter to transactions list

- Add CategoryFilter component
- Integrate with TransactionsScreen
- Update transaction query to support filtering

Closes #42
```

```
fix(validation): correct amount validation for decimal values

Previously, amounts with trailing zeros (e.g., "10.00") were 
incorrectly flagged as invalid. Updated parseFloat logic to 
handle decimal strings correctly.

Fixes #38
```

### Commit Best Practices

1. **Atomic commits** - One logical change per commit
2. **Descriptive messages** - Explain *why*, not just *what*
3. **Reference issues** - Use `Closes #123` or `Fixes #456`
4. **Keep commits small** - Easier to review and revert if needed

---

## Pull Request Process

### Before Creating PR

1. **Run all checks**:
   ```bash
   npm run type-check  # TypeScript compilation
   npm run lint        # ESLint
   npm run format      # Prettier
   npm test            # All tests
   ```

2. **Update documentation** if needed:
   - Update `README.md` for user-facing changes
   - Update `ARCHITECTURE.md` for structural changes
   - Update `src/components/README.md` for new components

3. **Add tests** for new functionality

4. **Verify i18n keys** match between zh-CN.json and en.json

### PR Title Format

Use same format as commit messages:

```
feat(transactions): add category filter
fix(validation): correct decimal amount handling
```

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manually tested on iOS
- [ ] Manually tested on Android
- [ ] Manually tested on Web

## Screenshots (if applicable)
[Add screenshots here]

## Checklist
- [ ] TypeScript compilation passes
- [ ] ESLint passes
- [ ] All tests pass
- [ ] i18n keys synchronized (zh-CN and en)
- [ ] Documentation updated
- [ ] No console.log or debug code left

## Related Issues
Closes #123
```

### Code Review Guidelines

**For Authors**:
1. Keep PRs small and focused (< 400 lines changed)
2. Self-review before requesting review
3. Respond to feedback promptly
4. Update PR based on feedback

**For Reviewers**:
1. Review within 24 hours
2. Be constructive and respectful
3. Check for:
   - Code quality and readability
   - Test coverage
   - TypeScript type safety
   - i18n integration
   - Performance implications
   - Accessibility compliance

### Merge Requirements

- ✅ All CI checks pass
- ✅ At least one approval from code reviewer
- ✅ No unresolved conversations
- ✅ Branch is up to date with main

---

## Development Environment Setup

### Required Tools

- **Node.js**: 18+ (use `nvm` for version management)
- **npm**: 9+
- **Expo CLI**: `npm install -g expo-cli`
- **VS Code** (recommended IDE)

### VS Code Extensions

**Recommended**:
- ESLint
- Prettier - Code formatter
- TypeScript + JavaScript
- React Native Tools
- i18n Ally (for translation key management)

### VS Code Settings

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

---

## Questions or Issues?

- **Bug Reports**: Create issue with `bug` label
- **Feature Requests**: Create issue with `enhancement` label
- **Questions**: Create issue with `question` label

---

**Thank you for contributing to My Tally Book!** 🎉
