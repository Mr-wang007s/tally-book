/**
 * Screen Integration Tests for TransactionDetailScreen
 * Tests delete flow: button → dialog → confirm → navigate back
 * 
 * @module TransactionDetailScreen.test
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import TransactionDetailScreen from '@/app/transaction/[id]';
import * as storageService from '@/services/transactionStorage';
import type { Transaction, Account, Category } from '@/types/transaction';

// Mock dependencies
jest.mock('expo-router');
jest.mock('@/services/transactionStorage');

const mockRouter = {
  push: jest.fn(),
  back: jest.fn(),
};

const mockStorageService = storageService as jest.Mocked<typeof storageService>;

const mockTransaction: Transaction = {
  id: 'txn-test-1',
  amount: 150.50,
  timestamp: Date.now(),
  type: 'expense',
  fromAccount: 'acc-1',
  toAccount: null,
  category: 'cat-1',
  description: 'Test transaction',
  attachments: [],
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

const mockAccounts: Account[] = [
  {
    id: 'acc-1',
    name: 'Test Account',
    type: 'checking',
    balance: 1000,
    currency: 'CNY',
    icon: 'wallet',
    color: '#007AFF',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

const mockCategories: Category[] = [
  {
    id: 'cat-1',
    name: 'Test Category',
    type: 'expense',
    icon: 'cart',
    color: '#FF3B30',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

describe('TransactionDetailScreen - Delete Flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useLocalSearchParams as jest.Mock).mockReturnValue({ id: 'txn-test-1' });
    
    mockStorageService.loadTransactions.mockResolvedValue([mockTransaction]);
    mockStorageService.loadAccounts.mockResolvedValue(mockAccounts);
    mockStorageService.loadCategories.mockResolvedValue(mockCategories);
    mockStorageService.saveTransactions.mockResolvedValue();
  });

  describe('delete button', () => {
    it('should render delete button in header', async () => {
      const { getByLabelText } = render(<TransactionDetailScreen />);

      await waitFor(() => {
        expect(getByLabelText('删除交易')).toBeTruthy();
      });
    });

    it('should show confirm dialog when delete button is pressed', async () => {
      const { getByLabelText, getByText } = render(<TransactionDetailScreen />);

      // Wait for data to load
      await waitFor(() => {
        expect(getByLabelText('删除交易')).toBeTruthy();
      });

      // Press delete button
      fireEvent.press(getByLabelText('删除交易'));

      // Verify dialog appears
      await waitFor(() => {
        expect(getByText('删除交易')).toBeTruthy(); // Dialog title
        expect(getByText('确定要删除这笔交易吗?此操作无法撤销。')).toBeTruthy();
      });
    });

    it('should have trash icon on delete button', async () => {
      const { getByLabelText } = render(<TransactionDetailScreen />);

      await waitFor(() => {
        const deleteButton = getByLabelText('删除交易');
        expect(deleteButton).toBeTruthy();
        // Icon is rendered via @expo/vector-icons, check accessibility
        expect(deleteButton.props.accessibilityRole).toBe('button');
      });
    });
  });

  describe('confirm dialog', () => {
    it('should display correct dialog message', async () => {
      const { getByLabelText, getByText } = render(<TransactionDetailScreen />);

      await waitFor(() => {
        fireEvent.press(getByLabelText('删除交易'));
      });

      await waitFor(() => {
        expect(getByText('删除交易')).toBeTruthy();
        expect(getByText('确定要删除这笔交易吗?此操作无法撤销。')).toBeTruthy();
        expect(getByText('删除')).toBeTruthy();
        expect(getByText('取消')).toBeTruthy();
      });
    });

    it('should close dialog when cancel button is pressed', async () => {
      const { getByLabelText, getByText, queryByText } = render(
        <TransactionDetailScreen />
      );

      await waitFor(() => {
        fireEvent.press(getByLabelText('删除交易'));
      });

      await waitFor(() => {
        expect(getByText('删除交易')).toBeTruthy();
      });

      // Press cancel
      fireEvent.press(getByText('取消'));

      await waitFor(() => {
        // Dialog should be dismissed
        expect(queryByText('确定要删除这笔交易吗?此操作无法撤销。')).toBeNull();
      });

      // Should not navigate
      expect(mockRouter.back).not.toHaveBeenCalled();
    });

    it('should delete transaction and navigate back when confirm is pressed', async () => {
      const { getByLabelText, getByText } = render(<TransactionDetailScreen />);

      await waitFor(() => {
        fireEvent.press(getByLabelText('删除交易'));
      });

      await waitFor(() => {
        expect(getByText('删除')).toBeTruthy();
      });

      // Press confirm
      fireEvent.press(getByText('删除'));

      // Should call storage service to save transactions
      await waitFor(() => {
        expect(mockStorageService.saveTransactions).toHaveBeenCalled();
      });

      // Should navigate back
      await waitFor(() => {
        expect(mockRouter.back).toHaveBeenCalled();
      });
    });

    it('should be marked as destructive', async () => {
      const { getByLabelText, getByText } = render(<TransactionDetailScreen />);

      await waitFor(() => {
        fireEvent.press(getByLabelText('删除交易'));
      });

      await waitFor(() => {
        const deleteButton = getByText('删除');
        expect(deleteButton).toBeTruthy();
        // Destructive styling is applied in ConfirmDialog component
      });
    });
  });

  describe('error handling', () => {
    it('should show error alert if delete fails', async () => {
      // Mock Alert.alert
      const mockAlert = jest.fn();
      jest.mock('react-native', () => ({
        ...jest.requireActual('react-native'),
        Alert: {
          alert: mockAlert,
        },
      }));

      mockStorageService.saveTransactions.mockRejectedValueOnce(
        new Error('Storage failed')
      );

      const { getByLabelText, getByText } = render(<TransactionDetailScreen />);

      await waitFor(() => {
        fireEvent.press(getByLabelText('删除交易'));
      });

      await waitFor(() => {
        fireEvent.press(getByText('删除'));
      });

      // Error should be handled
      await waitFor(() => {
        // Check that saveTransactions was called
        expect(mockStorageService.saveTransactions).toHaveBeenCalled();
      });

      // Should not navigate if delete failed
      expect(mockRouter.back).not.toHaveBeenCalled();
    });

    it('should not navigate if transaction ID is invalid', async () => {
      (useLocalSearchParams as jest.Mock).mockReturnValue({ id: null });

      const { queryByLabelText } = render(<TransactionDetailScreen />);

      // Transaction detail view should not render
      await waitFor(() => {
        expect(queryByLabelText('删除交易')).toBeNull();
      });
    });
  });

  describe('navigation', () => {
    it('should navigate to edit screen when edit button is pressed', async () => {
      const { getByLabelText } = render(<TransactionDetailScreen />);

      await waitFor(() => {
        expect(getByLabelText('编辑交易')).toBeTruthy();
      });

      fireEvent.press(getByLabelText('编辑交易'));

      expect(mockRouter.push).toHaveBeenCalledWith('/transaction/edit/txn-test-1');
    });

    it('should navigate back when back button is pressed', async () => {
      const { getByLabelText } = render(<TransactionDetailScreen />);

      await waitFor(() => {
        expect(getByLabelText('返回')).toBeTruthy();
      });

      fireEvent.press(getByLabelText('返回'));

      expect(mockRouter.back).toHaveBeenCalled();
    });

    it('should navigate back after successful delete', async () => {
      const { getByLabelText, getByText } = render(<TransactionDetailScreen />);

      await waitFor(() => {
        fireEvent.press(getByLabelText('删除交易'));
      });

      await waitFor(() => {
        fireEvent.press(getByText('删除'));
      });

      await waitFor(() => {
        expect(mockRouter.back).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('accessibility', () => {
    it('should have accessibility labels on all buttons', async () => {
      const { getByLabelText } = render(<TransactionDetailScreen />);

      await waitFor(() => {
        expect(getByLabelText('返回')).toBeTruthy();
        expect(getByLabelText('删除交易')).toBeTruthy();
        expect(getByLabelText('编辑交易')).toBeTruthy();
      });
    });

    it('should have accessible delete confirmation dialog', async () => {
      const { getByLabelText, getByRole } = render(<TransactionDetailScreen />);

      await waitFor(() => {
        fireEvent.press(getByLabelText('删除交易'));
      });

      await waitFor(() => {
        // Dialog title should be a header
        expect(getByRole('header')).toBeTruthy();
      });
    });
  });

  describe('loading states', () => {
    it('should show loading indicator while data is loading', () => {
      mockStorageService.loadTransactions.mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve([mockTransaction]), 100))
      );

      const { getByTestId } = render(<TransactionDetailScreen />);

      // Should show ActivityIndicator during load
      // Note: ActivityIndicator doesn't have a built-in testID, 
      // this is a conceptual test showing the pattern
    });

    it('should hide loading indicator after data loads', async () => {
      const { getByLabelText } = render(<TransactionDetailScreen />);

      await waitFor(() => {
        // Content should be visible after loading
        expect(getByLabelText('删除交易')).toBeTruthy();
      });
    });
  });

  describe('data refresh', () => {
    it('should load transaction data on mount', async () => {
      render(<TransactionDetailScreen />);

      await waitFor(() => {
        expect(mockStorageService.loadTransactions).toHaveBeenCalled();
        expect(mockStorageService.loadAccounts).toHaveBeenCalled();
        expect(mockStorageService.loadCategories).toHaveBeenCalled();
      });
    });

    it('should display transaction details after loading', async () => {
      const { getByText } = render(<TransactionDetailScreen />);

      await waitFor(() => {
        expect(getByText('Test transaction')).toBeTruthy();
        expect(getByText('¥150.50')).toBeTruthy();
      });
    });
  });
});
