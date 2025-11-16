/**
 * DashboardSkeleton Component
 * Skeleton loader showing placeholder for entire dashboard while loading
 */

import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Skeleton, SkeletonGroup, SkeletonCard } from '../animations/Skeleton';

export interface DashboardSkeletonProps {
  /** Show full or compact skeleton */
  compact?: boolean;
}

/**
 * DashboardSkeleton component - animated loading skeleton for home dashboard
 */
export const DashboardSkeleton: React.FC<DashboardSkeletonProps> = ({
  compact = false,
}) => {
  const { theme } = useTheme();

  return (
    <View
      style={{
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: theme.colors.background,
      }}
    >
      {/* Header Skeleton */}
      <View style={{ marginBottom: 24 }}>
        <Skeleton shape="text" height={14} width="40%" />
        <Skeleton
          shape="text"
          height={28}
          width="60%"
          style={{ marginTop: 8 }}
        />
        <Skeleton
          shape="text"
          height={12}
          width="45%"
          style={{ marginTop: 8 }}
        />
      </View>

      {/* Balance Card Skeleton */}
      {!compact && (
        <View
          style={{
            marginBottom: 24,
            backgroundColor: theme.colors.surface,
            borderRadius: 16,
            padding: 16,
            borderWidth: 1,
            borderColor: theme.colors.border,
          }}
        >
          <Skeleton shape="text" height={14} width="30%" />
          <Skeleton
            shape="text"
            height={32}
            width="70%"
            style={{ marginTop: 12 }}
          />
          <View
            style={{
              flexDirection: 'row',
              gap: 12,
              marginTop: 16,
            }}
          >
            <Skeleton
              shape="rect"
              width="48%"
              height={60}
              borderRadius={8}
            />
            <Skeleton
              shape="rect"
              width="48%"
              height={60}
              borderRadius={8}
            />
          </View>
        </View>
      )}

      {/* Recent Transactions Skeleton */}
      <View style={{ marginBottom: 24 }}>
        <Skeleton
          shape="text"
          height={18}
          width="50%"
          style={{ marginBottom: 12 }}
        />
        <SkeletonGroup
          count={3}
          itemHeight={60}
          gap={12}
          shape="rect"
        />
        <Skeleton
          shape="text"
          height={14}
          width="25%"
          style={{ marginTop: 16, alignSelf: 'center' }}
        />
      </View>

      {/* Quick Insights Skeleton */}
      <View style={{ marginBottom: 24 }}>
        <Skeleton
          shape="text"
          height={18}
          width="50%"
          style={{ marginBottom: 12 }}
        />
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <Skeleton
            shape="rect"
            width="48%"
            height={100}
            borderRadius={12}
          />
          <Skeleton
            shape="rect"
            width="48%"
            height={100}
            borderRadius={12}
          />
        </View>
      </View>

      {/* Spending Breakdown Skeleton */}
      <View>
        <Skeleton
          shape="text"
          height={18}
          width="50%"
          style={{ marginBottom: 12 }}
        />
        <SkeletonGroup
          count={4}
          itemHeight={50}
          gap={12}
          shape="rect"
        />
      </View>
    </View>
  );
};

DashboardSkeleton.displayName = 'DashboardSkeleton';

export default DashboardSkeleton;
