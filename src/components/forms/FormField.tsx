/**
 * FormField: Unified form input wrapper with validation, error display, and haptic feedback
 * This is the single source of truth for all form inputs across the app
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/src/hooks/useTheme';
import Input from '../ui/Input';
import { useTranslation } from '@/src/i18n/useTranslation';

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
  accessibilityLabel?: string;
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
  testID,
  accessibilityLabel
}: FormFieldProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [isFocused, setIsFocused] = useState(false);

  const handleChangeText = (text: string) => {
    onChangeText(text);
  };

  const handleBlur = async () => {
    setIsFocused(false);
    if (error) {
      // Haptic feedback for error
      try {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      } catch (e) {
        // Graceful fallback
      }
    }
  };

  const containerStyle: ViewStyle = {
    marginBottom: 16
  };

  const labelStyle: TextStyle = {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 6
  };

  const labelContainerStyle: ViewStyle = {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  };

  const errorStyle: TextStyle = {
    fontSize: 12,
    color: colors.error,
    fontWeight: '500'
  };

  const helperStyle: TextStyle = {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4
  };

  return (
    <View style={containerStyle} testID={testID}>
      <View style={labelContainerStyle}>
        <Text style={labelStyle}>
          {label}
          {isRequired && <Text style={{ color: colors.error }}> *</Text>}
        </Text>
        {error && <Text style={errorStyle}>{error}</Text>}
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
        error={!!error}
        accessibilityLabel={accessibilityLabel || label}
      />

      {helperText && !error && (
        <Text style={helperStyle}>{helperText}</Text>
      )}
    </View>
  );
}

export default FormField;
