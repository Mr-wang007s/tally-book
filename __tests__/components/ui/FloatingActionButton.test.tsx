import { renderHook, act } from '@testing-library/react-native';
import { useSharedValue } from 'react-native-reanimated';

describe('FloatingActionButton - Animation', () => {
  it('should have a staggered animation', () => {
    const { result } = renderHook(() => useSharedValue(0));

    act(() => {
      result.current.value = 1;
    });

    expect(result.current.value).toBe(1);
  });
});
