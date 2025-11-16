/**
 * ScreenLayout Component
 * 
 * Base screen layout with header, content area, and footer
 * Handles safe area insets and common screen structure
 */

import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  ViewStyle,
  SafeAreaView,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export interface ScreenLayoutProps {
  header?: React.ReactNode;
  headerStyle?: ViewStyle;
  children: React.ReactNode;
  footer?: React.ReactNode;
  footerStyle?: ViewStyle;
  scrollable?: boolean;
  contentStyle?: ViewStyle;
  style?: ViewStyle;
  backgroundColor?: string;
}

export const ScreenLayout: React.FC<ScreenLayoutProps> = ({
  header,
  headerStyle,
  children,
  footer,
  footerStyle,
  scrollable = true,
  contentStyle,
  style,
  backgroundColor,
}) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: backgroundColor || theme.colors.background,
    },
    header: {
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
    content: {
      flex: 1,
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    contentScroll: {
      flex: 1,
    },
    footer: {
      backgroundColor: theme.colors.surface,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
  });

  const contentComponent = scrollable ? (
    <ScrollView
      style={styles.contentScroll}
      contentContainerStyle={[styles.content, contentStyle]}
      showsVerticalScrollIndicator={true}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.content, contentStyle]}>
      {children}
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, style]}>
      {header && (
        <View style={[styles.header, headerStyle]}>
          {header}
        </View>
      )}
      {contentComponent}
      {footer && (
        <View style={[styles.footer, footerStyle]}>
          {footer}
        </View>
      )}
    </SafeAreaView>
  );
};

ScreenLayout.displayName = 'ScreenLayout';
