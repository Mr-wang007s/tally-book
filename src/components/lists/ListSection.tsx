/**
 * ListSection Component
 * 
 * Grouped list section with header, footer, and items
 * Used for organizing transactions by date or category
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export interface ListSectionProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: string;
  style?: ViewStyle;
}

export const ListSection: React.FC<ListSectionProps> = ({
  title,
  subtitle,
  children,
  footer,
  style,
}) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      marginBottom: 16,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 12,
      paddingHorizontal: 12,
    },
    headerLeft: {
      flex: 1,
    },
    title: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.colors.text,
      marginBottom: subtitle ? 2 : 0,
    },
    subtitle: {
      fontSize: 12,
      color: theme.colors.textSecondary,
    },
    content: {
      gap: 8,
    },
    footer: {
      marginTop: 12,
      paddingHorizontal: 12,
      fontSize: 12,
      color: theme.colors.textSecondary,
    },
  });

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      </View>
      <View style={styles.content}>
        {children}
      </View>
      {footer && <Text style={styles.footer}>{footer}</Text>}
    </View>
  );
};

ListSection.displayName = 'ListSection';
