import React from 'react';
import { TextInput, TextInputProps, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@/src/hooks/useTheme';

export interface InputProps extends TextInputProps {
  error?: boolean;
  style?: ViewStyle;
}

export function Input({ error, style, ...props }: InputProps) {
  const { colors } = useTheme();

  const inputStyle: ViewStyle = {
    borderWidth: 1,
    borderColor: error ? colors.error : colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: colors.text,
    ...style
  };

  return (
    <TextInput
      {...props}
      style={inputStyle}
      placeholderTextColor={colors.textSecondary}
    />
  );
}

export default Input;
