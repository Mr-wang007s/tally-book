/**
 * TransactionList Component
 * 
 * Virtualized list of transactions with pull-to-refresh and load more
 * Optimized for large datasets
 */

import React, { useCallback } from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Transaction } from '../../models/Transaction';
import { ListItem } from './ListItem';
import { EmptyState } from '../feedback/EmptyState';

export interface TransactionListProps {
  data: Transaction[];
  onSelectTransaction?: (transaction: Transaction) => void;
  onRefresh?: () => Promise<void>;
  onLoadMore?: () => void;
  isLoading?: boolean;
  isRefreshing?: boolean;
  hasMore?: boolean;
  containerStyle?: ViewStyle;
  emptyStateIcon?: string;
  emptyStateTitle?: string;
  emptyStateMessage?: string;
  emptyStateAction?: {
    label: string;
    onPress: () => void;
  };
}

export const TransactionList: React.FC<TransactionListProps> = ({
  data,
  onSelectTransaction,
  onRefresh,
  onLoadMore,
  isLoading = false,
  isRefreshing = false,
  hasMore = false,
  containerStyle,
  emptyStateIcon = '📭',
  emptyStateTitle = '暂无交易',
  emptyStateMessage = '开始记录您的第一笔交易',
  emptyStateAction,
}) => {
  const { theme } = useTheme();

  const handleEndReached = useCallback(() => {
    if (!isLoading && hasMore && onLoadMore) {
      onLoadMore();
    }
  }, [isLoading, hasMore, onLoadMore]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    list: {
      paddingHorizontal: 12,
      paddingVertical: 8,
    },
    separator: {
      height: 8,
    },
    footer: {
      paddingVertical: 16,
      alignItems: 'center',
    },
    footerText: {
      fontSize: 12,
      color: theme.colors.textSecondary,
    },
  });

  return (
    <View style={[styles.container, containerStyle]}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ListItem
            transaction={item}
            onPress={() => onSelectTransaction?.(item)}
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.list}
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              tintColor={theme.colors.primary}
            />
          ) : undefined
        }
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          <EmptyState
            icon={emptyStateIcon}
            title={emptyStateTitle}
            message={emptyStateMessage}
            action={emptyStateAction}
          />
        }
        ListFooterComponent={
          hasMore && isLoading ? (
            <View style={styles.footer}>
              <View
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  borderWidth: 2,
                  borderColor: theme.colors.primary,
                  borderTopColor: 'transparent',
                  borderRightColor: 'transparent',
                }}
              />
            </View>
          ) : null
        }
        scrollEnabled={data.length > 0}
      />
    </View>
  );
};

TransactionList.displayName = 'TransactionList';
