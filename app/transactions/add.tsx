/**
 * Add Transaction Screen
 * Allows users to create new income/expense transactions
 */

import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { TransactionForm } from '@/components/TransactionForm';
import { Category } from '@/models/category';
import { CreateTransactionInput } from '@/models/transaction';
import { loadCategories, addTransaction } from '@/services/transactions';
import { colors } from '@/theme/tokens';
import { useTranslation } from '@/i18n/useTranslation';

export default function AddTransactionScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategoriesData();
  }, []);

  const loadCategoriesData = async () => {
    try {
      const cats = await loadCategories();
      setCategories(cats);
    } catch (error) {
      console.error('Error loading categories:', error);
      Alert.alert('Error', 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: CreateTransactionInput) => {
    try {
      const newTransaction = await addTransaction(data);
      
      // Trigger success haptic feedback
      try {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch (e) {
        // Haptics might not be available on all devices
        console.warn('Haptic feedback not available:', e);
      }
      
      // Navigate to transactions list with scroll and highlight params
      router.replace({
        pathname: '/transactions',
        params: {
          scrollToId: newTransaction.id,
          highlight: 'true',
        },
      });
    } catch (error) {
      console.error('Error adding transaction:', error);
      
      // Trigger error haptic feedback
      try {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      } catch (e) {
        console.warn('Haptic feedback not available:', e);
      }
      
      Alert.alert(
        t('common.error'),
        error instanceof Error ? error.message : t('messages.error.saveFailed')
      );
    }
  };

  if (loading) {
    return <View style={styles.container} />;
  }

  return (
    <ScrollView style={styles.container}>
      <TransactionForm categories={categories} onSubmit={handleSubmit} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
