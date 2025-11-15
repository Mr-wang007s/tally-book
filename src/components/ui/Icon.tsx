/**
 * Icon Component
 * Wrapper for @expo/vector-icons (Ionicons)
 * 遵循 Constitution Principle I (HIG - SF Symbols equivalent)
 */

import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import type { ComponentProps } from 'react';

export interface IconProps extends Omit<ComponentProps<typeof Ionicons>, 'name'> {
  name: ComponentProps<typeof Ionicons>['name'];
  color?: string;
  size?: number;
}

export function Icon({ name, color, size = 24, ...props }: IconProps) {
  const { colors } = useTheme();
  
  return (
    <Ionicons
      name={name}
      size={size}
      color={color || colors.text}
      {...props}
    />
  );
}
