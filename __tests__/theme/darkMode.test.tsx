import { renderHook } from '@testing-library/react-native';
import { useTheme } from '@/hooks/useTheme';
import { useColorScheme } from 'react-native';

jest.mock('react-native', () => ({
  ...jest.requireActual('react-native'),
  useColorScheme: jest.fn(),
}));

describe('Theme: Dark Mode', () => {
  it('should return dark theme when color scheme is dark', () => {
    (useColorScheme as jest.Mock).mockReturnValue('dark');
    const { result } = renderHook(() => useTheme());
    expect(result.current.isDark).toBe(true);
    expect(result.current.colors.background).toBe('#000000');
  });
});
