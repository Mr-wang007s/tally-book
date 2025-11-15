import { renderHook } from '@testing-library/react-native';
import { useTheme } from '@/hooks/useTheme';

describe('Hook: useTheme', () => {
  it('should return the light theme by default', () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.isDark).toBe(false);
    expect(result.current.colors.background).toBe('#FFFFFF');
  });
});
