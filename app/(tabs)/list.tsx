/**
 * ExpenseListScreen - 支出列表页
 * 遵循 Constitution Principles I (HIG), V (Performance - FlatList), VII (Safe Areas)
 * Features: Filter by type/category, Sort, FAB for quick add
 */

import React, { useState, useMemo } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaWrapper } from '@/components/ui/SafeAreaWrapper';
import { ExpenseListItem } from '@/components/features/ExpenseListItem';
import { FilterBottomSheet } from '@/components/features/FilterBottomSheet';
import { FloatingActionButton } from '@/components/ui/FloatingActionButton';
import { useTheme } from '@/hooks/useTheme';
import { useExpenses } from '@/hooks/useExpenses';
import { useCategories } from '@/hooks/useCategories';
import type { Expense } from '@/types/expense';
import type { Transaction, FilterCriteria, Category as TransactionCategory } from '@/types/transaction';

export default function ExpenseListScreen() {
  const { colors, typography } = useTheme();
  const { expenses, deleteExpense, isLoading } = useExpenses();
  const { categories } = useCategories();
  const router = useRouter();
  
  // Filter state
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [filterCriteria, setFilterCriteria] = useState<FilterCriteria>({
    typeFilter: null,
    sortBy: 'newest',
    selectedCategories: [],
  });

  // Convert categories to transaction category format
  const transactionCategories: TransactionCategory[] = useMemo(() => {
    return categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      icon: cat.icon,
      color: cat.color,
      type: null, // Categories are universal in this context
    }));
  }, [categories]);

  // Convert expenses to transactions format for filtering
  const transactions: Transaction[] = useMemo(() => {
    return expenses.map((expense) => ({
      id: expense.id,
      amount: expense.amount,
      timestamp: new Date(expense.date).getTime(),
      type: 'expense' as const,
      fromAccount: null,
      toAccount: null,
      category: expense.categoryId,
      description: expense.note,
      attachments: expense.photoPath ? [expense.photoPath] : undefined,
      createdAt: new Date(expense.createdAt).getTime(),
      updatedAt: new Date(expense.updatedAt).getTime(),
    }));
  }, [expenses]);

  // Apply filters
  const filteredTransactions = useMemo(() => {
    let result = [...transactions];

    // Filter by type
    if (filterCriteria.typeFilter) {
      result = result.filter((t) => t.type === filterCriteria.typeFilter);
    }

    // Filter by categories
    if (filterCriteria.selectedCategories.length > 0) {
      result = result.filter((t) =>
        filterCriteria.selectedCategories.includes(t.category)
      );
    }

    // Sort
    switch (filterCriteria.sortBy) {
      case 'highest':
        result.sort((a, b) => b.amount - a.amount);
        break;
      case 'lowest':
        result.sort((a, b) => a.amount - b.amount);
        break;
      case 'newest':
        result.sort((a, b) => b.timestamp - a.timestamp);
        break;
      case 'oldest':
        result.sort((a, b) => a.timestamp - b.timestamp);
        break;
    }

    return result;
  }, [transactions, filterCriteria]);

  // Convert back to expenses for display
  const filteredExpenses: Expense[] = useMemo(() => {
    return filteredTransactions.map((tx) => {
      const originalExpense = expenses.find((e) => e.id === tx.id);
      return originalExpense!;
    }).filter(Boolean);
  }, [filteredTransactions, expenses]);

  const handleDelete = (expense: Expense) => {
    Alert.alert(
      '确认删除',
      `确定要删除这笔支出吗？`,
      [
        { text: '取消', style: 'cancel' },
        {
          text: '删除',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteExpense(expense.id);
            } catch (error) {
              Alert.alert('错误', '删除失败');
            }
          },
        },
      ]
    );
  };

  const handleFilterApply = (criteria: FilterCriteria) => {
    setFilterCriteria(criteria);
  };

  const handleFilterReset = () => {
    setFilterCriteria({
      typeFilter: null,
      sortBy: 'newest',
      selectedCategories: [],
    });
  };

  const handleFABIncome = () => {
    router.push('/expense/create' as any);
  };

  const handleFABExpense = () => {
    router.push('/expense/create' as any);
  };

  const handleFABTransfer = () => {
    router.push('/expense/create' as any);
  };

  return (
    <SafeAreaWrapper>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header with Filter Button */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            交易列表
          </Text>
          <TouchableOpacity
            onPress={() => setIsFilterVisible(true)}
            accessibilityRole="button"
            accessibilityLabel="筛选交易"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="filter" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Transaction List */}
        <FlatList
          data={filteredExpenses}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ExpenseListItem
              expense={item}
              onDelete={handleDelete}
            />
          )}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text
                style={[
                  styles.emptyText,
                  { color: colors.textSecondary, fontSize: typography.fontSize.body },
                ]}
              >
                {isLoading ? '加载中...' : '暂无支出记录'}
              </Text>
            </View>
          }
          // Performance optimization (Constitution Principle V)
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={50}
          windowSize={10}
        />

        {/* Filter Bottom Sheet */}
        <FilterBottomSheet
          filterCriteria={filterCriteria}
          categories={transactionCategories}
          onApply={handleFilterApply}
          onReset={handleFilterReset}
          onDismiss={() => setIsFilterVisible(false)}
          isVisible={isFilterVisible}
        />

        {/* Floating Action Button */}
        <FloatingActionButton
          onIncomePress={handleFABIncome}
          onExpensePress={handleFABExpense}
          onTransferPress={handleFABTransfer}
        />
      </View>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  listContent: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    textAlign: 'center',
  },
});
