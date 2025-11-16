/**
 * Translation key constants for type-safe access to i18n strings
 * This file serves as a single source of truth for all translation keys
 */

export const TRANSLATION_KEYS = {
  // Common
  common: {
    ok: 'common.ok',
    cancel: 'common.cancel',
    close: 'common.close',
    delete: 'common.delete',
    edit: 'common.edit',
    save: 'common.save',
    add: 'common.add',
    back: 'common.back',
    next: 'common.next',
    previous: 'common.previous',
    loading: 'common.loading',
    error: 'common.error',
    success: 'common.success',
    warning: 'common.warning',
    info: 'common.info',
    noData: 'common.noData',
    tryAgain: 'common.tryAgain',
    confirm: 'common.confirm'
  },

  // Transactions
  transactions: {
    title: 'transactions.title',
    add: 'transactions.add',
    edit: 'transactions.edit',
    delete: 'transactions.delete',
    view: 'transactions.view',
    list: 'transactions.list',
    fields: {
      type: 'transactions.fields.type',
      amount: 'transactions.fields.amount',
      date: 'transactions.fields.date',
      category: 'transactions.fields.category',
      note: 'transactions.fields.note',
      paymentMethod: 'transactions.fields.paymentMethod',
      description: 'transactions.fields.description'
    },
    types: {
      income: 'transactions.types.income',
      expense: 'transactions.types.expense'
    },
    categories: {
      income: {
        salary: 'transactions.categories.income.salary',
        bonus: 'transactions.categories.income.bonus',
        investment: 'transactions.categories.income.investment',
        other: 'transactions.categories.income.other'
      },
      expense: {
        food: 'transactions.categories.expense.food',
        transport: 'transactions.categories.expense.transport',
        shopping: 'transactions.categories.expense.shopping',
        entertainment: 'transactions.categories.expense.entertainment',
        utilities: 'transactions.categories.expense.utilities',
        healthcare: 'transactions.categories.expense.healthcare',
        education: 'transactions.categories.expense.education',
        other: 'transactions.categories.expense.other'
      }
    },
    paymentMethods: {
      cash: 'transactions.paymentMethods.cash',
      creditCard: 'transactions.paymentMethods.creditCard',
      debitCard: 'transactions.paymentMethods.debitCard',
      bankTransfer: 'transactions.paymentMethods.bankTransfer',
      mobilePayment: 'transactions.paymentMethods.mobilePayment',
      other: 'transactions.paymentMethods.other'
    },
    messages: {
      created: 'transactions.messages.created',
      updated: 'transactions.messages.updated',
      deleted: 'transactions.messages.deleted',
      deleteConfirm: 'transactions.messages.deleteConfirm',
      emptyState: 'transactions.messages.emptyState'
    },
    validation: {
      amountRequired: 'transactions.validation.amountRequired',
      amountPositive: 'transactions.validation.amountPositive',
      amountDecimal: 'transactions.validation.amountDecimal',
      categoryRequired: 'transactions.validation.categoryRequired',
      dateRequired: 'transactions.validation.dateRequired',
      dateInvalid: 'transactions.validation.dateInvalid',
      dateFuture: 'transactions.validation.dateFuture',
      typeRequired: 'transactions.validation.typeRequired'
    }
  },

  // Home
  home: {
    title: 'home.title',
    greeting: 'home.greeting',
    balance: 'home.balance',
    income: 'home.income',
    expense: 'home.expense',
    rate: 'home.rate',
    sections: {
      overview: 'home.sections.overview',
      recentTransactions: 'home.sections.recentTransactions',
      topCategories: 'home.sections.topCategories'
    },
    messages: {
      noTransactions: 'home.messages.noTransactions',
      loadingFailed: 'home.messages.loadingFailed'
    },
    actions: {
      addTransaction: 'home.actions.addTransaction',
      viewAll: 'home.actions.viewAll',
      viewTrends: 'home.actions.viewTrends'
    }
  },

  // Summary
  summary: {
    title: 'summary.title',
    period: 'summary.period',
    selectPeriod: 'summary.selectPeriod',
    periods: {
      today: 'summary.periods.today',
      week: 'summary.periods.week',
      month: 'summary.periods.month',
      year: 'summary.periods.year',
      custom: 'summary.periods.custom'
    },
    metrics: {
      totalIncome: 'summary.metrics.totalIncome',
      totalExpense: 'summary.metrics.totalExpense',
      balance: 'summary.metrics.balance',
      savingsRate: 'summary.metrics.savingsRate'
    },
    messages: {
      noData: 'summary.messages.noData',
      selectCustomRange: 'summary.messages.selectCustomRange'
    }
  },

  // Trends
  trends: {
    title: 'trends.title',
    viewBy: 'trends.viewBy',
    views: {
      byTime: 'trends.views.byTime',
      byCategory: 'trends.views.byCategory'
    },
    granularity: {
      daily: 'trends.granularity.daily',
      weekly: 'trends.granularity.weekly',
      monthly: 'trends.granularity.monthly'
    },
    periods: {
      last7Days: 'trends.periods.last7Days',
      last30Days: 'trends.periods.last30Days',
      currentMonth: 'trends.periods.currentMonth',
      last3Months: 'trends.periods.last3Months',
      custom: 'trends.periods.custom'
    },
    messages: {
      noData: 'trends.messages.noData',
      selectOption: 'trends.messages.selectOption'
    },
    labels: {
      expense: 'trends.labels.expense',
      income: 'trends.labels.income',
      trend: 'trends.labels.trend',
      average: 'trends.labels.average'
    }
  },

  // Validation
  validation: {
    required: 'validation.required',
    invalid: 'validation.invalid',
    tooLong: 'validation.tooLong',
    tooShort: 'validation.tooShort',
    pattern: 'validation.pattern',
    network: 'validation.network',
    unknown: 'validation.unknown'
  }
} as const;

export default TRANSLATION_KEYS;
