/**
 * Input Component (shadcn-like pattern)
 * Reusable text input primitive with validation states and focus ring
 * 
 * @module src/components/ui/Input
 */

import React from 'react';
import { TextInput, TextInputProps, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors, spacing, typography } from '@/tokens';
import { useColorScheme } from '@/hooks/useColorScheme';

export interface InputProps extends Omit<TextInputProps, 'style'> {
  /** Error state */
  error?: boolean;
  
  /** Disabled state */
  disabled?: boolean;
  
  /** Custom container style */
  style?: ViewStyle;
  
  /** Custom text style */
  textStyle?: TextStyle;
}

/**
 * Text input component with focus ring and error states
 * 
 * @example
 * ```tsx
 * <Input
 *   placeholder="Enter amount"
 *   value={amount}
 *   onChangeText={setAmount}
 *   keyboardType="decimal-pad"
 *   error={!!errors.amount}
 *   accessibilityLabel="Amount input"
 * />
 * ```
 */
export function Input({ 
  error, 
  disabled,
  style, 
  textStyle,
  ...props 
}: InputProps) {
  const { colorScheme } = useColorScheme();
  const themeColors = colorScheme === 'dark' ? colors.dark : colors.light;
  const [isFocused, setIsFocused] = React.useState(false);

  const inputContainerStyle: ViewStyle = {
    borderWidth: 1,
    borderColor: error 
      ? themeColors.error 
      : isFocused 
        ? themeColors.primary 
        : themeColors.border,
    borderRadius: 8,
    backgroundColor: disabled ? themeColors.disabledBackground : themeColors.surface,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    minHeight: 44, // Accessibility: minimum touch target
    ...style,
  };

  const inputTextStyle: TextStyle = {
    ...typography.body,
    color: disabled ? themeColors.disabled : themeColors.textPrimary,
    ...textStyle,
  };

  return (
    <TextInput
      {...props}
      style={[inputContainerStyle, inputTextStyle]}
      placeholderTextColor={themeColors.textPlaceholder}
      editable={!disabled}
      onFocus={(e) => {
        setIsFocused(true);
        props.onFocus?.(e);
      }}
      onBlur={(e) => {
        setIsFocused(false);
        props.onBlur?.(e);
      }}
      accessibilityState={{
        disabled: disabled || false,
      }}
    />
  );
}

export default Input;
