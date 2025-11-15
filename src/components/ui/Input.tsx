/**
 * Input Component
 * 遵循 Constitution Principles I (HIG), IV (Accessibility), VII (Keyboard)
 */

import React from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  type TextInputProps,
} from 'react-native';
import { useTheme } from '@/hooks/useTheme';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Input({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  style,
  ...props
}: InputProps) {
  const { colors, typography, spacing } = useTheme();

  const inputStyles = [
    styles.input,
    {
      backgroundColor: colors.backgroundSecondary,
      color: colors.text,
      fontSize: typography.fontSize.body,
      borderRadius: spacing.borderRadius.md,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      minHeight: spacing.touchTarget,
      borderWidth: spacing.borderWidth.regular,
      borderColor: error ? colors.error : colors.border,
    },
    leftIcon && { paddingLeft: spacing.xl + spacing.sm },
    rightIcon && { paddingRight: spacing.xl + spacing.sm },
    style,
  ];

  return (
    <View style={styles.container}>
      {label && (
        <Text
          style={[
            styles.label,
            {
              color: colors.textSecondary,
              fontSize: typography.fontSize.subhead,
              marginBottom: spacing.xs,
            },
          ]}
        >
          {label}
        </Text>
      )}
      <View style={styles.inputContainer}>
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        <TextInput
          style={inputStyles}
          placeholderTextColor={colors.textTertiary}
          accessibilityLabel={label || props.placeholder}
          accessibilityState={{ disabled: props.editable === false }}
          {...props}
        />
        {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
      </View>
      {error && (
        <Text
          style={[
            styles.helperText,
            {
              color: colors.error,
              fontSize: typography.fontSize.footnote,
              marginTop: spacing.xs,
            },
          ]}
        >
          {error}
        </Text>
      )}
      {helperText && !error && (
        <Text
          style={[
            styles.helperText,
            {
              color: colors.textTertiary,
              fontSize: typography.fontSize.footnote,
              marginTop: spacing.xs,
            },
          ]}
        >
          {helperText}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    fontWeight: '500',
  },
  inputContainer: {
    position: 'relative',
  },
  input: {
    width: '100%',
  },
  leftIcon: {
    position: 'absolute',
    left: 12,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    zIndex: 1,
  },
  rightIcon: {
    position: 'absolute',
    right: 12,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    zIndex: 1,
  },
  helperText: {
    lineHeight: 16,
  },
});
