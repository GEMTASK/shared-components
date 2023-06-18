import { useState } from 'react';

import View, { ViewProps } from '../view/index.js';
import Field from '../field/index.js';
import Stack from '../stack/Stack.js';

import FormContext from './FormContext.js';

type FieldDefinition<T = unknown> = {
  key: string,
  label: string,
  type?: 'text' | 'date' | 'color' | 'select' | 'checkbox' | 'radio',
  options?: { [value: string]: string; },
  render?: (item: T) => React.ReactNode,
};

const getDefaultValueForType = (type: string = 'text') => {
  switch (type) {
    case 'checkbox': return false;
    case 'color': return '#FFFFFF';
  }

  return '';
};

type FormProps = {
  fields?: FieldDefinition[],
  initialValues?: { [key: string]: string | boolean; },
} & ViewProps<'form'>;

const Form = ({
  fields = [],
  initialValues = {},
  children,
  ...props
}: FormProps) => {
  const [values, setValues] = useState(fields.reduce((acc, { key, type }) => ({
    ...acc,
    [key]: acc[key] ?? getDefaultValueForType(type)
  }), initialValues));

  const handleFieldChange = (key: string, value: string | boolean) => {
    console.log('handleFieldChange', key, value);

    setValues({ ...values, [key]: value });
  };

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    console.log(values);
  };

  return (
    <FormContext.Provider value={{ onFieldChange: handleFieldChange }}>
      <Stack as="form" spacing="large" onSubmit={handleFormSubmit} {...props}>
        {fields.map(({ key, ...props }) => (
          <Field key={key} _key={key} value={values[key]} {...props} />
        ))}
      </Stack>
    </FormContext.Provider>
  );
};

export default Form;
