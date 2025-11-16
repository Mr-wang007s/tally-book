/**
 * Form Type Definitions
 * 
 * TypeScript types for form handling throughout the application.
 * Provides generic types for form state, errors, and validation.
 * 
 * @module src/components/forms/FormTypes
 */

import type { ReactNode } from 'react';

/**
 * Form field props interface
 * Generic type for consistent form field components
 */
export interface FormFieldProps<T = any> {
  /** Field name (for form state tracking) */
  name: keyof T | string;
  
  /** Display label */
  label: string;
  
  /** Current field value */
  value: string | number | boolean;
  
  /** Change handler */
  onChangeText?: (text: string) => void;
  onChange?: (value: any) => void;
  
  /** Validation error message (i18n key or string) */
  error?: string;
  
  /** Whether field has been touched/interacted with */
  touched?: boolean;
  
  /** Blur handler (marks field as touched) */
  onBlur?: () => void;
  
  /** Whether field is required */
  required?: boolean;
  
  /** Helper text / hint */
  hint?: string;
  
  /** Whether field is disabled */
  disabled?: boolean;
  
  /** Whether to trigger haptic feedback on error display */
  hapticOnError?: boolean;
}

/**
 * Form errors object
 * Maps field names to error messages (i18n keys)
 */
export type FormErrors<T> = Partial<Record<keyof T, string>> & {
  /** Global form error (not specific to a field) */
  _form?: string;
};

/**
 * Touched fields tracking
 * Tracks which fields have been interacted with
 */
export type TouchedFields<T> = Partial<Record<keyof T, boolean>>;

/**
 * Form state interface
 * Complete form state including values, errors, and touched fields
 */
export interface FormState<T> {
  /** Form field values */
  values: T;
  
  /** Validation errors */
  errors: FormErrors<T>;
  
  /** Touched fields */
  touched: TouchedFields<T>;
  
  /** Whether form is currently submitting */
  isSubmitting: boolean;
  
  /** Whether form has been submitted at least once */
  isSubmitted: boolean;
  
  /** Whether form is currently validating */
  isValidating: boolean;
}

/**
 * Form context value
 * Provides form state and handlers via context
 */
export interface FormContextValue<T> {
  /** Current form state */
  state: FormState<T>;
  
  /** Set field value */
  setFieldValue: (field: keyof T, value: any) => void;
  
  /** Set field error */
  setFieldError: (field: keyof T, error: string | undefined) => void;
  
  /** Mark field as touched */
  setFieldTouched: (field: keyof T, touched: boolean) => void;
  
  /** Validate single field */
  validateField: (field: keyof T) => Promise<string | undefined>;
  
  /** Validate entire form */
  validateForm: () => Promise<FormErrors<T>>;
  
  /** Submit form */
  submitForm: () => Promise<void>;
  
  /** Reset form to initial values */
  resetForm: () => void;
}

/**
 * Form submit handler type
 */
export type FormSubmitHandler<T> = (values: T) => void | Promise<void>;

/**
 * Form validation handler type
 */
export type FormValidationHandler<T> = (values: T) => FormErrors<T> | Promise<FormErrors<T>>;

/**
 * Field validation handler type
 */
export type FieldValidationHandler<T> = (
  value: any,
  allValues: T
) => string | undefined | Promise<string | undefined>;

/**
 * Form configuration options
 */
export interface FormConfig<T> {
  /** Initial form values */
  initialValues: T;
  
  /** Form validation function */
  validate?: FormValidationHandler<T>;
  
  /** Field-level validation functions */
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  validateOnMount?: boolean;
  
  /** Submit handler */
  onSubmit: FormSubmitHandler<T>;
  
  /** Enable debug mode */
  debug?: boolean;
}

/**
 * Form hook return type
 * What useForm() returns
 */
export interface FormHookReturn<T> {
  /** Current form values */
  values: T;
  
  /** Current form errors */
  errors: FormErrors<T>;
  
  /** Touched fields */
  touched: TouchedFields<T>;
  
  /** Form submission state */
  isSubmitting: boolean;
  isSubmitted: boolean;
  isValidating: boolean;
  
  /** Field value getter */
  getFieldValue: (field: keyof T) => any;
  
  /** Field value setter */
  setFieldValue: (field: keyof T, value: any) => void;
  
  /** Field error setter */
  setFieldError: (field: keyof T, error: string | undefined) => void;
  
  /** Field touched setter */
  setFieldTouched: (field: keyof T, touched: boolean) => void;
  
  /** Validation functions */
  validateField: (field: keyof T) => Promise<string | undefined>;
  validateForm: () => Promise<FormErrors<T>>;
  
  /** Form submission */
  handleSubmit: (e?: any) => Promise<void>;
  submitForm: () => Promise<void>;
  
  /** Form reset */
  resetForm: () => void;
  
  /** Helper to generate field props */
  getFieldProps: (field: keyof T) => {
    name: keyof T;
    value: any;
    onChange: (value: any) => void;
    onBlur: () => void;
    error: string | undefined;
    touched: boolean;
  };
}

/**
 * Form render props type
 */
export type FormRenderProps<T> = FormHookReturn<T>;

/**
 * Form component props
 */
export interface FormComponentProps<T> {
  /** Initial form values */
  initialValues: T;
  
  /** Validation schema or function */
  validate?: FormValidationHandler<T>;
  
  /** Submit handler */
  onSubmit: FormSubmitHandler<T>;
  
  /** Render function or children */
  children: ((props: FormRenderProps<T>) => ReactNode) | ReactNode;
  
  /** Validation timing */
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  
  /** Enable debug mode */
  debug?: boolean;
}

/**
 * Field array item type
 */
export interface FieldArrayItem {
  id: string;
  [key: string]: any;
}

/**
 * Field array helpers
 */
export interface FieldArrayHelpers<T> {
  push: (item: T) => void;
  remove: (index: number) => void;
  insert: (index: number, item: T) => void;
  replace: (index: number, item: T) => void;
  move: (from: number, to: number) => void;
  swap: (indexA: number, indexB: number) => void;
}
