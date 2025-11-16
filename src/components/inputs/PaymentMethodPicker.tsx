/**
 * PaymentMethodPicker Component
 * 
 * Specialized picker for payment methods with icons and descriptions
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ScrollView,
  Modal,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Button } from '../ui/Button';

export interface PaymentMethod {
  id: string;
  name: string;
  icon?: string;
  description?: string;
  color?: string;
}

export interface PaymentMethodPickerProps {
  label?: string;
  value?: string;
  onChangeMethod?: (methodId: string) => void;
  methods: PaymentMethod[];
  error?: string;
  helperText?: string;
  isRequired?: boolean;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  disabled?: boolean;
  placeholder?: string;
}

export const PaymentMethodPicker: React.FC<PaymentMethodPickerProps> = ({
  label,
  value,
  onChangeMethod,
  methods,
  error,
  helperText,
  isRequired = false,
  containerStyle,
  labelStyle,
  disabled = false,
  placeholder = '选择支付方式',
}) => {
  const { theme } = useTheme();
  const [showModal, setShowModal] = useState(false);

  const selectedMethod = methods.find((m) => m.id === value);

  const handleSelectMethod = useCallback(
    (methodId: string) => {
      onChangeMethod?.(methodId);
      setShowModal(false);
    },
    [onChangeMethod]
  );

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
    pickerButton: {
      paddingHorizontal: 12,
      paddingVertical: 12,
      borderRadius: theme.borderRadius.md,
      backgroundColor: disabled ? theme.colors.background : theme.colors.surface,
      borderWidth: 1,
      borderColor: error ? theme.colors.error : theme.colors.border,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    pickerButtonContent: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    pickerButtonIcon: {
      fontSize: 20,
      marginRight: 8,
    },
    pickerButtonText: {
      fontSize: 16,
      color: selectedMethod ? theme.colors.text : theme.colors.textSecondary,
    },
    chevron: {
      fontSize: 18,
      color: theme.colors.textSecondary,
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
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: theme.colors.surface,
      borderTopLeftRadius: theme.borderRadius.lg,
      borderTopRightRadius: theme.borderRadius.lg,
      maxHeight: '80%',
      paddingBottom: 20,
    },
    modalHeader: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    modalTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
    },
    methodList: {
      paddingHorizontal: 12,
      paddingVertical: 12,
    },
    methodItem: {
      paddingHorizontal: 12,
      paddingVertical: 12,
      borderRadius: theme.borderRadius.md,
      marginBottom: 8,
      backgroundColor: theme.colors.background,
    },
    methodItemSelected: {
      backgroundColor: theme.colors.primary + '20',
      borderWidth: 1,
      borderColor: theme.colors.primary,
    },
    methodItemContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    methodItemLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    methodIcon: {
      fontSize: 24,
      marginRight: 12,
    },
    methodInfo: {
      flex: 1,
    },
    methodName: {
      fontSize: 16,
      fontWeight: '500',
      color: theme.colors.text,
      marginBottom: 2,
    },
    methodDescription: {
      fontSize: 12,
      color: theme.colors.textSecondary,
    },
    checkmark: {
      fontSize: 18,
      color: theme.colors.primary,
      fontWeight: 'bold',
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
      <Pressable
        disabled={disabled}
        onPress={() => !disabled && setShowModal(true)}
        style={styles.pickerButton}
      >
        <View style={styles.pickerButtonContent}>
          {selectedMethod?.icon && (
            <Text style={styles.pickerButtonIcon}>{selectedMethod.icon}</Text>
          )}
          <Text style={styles.pickerButtonText}>
            {selectedMethod ? selectedMethod.name : placeholder}
          </Text>
        </View>
        <Text style={styles.chevron}>›</Text>
      </Pressable>

      <Modal
        transparent
        animationType="slide"
        visible={showModal}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label || '选择支付方式'}</Text>
              <Pressable onPress={() => setShowModal(false)}>
                <Text style={{ fontSize: 24, color: theme.colors.textSecondary }}>×</Text>
              </Pressable>
            </View>
            <ScrollView style={styles.methodList}>
              {methods.map((method) => (
                <Pressable
                  key={method.id}
                  style={[
                    styles.methodItem,
                    value === method.id && styles.methodItemSelected,
                  ]}
                  onPress={() => handleSelectMethod(method.id)}
                >
                  <View style={styles.methodItemContent}>
                    <View style={styles.methodItemLeft}>
                      {method.icon && <Text style={styles.methodIcon}>{method.icon}</Text>}
                      <View style={styles.methodInfo}>
                        <Text style={styles.methodName}>{method.name}</Text>
                        {method.description && (
                          <Text style={styles.methodDescription}>{method.description}</Text>
                        )}
                      </View>
                    </View>
                    {value === method.id && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                </Pressable>
              ))}
            </ScrollView>
            <Button
              title="完成"
              onPress={() => setShowModal(false)}
              variant="primary"
              style={{ marginHorizontal: 12 }}
            />
          </View>
        </View>
      </Modal>

      {error && <Text style={styles.errorText}>{error}</Text>}
      {helperText && !error && <Text style={styles.helperText}>{helperText}</Text>}
    </View>
  );
};

PaymentMethodPicker.displayName = 'PaymentMethodPicker';
