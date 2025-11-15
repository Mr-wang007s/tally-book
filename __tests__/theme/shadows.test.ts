import { shadows } from '@/theme/shadows';

describe('Theme: Shadows', () => {
  it('light mode shadows should have correct opacity', () => {
    expect(shadows.light.sm.shadowOpacity).toBe(0.08);
    expect(shadows.light.md.shadowOpacity).toBe(0.12);
    expect(shadows.light.lg.shadowOpacity).toBe(0.16);
  });

  it('dark mode shadows should have correct opacity', () => {
    expect(shadows.dark.sm.shadowOpacity).toBe(0.3);
    expect(shadows.dark.md.shadowOpacity).toBe(0.4);
    expect(shadows.dark.lg.shadowOpacity).toBe(0.5);
  });
});
