/**
 * Confirm Component
 * Simple confirmation dialog wrapper using Alert API
 */

import { Alert } from 'react-native';

export interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel?: () => void;
}

/**
 * Show a confirmation dialog
 */
export function showConfirm({
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  destructive = false,
  onConfirm,
  onCancel,
}: ConfirmOptions): void {
  Alert.alert(
    title,
    message,
    [
      {
        text: cancelText,
        style: 'cancel',
        onPress: onCancel,
      },
      {
        text: confirmText,
        style: destructive ? 'destructive' : 'default',
        onPress: onConfirm,
      },
    ],
    { cancelable: true }
  );
}

/**
 * Show a delete confirmation dialog
 */
export function showDeleteConfirm(itemName: string, onConfirm: () => void): void {
  showConfirm({
    title: 'Delete Transaction',
    message: `Are you sure you want to delete this ${itemName}? This action cannot be undone.`,
    confirmText: 'Delete',
    cancelText: 'Cancel',
    destructive: true,
    onConfirm,
  });
}
