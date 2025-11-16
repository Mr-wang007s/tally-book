/**
 * i18n formatter utilities for currency, date, and percentage formatting
 */

export function formatCurrency(amount: number, locale: 'zh-CN' | 'en'): string {
  try {
    const formatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: locale === 'zh-CN' ? 'CNY' : 'USD'
    });
    return formatter.format(amount);
  } catch (error) {
    console.warn('Currency formatting error:', error);
    return amount.toFixed(2);
  }
}

export function formatDate(date: Date, locale: 'zh-CN' | 'en'): string {
  try {
    const formatter = new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    return formatter.format(date);
  } catch (error) {
    console.warn('Date formatting error:', error);
    return date.toLocaleDateString();
  }
}

export function formatDateShort(date: Date, locale: 'zh-CN' | 'en'): string {
  try {
    const formatter = new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    return formatter.format(date);
  } catch (error) {
    console.warn('Date formatting error:', error);
    return date.toLocaleDateString();
  }
}

export function formatPercent(value: number, locale: 'zh-CN' | 'en'): string {
  try {
    const formatter = new Intl.NumberFormat(locale, {
      style: 'percent',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });
    return formatter.format(value);
  } catch (error) {
    console.warn('Percent formatting error:', error);
    return `${(value * 100).toFixed(2)}%`;
  }
}

export function formatNumber(value: number, locale: 'zh-CN' | 'en'): string {
  try {
    const formatter = new Intl.NumberFormat(locale, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });
    return formatter.format(value);
  } catch (error) {
    console.warn('Number formatting error:', error);
    return value.toFixed(2);
  }
}
