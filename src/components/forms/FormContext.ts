/**
 * Form Context: Manages form-wide state (touched fields, errors, values)
 */

import React, { createContext, useContext, useState } from 'react';

export interface FormContextValue {
  values: Record<string, any>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  setFieldValue: (field: string, value: any) => void;
  setFieldError: (field: string, error: string) => void;
  setFieldTouched: (field: string, touched: boolean) => void;
  reset: () => void;
}

export const FormContext = createContext<FormContextValue | undefined>(undefined);

export function useFormContext() {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext must be used within FormProvider');
  }
  return context;
}

export interface FormProviderProps {
  children: React.ReactNode;
  initialValues?: Record<string, any>;
}

export function FormProvider({ children, initialValues = {} }: FormProviderProps) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const setFieldValue = (field: string, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }));
  };

  const setFieldError = (field: string, error: string) => {
    setErrors(prev => ({
      ...prev,
      [field]: error || undefined
    }));
  };

  const setFieldTouched = (field: string, isTouched: boolean) => {
    setTouched(prev => ({ ...prev, [field]: isTouched }));
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };

  return (
    <FormContext.Provider
      value={{
        values,
        errors,
        touched,
        setFieldValue,
        setFieldError,
        setFieldTouched,
        reset
      }}
    >
      {children}
    </FormContext.Provider>
  );
}
