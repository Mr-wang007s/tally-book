import { ThemeColors } from '../theme/colors';
import { Spacing } from '../theme/spacing';
import { animations } from '../theme/animations';
import { shadows } from '../theme/shadows';

export type Animations = typeof animations;
export type Shadows = typeof shadows;

export interface ExtendedTheme {
  colors: ThemeColors;
  spacing: Spacing;
  animations: Animations;
  shadows: Shadows;
  colorScheme: 'light' | 'dark';
  isDark: boolean;
}

export type ShadowStyle = {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
};

export type BlurMaterial = {
  intensity: number;
  tint: 'light' | 'dark' | 'default';
  fallbackColor: string;
};
