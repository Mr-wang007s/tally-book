/**
 * TypeScript Contracts - Central Export
 * 
 * Type-safe interfaces for navigation and i18n throughout the application.
 * 
 * @module src/contracts
 */

// Navigation contracts
export * from './navigation';
export type {
  TransactionsScreenParams,
  AddTransactionResult,
  EditTransactionParams,
  SummaryScreenParams,
  TrendsScreenParams,
  SheetParams,
  ScreenParams,
  RouteName,
  RouteMap,
  SafeRouter,
} from './navigation';

// i18n contracts
export * from './i18n';
export type {
  CommonTranslations,
  TransactionsTranslations,
  HomeTranslations,
  SummaryTranslations,
  TrendsTranslations,
  CategoriesTranslations,
  MessagesTranslations,
  Translations,
  LanguageCode,
  LanguageInfo,
  I18nConfig,
  TranslationFunction,
  UseTranslationReturn,
} from './i18n';
