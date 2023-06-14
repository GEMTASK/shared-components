import View, { ViewProps } from '../view/index.js';
import Input from '../input/index.js';

import FormContext from './FormContext.js';
import { useContext, useState } from 'react';
import Stack from '../stack/Stack.js';

const departments = { 1: 'Engineering', 2: 'Product', 3: 'Finance' };

type FieldDefinition<T = unknown> = {
  key: string,
  label: string,
  type?: string,
  options?: { [value: string]: string; },
  render?: (item: T) => React.ReactNode,
};

type FieldProps<T = unknown> = {
  _key: string,
  label: string,
  type?: string,
  value?: string,
  options?: { [value: string]: string; },
  render?: (item: T) => React.ReactNode,
};

type Record = {
  firstName: string,
  department: keyof typeof departments,
};

const columns: FieldDefinition<Record>[] = [
  { key: 'firstName', label: 'First Name' },
  { key: 'department', label: 'Department', render: ({ department }) => departments[department] },
];


const fields: FieldDefinition[] = [
  { key: 'firstName', label: 'First Name', type: 'text', },
  { key: 'married', label: 'Married', type: 'checkbox' },
  {
    key: 'gender', label: 'Gender', type: 'radio', options: {
      'M': 'Male',
    }
  },
  {
    key: 'state', label: 'State', type: 'select', options: {
      'AL': 'Alabama',
      'AK': 'Alaska',
    }
  },
];

const Field = ({ _key, label, type, value }: FieldProps) => {
  const { onFieldChange } = useContext(FormContext);

  const handleChange = (event: React.FocusEvent<HTMLInputElement>) => {
    onFieldChange(_key, event.target.value);
  };

  switch (type) {
    case 'text': return (
      <Input label={label} onBlur={handleChange} />
    );
  }

  return <Input label={label} />;
};

type FormProps = {
  fields?: FieldDefinition[],
  initialValues?: { [key: string]: string; },
} & ViewProps;

const Form = ({
  fields,
  initialValues,
  children,
  ...props
}: FormProps) => {
  const [values, setValues] = useState(initialValues ?? {});

  const handleFieldChange = (key: string, value: string) => {
    console.log('handleFieldChange', key, value);

    setValues({ ...values, [key]: value });
  };

  return (
    <FormContext.Provider value={{ onFieldChange: handleFieldChange }}>
      <Stack as="form" spacing="large" {...props}>
        {fields?.map(({ key, ...props }) => (
          <Field key={key} _key={key} value={values[key]}  {...props} />
        ))}
      </Stack>
    </FormContext.Provider>
  );
};

export default Form;
