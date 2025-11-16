/**
 * Asset Loader Service
 * Centralizes loading of icons, illustrations, and other image assets
 * Provides caching and lazy loading capabilities
 */

import { ImageSourcePropType, Image } from 'react-native';

/**
 * Icon asset mappings
 * Maps icon names to their source paths
 */
export const iconAssets = {
  // Navigation icons
  home: require('../../assets/icons/home.png'),
  transactions: require('../../assets/icons/transactions.png'),
  summary: require('../../assets/icons/summary.png'),
  trends: require('../../assets/icons/trends.png'),
  settings: require('../../assets/icons/settings.png'),

  // Action icons
  add: require('../../assets/icons/add.png'),
  delete: require('../../assets/icons/delete.png'),
  edit: require('../../assets/icons/edit.png'),
  more: require('../../assets/icons/more.png'),
  close: require('../../assets/icons/close.png'),
  back: require('../../assets/icons/back.png'),
  forward: require('../../assets/icons/forward.png'),

  // Category icons
  food: require('../../assets/icons/categories/food.png'),
  transport: require('../../assets/icons/categories/transport.png'),
  shopping: require('../../assets/icons/categories/shopping.png'),
  health: require('../../assets/icons/categories/health.png'),
  entertainment: require('../../assets/icons/categories/entertainment.png'),
  utilities: require('../../assets/icons/categories/utilities.png'),
  other: require('../../assets/icons/categories/other.png'),

  // Status icons
  success: require('../../assets/icons/status/success.png'),
  error: require('../../assets/icons/status/error.png'),
  warning: require('../../assets/icons/status/warning.png'),
  info: require('../../assets/icons/status/info.png'),

  // Feature icons
  analytics: require('../../assets/icons/analytics.png'),
  budget: require('../../assets/icons/budget.png'),
  recurring: require('../../assets/icons/recurring.png'),
  export: require('../../assets/icons/export.png'),
  import: require('../../assets/icons/import.png'),
};

/**
 * Illustration asset mappings
 * Maps illustration names to their source paths
 */
export const illustrationAssets = {
  // Empty states
  emptyTransactions: require('../../assets/illustrations/empty-transactions.png'),
  emptyBudget: require('../../assets/illustrations/empty-budget.png'),
  emptyAnalytics: require('../../assets/illustrations/empty-analytics.png'),

  // Onboarding
  welcomeStep1: require('../../assets/illustrations/onboarding-1.png'),
  welcomeStep2: require('../../assets/illustrations/onboarding-2.png'),
  welcomeStep3: require('../../assets/illustrations/onboarding-3.png'),

  // Success states
  successTransaction: require('../../assets/illustrations/success-transaction.png'),
  successBudget: require('../../assets/illustrations/success-budget.png'),

  // Feature highlights
  reportsFeature: require('../../assets/illustrations/feature-reports.png'),
  budgetFeature: require('../../assets/illustrations/feature-budget.png'),
  insightsFeature: require('../../assets/illustrations/feature-insights.png'),
};

/**
 * All available assets
 */
export const allAssets = {
  ...iconAssets,
  ...illustrationAssets,
};

/**
 * Asset cache for preloaded images
 */
const assetCache = new Map<string, ImageSourcePropType>();

/**
 * Get icon asset by name
 */
export function getIconAsset(
  name: keyof typeof iconAssets
): ImageSourcePropType | null {
  if (name in iconAssets) {
    return iconAssets[name];
  }
  return null;
}

/**
 * Get illustration asset by name
 */
export function getIllustrationAsset(
  name: keyof typeof illustrationAssets
): ImageSourcePropType | null {
  if (name in illustrationAssets) {
    return illustrationAssets[name];
  }
  return null;
}

/**
 * Preload image for faster display
 */
export async function preloadImage(
  source: ImageSourcePropType
): Promise<void> {
  try {
    const cacheKey = typeof source === 'number' ? String(source) : source.uri || '';
    
    if (!cacheKey || assetCache.has(cacheKey)) {
      return; // Already cached or invalid
    }

    await Image.prefetch(
      typeof source === 'number'
        ? `file://${source}`
        : (source as any).uri || ''
    );

    assetCache.set(cacheKey, source);
  } catch (error) {
    console.warn('[AssetLoader] Failed to preload image:', error);
  }
}

/**
 * Preload multiple images
 */
export async function preloadImages(
  sources: ImageSourcePropType[]
): Promise<void> {
  try {
    await Promise.all(sources.map(preloadImage));
  } catch (error) {
    console.warn('[AssetLoader] Failed to preload images:', error);
  }
}

/**
 * Preload all icons
 */
export async function preloadAllIcons(): Promise<void> {
  const icons = Object.values(iconAssets);
  await preloadImages(icons);
}

/**
 * Preload all illustrations
 */
export async function preloadAllIllustrations(): Promise<void> {
  const illustrations = Object.values(illustrationAssets);
  await preloadImages(illustrations);
}

/**
 * Preload assets for specific feature
 */
export async function preloadFeatureAssets(
  feature: 'home' | 'transactions' | 'summary' | 'trends'
): Promise<void> {
  const featureAssets: Record<string, ImageSourcePropType[]> = {
    home: [
      iconAssets.home,
      iconAssets.transactions,
      iconAssets.summary,
      iconAssets.trends,
      iconAssets.add,
      illustrationAssets.emptyTransactions,
    ],
    transactions: [
      iconAssets.transactions,
      iconAssets.add,
      iconAssets.edit,
      iconAssets.delete,
      ...Object.values(iconAssets).filter((_, i) => i > 10 && i < 18), // Category icons
    ],
    summary: [
      iconAssets.summary,
      iconAssets.analytics,
      iconAssets.budget,
    ],
    trends: [
      iconAssets.trends,
      iconAssets.analytics,
      illustrationAssets.emptyAnalytics,
    ],
  };

  const assets = featureAssets[feature] || [];
  await preloadImages(assets);
}

/**
 * Clear asset cache
 */
export function clearAssetCache(): void {
  assetCache.clear();
}

/**
 * Get cache statistics for debugging
 */
export function getAssetCacheStats() {
  return {
    cachedAssets: assetCache.size,
    cacheSize: Array.from(assetCache.values()).length,
  };
}

/**
 * Check if asset is cached
 */
export function isAssetCached(source: ImageSourcePropType): boolean {
  const cacheKey = typeof source === 'number' ? String(source) : source.uri || '';
  return assetCache.has(cacheKey);
}

/**
 * Asset preload configuration for different scenarios
 */
export const preloadConfigs = {
  // Startup preload - essential assets only
  startup: async () => {
    await preloadImages([
      iconAssets.home,
      iconAssets.transactions,
      iconAssets.summary,
      iconAssets.trends,
    ]);
  },

  // Complete preload - all assets
  complete: async () => {
    await Promise.all([
      preloadAllIcons(),
      preloadAllIllustrations(),
    ]);
  },

  // Lazy preload - preload on demand
  lazy: (feature: keyof typeof illustrationAssets | keyof typeof iconAssets) => {
    const asset = allAssets[feature];
    if (asset) {
      preloadImage(asset);
    }
  },
};
