import { useState } from 'react';

export interface UseFormProps {
  initialValues?: Record<string, any>;
  onSubmit: (values: Record<string, any>) => Promise<void> | void;
}

export function useForm({ initialValues = {}, onSubmit }: UseFormProps) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setFieldValue = (field: string, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }));
  };

  const setFieldError = (field: string, error: string) => {
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    values,
    errors,
    touched,
    isSubmitting,
    setFieldValue,
    setFieldError,
    setTouched: (field: string, value: boolean) => {
      setTouched(prev => ({ ...prev, [field]: value }));
    },
    handleSubmit,
    reset: () => {
      setValues(initialValues);
      setErrors({});
      setTouched({});
    }
  };
}

export default useForm;
