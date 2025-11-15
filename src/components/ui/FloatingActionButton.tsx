/**
 * FloatingActionButton (FAB) Component
 * 
 * Animated FAB with expandable sub-buttons for quick transaction creation
 * Uses Reanimated 3 for 60fps animations
 * 
 * @module FloatingActionButton
 */

import React, { useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  useColorScheme,
  Pressable,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFABAnimation } from '@/hooks/useFABAnimation';
import type { FloatingActionButtonProps } from '@/types/transaction';

export function FloatingActionButton({
  onIncomePress,
  onExpensePress,
  onTransferPress,
  isExpanded: controlledExpanded,
  onExpandChange,
}: FloatingActionButtonProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const insets = useSafeAreaInsets();

  const {
    isExpanded,
    toggleExpanded,
    mainButtonStyle,
    subButtonStyles,
  } = useFABAnimation();

  const colors = {
    fabPrimary: isDark ? '#5E5CE6' : '#5856D6',
    fabIncome: isDark ? '#30D158' : '#34C759',
    fabExpense: isDark ? '#FF453A' : '#FF3B30',
    fabTransfer: isDark ? '#0A84FF' : '#007AFF',
    backdrop: 'rgba(0, 0, 0, 0.4)',
  };

  // Sync with controlled state if provided
  useEffect(() => {
    if (controlledExpanded !== undefined && controlledExpanded !== isExpanded) {
      toggleExpanded();
    }
  }, [controlledExpanded]);

  // Notify parent of expand state changes
  useEffect(() => {
    onExpandChange?.(isExpanded);
  }, [isExpanded, onExpandChange]);

  const handleMainPress = () => {
    toggleExpanded();
  };

  const handleSubPress = (callback: () => void) => {
    callback();
    if (isExpanded) {
      toggleExpanded(); // Collapse after selection
    }
  };

  return (
    <>
      {/* Backdrop overlay */}
      {isExpanded && (
        <Pressable
          style={[StyleSheet.absoluteFill, { backgroundColor: colors.backdrop }]}
          onPress={toggleExpanded}
          accessibilityRole="button"
          accessibilityLabel="关闭添加菜单"
        />
      )}

      {/* FAB Container */}
      <View
        style={[
          styles.container,
          {
            bottom: insets.bottom + 16,
            right: 16,
          },
        ]}
        pointerEvents="box-none"
      >
        {/* Sub-buttons */}
        {/* Transfer Button */}
        <Animated.View style={[styles.subButtonContainer, subButtonStyles[0]]}>
          <TouchableOpacity
            style={[styles.subButton, { backgroundColor: colors.fabTransfer }]}
            onPress={() => handleSubPress(onTransferPress)}
            accessibilityRole="button"
            accessibilityLabel="添加转账交易"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="swap-horizontal" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.labelContainer}>
            <Text style={styles.label}>转账</Text>
          </View>
        </Animated.View>

        {/* Income Button */}
        <Animated.View style={[styles.subButtonContainer, subButtonStyles[1]]}>
          <TouchableOpacity
            style={[styles.subButton, { backgroundColor: colors.fabIncome }]}
            onPress={() => handleSubPress(onIncomePress)}
            accessibilityRole="button"
            accessibilityLabel="添加收入交易"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-down" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.labelContainer}>
            <Text style={styles.label}>收入</Text>
          </View>
        </Animated.View>

        {/* Expense Button */}
        <Animated.View style={[styles.subButtonContainer, subButtonStyles[2]]}>
          <TouchableOpacity
            style={[styles.subButton, { backgroundColor: colors.fabExpense }]}
            onPress={() => handleSubPress(onExpensePress)}
            accessibilityRole="button"
            accessibilityLabel="添加支出交易"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-up" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.labelContainer}>
            <Text style={styles.label}>支出</Text>
          </View>
        </Animated.View>

        {/* Main FAB Button */}
        <Animated.View style={mainButtonStyle}>
          <TouchableOpacity
            style={[styles.mainButton, { backgroundColor: colors.fabPrimary }]}
            onPress={handleMainPress}
            accessibilityRole="button"
            accessibilityLabel={isExpanded ? '关闭添加菜单' : '添加交易'}
            accessibilityHint="点击展开快捷添加菜单"
          >
            <Ionicons name="add" size={32} color="#FFFFFF" />
          </TouchableOpacity>
        </Animated.View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignItems: 'center',
  },
  mainButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  subButtonContainer: {
    position: 'absolute',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  subButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  labelContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
});
