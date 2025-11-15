/**
 * Transactions List Screen
 * Displays all transactions sorted by date (latest first)
 */

import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Transaction } from '@/models/transaction';
import { Category } from '@/models/category';
import { loadTransactions, loadCategories } from '@/services/transactions';
import { colors, typography, spacing } from '@/theme/tokens';
import { buttonA11y, formatCurrencyA11y, formatDateA11y } from '@/components/A11y';

export default function TransactionsListScreen() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    try {
      const [txns, cats] = await Promise.all([loadTransactions(), loadCategories()]);
      // Sort by date descending (latest first)
      const sorted = txns.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setTransactions(sorted);
      setCategories(cats);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const getCategoryName = (categoryId: string): string => {
    const category = categories.find((c) => c.id === categoryId);
    return category?.name || 'Unknown';
  };

  const renderTransaction = ({ item }: { item: Transaction }) => {
    const date = new Date(item.date);
    const isIncome = item.type === 'income';

    return (
      <TouchableOpacity
        style={styles.transactionItem}
        onPress={() => router.push(`/transactions/${item.id}/edit`)}
        accessible={true}
        accessibilityLabel={`${isIncome ? 'Income' : 'Expense'} of ${formatCurrencyA11y(
          item.amount
        )} on ${formatDateA11y(date)} in ${getCategoryName(item.categoryId)} category`}
        accessibilityRole="button"
      >
        <View style={styles.transactionLeft}>
          <Text style={styles.category}>{getCategoryName(item.categoryId)}</Text>
          <Text style={styles.date}>{date.toLocaleDateString()}</Text>
          {item.note && <Text style={styles.note}>{item.note}</Text>}
        </View>
        <View style={styles.transactionRight}>
          <Text style={[styles.amount, isIncome ? styles.income : styles.expense]}>
            {isIncome ? '+' : '-'}${item.amount.toFixed(2)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={transactions}
        renderItem={renderTransaction}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No transactions yet</Text>
            <Text style={styles.emptyHint}>Tap the + button to add your first transaction</Text>
          </View>
        }
        contentContainerStyle={transactions.length === 0 ? styles.emptyContainer : undefined}
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/transactions/add')}
        {...buttonA11y('Add Transaction', 'Add a new transaction')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  transactionLeft: {
    flex: 1,
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  category: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  date: {
    ...typography.caption1,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  note: {
    ...typography.caption2,
    color: colors.textTertiary,
    marginTop: spacing.xs,
  },
  amount: {
    ...typography.title3,
    fontWeight: '700',
  },
  income: {
    color: colors.success,
  },
  expense: {
    color: colors.error,
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxl,
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  emptyText: {
    ...typography.title3,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  emptyHint: {
    ...typography.body,
    color: colors.textTertiary,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabText: {
    fontSize: 32,
    color: colors.textOnPrimary,
    fontWeight: '300',
  },
});
