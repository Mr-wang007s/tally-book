/**
 * FormField - Unified Form Input Wrapper
 * 
 * CRITICAL COMPONENT: Use this for ALL form inputs throughout the app.
 * Provides consistent validation display, error messages, and haptic feedback.
 * 
 * @module src/components/forms/FormField
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { typography, spacing, colors } from '@/tokens';
import { useTranslation } from '@/i18n/useTranslation';

export interface FormFieldProps<T = any> {
  /** Field name (for form state tracking) */
  name: keyof T | string;
  
  /** Display label */
  label: string;
  
  /** Current field value */
  value: string;
  
  /** Change handler */
  onChangeText: (text: string) => void;
  
  /** Validation error message (i18n key or string) */
  error?: string;
  
  /** Whether field has been touched/interacted with */
  touched?: boolean;
  
  /** Blur handler (marks field as touched) */
  onBlur?: () => void;
  
  /** Whether field is required */
  required?: boolean;
  
  /** Helper text / hint */
  hint?: string;
  
  /** Input component type */
  component: 'input' | 'select' | 'datepicker' | 'custom';
  
  /** Props passed to the underlying component */
  componentProps?: Record<string, any>;
  
  /** Whether to trigger haptic feedback on error display */
  hapticOnError?: boolean;
  
  /** Custom render function for the input component */
  renderComponent?: (props: {
    value: string;
    onChangeText: (text: string) => void;
    onBlur?: () => void;
    error?: boolean;
    [key: string]: any;
  }) => React.ReactElement;
}

/**
 * Unified form field wrapper with validation display
 * 
 * USE THIS FOR ALL FORM INPUTS - provides consistent UX across the app.
 * 
 * @example
 * ```tsx
 * <FormField
 *   name="amount"
 *   label={t('transactions.amount')}
 *   value={amount}
 *   onChangeText={setAmount}
 *   error={errors.amount}
 *   touched={touched.amount}
 *   required
 *   component="input"
 *   componentProps={{ keyboardType: 'numeric' }}
 *   hapticOnError
 * />
 * ```
 */
export function FormField<T = any>({
  name,
  label,
  value,
  onChangeText,
  error,
  touched = false,
  onBlur,
  required = false,
  hint,
  component,
  componentProps = {},
  hapticOnError = true,
  renderComponent,
}: FormFieldProps<T>) {
  const { t } = useTranslation();
  const [previousError, setPreviousError] = React.useState<string | undefined>();
  
  // Show error only if field has been touched
  const shouldShowError = touched && !!error;
  
  // Trigger haptic feedback when error first appears
  React.useEffect(() => {
    if (shouldShowError && error !== previousError && hapticOnError) {
      // Trigger error haptic feedback
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
    setPreviousError(error);
  }, [shouldShowError, error, previousError, hapticOnError]);
  
  // Resolve error message (could be i18n key or plain string)
  const errorMessage = React.useMemo(() => {
    if (!shouldShowError || !error) return undefined;
    
    // Try to translate as i18n key, fallback to raw string
    try {
      const translated = t(error as any);
      return translated === error ? error : translated;
    } catch {
      return error;
    }
  }, [shouldShowError, error, t]);
  
  return (
    <View style={styles.container}>
      {/* Label */}
      <View style={styles.labelContainer}>
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      </View>
      
      {/* Input Component */}
      {renderComponent ? (
        renderComponent({
          value,
          onChangeText,
          onBlur,
          error: shouldShowError,
          ...componentProps,
        })
      ) : (
        <Text style={styles.placeholder}>
          {`[${component} component - implement based on type]`}
        </Text>
      )}
      
      {/* Error Message */}
      {shouldShowError && errorMessage && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      )}
      
      {/* Hint Text */}
      {!shouldShowError && hint && (
        <View style={styles.hintContainer}>
          <Text style={styles.hintText}>{hint}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  labelContainer: {
    marginBottom: spacing.xxs,
  },
  label: {
    ...typography.subhead,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  required: {
    color: colors.error,
  },
  placeholder: {
    ...typography.body,
    color: colors.textTertiary,
    fontStyle: 'italic',
    padding: spacing.sm,
    backgroundColor: colors.surfaceAlt,
    borderRadius: 8,
  },
  errorContainer: {
    marginTop: spacing.xxs,
  },
  errorText: {
    ...typography.caption1,
    fontWeight: '600',
    color: colors.error,
  },
  hintContainer: {
    marginTop: spacing.xxs,
  },
  hintText: {
    ...typography.caption1,
    color: colors.textTertiary,
  },
});
