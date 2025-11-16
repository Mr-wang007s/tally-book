/**
 * CategoryPicker Component
 * 
 * Specialized picker for transaction categories with icons and grouped options
 * Supports dynamic category lists for income/expense types
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

export interface Category {
  id: string;
  name: string;
  icon?: string;
  type?: 'income' | 'expense';
  color?: string;
}

export interface CategoryPickerProps {
  label?: string;
  value?: string;
  onChangeCategory?: (categoryId: string) => void;
  categories: Category[];
  error?: string;
  helperText?: string;
  isRequired?: boolean;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  disabled?: boolean;
  placeholder?: string;
}

export const CategoryPicker: React.FC<CategoryPickerProps> = ({
  label,
  value,
  onChangeCategory,
  categories,
  error,
  helperText,
  isRequired = false,
  containerStyle,
  labelStyle,
  disabled = false,
  placeholder = '选择分类',
}) => {
  const { theme } = useTheme();
  const [showModal, setShowModal] = useState(false);

  const selectedCategory = categories.find((c) => c.id === value);

  const handleSelectCategory = useCallback(
    (categoryId: string) => {
      onChangeCategory?.(categoryId);
      setShowModal(false);
    },
    [onChangeCategory]
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
    pickerButtonText: {
      fontSize: 16,
      color: selectedCategory ? theme.colors.text : theme.colors.textSecondary,
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
    categoryList: {
      paddingHorizontal: 12,
      paddingVertical: 12,
    },
    categoryItem: {
      paddingHorizontal: 12,
      paddingVertical: 12,
      borderRadius: theme.borderRadius.md,
      marginBottom: 8,
      backgroundColor: theme.colors.background,
      flexDirection: 'row',
      alignItems: 'center',
    },
    categoryItemSelected: {
      backgroundColor: theme.colors.primary + '20',
      borderWidth: 1,
      borderColor: theme.colors.primary,
    },
    categoryIcon: {
      marginRight: 12,
      fontSize: 20,
    },
    categoryName: {
      fontSize: 16,
      color: theme.colors.text,
      flex: 1,
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
        <Text style={styles.pickerButtonText}>
          {selectedCategory ? selectedCategory.name : placeholder}
        </Text>
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
              <Text style={styles.modalTitle}>{label || '选择分类'}</Text>
              <Pressable onPress={() => setShowModal(false)}>
                <Text style={{ fontSize: 24, color: theme.colors.textSecondary }}>×</Text>
              </Pressable>
            </View>
            <ScrollView style={styles.categoryList}>
              {categories.map((category) => (
                <Pressable
                  key={category.id}
                  style={[
                    styles.categoryItem,
                    value === category.id && styles.categoryItemSelected,
                  ]}
                  onPress={() => handleSelectCategory(category.id)}
                >
                  {category.icon && <Text style={styles.categoryIcon}>{category.icon}</Text>}
                  <Text style={styles.categoryName}>{category.name}</Text>
                  {value === category.id && <Text style={styles.checkmark}>✓</Text>}
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

CategoryPicker.displayName = 'CategoryPicker';
