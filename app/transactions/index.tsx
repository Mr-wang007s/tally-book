/**
 * Transactions List Screen
 * Displays all transactions sorted by date (latest first)
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, useFocusEffect, useLocalSearchParams } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
} from 'react-native-reanimated';
import { Transaction } from '@/models/transaction';
import { Category } from '@/models/category';
import { loadTransactions, loadCategories } from '@/services/transactions';
import { colors, typography, spacing } from '@/theme/tokens';
import { buttonA11y, formatCurrencyA11y, formatDateA11y } from '@/components/A11y';
import { useTranslation } from '@/i18n/useTranslation';

export default function TransactionsListScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams<{ scrollToId?: string; highlight?: string }>();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const flatListRef = useRef<FlatList<Transaction>>(null);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  // Handle scroll to newly added transaction
  useEffect(() => {
    if (params.scrollToId && transactions.length > 0) {
      const index = transactions.findIndex((t) => t.id === params.scrollToId);
      if (index !== -1) {
        // Scroll to the item
        setTimeout(() => {
          flatListRef.current?.scrollToIndex({
            index,
            animated: true,
            viewPosition: 0.5, // Center in viewport
          });
        }, 100);

        // Set highlight if requested
        if (params.highlight === 'true') {
          setHighlightedId(params.scrollToId);
          // Clear highlight after 2 seconds
          setTimeout(() => {
            setHighlightedId(null);
          }, 2000);
        }
      }
    }
  }, [params.scrollToId, params.highlight, transactions]);

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
    return category?.name || t('common.noData');
  };

  const renderTransaction = ({ item }: { item: Transaction }) => {
    const date = new Date(item.date);
    const isIncome = item.type === 'income';
    const isHighlighted = highlightedId === item.id;

    return (
      <AnimatedTransactionItem
        item={item}
        isIncome={isIncome}
        isHighlighted={isHighlighted}
        date={date}
        categoryName={getCategoryName(item.categoryId)}
        onPress={() => router.push(`/transactions/${item.id}/edit`)}
        accessibilityLabel={`${isIncome ? t('transactions.income') : t('transactions.expense')} of ${formatCurrencyA11y(
          item.amount
        )} on ${formatDateA11y(date)} in ${getCategoryName(item.categoryId)} category`}
      />
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={transactions}
        renderItem={renderTransaction}
        keyExtractor={(item) => item.id}
        onScrollToIndexFailed={(info) => {
          // Handle scroll failure gracefully
          const wait = new Promise((resolve) => setTimeout(resolve, 500));
          wait.then(() => {
            flatListRef.current?.scrollToIndex({
              index: info.index,
              animated: true,
              viewPosition: 0.5,
            });
          });
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>{t('messages.info.noTransactionsFound')}</Text>
            <Text style={styles.emptyHint}>{t('home.empty')}</Text>
          </View>
        }
        contentContainerStyle={transactions.length === 0 ? styles.emptyContainer : undefined}
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/transactions/add')}
        {...buttonA11y(t('transactions.addTransaction'), t('transactions.addTransaction'))}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

/**
 * Animated Transaction Item Component
 * Handles highlight animation for newly added transactions
 */
interface AnimatedTransactionItemProps {
  item: Transaction;
  isIncome: boolean;
  isHighlighted: boolean;
  date: Date;
  categoryName: string;
  onPress: () => void;
  accessibilityLabel: string;
}

function AnimatedTransactionItem({
  item,
  isIncome,
  isHighlighted,
  date,
  categoryName,
  onPress,
  accessibilityLabel,
}: AnimatedTransactionItemProps) {
  const highlightOpacity = useSharedValue(0);

  // Trigger highlight animation when item is highlighted
  useEffect(() => {
    if (isHighlighted) {
      highlightOpacity.value = withSequence(
        withTiming(1, { duration: 300 }),
        withDelay(1400, withTiming(0, { duration: 300 }))
      );
    }
  }, [isHighlighted]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: colors.surface,
      opacity: 1 - highlightOpacity.value * 0.3,
    };
  });

  const highlightOverlayStyle = useAnimatedStyle(() => {
    return {
      opacity: highlightOpacity.value,
    };
  });

  return (
    <TouchableOpacity onPress={onPress} accessible={true} accessibilityLabel={accessibilityLabel} accessibilityRole="button">
      <Animated.View style={[styles.transactionItem, animatedStyle]}>
        {isHighlighted && (
          <Animated.View
            style={[
              StyleSheet.absoluteFill,
              {
                backgroundColor: colors.primary,
                borderRadius: 0,
              },
              highlightOverlayStyle,
            ]}
          />
        )}
        <View style={styles.transactionLeft}>
          <Text style={styles.category}>{categoryName}</Text>
          <Text style={styles.date}>{date.toLocaleDateString()}</Text>
          {item.note && <Text style={styles.note}>{item.note}</Text>}
        </View>
        <View style={styles.transactionRight}>
          <Text style={[styles.amount, isIncome ? styles.income : styles.expense]}>
            {isIncome ? '+' : '-'}${item.amount.toFixed(2)}
          </Text>
        </View>
      </Animated.View>
    </TouchableOpacity>
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
