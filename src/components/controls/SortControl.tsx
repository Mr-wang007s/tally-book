/**
 * SortControl Component
 * 
 * Sort order selector (date ascending/descending, amount, category)
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Modal,
  ScrollView,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export type SortBy = 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc' | 'category';

export interface SortControlProps {
  value?: SortBy;
  onChangeSort?: (sortBy: SortBy) => void;
  containerStyle?: ViewStyle;
}

const sortOptions = [
  { id: 'date-desc' as const, label: '日期（最新）' },
  { id: 'date-asc' as const, label: '日期（最早）' },
  { id: 'amount-desc' as const, label: '金额（最高）' },
  { id: 'amount-asc' as const, label: '金额（最低）' },
  { id: 'category' as const, label: '分类' },
];

export const SortControl: React.FC<SortControlProps> = ({
  value = 'date-desc',
  onChangeSort,
  containerStyle,
}) => {
  const { theme } = useTheme();
  const [showModal, setShowModal] = useState(false);

  const handleSelectSort = (sortBy: SortBy) => {
    onChangeSort?.(sortBy);
    setShowModal(false);
  };

  const styles = StyleSheet.create({
    container: {
      marginBottom: 12,
    },
    button: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    buttonText: {
      color: theme.colors.text,
      fontSize: 13,
      fontWeight: '600',
    },
    icon: {
      fontSize: 14,
      marginLeft: 6,
      color: theme.colors.textSecondary,
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
      paddingBottom: 20,
    },
    modalHeader: {
      paddingHorizontal: 16,
      paddingVertical: 12,
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
    optionsList: {
      paddingHorizontal: 12,
      paddingVertical: 12,
    },
    option: {
      paddingHorizontal: 12,
      paddingVertical: 12,
      borderRadius: theme.borderRadius.md,
      marginBottom: 8,
      backgroundColor: theme.colors.background,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    optionSelected: {
      backgroundColor: theme.colors.primary + '20',
      borderWidth: 1,
      borderColor: theme.colors.primary,
    },
    optionLabel: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.colors.text,
    },
    checkmark: {
      fontSize: 16,
      color: theme.colors.primary,
      fontWeight: 'bold',
    },
  });

  const currentLabel =
    sortOptions.find((opt) => opt.id === value)?.label || '排序';

  return (
    <View style={[styles.container, containerStyle]}>
      <Pressable
        style={styles.button}
        onPress={() => setShowModal(true)}
      >
        <Text style={styles.buttonText}>{currentLabel}</Text>
        <Text style={styles.icon}>⇅</Text>
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
              <Text style={styles.modalTitle}>排序方式</Text>
              <Pressable onPress={() => setShowModal(false)}>
                <Text style={{ fontSize: 24, color: theme.colors.textSecondary }}>×</Text>
              </Pressable>
            </View>
            <ScrollView style={styles.optionsList}>
              {sortOptions.map((option) => (
                <Pressable
                  key={option.id}
                  style={[
                    styles.option,
                    value === option.id && styles.optionSelected,
                  ]}
                  onPress={() => handleSelectSort(option.id)}
                >
                  <Text style={styles.optionLabel}>{option.label}</Text>
                  {value === option.id && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

SortControl.displayName = 'SortControl';
