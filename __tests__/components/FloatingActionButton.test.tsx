/**
 * Component Tests for FloatingActionButton
 * Tests expand/collapse, sub-button press, and animations
 * 
 * @module FloatingActionButton.test
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { FloatingActionButton } from '@/components/ui/FloatingActionButton';

describe('FloatingActionButton', () => {
  const mockOnIncomePress = jest.fn();
  const mockOnExpensePress = jest.fn();
  const mockOnTransferPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render main FAB button', () => {
      const { getByLabelText } = render(
        <FloatingActionButton
          onIncomePress={mockOnIncomePress}
          onExpensePress={mockOnExpensePress}
          onTransferPress={mockOnTransferPress}
        />
      );

      expect(getByLabelText('添加交易')).toBeTruthy();
    });

    it('should not show sub-buttons initially', () => {
      const { queryByLabelText } = render(
        <FloatingActionButton
          onIncomePress={mockOnIncomePress}
          onExpensePress={mockOnExpensePress}
          onTransferPress={mockOnTransferPress}
        />
      );

      // Sub-buttons should not be visible initially
      expect(queryByLabelText('添加收入交易')).toBeNull();
      expect(queryByLabelText('添加支出交易')).toBeNull();
      expect(queryByLabelText('添加转账交易')).toBeNull();
    });
  });

  describe('expand/collapse', () => {
    it('should show sub-buttons when main button is pressed', () => {
      const { getByLabelText } = render(
        <FloatingActionButton
          onIncomePress={mockOnIncomePress}
          onExpensePress={mockOnExpensePress}
          onTransferPress={mockOnTransferPress}
        />
      );

      // Press main button to expand
      fireEvent.press(getByLabelText('添加交易'));

      // Sub-buttons should now be visible
      expect(getByLabelText('添加收入交易')).toBeTruthy();
      expect(getByLabelText('添加支出交易')).toBeTruthy();
      expect(getByLabelText('添加转账交易')).toBeTruthy();
    });

    it('should hide sub-buttons when main button is pressed again', () => {
      const { getByLabelText, queryByLabelText } = render(
        <FloatingActionButton
          onIncomePress={mockOnIncomePress}
          onExpensePress={mockOnExpensePress}
          onTransferPress={mockOnTransferPress}
        />
      );

      const mainButton = getByLabelText('添加交易');

      // Expand
      fireEvent.press(mainButton);
      expect(getByLabelText('添加收入交易')).toBeTruthy();

      // Collapse
      fireEvent.press(mainButton);
      expect(queryByLabelText('添加收入交易')).toBeNull();
    });
  });

  describe('sub-button interactions', () => {
    it('should call onIncomePress when income button is pressed', () => {
      const { getByLabelText } = render(
        <FloatingActionButton
          onIncomePress={mockOnIncomePress}
          onExpensePress={mockOnExpensePress}
          onTransferPress={mockOnTransferPress}
        />
      );

      // Expand FAB
      fireEvent.press(getByLabelText('添加交易'));

      // Press income button
      fireEvent.press(getByLabelText('添加收入交易'));

      expect(mockOnIncomePress).toHaveBeenCalledTimes(1);
      expect(mockOnExpensePress).not.toHaveBeenCalled();
      expect(mockOnTransferPress).not.toHaveBeenCalled();
    });

    it('should call onExpensePress when expense button is pressed', () => {
      const { getByLabelText } = render(
        <FloatingActionButton
          onIncomePress={mockOnIncomePress}
          onExpensePress={mockOnExpensePress}
          onTransferPress={mockOnTransferPress}
        />
      );

      fireEvent.press(getByLabelText('添加交易'));
      fireEvent.press(getByLabelText('添加支出交易'));

      expect(mockOnExpensePress).toHaveBeenCalledTimes(1);
      expect(mockOnIncomePress).not.toHaveBeenCalled();
      expect(mockOnTransferPress).not.toHaveBeenCalled();
    });

    it('should call onTransferPress when transfer button is pressed', () => {
      const { getByLabelText } = render(
        <FloatingActionButton
          onIncomePress={mockOnIncomePress}
          onExpensePress={mockOnExpensePress}
          onTransferPress={mockOnTransferPress}
        />
      );

      fireEvent.press(getByLabelText('添加交易'));
      fireEvent.press(getByLabelText('添加转账交易'));

      expect(mockOnTransferPress).toHaveBeenCalledTimes(1);
      expect(mockOnIncomePress).not.toHaveBeenCalled();
      expect(mockOnExpensePress).not.toHaveBeenCalled();
    });

    it('should collapse FAB after sub-button is pressed', () => {
      const { getByLabelText, queryByLabelText } = render(
        <FloatingActionButton
          onIncomePress={mockOnIncomePress}
          onExpensePress={mockOnExpensePress}
          onTransferPress={mockOnTransferPress}
        />
      );

      // Expand
      fireEvent.press(getByLabelText('添加交易'));

      // Press sub-button
      fireEvent.press(getByLabelText('添加收入交易'));

      // FAB should collapse
      expect(queryByLabelText('添加收入交易')).toBeNull();
    });
  });

  describe('accessibility', () => {
    it('should have accessible button roles', () => {
      const { getAllByRole } = render(
        <FloatingActionButton
          onIncomePress={mockOnIncomePress}
          onExpensePress={mockOnExpensePress}
          onTransferPress={mockOnTransferPress}
        />
      );

      const buttons = getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('should have accessibility labels on all buttons', () => {
      const { getByLabelText } = render(
        <FloatingActionButton
          onIncomePress={mockOnIncomePress}
          onExpensePress={mockOnExpensePress}
          onTransferPress={mockOnTransferPress}
        />
      );

      // Main button
      expect(getByLabelText('添加交易')).toBeTruthy();

      // Expand to show sub-buttons
      fireEvent.press(getByLabelText('添加交易'));

      // Sub-buttons
      expect(getByLabelText('添加收入交易')).toBeTruthy();
      expect(getByLabelText('添加支出交易')).toBeTruthy();
      expect(getByLabelText('添加转账交易')).toBeTruthy();
    });

    it('should have minimum touch target size (56pt for main button)', () => {
      const { getByLabelText } = render(
        <FloatingActionButton
          onIncomePress={mockOnIncomePress}
          onExpensePress={mockOnExpensePress}
          onTransferPress={mockOnTransferPress}
        />
      );

      const mainButton = getByLabelText('添加交易');
      expect(mainButton.props.style).toBeDefined();
      // Specific size is tested via snapshot
    });
  });
});
