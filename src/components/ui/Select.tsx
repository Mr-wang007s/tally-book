/**
 * Select Component (shadcn-like pattern)
 * Reusable dropdown/picker component with options array
 * 
 * @module src/components/ui/Select
 */

import React from 'react';
import { View, Text, TouchableOpacity, ViewStyle, TextStyle, Modal, ScrollView } from 'react-native';
import { colors, spacing, typography } from '@/tokens';
import { useColorScheme } from '@/hooks/useColorScheme';

export interface SelectOption<T = any> {
  /** Display label */
  label: string;
  /** Option value */
  value: T;
  /** Whether option is disabled */
  disabled?: boolean;
}

export interface SelectProps<T = any> {
  /** Available options */
  options: SelectOption<T>[];
  
  /** Currently selected value */
  value?: T;
  
  /** Change handler */
  onValueChange: (value: T) => void;
  
  /** Placeholder text when no value selected */
  placeholder?: string;
  
  /** Error state */
  error?: boolean;
  
  /** Disabled state */
  disabled?: boolean;
  
  /** Custom style */
  style?: ViewStyle;
  
  /** Test ID */
  testID?: string;
  
  /** Accessibility label */
  accessibilityLabel?: string;
}

/**
 * Dropdown select component
 * 
 * @example
 * ```tsx
 * <Select
 *   options={[
 *     { label: 'Income', value: 'income' },
 *     { label: 'Expense', value: 'expense' },
 *   ]}
 *   value={type}
 *   onValueChange={setType}
 *   placeholder="Select type"
 *   error={!!errors.type}
 * />
 * ```
 */
export function Select<T = any>({
  options,
  value,
  onValueChange,
  placeholder = 'Select...',
  error,
  disabled,
  style,
  testID,
  accessibilityLabel,
}: SelectProps<T>) {
  const { colorScheme } = useColorScheme();
  const themeColors = colorScheme === 'dark' ? colors.dark : colors.light;
  const [isOpen, setIsOpen] = React.useState(false);

  const selectedOption = options.find(o => o.value === value);
  const displayLabel = selectedOption?.label || placeholder;

  const triggerStyle: ViewStyle = {
    borderWidth: 1,
    borderColor: error ? themeColors.error : themeColors.border,
    borderRadius: 8,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    backgroundColor: disabled ? themeColors.disabledBackground : themeColors.surface,
    minHeight: 44, // Accessibility: minimum touch target
    justifyContent: 'center',
    ...style,
  };

  const triggerTextStyle: TextStyle = {
    ...typography.body,
    color: selectedOption 
      ? themeColors.textPrimary 
      : themeColors.textPlaceholder,
  };

  const optionStyle = (isSelected: boolean, isDisabled?: boolean): ViewStyle => ({
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: isSelected ? themeColors.primaryLight : 'transparent',
    opacity: isDisabled ? 0.5 : 1,
  });

  const optionTextStyle = (isSelected: boolean): TextStyle => ({
    ...typography.body,
    color: isSelected ? themeColors.primary : themeColors.textPrimary,
    fontWeight: isSelected ? '600' : '400',
  });

  return (
    <View testID={testID}>
      {/* Trigger Button */}
      <TouchableOpacity
        onPress={() => !disabled && setIsOpen(!isOpen)}
        style={triggerStyle}
        disabled={disabled}
        accessibilityLabel={accessibilityLabel || `Select ${displayLabel}`}
        accessibilityRole="button"
        accessibilityState={{ disabled: disabled || false }}
      >
        <Text style={triggerTextStyle}>{displayLabel}</Text>
      </TouchableOpacity>

      {/* Options Modal */}
      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity 
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            paddingHorizontal: spacing.lg,
          }}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View 
            style={{
              backgroundColor: themeColors.surface,
              borderRadius: 12,
              maxHeight: '70%',
              overflow: 'hidden',
            }}
            onStartShouldSetResponder={() => true}
          >
            <ScrollView>
              {options.map((option, index) => {
                const isSelected = option.value === value;
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      if (!option.disabled) {
                        onValueChange(option.value);
                        setIsOpen(false);
                      }
                    }}
                    style={optionStyle(isSelected, option.disabled)}
                    disabled={option.disabled}
                  >
                    <Text style={optionTextStyle(isSelected)}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

export default Select;
