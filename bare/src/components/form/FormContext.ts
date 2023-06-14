import React from 'react';

interface FormContext {
  onFieldChange: (key: string, value: string) => void,
}

const FormContext = React.createContext<FormContext>({ onFieldChange: () => undefined });

export default FormContext;
