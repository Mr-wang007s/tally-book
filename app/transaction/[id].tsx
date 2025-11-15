/**
 * Transaction Detail Screen
 * 
 * Expo Router dynamic route for viewing transaction details
 * Path: /transaction/[id]
 * 
 * @module TransactionDetailScreen
 */

import React, { useState, useEffect, useMemo } from 'react';
import { View, ActivityIndicator, StyleSheet, useColorScheme, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { TransactionDetailView } from '@/components/features/TransactionDetailView';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useTransactionCRUD } from '@/hooks/useTransactionCRUD';
import * as storageService from '@/services/transactionStorage';
import type { Account, Category } from '@/types/transaction';

export default function TransactionDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const {
    getTransaction,
    deleteTransaction,
    isLoading: isCRUDLoading,
  } = useTransactionCRUD();

  const [accounts, setAccounts] = useState<Record<string, Account>>({});
  const [categories, setCategories] = useState<Record<string, Category>>({});
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Load accounts and categories
  useEffect(() => {
    async function loadData() {
      try {
        const [accountsList, categoriesList] = await Promise.all([
          storageService.loadAccounts(),
          storageService.loadCategories(),
        ]);

        // Convert arrays to maps
        const accountsMap = accountsList.reduce((acc, account) => {
          acc[account.id] = account;
          return acc;
        }, {} as Record<string, Account>);

        const categoriesMap = categoriesList.reduce((acc, category) => {
          acc[category.id] = category;
          return acc;
        }, {} as Record<string, Category>);

        setAccounts(accountsMap);
        setCategories(categoriesMap);
      } catch (error) {
        console.error('[TransactionDetailScreen] Failed to load data:', error);
      } finally {
        setIsLoadingData(false);
      }
    }

    loadData();
  }, []);

  // Get transaction
  const transaction = useMemo(() => {
    if (!id || typeof id !== 'string') return null;
    return getTransaction(id);
  }, [id, getTransaction]);

  // Handlers
  const handleEdit = () => {
    if (!id) return;
    router.push(`/transaction/edit/${id}`);
  };

  const handleDeletePress = () => {
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!id || typeof id !== 'string') return;

    try {
      await deleteTransaction(id);
      setShowDeleteDialog(false);
      // Navigate back to list - the list will auto-refresh via React Navigation focus listener
      router.back();
    } catch (error) {
      console.error('[TransactionDetailScreen] Failed to delete transaction:', error);
      setShowDeleteDialog(false);
      // Show error alert
      Alert.alert(
        '删除失败',
        '无法删除交易，请稍后重试。',
        [{ text: '确定', style: 'default' }]
      );
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteDialog(false);
  };

  const handleBack = () => {
    router.back();
  };

  const handleAttachmentPress = (uri: string, index: number) => {
    // TODO: Open image viewer modal
    console.log('View attachment:', uri, index);
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
      <TransactionDetailView
        transaction={transaction}
        accounts={accounts}
        categories={categories}
        onEdit={handleEdit}
        onDelete={handleDeletePress}
        onBack={handleBack}
        onAttachmentPress={handleAttachmentPress}
      />

      <ConfirmDialog
        visible={showDeleteDialog}
        title="删除交易"
        message="确定要删除这笔交易吗?此操作无法撤销。"
        confirmText="删除"
        cancelText="取消"
        destructive
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
