/**
 * SummaryCards Component
 * Display income, expense, and balance summary widgets
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing, radius, shadows } from '@/theme/tokens';
import { Summary } from '@/models/summary';
import { formatCurrencyA11y } from './A11y';

export interface SummaryCardsProps {
  summary: Summary;
}

export function SummaryCards({ summary }: SummaryCardsProps) {
  return (
    <View style={styles.container}>
      {/* Income Card */}
      <View
        style={[styles.card, styles.incomeCard]}
        accessible={true}
        accessibilityLabel={`Total income: ${formatCurrencyA11y(summary.totalIncome)}`}
        accessibilityRole="summary"
      >
        <Text style={styles.cardLabel}>Income</Text>
        <Text style={[styles.cardAmount, styles.incomeAmount]}>
          ${summary.totalIncome.toFixed(2)}
        </Text>
      </View>

      {/* Expense Card */}
      <View
        style={[styles.card, styles.expenseCard]}
        accessible={true}
        accessibilityLabel={`Total expense: ${formatCurrencyA11y(summary.totalExpense)}`}
        accessibilityRole="summary"
      >
        <Text style={styles.cardLabel}>Expense</Text>
        <Text style={[styles.cardAmount, styles.expenseAmount]}>
          ${summary.totalExpense.toFixed(2)}
        </Text>
      </View>

      {/* Balance Card */}
      <View
        style={[styles.card, styles.balanceCard]}
        accessible={true}
        accessibilityLabel={`Balance: ${formatCurrencyA11y(summary.balance)}`}
        accessibilityRole="summary"
      >
        <Text style={styles.cardLabel}>Balance</Text>
        <Text
          style={[
            styles.cardAmount,
            summary.balance >= 0 ? styles.balancePositive : styles.balanceNegative,
          ]}
        >
          {summary.balance >= 0 ? '+' : ''}${summary.balance.toFixed(2)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...shadows.sm,
  },
  incomeCard: {
    borderLeftWidth: 4,
    borderLeftColor: colors.success,
  },
  expenseCard: {
    borderLeftWidth: 4,
    borderLeftColor: colors.error,
  },
  balanceCard: {
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  cardLabel: {
    ...typography.subhead,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    fontWeight: '600',
  },
  cardAmount: {
    ...typography.largeTitle,
    fontWeight: '700',
  },
  incomeAmount: {
    color: colors.success,
  },
  expenseAmount: {
    color: colors.error,
  },
  balancePositive: {
    color: colors.success,
  },
  balanceNegative: {
    color: colors.error,
  },
});
