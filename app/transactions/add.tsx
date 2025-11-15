/**
 * Add Transaction Screen
 * Allows users to create new income/expense transactions
 */

import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { TransactionForm } from '@/components/TransactionForm';
import { Category } from '@/models/category';
import { CreateTransactionInput } from '@/models/transaction';
import { loadCategories, addTransaction } from '@/services/transactions';
import { colors } from '@/theme/tokens';

export default function AddTransactionScreen() {
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
      await addTransaction(data);
      Alert.alert('Success', 'Transaction added successfully', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      console.error('Error adding transaction:', error);
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to add transaction');
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
