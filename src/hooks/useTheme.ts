import { useColorScheme as useRNColorScheme } from 'react-native';
import { lightTheme, darkTheme, type ThemeColors, type ColorScheme } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing } from '@/theme/spacing';

/**
 * useTheme Hook
 * 
 * 提供当前主题（浅色/深色）的完整样式系统
 * 遵循 Constitution Principle VI - Dark Mode
 * 
 * @returns {Object} 当前主题对象
 * @returns {ThemeColors} colors - 颜色系统
 * @returns {Typography} typography - 字体系统
 * @returns {Spacing} spacing - 间距系统
 * @returns {ColorScheme} colorScheme - 当前主题模式
 * @returns {boolean} isDark - 是否为深色模式
 */
export function useTheme() {
  const colorScheme = useRNColorScheme() ?? 'light';
  const isDark = colorScheme === 'dark';
  const colors = isDark ? darkTheme : lightTheme;

  return {
    colors,
    typography,
    spacing,
    colorScheme,
    isDark,
  };
}

export type Theme = ReturnType<typeof useTheme>;
