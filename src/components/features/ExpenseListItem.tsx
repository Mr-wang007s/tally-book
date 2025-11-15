/**
 * ExpenseListItem Component
 * 支出记录列表项
 * 遵循 Constitution Principles I (HIG), IV (Accessibility), V (Performance)
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useCategories } from '@/hooks/useCategories';
import { Icon } from '@/components/ui/Icon';
import { formatAmount, formatRelativeTime } from '@/utils/formatting';
import type { Expense } from '@/types/expense';

export interface ExpenseListItemProps {
  expense: Expense;
  onPress?: (expense: Expense) => void;
  onDelete?: (expense: Expense) => void;
}

export function ExpenseListItem({ expense, onPress, onDelete }: ExpenseListItemProps) {
  const { colors, typography, spacing } = useTheme();
  const { getCategoryById } = useCategories();
  
  const category = getCategoryById(expense.categoryId);
  const inputMethodIcon =
    expense.inputMethod === 'keyboard'
      ? 'keypad'
      : expense.inputMethod === 'voice'
      ? 'mic'
      : 'camera';

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          borderRadius: spacing.borderRadius.md,
          padding: spacing.md,
          marginBottom: spacing.sm,
          minHeight: spacing.touchTarget + spacing.md,
        },
      ]}
      onPress={() => onPress?.(expense)}
      accessibilityRole="button"
      accessibilityLabel={`支出记录：${formatAmount(expense.amount)}，类别${category?.name || '未知'}，${formatRelativeTime(expense.createdAt)}`}
    >
      <View style={styles.content}>
        {/* Left: Category Icon */}
        <View
          style={[
            styles.categoryIcon,
            {
              backgroundColor: category?.color || colors.backgroundSecondary,
              borderRadius: spacing.borderRadius.full,
            },
          ]}
        >
          <Icon
            name={category?.icon as any || 'help'}
            size={24}
            color="#FFFFFF"
          />
        </View>

        {/* Middle: Details */}
        <View style={styles.details}>
          <View style={styles.titleRow}>
            <Text
              style={[
                styles.categoryName,
                { color: colors.text, fontSize: typography.fontSize.body },
              ]}
            >
              {category?.name || '未知类别'}
            </Text>
            <Icon
              name={inputMethodIcon}
              size={14}
              color={colors.textTertiary}
            />
          </View>
          
          {expense.note ? (
            <Text
              style={[
                styles.note,
                { color: colors.textSecondary, fontSize: typography.fontSize.footnote },
              ]}
              numberOfLines={1}
            >
              {expense.note}
            </Text>
          ) : null}
          
          <Text
            style={[
              styles.time,
              { color: colors.textTertiary, fontSize: typography.fontSize.caption1 },
            ]}
          >
            {formatRelativeTime(expense.createdAt)}
          </Text>
        </View>

        {/* Right: Amount */}
        <View style={styles.amountContainer}>
          <Text
            style={[
              styles.amount,
              { color: colors.error, fontSize: typography.fontSize.title3 },
            ]}
          >
            {formatAmount(expense.amount)}
          </Text>
          {onDelete && (
            <TouchableOpacity
              onPress={() => onDelete(expense)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              accessibilityRole="button"
              accessibilityLabel="删除支出记录"
            >
              <Icon name="trash-outline" size={18} color={colors.error} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIcon: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  details: {
    flex: 1,
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  categoryName: {
    fontWeight: '600',
  },
  note: {
    marginBottom: 2,
  },
  time: {
    marginTop: 2,
  },
  amountContainer: {
    alignItems: 'flex-end',
    gap: 4,
  },
  amount: {
    fontWeight: '700',
  },
});
