import View, { ViewProps } from '../view/index.js';
import Input from '../input/index.js';
import Control from '../control/index.js';
import { useStyles as useControlStyles } from '../control/Control.js';

import FormContext from './FormContext.js';
import { useContext, useState } from 'react';
import Stack from '../stack/Stack.js';

const departments = { 1: 'Engineering', 2: 'Product', 3: 'Finance' };

type FieldDefinition<T = unknown> = {
  key: string,
  label: string,
  type?: 'text' | 'date' | 'color' | 'select' | 'checkbox' | 'radio',
  options?: { [value: string]: string; },
  render?: (item: T) => React.ReactNode,
};

type FieldProps<T = unknown> = {
  _key: string,
  label: string,
  type?: 'text' | 'date' | 'color' | 'select' | 'checkbox' | 'radio',
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

const Field = ({ _key, label, type, options, value }: FieldProps) => {
  const { onFieldChange } = useContext(FormContext);

  const controlStyles = useControlStyles();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFieldChange(_key, event.target.value);
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onFieldChange(_key, event.target.value);
  };

  switch (type) {
    case 'checkbox': return null;
    case 'radio': return null;
    case 'select': return (
      <View as="select" className={controlStyles.Inner} onChange={handleSelectChange}>
        <option hidden>Please select...</option>
        {Object.entries(options ?? {}).map(([value, label]) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </View>
    );
  }

  return <Input label={label} type={type ?? 'text'} onChange={handleInputChange} />;
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
