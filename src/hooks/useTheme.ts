import { useColorScheme as useRNColorScheme } from 'react-native';
import { lightTheme, darkTheme } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing } from '@/theme/spacing';
import { animations } from '@/theme/animations';
import { shadows } from '@/theme/shadows';
import { ExtendedTheme } from '@/types/theme';

/**
 * useTheme Hook
 * 
 * 提供当前主题（浅色/深色）的完整样式系统
 * 遵循 Constitution Principle VI - Dark Mode
 * 
 * @returns {ExtendedTheme} 当前主题对象
 */
export function useTheme(): ExtendedTheme {
  const colorScheme = useRNColorScheme() ?? 'light';
  const isDark = colorScheme === 'dark';
  const colors = isDark ? darkTheme : lightTheme;

  return {
    colors,
    typography,
    spacing,
    animations,
    shadows,
    colorScheme,
    isDark,
  };
}
