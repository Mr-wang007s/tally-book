/**
 * NotesInput Component
 * 
 * Multi-line text input for notes with character counter and validation
 */

import React, { forwardRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput as RNTextInput,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TextInputProps as RNTextInputProps,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export interface NotesInputProps extends RNTextInputProps {
  label?: string;
  value?: string;
  onChangeValue?: (value: string) => void;
  error?: string;
  helperText?: string;
  isRequired?: boolean;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  inputStyle?: TextStyle;
  disabled?: boolean;
  maxLength?: number;
  showCharCount?: boolean;
  minHeight?: number;
}

export const NotesInput = forwardRef<RNTextInput, NotesInputProps>(
  (
    {
      label,
      value = '',
      onChangeValue,
      error,
      helperText,
      isRequired = false,
      containerStyle,
      labelStyle,
      inputStyle,
      disabled = false,
      maxLength = 500,
      showCharCount = true,
      minHeight = 100,
      onChangeText,
      editable = true,
      ...props
    },
    ref
  ) => {
    const { theme } = useTheme();
    const [text, setText] = useState(value);

    const handleChangeText = useCallback(
      (newText: string) => {
        if (maxLength && newText.length > maxLength) {
          return;
        }
        setText(newText);
        onChangeValue?.(newText);
        onChangeText?.(newText);
      },
      [maxLength, onChangeValue, onChangeText]
    );

    const charCount = text.length;
    const charPercentage = maxLength ? (charCount / maxLength) * 100 : 0;

    const styles = StyleSheet.create({
      container: {
        marginBottom: 12,
      },
      labelContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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
      charCount: {
        fontSize: 12,
        color: charPercentage > 80 ? theme.colors.warning : theme.colors.textSecondary,
      },
      inputContainer: {
        paddingHorizontal: 12,
        paddingVertical: 12,
        borderRadius: theme.borderRadius.md,
        backgroundColor: disabled ? theme.colors.background : theme.colors.surface,
        borderWidth: 1,
        borderColor: error ? theme.colors.error : theme.colors.border,
        minHeight: minHeight,
      },
      input: {
        fontSize: 16,
        color: disabled ? theme.colors.textSecondary : theme.colors.text,
        textAlignVertical: 'top',
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
            <View style={{ flexDirection: 'row' }}>
              <Text style={[styles.labelText, labelStyle]}>{label}</Text>
              {isRequired && <Text style={styles.requiredIndicator}>*</Text>}
            </View>
            {showCharCount && maxLength && (
              <Text style={styles.charCount}>
                {charCount}/{maxLength}
              </Text>
            )}
          </View>
        )}
        <View style={styles.inputContainer}>
          <RNTextInput
            ref={ref}
            value={text}
            onChangeText={handleChangeText}
            multiline
            numberOfLines={4}
            placeholder="添加说明（可选）"
            placeholderTextColor={theme.colors.textSecondary}
            style={[styles.input, inputStyle]}
            editable={editable && !disabled}
            scrollEnabled={false}
            maxLength={maxLength}
            {...props}
          />
        </View>
        {error && <Text style={styles.errorText}>{error}</Text>}
        {helperText && !error && <Text style={styles.helperText}>{helperText}</Text>}
      </View>
    );
  }
);

NotesInput.displayName = 'NotesInput';
