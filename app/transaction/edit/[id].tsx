/**
 * Transaction Edit Screen
 * 
 * Expo Router dynamic route for editing transactions
 * Path: /transaction/edit/[id]
 * 
 * @module TransactionEditScreen
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet,
  useColorScheme,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { TransactionEditForm } from '@/components/features/TransactionEditForm';
import { useTransactionCRUD } from '@/hooks/useTransactionCRUD';
import * as storageService from '@/services/transactionStorage';
import type {
  Account,
  Category,
  CreateTransactionInput,
  UpdateTransactionInput,
} from '@/types/transaction';

export default function TransactionEditScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const {
    getTransaction,
    updateTransaction,
    isLoading: isCRUDLoading,
  } = useTransactionCRUD();

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Load accounts and categories
  useEffect(() => {
    async function loadData() {
      try {
        const [accountsList, categoriesList] = await Promise.all([
          storageService.loadAccounts(),
          storageService.loadCategories(),
        ]);

        setAccounts(accountsList);
        setCategories(categoriesList);
      } catch (error) {
        console.error('[TransactionEditScreen] Failed to load data:', error);
      } finally {
        setIsLoadingData(false);
      }
    }

    loadData();
  }, []);

  // Get transaction
  const transaction = useMemo(() => {
    if (!id || typeof id !== 'string') return undefined;
    return getTransaction(id);
  }, [id, getTransaction]);

  // Handlers
  const handleSubmit = async (input: CreateTransactionInput | UpdateTransactionInput) => {
    setIsSaving(true);
    try {
      await updateTransaction(input as UpdateTransactionInput);
      router.back();
    } catch (error) {
      console.error('[TransactionEditScreen] Failed to update transaction:', error);
      throw error; // Re-throw to let form handle error display
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  const colors = {
    background: isDark ? '#000000' : '#FFFFFF',
  };

  // Loading state
  if (isLoadingData || isCRUDLoading) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
        edges={['top', 'left', 'right']}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
        </View>
      </SafeAreaView>
    );
  }

  // Transaction not found
  if (!transaction) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
        edges={['top', 'left', 'right']}
      >
        <View style={styles.loadingContainer}>
          {/* TODO: Show error message */}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top', 'left', 'right']}
    >
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <TransactionEditForm
          transaction={transaction}
          accounts={accounts}
          categories={categories}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isSaving}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
