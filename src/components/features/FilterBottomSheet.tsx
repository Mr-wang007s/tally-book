/**
 * FilterBottomSheet Component
 * 
 * Bottom sheet for filtering and sorting transactions
 * Uses @gorhom/bottom-sheet for smooth interactions
 * 
 * @module FilterBottomSheet
 */

import React, { useRef, useMemo, useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useTheme } from '@/hooks/useTheme';
import { useHaptics } from '@/hooks/useHaptics';
import type { FilterBottomSheetProps, TransactionType, SortOption, FilterCriteria } from '@/types/transaction';

export function FilterBottomSheet({
  filterCriteria,
  categories,
  onApply,
  onReset,
  onDismiss,
  isVisible,
}: FilterBottomSheetProps) {
  const { colors, animations } = useTheme();
  const { triggerLight } = useHaptics();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const animatedPosition = useSharedValue(0);

  const [localCriteria, setLocalCriteria] = useState<FilterCriteria>(filterCriteria);

  useEffect(() => {
    setLocalCriteria(filterCriteria);
  }, [filterCriteria]);

  const snapPoints = useMemo(() => ['50%', '80%'], []);

  useEffect(() => {
    if (isVisible) {
      bottomSheetRef.current?.expand();
      animatedPosition.value = withSpring(1, animations.spring.default);
      triggerLight();
    } else {
      bottomSheetRef.current?.close();
      animatedPosition.value = withSpring(0);
    }
  }, [isVisible]);

  // Type filter options
  const typeOptions: { value: TransactionType | null; label: string }[] = [
    { value: null, label: '全部' },
    { value: 'income', label: '收入' },
    { value: 'expense', label: '支出' },
    { value: 'transfer', label: '转账' },
  ];

  // Sort options
  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'highest', label: '最高金额' },
    { value: 'lowest', label: '最低金额' },
    { value: 'newest', label: '最新' },
    { value: 'oldest', label: '最旧' },
  ];

  // Handlers
  const handleTypeSelect = (type: TransactionType | null) => {
    setLocalCriteria({ ...localCriteria, typeFilter: type });
  };

  const handleSortSelect = (sort: SortOption) => {
    setLocalCriteria({ ...localCriteria, sortBy: sort });
  };

  const handleCategoryToggle = (categoryId: string) => {
    const isSelected = localCriteria.selectedCategories.includes(categoryId);
    const newCategories = isSelected
      ? localCriteria.selectedCategories.filter((id) => id !== categoryId)
      : [...localCriteria.selectedCategories, categoryId];
    setLocalCriteria({ ...localCriteria, selectedCategories: newCategories });
  };

  const handleApply = () => {
    onApply(localCriteria);
    onDismiss();
  };

  const handleReset = () => {
    const resetCriteria: FilterCriteria = {
      typeFilter: null,
      sortBy: 'newest',
      selectedCategories: [],
    };
    setLocalCriteria(resetCriteria);
    onReset();
    onDismiss();
  };

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
        pressBehavior="close"
      />
    ),
    []
  );

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      onClose={onDismiss}
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: colors.background }}
      handleIndicatorStyle={{ backgroundColor: colors.secondaryText }}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>筛选</Text>
          <TouchableOpacity
            onPress={handleReset}
            accessibilityRole="button"
            accessibilityLabel="重置筛选"
          >
            <Text style={[styles.resetButton, { color: colors.primary }]}>
              重置
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Type Filter */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.secondaryText }]}>
              类型
            </Text>
            <View style={styles.optionGrid}>
              {typeOptions.map((option) => (
                <TouchableOpacity
                  key={option.value || 'all'}
                  style={[
                    styles.optionButton,
                    {
                      backgroundColor:
                        localCriteria.typeFilter === option.value
                          ? colors.selected + '20'
                          : colors.cardBackground,
                      borderColor:
                        localCriteria.typeFilter === option.value
                          ? colors.selected
                          : colors.border,
                    },
                  ]}
                  onPress={() => handleTypeSelect(option.value)}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: localCriteria.typeFilter === option.value }}
                  accessibilityLabel={option.label}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Text
                    style={[
                      styles.optionText,
                      {
                        color:
                          localCriteria.typeFilter === option.value
                            ? colors.selected
                            : colors.text,
                      },
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Sort Options */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.secondaryText }]}>
              排序
            </Text>
            <View style={styles.optionGrid}>
              {sortOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.optionButton,
                    {
                      backgroundColor:
                        localCriteria.sortBy === option.value
                          ? colors.selected + '20'
                          : colors.cardBackground,
                      borderColor:
                        localCriteria.sortBy === option.value
                          ? colors.selected
                          : colors.border,
                    },
                  ]}
                  onPress={() => handleSortSelect(option.value)}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: localCriteria.sortBy === option.value }}
                  accessibilityLabel={option.label}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Text
                    style={[
                      styles.optionText,
                      {
                        color:
                          localCriteria.sortBy === option.value
                            ? colors.selected
                            : colors.text,
                      },
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Category Filter */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.secondaryText }]}>
              分类 ({localCriteria.selectedCategories.length} 已选择)
            </Text>
            <View style={styles.categoryGrid}>
              {categories.map((category) => {
                const isSelected = localCriteria.selectedCategories.includes(category.id);
                return (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.categoryButton,
                      {
                        backgroundColor: isSelected
                          ? colors.selected + '20'
                          : colors.cardBackground,
                        borderColor: isSelected ? colors.selected : colors.border,
                      },
                    ]}
                    onPress={() => handleCategoryToggle(category.id)}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: isSelected }}
                    accessibilityLabel={category.name}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Text style={{ fontSize: 20 }}>{category.icon}</Text>
                    <Text
                      style={[
                        styles.categoryText,
                        {
                          color: isSelected ? colors.selected : colors.text,
                        },
                      ]}
                    >
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </ScrollView>

        {/* Apply Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.applyButton, { backgroundColor: colors.primary }]}
            onPress={handleApply}
            accessibilityRole="button"
            accessibilityLabel="应用筛选"
          >
            <Text style={styles.applyButtonText}>应用</Text>
          </TouchableOpacity>
        </View>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  resetButton: {
    fontSize: 17,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 12,
  },
  optionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 44, // Accessibility: minimum touch target
  },
  optionText: {
    fontSize: 15,
    fontWeight: '500',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    minHeight: 44, // Accessibility: minimum touch target
  },
  categoryText: {
    fontSize: 15,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 32,
  },
  applyButton: {
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
});
