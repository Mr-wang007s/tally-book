/**
 * ModalLayout Component
 * 
 * Modal/sheet layout with header, content, and actions
 * Used for forms, filters, and bottom sheets
 */

import React from 'react';
import {
  View,
  Text,
  Pressable,
  Modal,
  StyleSheet,
  ViewStyle,
  ScrollView,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export interface ModalLayoutProps {
  visible: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  actions?: Array<{
    label: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'destructive';
  }>;
  scrollable?: boolean;
  style?: ViewStyle;
}

export const ModalLayout: React.FC<ModalLayoutProps> = ({
  visible,
  title,
  children,
  onClose,
  actions,
  scrollable = true,
  style,
}) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'flex-end',
    },
    modal: {
      backgroundColor: theme.colors.surface,
      borderTopLeftRadius: theme.borderRadius.lg,
      borderTopRightRadius: theme.borderRadius.lg,
      maxHeight: '90%',
      paddingBottom: 20,
    },
    header: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    title: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.colors.text,
    },
    closeButton: {
      padding: 4,
    },
    closeIcon: {
      fontSize: 24,
      color: theme.colors.textSecondary,
    },
    content: {
      paddingHorizontal: 16,
      paddingVertical: 16,
    },
    actions: {
      paddingHorizontal: 16,
      paddingTop: 12,
      gap: 8,
    },
    actionButton: {
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
    },
    primaryAction: {
      backgroundColor: theme.colors.primary,
    },
    secondaryAction: {
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    destructiveAction: {
      backgroundColor: theme.colors.error,
    },
    actionText: {
      fontSize: 15,
      fontWeight: '600',
    },
    primaryText: {
      color: '#ffffff',
    },
    secondaryText: {
      color: theme.colors.text,
    },
    destructiveText: {
      color: '#ffffff',
    },
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.modal, style]}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <Pressable style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeIcon}>×</Text>
            </Pressable>
          </View>

          {scrollable ? (
            <ScrollView style={styles.content}>
              {children}
            </ScrollView>
          ) : (
            <View style={styles.content}>
              {children}
            </View>
          )}

          {actions && actions.length > 0 && (
            <View style={styles.actions}>
              {actions.map((action, index) => {
                const isDestructive = action.variant === 'destructive';
                const isPrimary = action.variant === 'primary';
                const buttonStyle =
                  action.variant === 'destructive'
                    ? styles.destructiveAction
                    : action.variant === 'primary'
                    ? styles.primaryAction
                    : styles.secondaryAction;
                const textStyle =
                  action.variant === 'destructive'
                    ? styles.destructiveText
                    : action.variant === 'primary'
                    ? styles.primaryText
                    : styles.secondaryText;

                return (
                  <Pressable
                    key={index}
                    style={[styles.actionButton, buttonStyle]}
                    onPress={() => {
                      action.onPress();
                      onClose();
                    }}
                  >
                    <Text style={[styles.actionText, textStyle]}>
                      {action.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

ModalLayout.displayName = 'ModalLayout';
