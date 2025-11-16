/**
 * Type definitions for all translation keys
 * This ensures type-safe access to all i18n translations
 */

export interface CommonTranslations {
  ok: string;
  cancel: string;
  close: string;
  delete: string;
  edit: string;
  save: string;
  add: string;
  back: string;
  next: string;
  previous: string;
  loading: string;
  error: string;
  success: string;
  warning: string;
  info: string;
  noData: string;
  tryAgain: string;
  confirm: string;
}

export interface TransactionFieldTranslations {
  type: string;
  amount: string;
  date: string;
  category: string;
  note: string;
  paymentMethod: string;
  description: string;
}

export interface TransactionTypesTranslations {
  income: string;
  expense: string;
}

export interface TransactionCategoryIncomeTranslations {
  salary: string;
  bonus: string;
  investment: string;
  other: string;
}

export interface TransactionCategoryExpenseTranslations {
  food: string;
  transport: string;
  shopping: string;
  entertainment: string;
  utilities: string;
  healthcare: string;
  education: string;
  other: string;
}

export interface TransactionPaymentMethodsTranslations {
  cash: string;
  creditCard: string;
  debitCard: string;
  bankTransfer: string;
  mobilePayment: string;
  other: string;
}

export interface TransactionValidationTranslations {
  amountRequired: string;
  amountPositive: string;
  amountDecimal: string;
  categoryRequired: string;
  dateRequired: string;
  dateInvalid: string;
  dateFuture: string;
  typeRequired: string;
}

export interface TransactionMessagesTranslations {
  created: string;
  updated: string;
  deleted: string;
  deleteConfirm: string;
  emptyState: string;
}

export interface TransactionsTranslations {
  title: string;
  add: string;
  edit: string;
  delete: string;
  view: string;
  list: string;
  fields: TransactionFieldTranslations;
  types: TransactionTypesTranslations;
  categories: {
    income: TransactionCategoryIncomeTranslations;
    expense: TransactionCategoryExpenseTranslations;
  };
  paymentMethods: TransactionPaymentMethodsTranslations;
  messages: TransactionMessagesTranslations;
  validation: TransactionValidationTranslations;
}

export interface HomeTranslations {
  title: string;
  greeting: string;
  balance: string;
  income: string;
  expense: string;
  rate: string;
  sections: {
    overview: string;
    recentTransactions: string;
    topCategories: string;
  };
  messages: {
    noTransactions: string;
    loadingFailed: string;
  };
  actions: {
    addTransaction: string;
    viewAll: string;
    viewTrends: string;
  };
}

export interface SummaryTranslations {
  title: string;
  period: string;
  selectPeriod: string;
  periods: {
    today: string;
    week: string;
    month: string;
    year: string;
    custom: string;
  };
  metrics: {
    totalIncome: string;
    totalExpense: string;
    balance: string;
    savingsRate: string;
  };
  messages: {
    noData: string;
    selectCustomRange: string;
  };
}

export interface TrendsTranslations {
  title: string;
  viewBy: string;
  views: {
    byTime: string;
    byCategory: string;
  };
  granularity: {
    daily: string;
    weekly: string;
    monthly: string;
  };
  periods: {
    last7Days: string;
    last30Days: string;
    currentMonth: string;
    last3Months: string;
    custom: string;
  };
  messages: {
    noData: string;
    selectOption: string;
  };
  labels: {
    expense: string;
    income: string;
    trend: string;
    average: string;
  };
}

export interface ValidationTranslations {
  required: string;
  invalid: string;
  tooLong: string;
  tooShort: string;
  pattern: string;
  network: string;
  unknown: string;
}

export interface Translations {
  common: CommonTranslations;
  transactions: TransactionsTranslations;
  home: HomeTranslations;
  summary: SummaryTranslations;
  trends: TrendsTranslations;
  validation: ValidationTranslations;
}
