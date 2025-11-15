/**
 * FormField Component
 * Reusable form field with label, input, and error message
 */

import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { colors, typography, spacing, radius } from '@/theme/tokens';

export interface FormFieldProps extends TextInputProps {
  label: string;
  error?: string;
  required?: boolean;
}

export function FormField({ label, error, required, ...inputProps }: FormFieldProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>
      <TextInput
        style={[styles.input, error && styles.inputError]}
        placeholderTextColor={colors.textTertiary}
        {...inputProps}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.subhead,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    fontWeight: '600',
  },
  required: {
    color: colors.error,
  },
  input: {
    ...typography.body,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: colors.textPrimary,
  },
  inputError: {
    borderColor: colors.error,
  },
  error: {
    ...typography.caption1,
    color: colors.error,
    marginTop: spacing.xs,
  },
});
