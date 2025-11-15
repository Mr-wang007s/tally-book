# Data Model: Visual & Interaction Enhancement

## Theme & Appearance

### ThemePreference
Configuration for app appearance and user preferences.

**Fields**:
- `mode`: 'light' | 'dark' | 'auto'
- `useSystemSettings`: boolean (follow OS appearance)
- `reducedMotion`: boolean (accessibility preference)
- `hapticsEnabled`: boolean (enable/disable haptic feedback)
- `lastUpdated`: ISO timestamp

**Validation**:
- `mode` must be one of ['light', 'dark', 'auto']
- All boolean fields default to true
- `useSystemSettings` overrides `mode` when true

**Storage**:
- Key: 'theme_preference'
- Persisted to AsyncStorage
- Loaded on app launch

---

### ColorPalette
Dynamic color values based on current theme mode.

**Fields**:
- `primary`: string (hex color)
- `success`: string
- `warning`: string
- `error`: string
- `background`: string
- `surface`: string
- `overlay`: string (rgba)
- `textPrimary`: string
- `textSecondary`: string
- `textTertiary`: string

**Computed**:
- Generated dynamically from `ThemePreference.mode`
- Light mode uses iOS system colors
- Dark mode uses true black (#000000) + elevated surfaces

---

## Animation & Interaction

### AnimationConfig
Configuration for individual animations.

**Fields**:
- `duration`: number (milliseconds)
- `curve`: 'easeInOut' | 'spring' | 'bounce' | 'linear'
- `delay`: number (milliseconds, optional)
- `useNativeDriver`: boolean (always true)

**Presets**:
```typescript
const PRESETS = {
  instant: { duration: 100, curve: 'easeInOut' },
  fast: { duration: 200, curve: 'easeInOut' },
  normal: { duration: 300, curve: 'easeInOut' },
  slow: { duration: 500, curve: 'easeInOut' },
  spring: { duration: 0, curve: 'spring' }, // Physics-based
};
```

---

### SpringConfig
Spring physics parameters for natural motion.

**Fields**:
- `damping`: number (10-20, default: 15)
- `stiffness`: number (50-200, default: 150)
- `mass`: number (0.5-2, default: 1)
- `overshootClamping`: boolean (default: false)

**Presets**:
```typescript
const SPRING_PRESETS = {
  gentle: { damping: 20, stiffness: 90, mass: 1 },
  default: { damping: 15, stiffness: 150, mass: 1 },
  snappy: { damping: 12, stiffness: 200, mass: 0.8 },
  bouncy: { damping: 10, stiffness: 100, mass: 1 },
};
```

---

### HapticFeedback
Tactile feedback types for user interactions.

**Types**:
- `impact`: { style: 'light' | 'medium' | 'heavy' }
- `notification`: { type: 'success' | 'warning' | 'error' }
- `selection`: {} (no parameters)

**Usage Mapping**:
| Interaction | Haptic Type | Style/Type |
|-------------|-------------|------------|
| Toggle switch | impact | light |
| Button press | impact | medium |
| Delete action | impact | heavy |
| Save success | notification | success |
| Validation error | notification | error |
| List item tap | selection | - |
| Category chip tap | impact | light |
| FAB press | impact | medium |
| Swipe action | impact | medium |

---

## Visual Components

### ElevationLevel
Shadow configuration for depth hierarchy.

**Levels**: 0-5

**Properties**:
```typescript
interface ElevationStyle {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number; // Android
}
```

**Usage**:
- Level 0: Flat backgrounds
- Level 1: List items, subtle cards
- Level 2: Summary cards, standard UI ← Most common
- Level 3: Modals, bottom sheets
- Level 4: Overlays, alerts
- Level 5: Popovers, tooltips

---

### GlassmorphismStyle
Frosted glass effect configuration.

**Fields**:
- `blurIntensity`: number (0-100, iOS only)
- `tint`: 'light' | 'dark' | 'default'
- `backgroundColor`: string (rgba with opacity)
- `borderColor`: string (rgba with low opacity)
- `borderWidth`: number (1-2pt)

**Platform Support**:
- iOS: Native BlurView with full blur
- Android: Semi-transparent overlay fallback
- Web: CSS backdrop-filter

---

## Chart Data Structures

### ChartDataPoint
Individual data point for chart rendering.

**Fields**:
- `x`: number | string (axis value)
- `y`: number (value)
- `label`: string (display label)
- `color`: string (optional, hex color)
- `metadata`: Record<string, any> (optional)

**Validation**:
- `y` must be non-negative for financial data
- `label` max length: 20 characters
- `color` must be valid hex (#RRGGBB or #RRGGBBAA)

---

### BarChartConfig
Configuration for animated bar chart.

**Fields**:
- `data`: ChartDataPoint[]
- `maxValue`: number (auto-calculated or manual)
- `barColor`: string (default: theme.primary)
- `animationDuration`: number (default: 800ms)
- `animationCurve`: 'spring' | 'easeOut'
- `showLabels`: boolean (default: true)
- `showGrid`: boolean (default: true)

**Animation Behavior**:
- Bars grow from 0 to target height
- Staggered start (50ms delay per bar)
- Spring physics for natural motion

---

### DonutChartConfig
Configuration for animated donut chart.

**Fields**:
- `data`: ChartDataPoint[]
- `innerRadius`: number (percentage, 0.5-0.8)
- `animationDuration`: number (default: 1000ms)
- `animationCurve`: 'easeInOut'
- `showLabels`: boolean (default: true)
- `showLegend`: boolean (default: true)
- `startAngle`: number (default: -90, top of circle)

**Animation Behavior**:
- Segments draw clockwise from startAngle
- Each segment animates sequentially (100ms gap)
- Legend items fade in after chart completes

---

## Gesture Data

### SwipeGesture
Configuration for swipe-to-delete/edit actions.

**Fields**:
- `direction`: 'left' | 'right'
- `threshold`: number (pixels, default: 80)
- `actions`: SwipeAction[]

**SwipeAction**:
```typescript
interface SwipeAction {
  id: string;
  label: string;
  icon: string;
  backgroundColor: string;
  textColor: string;
  haptic: 'light' | 'medium' | 'heavy';
  onPress: () => void;
}
```

**Example** (Transaction List):
```typescript
const leftSwipe = {
  direction: 'left',
  threshold: 80,
  actions: [{
    id: 'delete',
    label: 'Delete',
    icon: 'trash',
    backgroundColor: '#FF3B30',
    textColor: '#FFFFFF',
    haptic: 'heavy',
    onPress: handleDelete,
  }],
};

const rightSwipe = {
  direction: 'right',
  threshold: 80,
  actions: [{
    id: 'edit',
    label: 'Edit',
    icon: 'pencil',
    backgroundColor: '#007AFF',
    textColor: '#FFFFFF',
    haptic: 'medium',
    onPress: handleEdit,
  }],
};
```

---

## Loading States

### SkeletonConfig
Loading placeholder configuration.

**Fields**:
- `width`: number | string (e.g., 100, '100%')
- `height`: number
- `borderRadius`: number (match content shape)
- `animationDuration`: number (default: 1500ms)
- `shimmerColor`: string (default: rgba(255,255,255,0.1))

**Animation**:
- Linear gradient shimmer from left to right
- Infinite loop with 1.5s cycle
- Runs on native driver for 60fps

**Usage**:
```typescript
// Transaction list skeleton
<Skeleton width="100%" height={72} borderRadius={12} />

// Summary card skeleton
<Skeleton width={160} height={100} borderRadius={16} />

// Chart skeleton
<Skeleton width="100%" height={200} borderRadius={12} />
```

---

## Toast Notifications

### Toast
Temporary notification message.

**Fields**:
- `id`: string (unique identifier)
- `message`: string (max 100 characters)
- `type`: 'success' | 'error' | 'warning' | 'info'
- `duration`: number (milliseconds, default: 3000)
- `position`: 'top' | 'bottom' (default: 'bottom')
- `haptic`: boolean (default: true)

**Visual Properties**:
```typescript
const TOAST_STYLES = {
  success: {
    backgroundColor: '#34C759',
    iconName: 'checkmark.circle.fill',
  },
  error: {
    backgroundColor: '#FF3B30',
    iconName: 'xmark.circle.fill',
  },
  warning: {
    backgroundColor: '#FF9500',
    iconName: 'exclamationmark.triangle.fill',
  },
  info: {
    backgroundColor: '#007AFF',
    iconName: 'info.circle.fill',
  },
};
```

**Animation**:
- Slides in from bottom/top with spring
- Auto-dismisses after duration
- Swipe down/up to dismiss manually
- Triggers haptic on appear (if enabled)

---

## Relationships

### Theme System
```
ThemePreference → ColorPalette (1:1)
ThemePreference → AnimationConfig (1:N)
```

### Animation System
```
AnimationConfig → SpringConfig (1:1, when curve='spring')
HapticFeedback → User Interaction (N:1)
```

### Chart System
```
Transaction[] → ChartDataPoint[] (aggregation)
ChartDataPoint[] → BarChartConfig (1:1)
ChartDataPoint[] → DonutChartConfig (1:1)
```

### Gesture System
```
SwipeGesture → SwipeAction[] (1:N)
SwipeAction → HapticFeedback (1:1)
```

---

## State Management

### Theme Context
```typescript
interface ThemeContextValue {
  theme: 'light' | 'dark';
  colors: ColorPalette;
  isDark: boolean;
  setTheme: (mode: 'light' | 'dark' | 'auto') => void;
  toggleTheme: () => void;
}
```

### Animation Context
```typescript
interface AnimationContextValue {
  reducedMotion: boolean;
  springConfig: SpringConfig;
  duration: (speed: 'fast' | 'normal' | 'slow') => number;
}
```

### Haptics Context
```typescript
interface HapticsContextValue {
  enabled: boolean;
  impact: (style: 'light' | 'medium' | 'heavy') => void;
  notification: (type: 'success' | 'warning' | 'error') => void;
  selection: () => void;
  setEnabled: (enabled: boolean) => void;
}
```

---

## Performance Considerations

### Memoization Strategy
- ColorPalette: Cached, invalidated on theme change
- ChartDataPoint[]: Memoized with useMemo, dependencies: [transactions, period]
- SkeletonConfig: Static, no memoization needed

### Animation Optimizations
- All animations use `useNativeDriver: true`
- Chart animations use Skia (GPU-accelerated)
- Gesture handlers use native event processing
- Spring physics calculated on UI thread

### Storage Strategy
- ThemePreference: AsyncStorage, cached in memory
- ColorPalette: Computed on-the-fly, not persisted
- Toast queue: In-memory only (ephemeral)

---

## Migration Notes

### From Current Implementation
1. **Design Tokens**: Merge existing `tokens.ts` with new color/spacing/typography
2. **Theme System**: Add ThemeProvider wrapping App root
3. **Haptics**: Integrate expo-haptics into existing button/gesture handlers
4. **Charts**: Replace existing SVG charts with Skia-based components
5. **Animations**: Migrate from Animated to Reanimated 3 API

### Backward Compatibility
- Existing Transaction/Category models unchanged
- Storage keys remain the same
- API contracts unaffected
- Only UI layer changes

---

## Testing Requirements

### Unit Tests
- ThemePreference validation
- ColorPalette computation (light/dark mode)
- SpringConfig parameter ranges
- ChartDataPoint validation
- Toast queue management

### Integration Tests
- Theme switching (light ↔ dark)
- Haptic feedback triggering
- Chart data transformation
- Swipe gesture recognition
- Toast display lifecycle

### Visual Regression Tests
- Screenshot tests for light/dark mode
- Elevation level rendering
- Chart animation frames
- Skeleton loading states
- Toast positioning

### Performance Tests
- Animation frame rate (60fps target)
- Chart render time (≤ 1s for 5k points)
- Theme switch latency (≤ 100ms)
- Haptic feedback latency (≤ 16ms)
