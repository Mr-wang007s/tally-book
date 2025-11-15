/**
 * Performance SLOs (Service Level Objectives)
 * Define target performance metrics per constitution
 */

export const PERF_SLO = {
  /**
   * Screen should be visible and interactive within 1.5s for ≤5,000 transactions
   */
  SCREEN_INTERACTIVE_MS: 1500,

  /**
   * User interactions should respond within 150ms
   */
  INTERACTION_RESPONSE_MS: 150,

  /**
   * Chart/aggregation updates when switching granularity (day/week/month)
   * should complete under 1s for ≤5,000 transactions
   */
  AGGREGATION_UPDATE_MS: 1000,

  /**
   * Maximum transaction count for performance testing
   */
  MAX_TRANSACTION_COUNT: 5000,

  /**
   * Scroll frame rate target
   */
  SCROLL_FPS: 60,
} as const;

/**
 * Performance budget thresholds
 */
export const PERF_BUDGET = {
  /**
   * Maximum bundle size for initial load (bytes)
   */
  MAX_BUNDLE_SIZE_BYTES: 500 * 1024, // 500KB

  /**
   * Maximum memory usage (MB)
   */
  MAX_MEMORY_MB: 100,

  /**
   * Maximum API requests per screen load
   */
  MAX_REQUESTS_PER_SCREEN: 3,
} as const;
