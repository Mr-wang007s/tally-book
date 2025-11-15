import { renderHook, act } from '@testing-library/react-native';
import { useHaptics } from '@/hooks/useHaptics';
import * as Haptics from 'expo-haptics';

jest.mock('expo-haptics');

describe('Hook: useHaptics', () => {
  it('should call Haptics.impactAsync on triggerLight', () => {
    const { result } = renderHook(() => useHaptics());
    act(() => {
      result.current.triggerLight();
    });
    expect(Haptics.impactAsync).toHaveBeenCalledWith('light');
  });
});
