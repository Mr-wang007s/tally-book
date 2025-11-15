/**
 * Type Contracts for Transaction Detail and Filter Interactions
 * 
 * This file defines TypeScript types and interfaces for the transaction
 * detail, edit, filter, and delete features.
 * 
 * @module TransactionContracts
 * @version 1.0.0
 * @created 2025-11-15
 */

// ============================================================================
// Enumerations
// ============================================================================

/**
 * Transaction type enumeration
 * 
 * @enum {string}
 */
export type TransactionType = 'income' | 'expense' | 'transfer';

/**
 * Sort option enumeration for transaction lists
 * 
 * @enum {string}
 */
export type SortOption = 'highest' | 'lowest' | 'newest' | 'oldest';

// ============================================================================
// Core Entities
// ============================================================================

/**
 * Transaction entity representing a financial transaction record
 * 
 * @interface Transaction
 */
export interface Transaction {
  /** Unique identifier (UUID v4 format) */
  id: string;
  
  /** Transaction amount (positive number with max 2 decimal places) */
  amount: number;
  
  /** Transaction timestamp in milliseconds (Unix epoch) */
  timestamp: number;
  
  /** Transaction type */
  type: TransactionType;
  
  /** Source account ID (required for expense/transfer, null for income) */
  fromAccount: string | null;
  
  /** Destination account ID (required for income/transfer, null for expense) */
  toAccount: string | null;
  
  /** Category ID (reference to Category entity) */
  category: string;
  
  /** Optional description text (max 500 characters) */
  description?: string;
  
  /** Optional array of attachment file URIs */
  attachments?: string[];
  
  /** Creation timestamp (auto-generated) */
  createdAt: number;
  
  /** Last update timestamp (auto-updated) */
  updatedAt: number;
}

/**
 * Filter criteria for transaction list filtering and sorting
 * 
 * @interface FilterCriteria
 */
export interface FilterCriteria {
  /** Type filter (null means no type filtering) */
  typeFilter: TransactionType | null;
  
  /** Sort option */
  sortBy: SortOption;
  
  /** Selected category IDs (empty array means no category filtering) */
  selectedCategories: string[];
}

/**
 * Account entity representing a financial account
 * 
 * @interface Account
 */
export interface Account {
  /** Unique account identifier */
  id: string;
  
  /** Account display name */
  name: string;
  
  /** Account type (e.g., "Bank", "E-Wallet") */
  type?: string;
  
  /** Current account balance (can be negative) */
  balance: number;
  
  /** Icon name (SF Symbol or emoji) */
  icon?: string;
  
  /** Theme color in hex format (#RRGGBB) */
  color?: string;
}

/**
 * Category entity representing a transaction category
 * 
 * @interface Category
 */
export interface Category {
  /** Unique category identifier */
  id: string;
  
  /** Category display name */
  name: string;
  
  /** Icon name (SF Symbol or emoji) */
  icon: string;
  
  /** Theme color in hex format (#RRGGBB) */
  color: string;
  
  /** Applicable transaction type (null means universal) */
  type?: TransactionType | null;
}

// ============================================================================
// Input/Output Types
// ============================================================================

/**
 * Input type for creating a new transaction
 * 
 * @interface CreateTransactionInput
 */
export interface CreateTransactionInput {
  amount: number;
  timestamp?: number; // Optional, defaults to current time
  type: TransactionType;
  fromAccount: string | null;
  toAccount: string | null;
  category: string;
  description?: string;
  attachments?: string[];
}

/**
 * Input type for updating an existing transaction
 * 
 * @interface UpdateTransactionInput
 */
export interface UpdateTransactionInput {
  id: string; // Required for identifying the transaction to update
  amount?: number;
  timestamp?: number;
  type?: TransactionType;
  fromAccount?: string | null;
  toAccount?: string | null;
  category?: string;
  description?: string;
  attachments?: string[];
}

/**
 * Result type for validation operations
 * 
 * @interface ValidationResult
 */
export interface ValidationResult {
  /** Whether validation passed */
  isValid: boolean;
  
  /** Array of error messages (empty if valid) */
  errors: string[];
}

// ============================================================================
// Component Props
// ============================================================================

/**
 * Props for TransactionDetailView component
 * 
 * @interface TransactionDetailViewProps
 */
export interface TransactionDetailViewProps {
  /** Transaction to display */
  transaction: Transaction;
  
  /** Account lookup map (for resolving account names) */
  accounts: Record<string, Account>;
  
  /** Category lookup map (for resolving category info) */
  categories: Record<string, Category>;
  
  /** Callback when edit button is pressed */
  onEdit: () => void;
  
  /** Callback when delete button is pressed */
  onDelete: () => void;
  
  /** Callback when back button is pressed */
  onBack: () => void;
  
  /** Callback when attachment is pressed */
  onAttachmentPress?: (uri: string, index: number) => void;
}

/**
 * Props for TransactionEditForm component
 * 
 * @interface TransactionEditFormProps
 */
export interface TransactionEditFormProps {
  /** Transaction to edit (undefined for creating new) */
  transaction?: Transaction;
  
  /** Available accounts */
  accounts: Account[];
  
  /** Available categories */
  categories: Category[];
  
  /** Callback when form is submitted */
  onSubmit: (input: CreateTransactionInput | UpdateTransactionInput) => Promise<void>;
  
  /** Callback when form is cancelled */
  onCancel: () => void;
  
  /** Whether form is in loading state */
  isLoading?: boolean;
}

/**
 * Props for FilterBottomSheet component
 * 
 * @interface FilterBottomSheetProps
 */
export interface FilterBottomSheetProps {
  /** Current filter criteria */
  filterCriteria: FilterCriteria;
  
  /** Available categories for filtering */
  categories: Category[];
  
  /** Callback when filter is applied */
  onApply: (criteria: FilterCriteria) => void;
  
  /** Callback when filter is reset */
  onReset: () => void;
  
  /** Callback when bottom sheet is dismissed */
  onDismiss: () => void;
  
  /** Whether bottom sheet is visible */
  isVisible: boolean;
}

/**
 * Props for FloatingActionButton component
 * 
 * @interface FloatingActionButtonProps
 */
export interface FloatingActionButtonProps {
  /** Callback when income button is pressed */
  onIncomePress: () => void;
  
  /** Callback when expense button is pressed */
  onExpensePress: () => void;
  
  /** Callback when transfer button is pressed */
  onTransferPress: () => void;
  
  /** Whether FAB is currently expanded */
  isExpanded?: boolean;
  
  /** Callback when FAB expand state changes */
  onExpandChange?: (expanded: boolean) => void;
}

// ============================================================================
// Hook Return Types
// ============================================================================

/**
 * Return type for useTransactionFilter hook
 * 
 * @interface UseTransactionFilterResult
 */
export interface UseTransactionFilterResult {
  /** Filtered transactions */
  filteredTransactions: Transaction[];
  
  /** Current filter criteria */
  filterCriteria: FilterCriteria;
  
  /** Update filter criteria */
  setFilterCriteria: (criteria: FilterCriteria) => void;
  
  /** Reset filter to default */
  resetFilter: () => void;
  
  /** Number of active filters */
  activeFilterCount: number;
}

/**
 * Return type for useTransactionCRUD hook
 * 
 * @interface UseTransactionCRUDResult
 */
export interface UseTransactionCRUDResult {
  /** All transactions */
  transactions: Transaction[];
  
  /** Create a new transaction */
  createTransaction: (input: CreateTransactionInput) => Promise<Transaction>;
  
  /** Update an existing transaction */
  updateTransaction: (input: UpdateTransactionInput) => Promise<Transaction>;
  
  /** Delete a transaction */
  deleteTransaction: (id: string) => Promise<void>;
  
  /** Get a single transaction by ID */
  getTransaction: (id: string) => Transaction | undefined;
  
  /** Whether CRUD operation is in progress */
  isLoading: boolean;
  
  /** Error from last CRUD operation */
  error: Error | null;
}

/**
 * Return type for useFABAnimation hook
 * 
 * @interface UseFABAnimationResult
 */
export interface UseFABAnimationResult {
  /** Whether FAB is expanded */
  isExpanded: boolean;
  
  /** Toggle FAB expand state */
  toggleExpanded: () => void;
  
  /** Animated rotation value for main button */
  rotationValue: any; // Reanimated SharedValue
  
  /** Animated style for main button */
  mainButtonStyle: any; // Reanimated AnimatedStyle
  
  /** Animated styles for sub buttons */
  subButtonStyles: any[]; // Array of Reanimated AnimatedStyle
}

// ============================================================================
// Service Interfaces
// ============================================================================

/**
 * Interface for transaction storage service
 * 
 * @interface TransactionStorageService
 */
export interface TransactionStorageService {
  /** Load all transactions from storage */
  loadTransactions: () => Promise<Transaction[]>;
  
  /** Save all transactions to storage */
  saveTransactions: (transactions: Transaction[]) => Promise<void>;
  
  /** Load accounts from storage */
  loadAccounts: () => Promise<Account[]>;
  
  /** Load categories from storage */
  loadCategories: () => Promise<Category[]>;
  
  /** Save filter criteria to storage */
  saveFilterCriteria: (criteria: FilterCriteria) => Promise<void>;
  
  /** Load filter criteria from storage */
  loadFilterCriteria: () => Promise<FilterCriteria | null>;
}

// ============================================================================
// Utility Types
// ============================================================================

/**
 * Default filter criteria
 */
export const DEFAULT_FILTER_CRITERIA: FilterCriteria = {
  typeFilter: null,
  sortBy: 'newest',
  selectedCategories: [],
};

/**
 * Type guard to check if a value is a valid TransactionType
 */
export function isTransactionType(value: any): value is TransactionType {
  return ['income', 'expense', 'transfer'].includes(value);
}

/**
 * Type guard to check if a value is a valid SortOption
 */
export function isSortOption(value: any): value is SortOption {
  return ['highest', 'lowest', 'newest', 'oldest'].includes(value);
}

/**
 * Helper type for partial transaction updates
 */
export type PartialTransaction = Partial<Transaction> & { id: string };

/**
 * Helper type for creating transactions (without generated fields)
 */
export type TransactionInput = Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>;
