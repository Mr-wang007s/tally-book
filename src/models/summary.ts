/**
 * Summary Entity
 * Represents aggregated financial data for a period
 */

export interface Period {
  start: string; // ISO date string
  end: string; // ISO date string
}

export interface Summary {
  period: Period;
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

/**
 * Create a summary
 */
export function createSummary(
  period: Period,
  totalIncome: number,
  totalExpense: number
): Summary {
  return {
    period,
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense,
  };
}
