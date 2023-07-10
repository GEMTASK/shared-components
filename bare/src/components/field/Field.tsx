import { useContext } from 'react';

import View, { ViewProps } from '../view/index.js';
import Text from '../text/index.js';
import Input from '../input/index.js';
import Spacer from '../spacer/index.js';
import Checkbox from '../checkbox/index.js';
import RadioButton from '../radiobutton/index.js';
import Select from '../select/index.js';
import Slider from '../slider/index.js';

import FormContext from '../form/FormContext.js';

type FieldProps<T = unknown> = {
  _key: string,
  label: string,
  type?: 'text' | 'date' | 'color' | 'select' | 'checkbox' | 'radio' | 'checkboxlist' | 'range',
  value?: string | number | boolean | string[],
  lines?: number,
  options?: { [value: string]: string; },
  render?: (item: T) => React.ReactNode,
};

const Field = ({
  _key,
  label,
  type,
  lines,
  options = {},
  value
}: FieldProps) => {
  const { onFieldChange } = useContext(FormContext);

  const handleInputChange = (value: string) => {
    onFieldChange(_key, value);
  };

  const handleSliderChange = (value: number) => {
    onFieldChange(_key, value);
  };

  const handleCheckboxChange = (value: boolean) => {
    onFieldChange(_key, value);
  };

  const handleCheckboxListChange = (value: string[]) => {
    onFieldChange(_key, value);
  };

  const element = (() => {
    switch (type) {
      case 'radio': return typeof value === 'string' && (
        <RadioButton.List key={_key} value={value} options={options} onChange={handleInputChange} />
      );
      case 'checkboxlist': return Array.isArray(value) && (
        <Checkbox.List key={_key} value={value} options={options} onChange={handleCheckboxListChange} />
      );
      case 'checkbox': return typeof value === 'boolean' ? (
        <Checkbox key={_key} label={label} value={value} onChange={handleCheckboxChange} />
      ) : null;
      case 'select': return typeof value === 'string' ? (
        <Select value={value} options={options} onChange={handleInputChange} />
      ) : null;
      case 'range': return typeof value === 'number' ? (
        <Slider value={value} onChange={handleSliderChange} />
      ) : null;
    }

    return typeof value === 'string' ? (
      <Input type={type} lines={lines} value={value} options={options} onChange={handleInputChange} />
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
