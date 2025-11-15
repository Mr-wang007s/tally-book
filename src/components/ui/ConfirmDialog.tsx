/**
 * Confirm Dialog Component
 * 
 * A reusable confirmation dialog with customizable title, message, and buttons.
 * Supports Light/Dark Mode and accessibility features.
 * 
 * @module ConfirmDialog
 */

import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
} from 'react-native';

interface ConfirmDialogProps {
  /** Whether the dialog is visible */
  visible: boolean;
  
  /** Dialog title */
  title: string;
  
  /** Dialog message/description */
  message: string;
  
  /** Confirm button text (default: "确认") */
  confirmText?: string;
  
  /** Cancel button text (default: "取消") */
  cancelText?: string;
  
  /** Callback when confirm button is pressed */
  onConfirm: () => void;
  
  /** Callback when cancel button is pressed */
  onCancel: () => void;
  
  /** Whether the confirm action is destructive (uses red color) */
  destructive?: boolean;
}

export function ConfirmDialog({
  visible,
  title,
  message,
  confirmText = '确认',
  cancelText = '取消',
  onConfirm,
  onCancel,
  destructive = false,
}: ConfirmDialogProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const colors = {
    background: isDark ? '#1C1C1E' : '#FFFFFF',
    text: isDark ? '#FFFFFF' : '#000000',
    secondaryText: isDark ? '#AEAEB2' : '#6C6C70',
    separator: isDark ? '#38383A' : '#E5E5EA',
    confirm: destructive ? '#FF3B30' : '#007AFF',
    cancel: '#007AFF',
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={[styles.dialog, { backgroundColor: colors.background }]}>
          {/* Title */}
          <Text
            style={[styles.title, { color: colors.text }]}
            accessibilityRole="header"
          >
            {title}
          </Text>

          {/* Message */}
          <Text
            style={[styles.message, { color: colors.secondaryText }]}
            accessibilityLabel={message}
          >
            {message}
          </Text>

          {/* Separator */}
          <View style={[styles.separator, { backgroundColor: colors.separator }]} />

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            {/* Cancel Button */}
            <TouchableOpacity
              style={[styles.button, styles.buttonLeft]}
              onPress={onCancel}
              accessibilityRole="button"
              accessibilityLabel={cancelText}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={[styles.buttonText, { color: colors.cancel }]}>
                {cancelText}
              </Text>
            </TouchableOpacity>

            {/* Vertical Separator */}
            <View style={[styles.verticalSeparator, { backgroundColor: colors.separator }]} />

            {/* Confirm Button */}
            <TouchableOpacity
              style={[styles.button, styles.buttonRight]}
              onPress={onConfirm}
              accessibilityRole="button"
              accessibilityLabel={confirmText}
              accessibilityHint={destructive ? "This action cannot be undone" : undefined}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text
                style={[
                  styles.buttonText,
                  styles.confirmButtonText,
                  { color: colors.confirm },
                ]}
              >
                {confirmText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  dialog: {
    width: '100%',
    maxWidth: 320,
    borderRadius: 14,
    overflow: 'hidden',
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  message: {
    fontSize: 13,
    textAlign: 'center',
    paddingTop: 8,
    paddingHorizontal: 16,
    paddingBottom: 20,
    lineHeight: 18,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
  },
  buttonContainer: {
    flexDirection: 'row',
    height: 44,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 44, // Accessibility: ensure touch target ≥44pt
  },
  buttonLeft: {
    // Left button styling (if needed)
  },
  buttonRight: {
    // Right button styling (if needed)
  },
  verticalSeparator: {
    width: StyleSheet.hairlineWidth,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '400',
  },
  confirmButtonText: {
    fontWeight: '600',
  },
});
