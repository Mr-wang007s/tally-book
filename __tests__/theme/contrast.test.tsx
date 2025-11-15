import { lightTheme, darkTheme } from '@/theme/colors';

// A simple contrast checker
function getLuminance(hex: string): number {
  const rgb = parseInt(hex.slice(1), 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = (rgb >> 0) & 0xff;
  const a = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function getContrastRatio(color1: string, color2: string): number {
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

describe('Theme: Contrast', () => {
  it('all text colors should have sufficient contrast', () => {
    // Light theme
    expect(getContrastRatio(lightTheme.text, lightTheme.background)).toBeGreaterThanOrEqual(4.5);
    expect(getContrastRatio(lightTheme.textSecondary, lightTheme.background)).toBeGreaterThanOrEqual(4.5);

    // Dark theme
    expect(getContrastRatio(darkTheme.text, darkTheme.background)).toBeGreaterThanOrEqual(4.5);
    expect(getContrastRatio(darkTheme.textSecondary, darkTheme.background)).toBeGreaterThanOrEqual(4.5);
  });
});
