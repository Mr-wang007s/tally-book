/**
 * ExpenseListScreen - 支出列表页
 * 遵循 Constitution Principles I (HIG), V (Performance - FlatList), VII (Safe Areas)
 */

import React from 'react';
import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';
import { SafeAreaWrapper } from '@/components/ui/SafeAreaWrapper';
import { ExpenseListItem } from '@/components/features/ExpenseListItem';
import { useTheme } from '@/hooks/useTheme';
import { useExpenses } from '@/hooks/useExpenses';
import type { Expense } from '@/types/expense';

export default function ExpenseListScreen() {
  const { colors, typography, spacing } = useTheme();
  const { expenses, deleteExpense, isLoading } = useExpenses();

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

  return (
    <SafeAreaWrapper>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <FlatList
          data={expenses}
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
      </View>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
