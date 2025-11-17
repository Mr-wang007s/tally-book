/**
 * Summary Screen
 * Displays total income, expense, and balance for selected period
 */

import React, { useState, useCallback } from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { SummaryCards } from '@/components/SummaryCards';
import { PeriodFilter } from '@/components/PeriodFilter';
import { EmptyState } from '@/components/EmptyStates';
import { Summary, Period } from '@/models/summary';
import { loadTransactions } from '@/services/transactions';
import { calculateSummary } from '@/services/aggregates';
import { colors, spacing, typography } from '@/theme/tokens';
import { useTranslation } from '@/i18n/useTranslation';

export default function SummaryScreen() {
  const { t } = useTranslation();
  const [summary, setSummary] = useState<Summary | null>(null);
  const [period, setPeriod] = useState<Period>(() => {
    const now = new Date();
    return {
      start: new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0],
      end: new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0],
    };
  });
  const [hasTransactions, setHasTransactions] = useState(false);

  const loadSummaryCallback = useCallback(() => {
    loadSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period]);

  useFocusEffect(loadSummaryCallback);

  const loadSummary = async () => {
    try {
      const transactions = await loadTransactions();
      setHasTransactions(transactions.length > 0);

      if (transactions.length === 0) {
        setSummary(null);
        return;
      }

      const summaryData = calculateSummary(transactions, period);
      setSummary(summaryData);
    } catch (error) {
      console.error('Error loading summary:', error);
    }
  };

  const handlePeriodChange = (newPeriod: Period) => {
    setPeriod(newPeriod);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{t('summary.title')}</Text>

        <PeriodFilter onPeriodChange={handlePeriodChange} initialType="month" />

        {!hasTransactions ? (
          <EmptyState
            title={t('messages.info.noTransactionsFound')}
            message={t('home.empty')}
            actionLabel={t('transactions.title')}
            onAction={() => {}}
          />
        ) : summary ? (
          <>
            <SummaryCards summary={summary} />
            <View style={styles.periodInfo}>
              <Text style={styles.periodText}>
                {t('summary.period')}: {new Date(period.start).toLocaleDateString()} -{' '}
                {new Date(period.end).toLocaleDateString()}
              </Text>
            </View>
          </>
        ) : (
          <EmptyState
            title={t('summary.empty')}
            message={t('summary.empty')}
          />
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
