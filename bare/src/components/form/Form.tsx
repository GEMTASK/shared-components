import { useEffect, useState } from 'react';

import View, { ViewProps } from '../view/index.js';
import Field from '../field/index.js';
import Stack from '../stack/Stack.js';

import FormContext from './FormContext.js';

type FieldDefinition<T = unknown> = {
  key: string,
  label: string,
  type?: 'text' | 'date' | 'color' | 'select' | 'checkbox' | 'radio' | 'checkboxlist' | 'range',
  lines?: number,
  options?: { [value: string]: string; },
  render?: (item: T) => React.ReactNode,
};

const getDefaultValueForType = (type: string = 'text') => {
  switch (type) {
    case 'checkboxlist': return [];
    case 'checkbox': return false;
    case 'color': return '#FFFFFF';
    case 'range': return 0;
  }

  return '';
};

type FormProps = {
  fields?: FieldDefinition[],
  initialValues?: { [key: string]: string | number | boolean | string[]; },
  flush?: boolean,
  onFieldChange?: (key: string, values: string | number | boolean | string[]) => void,
} & ViewProps<'form'>;

const Form = ({
  fields = [],
  initialValues = {},
  flush,
  children,
  onFieldChange,
  ...props
}: FormProps) => {
  const [values, setValues] = useState(fields.reduce((acc, { key, type }) => ({
    ...acc,
    [key]: acc[key] ?? getDefaultValueForType(type)
  }), initialValues));

  useEffect(() => {
    setValues(initialValues);
  }, [initialValues]);

  const handleFieldChange = (key: string, value: string | number | boolean | string[]) => {
    // console.log('handleFieldChange', key, value);

    if (onFieldChange) {
      onFieldChange(key, value);
    }

    setValues({ ...values, [key]: value });
  };

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    console.log('handleFormSubmit', values);
  };

  return (
    <FormContext.Provider value={{ onFieldChange: handleFieldChange }}>
      <Stack as="form" spacing={!flush ? "xlarge" : 'medium'} onSubmit={handleFormSubmit} {...props}>
        {fields.map(({ key, ...props }, index) => (
          <Field flush={flush} key={index} _key={key} value={values[key]} {...props} />
        ))}
      </Stack>
    </FormContext.Provider>
  );
};

export default Form;
