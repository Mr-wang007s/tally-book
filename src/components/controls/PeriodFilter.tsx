/**
 * PeriodFilter Component
 * 
 * Time period selector with preset options (today, week, month, year, custom)
 * Used for filtering transactions by date range
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Modal,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export type PeriodType = 'today' | 'week' | 'month' | 'year' | 'custom';

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export interface PeriodFilterProps {
  value?: PeriodType;
  customRange?: DateRange;
  onChangePeriod?: (period: PeriodType, range?: DateRange) => void;
  containerStyle?: ViewStyle;
}

const periodOptions = [
  { id: 'today' as const, label: '今天' },
  { id: 'week' as const, label: '本周' },
  { id: 'month' as const, label: '本月' },
  { id: 'year' as const, label: '今年' },
  { id: 'custom' as const, label: '自定义' },
];

const getDateRange = (period: PeriodType): DateRange => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  switch (period) {
    case 'today':
      return { startDate: today, endDate: tomorrow };
    case 'week': {
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      return { startDate: startOfWeek, endDate: tomorrow };
    }
    case 'month': {
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      return { startDate: startOfMonth, endDate: tomorrow };
    }
    case 'year': {
      const startOfYear = new Date(today.getFullYear(), 0, 1);
      return { startDate: startOfYear, endDate: tomorrow };
    }
    default:
      return { startDate: today, endDate: tomorrow };
  }
};

export const PeriodFilter: React.FC<PeriodFilterProps> = ({
  value = 'month',
  customRange,
  onChangePeriod,
  containerStyle,
}) => {
  const { theme } = useTheme();
  const [showModal, setShowModal] = useState(false);

  const handleSelectPeriod = useCallback(
    (period: PeriodType) => {
      if (period === 'custom') {
        // Keep modal open for custom date selection
      } else {
        const range = getDateRange(period);
        onChangePeriod?.(period, range);
        setShowModal(false);
      }
    },
    [onChangePeriod]
  );

  const styles = StyleSheet.create({
    container: {
      marginBottom: 12,
    },
    button: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.primary,
      borderWidth: 1,
      borderColor: theme.colors.primary,
    },
    buttonText: {
      color: '#ffffff',
      fontSize: 13,
      fontWeight: '600',
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
      paddingTop: 16,
      paddingBottom: 20,
    },
    modalHeader: {
      paddingHorizontal: 16,
      marginBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      paddingBottom: 12,
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
    periodOptions.find((opt) => opt.id === value)?.label || '本月';

  return (
    <View style={[styles.container, containerStyle]}>
      <Pressable
        style={styles.button}
        onPress={() => setShowModal(true)}
      >
        <Text style={styles.buttonText}>{currentLabel}</Text>
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
              <Text style={styles.modalTitle}>选择时间段</Text>
              <Pressable onPress={() => setShowModal(false)}>
                <Text style={{ fontSize: 24, color: theme.colors.textSecondary }}>×</Text>
              </Pressable>
            </View>
            <ScrollView style={styles.optionsList}>
              {periodOptions.map((option) => (
                <Pressable
                  key={option.id}
                  style={[
                    styles.option,
                    value === option.id && styles.optionSelected,
                  ]}
                  onPress={() => handleSelectPeriod(option.id)}
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

PeriodFilter.displayName = 'PeriodFilter';
