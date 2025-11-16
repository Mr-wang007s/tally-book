/**
 * ListItem Component
 * 
 * Individual transaction list item with category, amount, date, and swipe actions
 */

import React, { useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated,
  PanResponder,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Transaction } from '../../models/Transaction';

export interface ListItemProps {
  transaction: Transaction;
  onPress?: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
  style?: ViewStyle;
}

export const ListItem: React.FC<ListItemProps> = ({
  transaction,
  onPress,
  onDelete,
  onEdit,
  style,
}) => {
  const { theme } = useTheme();
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (evt, { dx }) => Math.abs(dx) > 5,
      onPanResponderMove: (evt, { dx }) => {
        pan.x.setValue(Math.min(Math.max(dx, -80), 0));
      },
      onPanResponderRelease: (evt, { dx }) => {
        if (dx < -20) {
          Animated.timing(pan.x, {
            toValue: -80,
            duration: 200,
            useNativeDriver: false,
          }).start();
        } else {
          Animated.timing(pan.x, {
            toValue: 0,
            duration: 200,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  const categoryIcon = transaction.category?.charAt(0).toUpperCase() || '💰';
  const isIncome = transaction.type === 'income';
  const amountColor = isIncome ? theme.colors.success : theme.colors.error;
  const amountSign = isIncome ? '+' : '−';

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      overflow: 'hidden',
    },
    content: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 12,
      backgroundColor: theme.colors.surface,
    },
    categoryIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.background,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    categoryIconText: {
      fontSize: 18,
    },
    info: {
      flex: 1,
    },
    categoryName: {
      fontSize: 15,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 2,
    },
    transactionDate: {
      fontSize: 12,
      color: theme.colors.textSecondary,
    },
    amount: {
      fontSize: 15,
      fontWeight: '600',
      color: amountColor,
      textAlign: 'right',
      marginRight: 8,
    },
    actionContainer: {
      position: 'absolute',
      right: 0,
      top: 0,
      bottom: 0,
      width: 80,
      flexDirection: 'row',
    },
    actionButton: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    deleteButton: {
      backgroundColor: theme.colors.error,
    },
    editButton: {
      backgroundColor: theme.colors.warning,
    },
    actionIcon: {
      fontSize: 18,
      color: '#ffffff',
    },
  });

  const formatDate = (date: Date) => {
    const d = new Date(date);
    return d.toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Pressable onPress={onPress} style={styles.container}>
      <Animated.View
        style={[{ transform: [{ translateX: pan.x }] }]}
        {...panResponder.panHandlers}
      >
        <View style={[styles.content]}>
          <View style={styles.categoryIcon}>
            <Text style={styles.categoryIconText}>{categoryIcon}</Text>
          </View>
          <View style={styles.info}>
            <Text style={styles.categoryName}>{transaction.category}</Text>
            <Text style={styles.transactionDate}>
              {formatDate(transaction.date)}
            </Text>
          </View>
          <Text style={styles.amount}>
            {amountSign}¥{Math.abs(transaction.amount).toFixed(2)}
          </Text>
        </View>
      </Animated.View>

      <View style={styles.actionContainer}>
        {onEdit && (
          <Pressable
            style={[styles.actionButton, styles.editButton]}
            onPress={onEdit}
          >
            <Text style={styles.actionIcon}>✏</Text>
          </Pressable>
        )}
        {onDelete && (
          <Pressable
            style={[styles.actionButton, styles.deleteButton]}
            onPress={onDelete}
          >
            <Text style={styles.actionIcon}>🗑</Text>
          </Pressable>
        )}
      </View>
    </Pressable>
  );
};

ListItem.displayName = 'ListItem';
