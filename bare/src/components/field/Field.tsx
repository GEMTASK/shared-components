import { useContext } from 'react';

import View, { ViewProps } from '../view/index.js';
import Text from '../text/index.js';
import Input from '../input/index.js';
import Stack from '../stack/Stack.js';
import Spacer from '../spacer/Spacer.js';

import { useStyles as useControlStyles } from '../control/Control.js';

import FormContext from '../form/FormContext.js';

// type FieldDefinition<T = unknown> = {
//   key: string,
//   label: string,
//   type?: 'text' | 'date' | 'color' | 'select' | 'checkbox' | 'radio',
//   options?: { [value: string]: string; },
//   render?: (item: T) => React.ReactNode,
// };

type CheckboxProps = {
  label: string,
  value: boolean,
  onChange: (value: boolean) => void,
};

const Checkbox = ({ label, value, onChange, ...props }: CheckboxProps) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.checked);
  };

  return (
    <View as="label" horizontal align="middle left" {...props}>
      <input type="checkbox" checked={value} onChange={handleInputChange} />
      <Spacer size="xsmall" />
      <Text>{label}</Text>
    </View>
  );
};

type FieldProps<T = unknown> = {
  _key: string,
  label: string,
  type?: 'text' | 'date' | 'color' | 'select' | 'checkbox' | 'radio',
  value?: string | boolean,
  options?: { [value: string]: string; },
  render?: (item: T) => React.ReactNode,
};

const Field = ({ _key, label, type, options = {}, value }: FieldProps) => {
  const { onFieldChange } = useContext(FormContext);

  const controlStyles = useControlStyles();

  const handleInputChange = (value: string) => {
    onFieldChange(_key, value);
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onFieldChange(_key, event.target.value);
  };

  const handleCheckboxChange = (value: boolean) => {
    onFieldChange(_key, value);
  };

  switch (type) {
    case 'checkbox': return typeof value === 'boolean' ? (
      <Checkbox key={_key} label={label} value={value} onChange={handleCheckboxChange} />
    ) : null;
    case 'radio': return null;
    case 'select': return typeof value === 'string' ? (
      <View as="select" value={value} className={controlStyles.Inner} onChange={handleSelectChange}>
        <option hidden>
          Please select...
        </option>
        {Object.entries(options).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </View>
    ) : null;
  }

  return typeof value === 'string' ? (
    <Input label={label} type={type} value={value} onChange={handleInputChange} />
  ) : null;
};

export default Field;
