import { AccessibilityInfo } from 'react-native';

export async function shouldDisableBlur(): Promise<boolean> {
  try {
    const isReduceTransparency = await AccessibilityInfo.isReduceTransparencyEnabled();
    return isReduceTransparency;
  } catch (error) {
    console.error('Failed to check reduce transparency:', error);
    return false; // 默认启用毛玻璃
  }
}
