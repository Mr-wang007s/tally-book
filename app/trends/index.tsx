/**
 * Trends Screen
 * Shows expense trends over time and category breakdown
 */

import React, { useState, useCallback } from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { TrendControls } from '@/components/TrendControls';
import { ChartContainer } from '@/components/ChartContainer';
import { TimeSeries } from '@/components/charts/TimeSeries';
import { CategoryPie } from '@/components/charts/CategoryPie';
import { EmptyState } from '@/components/EmptyStates';
import { Granularity, TrendPoint, CategoryBreakdown } from '@/models/trend';
import { Period } from '@/models/summary';
import { loadTransactions, loadCategories } from '@/services/transactions';
import { calculateTimeSeries, calculateCategoryBreakdown } from '@/services/aggregates';
import { colors, spacing, typography } from '@/theme/tokens';
import { useTranslation } from '@/i18n/useTranslation';

export default function TrendsScreen() {
  const { t } = useTranslation();
  const [granularity, setGranularity] = useState<Granularity>('month');
  const [trendData, setTrendData] = useState<TrendPoint[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryBreakdown[]>([]);
  const [hasTransactions, setHasTransactions] = useState(false);
  const period: Period = (() => {
    const end = new Date();
    const start = new Date();
    start.setMonth(start.getMonth() - 6); // Last 6 months
    return {
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0],
    };
  })();

  const loadTrendsCallback = useCallback(() => {
    loadTrends();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [granularity, period]);

  useFocusEffect(loadTrendsCallback);

  const loadTrends = async () => {
    try {
      const [transactions, categories] = await Promise.all([
        loadTransactions(),
        loadCategories(),
      ]);

      setHasTransactions(transactions.length > 0);

      if (transactions.length === 0) {
        setTrendData([]);
        setCategoryData([]);
        return;
      }

      // Calculate time series
      const timeSeries = calculateTimeSeries(transactions, period, granularity);
      setTrendData(timeSeries);

      // Calculate category breakdown for expenses
      const breakdown = calculateCategoryBreakdown(transactions, categories, period, 'expense');
      setCategoryData(breakdown);
    } catch (error) {
      console.error('Error loading trends:', error);
    }
  };

  const handleGranularityChange = (newGranularity: Granularity) => {
    setGranularity(newGranularity);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{t('trends.title')}</Text>

        {!hasTransactions ? (
          <EmptyState
            title={t('messages.info.noTransactionsFound')}
            message={t('home.empty')}
            actionLabel={t('transactions.title')}
            onAction={() => {}}
          />
        ) : (
          <>
            <TrendControls
              granularity={granularity}
              onGranularityChange={handleGranularityChange}
            />

            <ChartContainer
              title={t('trends.totalExpense')}
              subtitle={`${t('trends.last3Months')} ${t('trends.byTime')} ${granularity === 'month' ? t('trends.monthly') : granularity === 'weekly' ? t('trends.weekly') : t('trends.daily')}`}
              accessibilityLabel={t('trends.totalExpense')}
            >
              <TimeSeries data={trendData} type="expense" />
            </ChartContainer>

            <ChartContainer
              title={t('trends.expenseByCategory')}
              subtitle={t('trends.byCategory')}
              accessibilityLabel={t('trends.expenseByCategory')}
            >
              <CategoryPie data={categoryData} type="expense" />
            </ChartContainer>

            <View style={styles.periodInfo}>
              <Text style={styles.periodText}>
                {t('trends.period')}: {new Date(period.start).toLocaleDateString()} {t('common.to')}{' '}
                {new Date(period.end).toLocaleDateString()}
              </Text>
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.md,
  },
  title: {
    ...typography.largeTitle,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  periodInfo: {
    marginTop: spacing.lg,
    padding: spacing.md,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 8,
  },
  periodText: {
    ...typography.caption1,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
