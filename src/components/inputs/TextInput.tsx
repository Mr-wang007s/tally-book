/**
 * TextInput Component
 * 
 * Flexible text input with optional label, placeholder, validation states, and i18n support
 * Supports all React Native TextInput props plus custom styling
 */

import React, { forwardRef } from 'react';
import {
  TextInput as RNTextInput,
  StyleSheet,
  View,
  Text,
  ViewStyle,
  TextStyle,
  TextInputProps as RNTextInputProps,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export interface TextInputProps extends RNTextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  isRequired?: boolean;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  inputStyle?: TextStyle;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const TextInput = forwardRef<RNTextInput, TextInputProps>(
  (
    {
      label,
      error,
      helperText,
      isRequired = false,
      containerStyle,
      labelStyle,
      inputStyle,
      disabled = false,
      leftIcon,
      rightIcon,
      placeholderTextColor,
      editable = true,
      ...props
    },
    ref
  ) => {
    const { theme } = useTheme();
    const isError = !!error;
    const isDisabled = disabled || !editable;

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
      inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        borderRadius: theme.borderRadius.md,
        backgroundColor: isDisabled ? theme.colors.background : theme.colors.surface,
        borderWidth: 1,
        borderColor: isError ? theme.colors.error : theme.colors.border,
      },
      input: {
        flex: 1,
        height: 44,
        fontSize: 16,
        color: isDisabled ? theme.colors.textSecondary : theme.colors.text,
        paddingVertical: 10,
        paddingHorizontal: 0,
      },
      icon: {
        marginHorizontal: 4,
      },
      errorText: {
        fontSize: 12,
        color: theme.colors.error,
        marginTop: 4,
      },
      helperText: {
        fontSize: 12,
        color: theme.colors.textSecondary,
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
        <View style={styles.inputWrapper}>
          {leftIcon && <View style={styles.icon}>{leftIcon}</View>}
          <RNTextInput
            ref={ref}
            style={[styles.input, inputStyle]}
            placeholderTextColor={placeholderTextColor || theme.colors.textSecondary}
            editable={editable}
            {...props}
          />
          {rightIcon && <View style={styles.icon}>{rightIcon}</View>}
        </View>
        {error && <Text style={styles.errorText}>{error}</Text>}
        {helperText && !error && <Text style={styles.helperText}>{helperText}</Text>}
      </View>
    );
  }
);

TextInput.displayName = 'TextInput';
