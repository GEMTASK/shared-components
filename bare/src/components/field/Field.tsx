import { useContext } from 'react';

import View, { ViewProps } from '../view/index.js';
import Text from '../text/index.js';
import Input from '../input/index.js';
import Select from '../select/index.js';
import Stack from '../stack/Stack.js';
import Spacer from '../spacer/Spacer.js';

import { useStyles as useControlStyles } from '../control/Control.js';

import FormContext from '../form/FormContext.js';

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

  const handleInputChange = (value: string) => {
    onFieldChange(_key, value);
  };

  const handleCheckboxChange = (value: boolean) => {
    onFieldChange(_key, value);
  };

  const element = (() => {
    switch (type) {
      case 'radio': return null;
      case 'checkbox': return typeof value === 'boolean' ? (
        <Checkbox key={_key} label={label} value={value} onChange={handleCheckboxChange} />
      ) : null;
      case 'select': return typeof value === 'string' ? (
        <Select value={value} options={options} onChange={handleInputChange} />
      ) : null;
    }

    return typeof value === 'string' ? (
      <Input type={type} value={value} onChange={handleInputChange} />
    ) : null;
  })();

  return (
    <View>
      {!!label && (
        <>
          <Text caps fontSize="xxsmall" fontWeight="semibold" textColor="gray-6">{label}</Text>
          <Spacer size="small" />
        </>
      )}
      {element}
    </View>
  );
};

export default Field;
