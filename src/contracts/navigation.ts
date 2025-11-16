/**
 * Navigation Contracts: Ledger Analytics
 * 
 * Type definitions for route parameters and navigation results.
 * Ensures type safety across the app's navigation flow.
 * 
 * @module src/contracts/navigation
 */

/**
 * Parameters passed to the Transactions screen
 * Enables post-add transaction flow with scroll-to-item and highlight
 * 
 * @example
 * router.push('/(tabs)/transactions', {
 *   scrollToId: 'txn-12345',
 *   highlight: true
 * });
 */
export interface TransactionsScreenParams {
  /**
   * Transaction ID to scroll to and center in viewport
   * Used after adding a new transaction
   */
  scrollToId?: string;

  /**
   * Whether to highlight the transaction with animation
   * Visual feedback that transaction was successfully created
   */
  highlight?: boolean;
}

/**
 * Result returned when adding or editing a transaction
 * Used for post-action navigation
 * 
 * @example
 * const result = await router.push('/(tabs)/transactions/add', {
 *   mode: 'add'
 * });
 * // result: AddTransactionResult
 */
export interface AddTransactionResult {
  /**
   * Whether the transaction was successfully saved
   */
  success: boolean;

  /**
   * ID of the newly created or updated transaction
   * Used for scrollToId in post-add navigation flow
   */
  transactionId: string;

  /**
   * Timestamp when the transaction was saved (milliseconds since epoch)
   * Useful for logging and analytics
   */
  timestamp: number;

  /**
   * Error message if success is false
   * Shown to user via toast/alert
   */
  errorMessage?: string;
}

/**
 * Parameters for editing an existing transaction
 * 
 * @example
 * router.push('/(tabs)/transactions/[id]', {
 *   id: 'txn-12345',
 *   mode: 'edit'
 * });
 */
export interface EditTransactionParams {
  /**
   * Transaction ID to load and edit
   */
  id: string;

  /**
   * Mode indicator: 'edit' or 'view'
   */
  mode: 'edit' | 'view';
}

/**
 * Summary screen parameters for period filtering
 * 
 * @example
 * router.push('/(tabs)/summary', {
 *   period: 'month',
 *   startDate: '2025-11-01',
 *   endDate: '2025-11-30'
 * });
 */
export interface SummaryScreenParams {
  /**
   * Pre-selected period: 'today', 'week', 'month', 'custom'
   */
  period?: 'today' | 'thisWeek' | 'thisMonth' | 'last7Days' | 'last30Days' | 'custom';

  /**
   * Start date for custom range (ISO format: YYYY-MM-DD)
   */
  startDate?: string;

  /**
   * End date for custom range (ISO format: YYYY-MM-DD)
   */
  endDate?: string;
}

/**
 * Trends screen parameters for analysis configuration
 * 
 * @example
 * router.push('/(tabs)/trends', {
 *   analysisType: 'byTime',
 *   granularity: 'month',
 *   period: 'last3Months'
 * });
 */
export interface TrendsScreenParams {
  /**
   * Type of analysis: 'byTime' or 'byCategory'
   */
  analysisType?: 'byTime' | 'byCategory';

  /**
   * Time granularity for 'byTime' analysis
   */
  granularity?: 'day' | 'week' | 'month';

  /**
   * Pre-selected period
   */
  period?: 'last7Days' | 'last30Days' | 'last3Months' | 'thisYear';
}

/**
 * Modal/Sheet parameters for bottom sheet components
 */
export interface SheetParams {
  /**
   * Type of sheet: 'datePicker', 'categoryPicker', 'periodFilter'
   */
  type: 'datePicker' | 'categoryPicker' | 'periodFilter' | 'transactionOptions';

  /**
   * Current value to display/pre-select
   */
  currentValue?: string;

  /**
   * Additional configuration based on sheet type
   */
  config?: Record<string, any>;
}

/**
 * Type-safe route parameter union for all screens
 * Used for type inference in router.push() calls
 */
export type ScreenParams = 
  | TransactionsScreenParams
  | AddTransactionResult
  | EditTransactionParams
  | SummaryScreenParams
  | TrendsScreenParams
  | SheetParams;

/**
 * Navigation helper type for route-to-params mapping
 */
export type RouteName = 
  | 'home'
  | 'transactions'
  | 'transactions/add'
  | 'transactions/[id]'
  | 'summary'
  | 'trends'
  | 'settings';

/**
 * Route map for type-safe navigation
 * Associates each route with its params type
 */
export interface RouteMap {
  'home': undefined;
  'transactions': TransactionsScreenParams;
  'transactions/add': undefined;
  'transactions/[id]': EditTransactionParams;
  'summary': SummaryScreenParams;
  'trends': TrendsScreenParams;
  'settings': undefined;
}

/**
 * Type-safe router function signature
 * Prevents invalid route/params combinations at compile time
 * 
 * @example
 * // ✅ Type-safe: params match route
 * safeRouter<'transactions'>('transactions', { scrollToId: 'txn-123' });
 * 
 * // ❌ TypeScript error: params don't match route
 * safeRouter<'home'>('home', { scrollToId: 'txn-123' });
 */
export type SafeRouter = <Route extends RouteName>(
  route: Route,
  params?: RouteMap[Route]
) => void;
