/**
 * Component Tests for FilterBottomSheet
 * Tests filter criteria selection, Apply, Reset, and dismiss functionality
 * 
 * @module FilterBottomSheet.test
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { FilterBottomSheet } from '@/components/features/FilterBottomSheet';
import type { FilterCriteria, Category } from '@/types/transaction';

// Mock @gorhom/bottom-sheet
jest.mock('@gorhom/bottom-sheet', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: ({ children }: any) => <>{children}</>,
    BottomSheetScrollView: ({ children }: any) => <>{children}</>,
  };
});

describe('FilterBottomSheet', () => {
  const mockCategories: Category[] = [
    {
      id: 'cat-1',
      name: 'Shopping',
      icon: 'cart',
      color: '#FF3B30',
      type: 'expense',
    },
    {
      id: 'cat-2',
      name: 'Food',
      icon: 'restaurant',
      color: '#34C759',
      type: 'expense',
    },
  ];

  const defaultFilterCriteria: FilterCriteria = {
    typeFilter: null,
    sortBy: 'newest',
    selectedCategories: [],
  };

  const mockOnApply = jest.fn();
  const mockOnReset = jest.fn();
  const mockOnDismiss = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render when visible', () => {
      const { getByText } = render(
        <FilterBottomSheet
          filterCriteria={defaultFilterCriteria}
          categories={mockCategories}
          onApply={mockOnApply}
          onReset={mockOnReset}
          onDismiss={mockOnDismiss}
          isVisible={true}
        />
      );

      expect(getByText('Apply')).toBeTruthy();
      expect(getByText('Reset')).toBeTruthy();
    });

    it('should render type filter options', () => {
      const { getByText } = render(
        <FilterBottomSheet
          filterCriteria={defaultFilterCriteria}
          categories={mockCategories}
          onApply={mockOnApply}
          onReset={mockOnReset}
          onDismiss={mockOnDismiss}
          isVisible={true}
        />
      );

      expect(getByText('All')).toBeTruthy();
      expect(getByText('Income')).toBeTruthy();
      expect(getByText('Expense')).toBeTruthy();
      expect(getByText('Transfer')).toBeTruthy();
    });

    it('should render sort options', () => {
      const { getByText } = render(
        <FilterBottomSheet
          filterCriteria={defaultFilterCriteria}
          categories={mockCategories}
          onApply={mockOnApply}
          onReset={mockOnReset}
          onDismiss={mockOnDismiss}
          isVisible={true}
        />
      );

      expect(getByText('Highest')).toBeTruthy();
      expect(getByText('Lowest')).toBeTruthy();
      expect(getByText('Newest')).toBeTruthy();
      expect(getByText('Oldest')).toBeTruthy();
    });
  });

  describe('Apply functionality', () => {
    it('should call onApply with updated criteria when Apply is pressed', () => {
      const { getByText } = render(
        <FilterBottomSheet
          filterCriteria={defaultFilterCriteria}
          categories={mockCategories}
          onApply={mockOnApply}
          onReset={mockOnReset}
          onDismiss={mockOnDismiss}
          isVisible={true}
        />
      );

      // Select Expense type
      fireEvent.press(getByText('Expense'));

      // Select Highest sort
      fireEvent.press(getByText('Highest'));

      // Press Apply
      fireEvent.press(getByText('Apply'));

      expect(mockOnApply).toHaveBeenCalledWith(
        expect.objectContaining({
          typeFilter: 'expense',
          sortBy: 'highest',
        })
      );
    });

    it('should close bottom sheet after Apply', () => {
      const { getByText } = render(
        <FilterBottomSheet
          filterCriteria={defaultFilterCriteria}
          categories={mockCategories}
          onApply={mockOnApply}
          onReset={mockOnReset}
          onDismiss={mockOnDismiss}
          isVisible={true}
        />
      );

      fireEvent.press(getByText('Apply'));

      expect(mockOnDismiss).toHaveBeenCalled();
    });
  });

  describe('Reset functionality', () => {
    it('should call onReset when Reset button is pressed', () => {
      const { getByText } = render(
        <FilterBottomSheet
          filterCriteria={{
            typeFilter: 'expense',
            sortBy: 'highest',
            selectedCategories: ['cat-1'],
          }}
          categories={mockCategories}
          onApply={mockOnApply}
          onReset={mockOnReset}
          onDismiss={mockOnDismiss}
          isVisible={true}
        />
      );

      fireEvent.press(getByText('Reset'));

      expect(mockOnReset).toHaveBeenCalled();
    });

    it('should close bottom sheet after Reset', () => {
      const { getByText } = render(
        <FilterBottomSheet
          filterCriteria={defaultFilterCriteria}
          categories={mockCategories}
          onApply={mockOnApply}
          onReset={mockOnReset}
          onDismiss={mockOnDismiss}
          isVisible={true}
        />
      );

      fireEvent.press(getByText('Reset'));

      expect(mockOnDismiss).toHaveBeenCalled();
    });
  });

  describe('accessibility', () => {
    it('should have accessible button roles', () => {
      const { getByRole } = render(
        <FilterBottomSheet
          filterCriteria={defaultFilterCriteria}
          categories={mockCategories}
          onApply={mockOnApply}
          onReset={mockOnReset}
          onDismiss={mockOnDismiss}
          isVisible={true}
        />
      );

      expect(getByRole('button')).toBeTruthy();
    });

    it('should have accessibility labels', () => {
      const { getByLabelText } = render(
        <FilterBottomSheet
          filterCriteria={defaultFilterCriteria}
          categories={mockCategories}
          onApply={mockOnApply}
          onReset={mockOnReset}
          onDismiss={mockOnDismiss}
          isVisible={true}
        />
      );

      expect(getByLabelText('Apply')).toBeTruthy();
      expect(getByLabelText('Reset')).toBeTruthy();
    });
  });
});
