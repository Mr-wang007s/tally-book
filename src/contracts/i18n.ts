/**
 * i18n Translation Contracts: Ledger Analytics
 * 
 * Type definitions for all application translations.
 * Provides type-safe access to translated strings throughout the app.
 * 
 * @module src/contracts/i18n
 * @see src/i18n/locales/zh-CN.json - Chinese translation source
 * @see src/i18n/locales/en.json - English translation source
 */

/**
 * Common UI labels and actions used across all screens
 */
export interface CommonTranslations {
  ok: string;
  cancel: string;
  save: string;
  delete: string;
  edit: string;
  close: string;
  confirm: string;
  back: string;
  clear: string;
  add: string;
  create: string;
  update: string;
  remove: string;
  loading: string;
  noData: string;
  error: string;
  success: string;
  warning: string;
  info: string;
}

/**
 * Transaction-related translations including CRUD operations and validation
 */
export interface TransactionsTranslations {
  // Screen title and actions
  title: string;
  addTransaction: string;
  editTransaction: string;
  deleteTransaction: string;

  // Transaction types
  income: string;
  expense: string;

  // Form field labels
  type: string;
  amount: string;
  date: string;
  category: string;
  note: string;
  paymentMethod: string;

  // Form actions
  saveTransaction: string;
  updateTransaction: string;
  cancelTransaction: string;
  confirmDelete: string;

  // Transaction status/feedback
  addSuccess: string;
  updateSuccess: string;
  deleteSuccess: string;

  // Validation error messages
  validation: {
    amountRequired: string;
    amountPositive: string;
    amountInvalid: string;
    categoryRequired: string;
    categoryInvalid: string;
    dateRequired: string;
    dateInvalid: string;
    typeRequired: string;
    noteMaxLength: string;
  };
}

/**
 * Home dashboard and overview screen translations
 */
export interface HomeTranslations {
  title: string;
  balance: string;
  income: string;
  expense: string;
  recentTransactions: string;
  insights: string;
  topCategory: string;
  savingsRate: string;
  spendingBreakdown: string;
  viewAll: string;
  empty: string;
}

/**
 * Financial summary and period filtering translations
 */
export interface SummaryTranslations {
  title: string;
  period: string;
  totalIncome: string;
  totalExpense: string;
  balance: string;

  // Period filters
  today: string;
  thisWeek: string;
  thisMonth: string;
  last7Days: string;
  last30Days: string;
  last3Months: string;
  customRange: string;

  // Summary actions
  selectPeriod: string;
  startDate: string;
  endDate: string;

  // Empty state
  empty: string;
}

/**
 * Spending trends analysis and visualization translations
 */
export interface TrendsTranslations {
  title: string;
  byTime: string;
  byCategory: string;

  // Granularity options
  granularity: string;
  daily: string;
  weekly: string;
  monthly: string;

  // Period filters
  period: string;
  last7Days: string;
  last30Days: string;
  last3Months: string;
  thisYear: string;

  // Chart labels
  totalExpense: string;
  expenseByCategory: string;
  topCategories: string;

  // Actions
  selectGranularity: string;
  selectPeriod: string;

  // Empty state
  empty: string;
}

/**
 * Transaction category names (income and expense types)
 */
export interface CategoriesTranslations {
  income: {
    salary: string;
    bonus: string;
    investment: string;
    rental: string;
    freelance: string;
    gifts: string;
    other: string;
  };
  expense: {
    food: string;
    transportation: string;
    utilities: string;
    entertainment: string;
    shopping: string;
    healthcare: string;
    education: string;
    housing: string;
    insurance: string;
    subscriptions: string;
    other: string;
  };
}

/**
 * Notification and feedback message translations
 */
export interface MessagesTranslations {
  // Success messages
  success: {
    transactionCreated: string;
    transactionUpdated: string;
    transactionDeleted: string;
    dataSaved: string;
    operationComplete: string;
  };

  // Error messages
  error: {
    invalidInput: string;
    saveFailed: string;
    deleteFailed: string;
    loadFailed: string;
    networkError: string;
    unknownError: string;
  };

  // Warning messages
  warning: {
    unsavedChanges: string;
    deleteConfirm: string;
    clearData: string;
  };

  // Info messages
  info: {
    selectDateRange: string;
    noTransactionsFound: string;
    emptyTransactionList: string;
  };
}

/**
 * Root translation object containing all namespaces
 * 
 * @example
 * // Type-safe translation access
 * const { t } = useTranslation();
 * const label = t('common.ok');           // ✅ Type-checked
 * const invalid = t('invalid.key');       // ❌ TypeScript error
 */
export interface Translations {
  common: CommonTranslations;
  transactions: TransactionsTranslations;
  home: HomeTranslations;
  summary: SummaryTranslations;
  trends: TrendsTranslations;
  categories: CategoriesTranslations;
  messages: MessagesTranslations;
}

/**
 * Supported language codes
 */
export type LanguageCode = 'zh-CN' | 'en';

/**
 * Language metadata
 */
export interface LanguageInfo {
  code: LanguageCode;
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
}

/**
 * i18n Configuration
 */
export interface I18nConfig {
  /**
   * Default language if system language is not supported
   */
  defaultLanguage: LanguageCode;

  /**
   * Fallback language if translation key is missing
   */
  fallbackLanguage: LanguageCode;

  /**
   * List of supported languages
   */
  supportedLanguages: LanguageCode[];

  /**
   * Whether to cache translations in memory
   */
  cache: boolean;

  /**
   * Whether to log missing keys in development
   */
  debug: boolean;
}

/**
 * Translation function type signature
 * Provides type safety for accessing translations
 * 
 * @example
 * const t = useTranslation();
 * const text = t('common.ok');  // Type-safe
 */
export type TranslationFunction = {
  (key: 'common.ok'): string;
  (key: 'common.cancel'): string;
  (key: 'common.save'): string;
  (key: 'common.delete'): string;
  (key: 'common.edit'): string;
  (key: 'common.close'): string;
  (key: 'common.confirm'): string;
  (key: 'common.back'): string;
  (key: 'common.clear'): string;
  (key: 'common.add'): string;
  (key: 'common.create'): string;
  (key: 'common.update'): string;
  (key: 'common.remove'): string;
  (key: 'common.loading'): string;
  (key: 'common.noData'): string;
  (key: 'common.error'): string;
  (key: 'common.success'): string;
  (key: 'common.warning'): string;
  (key: 'common.info'): string;
  
  // Transactions keys
  (key: 'transactions.title'): string;
  (key: 'transactions.addTransaction'): string;
  (key: 'transactions.editTransaction'): string;
  (key: 'transactions.deleteTransaction'): string;
  (key: 'transactions.income'): string;
  (key: 'transactions.expense'): string;
  (key: 'transactions.type'): string;
  (key: 'transactions.amount'): string;
  (key: 'transactions.date'): string;
  (key: 'transactions.category'): string;
  (key: 'transactions.note'): string;
  (key: 'transactions.paymentMethod'): string;
  (key: 'transactions.saveTransaction'): string;
  (key: 'transactions.updateTransaction'): string;
  (key: 'transactions.cancelTransaction'): string;
  (key: 'transactions.confirmDelete'): string;
  (key: 'transactions.addSuccess'): string;
  (key: 'transactions.updateSuccess'): string;
  (key: 'transactions.deleteSuccess'): string;
  (key: 'transactions.validation.amountRequired'): string;
  (key: 'transactions.validation.amountPositive'): string;
  (key: 'transactions.validation.amountInvalid'): string;
  (key: 'transactions.validation.categoryRequired'): string;
  (key: 'transactions.validation.categoryInvalid'): string;
  (key: 'transactions.validation.dateRequired'): string;
  (key: 'transactions.validation.dateInvalid'): string;
  (key: 'transactions.validation.typeRequired'): string;
  (key: 'transactions.validation.noteMaxLength'): string;

  // Home keys
  (key: 'home.title'): string;
  (key: 'home.balance'): string;
  (key: 'home.income'): string;
  (key: 'home.expense'): string;
  (key: 'home.recentTransactions'): string;
  (key: 'home.insights'): string;
  (key: 'home.topCategory'): string;
  (key: 'home.savingsRate'): string;
  (key: 'home.spendingBreakdown'): string;
  (key: 'home.viewAll'): string;
  (key: 'home.empty'): string;

  // Summary keys
  (key: 'summary.title'): string;
  (key: 'summary.period'): string;
  (key: 'summary.totalIncome'): string;
  (key: 'summary.totalExpense'): string;
  (key: 'summary.balance'): string;
  (key: 'summary.today'): string;
  (key: 'summary.thisWeek'): string;
  (key: 'summary.thisMonth'): string;
  (key: 'summary.last7Days'): string;
  (key: 'summary.last30Days'): string;
  (key: 'summary.last3Months'): string;
  (key: 'summary.customRange'): string;
  (key: 'summary.selectPeriod'): string;
  (key: 'summary.startDate'): string;
  (key: 'summary.endDate'): string;
  (key: 'summary.empty'): string;

  // Trends keys
  (key: 'trends.title'): string;
  (key: 'trends.byTime'): string;
  (key: 'trends.byCategory'): string;
  (key: 'trends.granularity'): string;
  (key: 'trends.daily'): string;
  (key: 'trends.weekly'): string;
  (key: 'trends.monthly'): string;
  (key: 'trends.period'): string;
  (key: 'trends.last7Days'): string;
  (key: 'trends.last30Days'): string;
  (key: 'trends.last3Months'): string;
  (key: 'trends.thisYear'): string;
  (key: 'trends.totalExpense'): string;
  (key: 'trends.expenseByCategory'): string;
  (key: 'trends.topCategories'): string;
  (key: 'trends.selectGranularity'): string;
  (key: 'trends.selectPeriod'): string;
  (key: 'trends.empty'): string;

  // Categories keys
  (key: 'categories.income.salary'): string;
  (key: 'categories.income.bonus'): string;
  (key: 'categories.income.investment'): string;
  (key: 'categories.income.rental'): string;
  (key: 'categories.income.freelance'): string;
  (key: 'categories.income.gifts'): string;
  (key: 'categories.income.other'): string;
  (key: 'categories.expense.food'): string;
  (key: 'categories.expense.transportation'): string;
  (key: 'categories.expense.utilities'): string;
  (key: 'categories.expense.entertainment'): string;
  (key: 'categories.expense.shopping'): string;
  (key: 'categories.expense.healthcare'): string;
  (key: 'categories.expense.education'): string;
  (key: 'categories.expense.housing'): string;
  (key: 'categories.expense.insurance'): string;
  (key: 'categories.expense.subscriptions'): string;
  (key: 'categories.expense.other'): string;

  // Messages keys
  (key: 'messages.success.transactionCreated'): string;
  (key: 'messages.success.transactionUpdated'): string;
  (key: 'messages.success.transactionDeleted'): string;
  (key: 'messages.success.dataSaved'): string;
  (key: 'messages.success.operationComplete'): string;
  (key: 'messages.error.invalidInput'): string;
  (key: 'messages.error.saveFailed'): string;
  (key: 'messages.error.deleteFailed'): string;
  (key: 'messages.error.loadFailed'): string;
  (key: 'messages.error.networkError'): string;
  (key: 'messages.error.unknownError'): string;
  (key: 'messages.warning.unsavedChanges'): string;
  (key: 'messages.warning.deleteConfirm'): string;
  (key: 'messages.warning.clearData'): string;
  (key: 'messages.info.selectDateRange'): string;
  (key: 'messages.info.noTransactionsFound'): string;
  (key: 'messages.info.emptyTransactionList'): string;
};

/**
 * i18n Hook return type
 * Provides type-safe translation access
 */
export interface UseTranslationReturn {
  /**
   * Type-safe translation function
   * 
   * @example
   * const { t } = useTranslation();
   * const message = t('common.ok');
   */
  t: TranslationFunction;

  /**
   * Current language code
   */
  language: LanguageCode;

  /**
   * i18n instance for advanced usage
   */
  i18n: {
    changeLanguage: (lang: LanguageCode) => Promise<void>;
    language: LanguageCode;
    languages: LanguageCode[];
  };
}
