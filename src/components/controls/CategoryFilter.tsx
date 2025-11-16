/**
 * CategoryFilter Component
 * 
 * Multi-select category filter with checkboxes
 * Used for filtering transactions by multiple categories
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Modal,
  ViewStyle,
  FlatList,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Checkbox } from '../ui/Checkbox';

export interface CategoryFilterProps {
  categories: Array<{ id: string; name: string; icon?: string }>;
  selectedIds?: string[];
  onChangeSelection?: (selectedIds: string[]) => void;
  containerStyle?: ViewStyle;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedIds = [],
  onChangeSelection,
  containerStyle,
}) => {
  const { theme } = useTheme();
  const [showModal, setShowModal] = useState(false);
  const [localSelected, setLocalSelected] = useState(selectedIds);

  const handleToggleCategory = useCallback(
    (categoryId: string) => {
      const newSelected = localSelected.includes(categoryId)
        ? localSelected.filter((id) => id !== categoryId)
        : [...localSelected, categoryId];
      setLocalSelected(newSelected);
    },
    [localSelected]
  );

  const handleApply = useCallback(() => {
    onChangeSelection?.(localSelected);
    setShowModal(false);
  }, [localSelected, onChangeSelection]);

  const styles = StyleSheet.create({
    container: {
      marginBottom: 12,
    },
    button: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: localSelected.length > 0 ? theme.colors.primary : theme.colors.border,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    buttonText: {
      color: theme.colors.text,
      fontSize: 13,
      fontWeight: '600',
    },
    badge: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 10,
      marginLeft: 8,
    },
    badgeText: {
      color: '#ffffff',
      fontSize: 11,
      fontWeight: '600',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: theme.colors.surface,
      borderTopLeftRadius: theme.borderRadius.lg,
      borderTopRightRadius: theme.borderRadius.lg,
      maxHeight: '80%',
      paddingBottom: 20,
    },
    modalHeader: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    modalTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
    },
    categoryList: {
      paddingHorizontal: 12,
      paddingVertical: 12,
    },
    categoryItem: {
      paddingHorizontal: 12,
      paddingVertical: 12,
      borderRadius: theme.borderRadius.md,
      marginBottom: 8,
      backgroundColor: theme.colors.background,
      flexDirection: 'row',
      alignItems: 'center',
    },
    categoryIcon: {
      fontSize: 18,
      marginRight: 12,
    },
    categoryName: {
      fontSize: 14,
      color: theme.colors.text,
      flex: 1,
    },
    footer: {
      paddingHorizontal: 12,
      gap: 8,
    },
  });

  return (
    <View style={[styles.container, containerStyle]}>
      <Pressable
        style={styles.button}
        onPress={() => setShowModal(true)}
      >
        <Text style={styles.buttonText}>分类</Text>
        {localSelected.length > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{localSelected.length}</Text>
          </View>
        )}
      </Pressable>

      <Modal
        transparent
        animationType="slide"
        visible={showModal}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>选择分类</Text>
              <Pressable onPress={() => setShowModal(false)}>
                <Text style={{ fontSize: 24, color: theme.colors.textSecondary }}>×</Text>
              </Pressable>
            </View>
            <FlatList
              data={categories}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.categoryItem}
                  onPress={() => handleToggleCategory(item.id)}
                >
                  {item.icon && <Text style={styles.categoryIcon}>{item.icon}</Text>}
                  <Text style={styles.categoryName}>{item.name}</Text>
                  <Checkbox
                    value={localSelected.includes(item.id)}
                    onValueChange={() => handleToggleCategory(item.id)}
                  />
                </Pressable>
              )}
              contentContainerStyle={styles.categoryList}
            />
            <View style={styles.footer}>
              <Pressable
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  borderRadius: theme.borderRadius.md,
                  backgroundColor: theme.colors.primary,
                }}
                onPress={handleApply}
              >
                <Text style={{ color: '#ffffff', fontWeight: '600', textAlign: 'center' }}>
                  应用
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

CategoryFilter.displayName = 'CategoryFilter';
