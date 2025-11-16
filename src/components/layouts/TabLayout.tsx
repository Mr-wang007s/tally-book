/**
 * TabLayout Component
 * 
 * Tab navigation layout with swipeable tab content
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  ViewStyle,
  Animated,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export interface Tab {
  id: string;
  label: string;
  icon?: string;
}

export interface TabLayoutProps {
  tabs: Tab[];
  activeTab?: string;
  onChangeTab?: (tabId: string) => void;
  children: Record<string, React.ReactNode>;
  style?: ViewStyle;
  variant?: 'scrollable' | 'fixed';
}

export const TabLayout: React.FC<TabLayoutProps> = ({
  tabs,
  activeTab = tabs[0]?.id || '',
  onChangeTab,
  children,
  style,
  variant = 'fixed',
}) => {
  const { theme } = useTheme();
  const [localActiveTab, setLocalActiveTab] = useState(activeTab);
  const scrollX = useRef(new Animated.Value(0)).current;

  const handleTabChange = (tabId: string) => {
    setLocalActiveTab(tabId);
    onChangeTab?.(tabId);
  };

  const activeTabIndex = tabs.findIndex((tab) => tab.id === localActiveTab);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    tabBar: {
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      flexDirection: 'row',
    },
    tabBarScroll: {
      paddingHorizontal: 4,
    },
    tabButton: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      marginHorizontal: 4,
      borderRadius: theme.borderRadius.md,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    tabButtonActive: {
      backgroundColor: theme.colors.primary + '20',
    },
    tabButtonFixed: {
      flex: 1,
      borderRadius: 0,
      marginHorizontal: 0,
      borderBottomWidth: 3,
      borderBottomColor: 'transparent',
    },
    tabButtonFixedActive: {
      borderBottomColor: theme.colors.primary,
    },
    tabIcon: {
      fontSize: 16,
      marginRight: 6,
    },
    tabLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.textSecondary,
    },
    tabLabelActive: {
      color: theme.colors.primary,
    },
    content: {
      flex: 1,
    },
    indicator: {
      position: 'absolute',
      bottom: 0,
      height: 3,
      backgroundColor: theme.colors.primary,
      width: `${100 / tabs.length}%`,
      left: `${(activeTabIndex / tabs.length) * 100}%`,
    },
  });

  const isFixed = variant === 'fixed';

  return (
    <View style={[styles.container, style]}>
      <View style={styles.tabBar}>
        {isFixed ? (
          <>
            {tabs.map((tab, index) => (
              <Pressable
                key={tab.id}
                style={[
                  styles.tabButton,
                  styles.tabButtonFixed,
                  localActiveTab === tab.id && styles.tabButtonFixedActive,
                ]}
                onPress={() => handleTabChange(tab.id)}
              >
                {tab.icon && <Text style={styles.tabIcon}>{tab.icon}</Text>}
                <Text
                  style={[
                    styles.tabLabel,
                    localActiveTab === tab.id && styles.tabLabelActive,
                  ]}
                >
                  {tab.label}
                </Text>
              </Pressable>
            ))}
          </>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            style={styles.tabBarScroll}
          >
            {tabs.map((tab) => (
              <Pressable
                key={tab.id}
                style={[
                  styles.tabButton,
                  localActiveTab === tab.id && styles.tabButtonActive,
                ]}
                onPress={() => handleTabChange(tab.id)}
              >
                {tab.icon && <Text style={styles.tabIcon}>{tab.icon}</Text>}
                <Text
                  style={[
                    styles.tabLabel,
                    localActiveTab === tab.id && styles.tabLabelActive,
                  ]}
                >
                  {tab.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        )}
      </View>

      <View style={styles.content}>
        {children[localActiveTab]}
      </View>
    </View>
  );
};

TabLayout.displayName = 'TabLayout';
