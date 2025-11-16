/**
 * NumberInput Component
 * 
 * Specialized numeric input with increment/decrement buttons, formatting, and validation
 * Supports positive/negative numbers and decimal places
 */

import React, { forwardRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Pressable,
  TextInputProps as RNTextInputProps,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { TextInput } from './TextInput';
import { Button } from '../ui/Button';

export interface NumberInputProps extends Omit<RNTextInputProps, 'keyboardType' | 'value'> {
  label?: string;
  value?: number;
  onChangeValue?: (value: number) => void;
  error?: string;
  helperText?: string;
  isRequired?: boolean;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  inputStyle?: TextStyle;
  disabled?: boolean;
  min?: number;
  max?: number;
  step?: number;
  decimals?: number;
  allowNegative?: boolean;
  prefix?: string;
  suffix?: string;
  showControls?: boolean;
}

export const NumberInput = forwardRef<any, NumberInputProps>(
  (
    {
      label,
      value = 0,
      onChangeValue,
      error,
      helperText,
      isRequired = false,
      containerStyle,
      labelStyle,
      inputStyle,
      disabled = false,
      min = Number.MIN_SAFE_INTEGER,
      max = Number.MAX_SAFE_INTEGER,
      step = 1,
      decimals = 2,
      allowNegative = false,
      prefix = '',
      suffix = '',
      showControls = true,
      onChangeText,
      ...props
    },
    ref
  ) => {
    const { theme } = useTheme();
    const [text, setText] = useState(value.toFixed(decimals));

    const handleChangeText = useCallback(
      (newText: string) => {
        // Remove prefix/suffix if present
        let cleanText = newText
          .replace(prefix, '')
          .replace(suffix, '')
          .trim();

        // Allow only numbers, optional minus sign, and decimal point
        const regex = allowNegative ? /^-?\d*\.?\d*$/ : /^\d*\.?\d*$/;
        if (!regex.test(cleanText)) return;

        setText(cleanText);

        if (cleanText === '' || cleanText === '-') {
          onChangeValue?.(0);
          onChangeText?.(cleanText);
          return;
        }

        const numValue = parseFloat(cleanText);
        if (!isNaN(numValue)) {
          const clampedValue = Math.max(min, Math.min(max, numValue));
          onChangeValue?.(clampedValue);
          onChangeText?.(clampedValue.toString());
        }
      },
      [allowNegative, min, max, onChangeValue, onChangeText, prefix, suffix]
    );

    const handleIncrement = useCallback(() => {
      const currentValue = parseFloat(text) || 0;
      const newValue = Math.min(max, currentValue + step);
      const formatted = newValue.toFixed(decimals);
      setText(formatted);
      onChangeValue?.(newValue);
    }, [text, step, max, decimals, onChangeValue]);

    const handleDecrement = useCallback(() => {
      const currentValue = parseFloat(text) || 0;
      const newValue = Math.max(min, currentValue - step);
      const formatted = newValue.toFixed(decimals);
      setText(formatted);
      onChangeValue?.(newValue);
    }, [text, step, min, decimals, onChangeValue]);

    const styles = StyleSheet.create({
      container: {
        marginBottom: 12,
      },
      labelContainer: {
        flexDirection: 'row',
        marginBottom: 6,
      },
      labelText: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.text,
      },
      requiredIndicator: {
        color: theme.colors.error,
        marginLeft: 4,
      },
      inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        borderRadius: theme.borderRadius.md,
        backgroundColor: disabled ? theme.colors.background : theme.colors.surface,
        borderWidth: 1,
        borderColor: error ? theme.colors.error : theme.colors.border,
      },
      textInput: {
        flex: 1,
        height: 44,
        fontSize: 16,
        color: disabled ? theme.colors.textSecondary : theme.colors.text,
        textAlign: 'right',
      },
      controlButton: {
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: theme.borderRadius.sm,
        backgroundColor: theme.colors.primary + '20',
      },
      controlButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.primary,
      },
      affixText: {
        fontSize: 14,
        color: theme.colors.textSecondary,
        marginHorizontal: 4,
      },
      errorText: {
        fontSize: 12,
        color: theme.colors.error,
        marginTop: 4,
      },
    });

    return (
      <View style={[styles.container, containerStyle]}>
        {label && (
          <View style={styles.labelContainer}>
            <Text style={[styles.labelText, labelStyle]}>{label}</Text>
            {isRequired && <Text style={styles.requiredIndicator}>*</Text>}
          </View>
        )}
        <View style={styles.inputContainer}>
          {showControls && (
            <Pressable style={styles.controlButton} onPress={handleDecrement} disabled={disabled}>
              <Text style={styles.controlButtonText}>−</Text>
            </Pressable>
          )}
          {prefix && <Text style={styles.affixText}>{prefix}</Text>}
          <TextInput
            ref={ref}
            value={text}
            onChangeText={handleChangeText}
            keyboardType="decimal-pad"
            editable={!disabled}
            style={[styles.textInput, inputStyle]}
            {...props}
          />
          {suffix && <Text style={styles.affixText}>{suffix}</Text>}
          {showControls && (
            <Pressable style={styles.controlButton} onPress={handleIncrement} disabled={disabled}>
              <Text style={styles.controlButtonText}>+</Text>
            </Pressable>
          )}
        </View>
        {error && <Text style={styles.errorText}>{error}</Text>}
        {helperText && !error && <Text style={styles.errorText}>{helperText}</Text>}
      </View>
    );
  }
);

NumberInput.displayName = 'NumberInput';
