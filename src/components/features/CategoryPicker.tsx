/**
 * CategoryPicker Component
 * 类别选择器，支持搜索过滤 (FR-022)
 * 遵循 Constitution Principles I (HIG), IV (Accessibility)
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  StyleSheet,
  Modal,
} from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useCategories } from '@/hooks/useCategories';
import { Icon } from '@/components/ui/Icon';
import { SafeAreaWrapper } from '@/components/ui/SafeAreaWrapper';
import type { Category } from '@/types/category';

export interface CategoryPickerProps {
  selectedCategoryId?: string;
  onSelectCategory: (category: Category) => void;
  placeholder?: string;
}

export function CategoryPicker({
  selectedCategoryId,
  onSelectCategory,
  placeholder = '选择类别',
}: CategoryPickerProps) {
  const { colors, typography, spacing } = useTheme();
  const { categories } = useCategories();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedCategory = categories.find((cat) => cat.id === selectedCategoryId);

  // 过滤类别
  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (category: Category) => {
    onSelectCategory(category);
    setIsModalVisible(false);
    setSearchQuery('');
  };

  return (
    <>
      {/* Trigger Button */}
      <TouchableOpacity
        style={[
          styles.trigger,
          {
            backgroundColor: colors.backgroundSecondary,
            borderColor: colors.border,
            borderRadius: spacing.borderRadius.md,
            padding: spacing.md,
            minHeight: spacing.touchTarget,
          },
        ]}
        onPress={() => setIsModalVisible(true)}
        accessibilityRole="button"
        accessibilityLabel="选择支出类别"
        accessibilityHint="点击选择类别"
      >
        {selectedCategory ? (
          <View style={styles.selectedCategory}>
            <View
              style={[
                styles.colorDot,
                { backgroundColor: selectedCategory.color },
              ]}
            />
            <Icon name={selectedCategory.icon as any} size={20} />
            <Text
              style={[
                styles.selectedText,
                { color: colors.text, fontSize: typography.fontSize.body },
              ]}
            >
              {selectedCategory.name}
            </Text>
          </View>
        ) : (
          <Text
            style={[
              styles.placeholder,
              { color: colors.textTertiary, fontSize: typography.fontSize.body },
            ]}
          >
            {placeholder}
          </Text>
        )}
        <Icon name="chevron-down" size={20} color={colors.textSecondary} />
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <SafeAreaWrapper>
          <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View
              style={[
                styles.modalHeader,
                { borderBottomColor: colors.separator, paddingBottom: spacing.md },
              ]}
            >
              <Text
                style={[
                  styles.modalTitle,
                  { color: colors.text, fontSize: typography.fontSize.title3 },
                ]}
              >
                选择类别
              </Text>
              <TouchableOpacity
                onPress={() => setIsModalVisible(false)}
                accessibilityRole="button"
                accessibilityLabel="关闭"
              >
                <Icon name="close" size={24} />
              </TouchableOpacity>
            </View>

            {/* Search Input */}
            <TextInput
              style={[
                styles.searchInput,
                {
                  backgroundColor: colors.backgroundSecondary,
                  color: colors.text,
                  fontSize: typography.fontSize.body,
                  borderRadius: spacing.borderRadius.md,
                  padding: spacing.md,
                  marginVertical: spacing.md,
                },
              ]}
              placeholder="搜索类别..."
              placeholderTextColor={colors.textTertiary}
              value={searchQuery}
              onChangeText={setSearchQuery}
              accessibilityLabel="搜索类别"
            />

            {/* Category List */}
            <FlatList
              data={filteredCategories}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.categoryItem,
                    {
                      backgroundColor:
                        item.id === selectedCategoryId
                          ? colors.backgroundSecondary
                          : 'transparent',
                      borderRadius: spacing.borderRadius.md,
                      padding: spacing.md,
                      minHeight: spacing.touchTarget,
                    },
                  ]}
                  onPress={() => handleSelect(item)}
                  accessibilityRole="button"
                  accessibilityLabel={`选择${item.name}类别`}
                  accessibilityState={{ selected: item.id === selectedCategoryId }}
                >
                  <View
                    style={[styles.colorDot, { backgroundColor: item.color }]}
                  />
                  <Icon name={item.icon as any} size={24} />
                  <Text
                    style={[
                      styles.categoryName,
                      {
                        color: colors.text,
                        fontSize: typography.fontSize.body,
                        fontWeight:
                          item.id === selectedCategoryId
                            ? typography.fontWeight.semibold
                            : typography.fontWeight.regular,
                      },
                    ]}
                  >
                    {item.name}
                  </Text>
                  {item.id === selectedCategoryId && (
                    <Icon name="checkmark" size={20} color={colors.primary} />
                  )}
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text
                  style={[
                    styles.emptyText,
                    { color: colors.textSecondary, textAlign: 'center' },
                  ]}
                >
                  没有找到匹配的类别
                </Text>
              }
            />
          </View>
        </SafeAreaWrapper>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
  },
  selectedCategory: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  selectedText: {
    flex: 1,
  },
  placeholder: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontWeight: '600',
  },
  searchInput: {
    width: '100%',
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  categoryName: {
    flex: 1,
  },
  emptyText: {
    marginTop: 32,
  },
});
