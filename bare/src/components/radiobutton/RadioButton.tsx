import { useContext } from 'react';

import View, { ViewProps } from '../view/index.js';
import Text from '../text/index.js';
import Input from '../input/index.js';
import Select from '../select/index.js';
import Stack from '../stack/Stack.js';
import Spacer from '../spacer/Spacer.js';

import { useStyles as useControlStyles } from '../control/Control.js';

import FormContext from '../form/FormContext.js';
import Icon from '../icon/Icon.js';
import OpenColor from 'open-color';

type ListProps = {
  value: string,
  options: { [value: string]: string; },
  onChange?: (value: string) => void,
};

const List = ({ value, options, onChange }: ListProps) => {
  const handleChange = (value: string) => {
    console.log(value);
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <Stack horizontal spacing="large">
      {Object.entries(options).map(([radiobuttonValue, label]) => (
        <RadioButton
          key={radiobuttonValue}
          label={label}
          value={radiobuttonValue === value}
          onChange={() => handleChange(radiobuttonValue)}
        />
      ))}
    </Stack>
  );
};

type RadioButtonProps = {
  label: string,
  value: boolean,
  onChange?: (value: boolean) => void,
};

const RadioButton = ({ label, value, onChange, ...props }: RadioButtonProps) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(event.target.checked);
    }
  };

  return (
    <View as="label" horizontal align="middle left" {...props}>
      <input hidden type="radio" checked={value} onChange={handleInputChange} />
      <Icon
        size="xl"
        color={value ? OpenColor.blue[5] : OpenColor.gray[3]}
        icon={value ? 'circle-check' : 'circle'}
      // style={{ boxShadow: 'inset 0 0 0 1px gray', margin: '-10px 0' }}
      />
      <Spacer size="small" />
      <Text>{label}</Text>
    </View>
  );
};

RadioButton.List = List;

export default RadioButton;
