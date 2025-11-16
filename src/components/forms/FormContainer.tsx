import React from 'react';
import { ScrollView, ScrollViewProps } from 'react-native';
import { FormProvider } from './FormContext';

export interface FormContainerProps extends ScrollViewProps {
  children: React.ReactNode;
  onSubmit?: () => void;
  initialValues?: Record<string, any>;
}

export function FormContainer({
  children,
  onSubmit,
  initialValues,
  ...props
}: FormContainerProps) {
  return (
    <FormProvider initialValues={initialValues}>
      <ScrollView {...props} style={{ flex: 1 }}>
        {children}
      </ScrollView>
    </FormProvider>
  );
}

export default FormContainer;
