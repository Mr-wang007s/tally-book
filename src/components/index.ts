/**
 * Components Export Hub
 * 
 * Central export point for all components
 * Allows importing from '@/components/inputs', '@/components/ui', etc.
 */

// UI Components
export { Button } from './ui/Button';
export { Card } from './ui/Card';
export { Input } from './ui/Input';
export { Select } from './ui/Select';
export { Badge } from './ui/Badge';
export { Checkbox } from './ui/Checkbox';
export { Radio } from './ui/Radio';
export { Switch } from './ui/Switch';
export { Divider } from './ui/Divider';
export { Spinner } from './ui/Spinner';
export type { ButtonProps } from './ui/Button';

// Input Components
export {
  TextInput,
  NumberInput,
  DateInput,
  CategoryPicker,
  PaymentMethodPicker,
  NotesInput,
} from './inputs';
export type {
  TextInputProps,
  NumberInputProps,
  DateInputProps,
  CategoryPickerProps,
  PaymentMethodPickerProps,
  NotesInputProps,
} from './inputs';

// Form Components
export { FormField } from './forms/FormField';
export { FormContainer } from './forms/FormContainer';
export { TransactionForm } from './forms/TransactionForm';
export { FormContext } from './forms/FormContext';
export { useForm } from './forms/useForm';
export type { FormFieldProps } from './forms/FormField';

// Feedback Components
export { Toast, Alert, Loading, EmptyState } from './feedback';
export type { ToastProps, AlertProps, LoadingProps, EmptyStateProps } from './feedback';

// List Components
export { TransactionList, ListItem, ListSection, ConfirmDialog } from './lists';
export type {
  TransactionListProps,
  ListItemProps,
  ListSectionProps,
  ConfirmDialogProps,
} from './lists';

// Control Components
export { PeriodFilter, CategoryFilter, SortControl, ViewModeToggle } from './controls';
export type {
  PeriodFilterProps,
  CategoryFilterProps,
  SortControlProps,
  ViewModeToggleProps,
} from './controls';

// Layout Components
export { ScreenLayout, ModalLayout, TabLayout } from './layouts';
export type { ScreenLayoutProps, ModalLayoutProps, TabLayoutProps } from './layouts';

// Surface Components
export { SummaryCard, SummaryCards, Container } from './surfaces';
export type { SummaryCardProps, SummaryCardsProps, ContainerProps } from './surfaces';

// Animation Components
export { FadeIn, SlideIn, ScaleIn } from './animations';

// Chart Components
export { CategoryPie, TimeSeries } from './charts';
