import { useContext } from 'react';
import OpenColor from 'open-color';

import View, { ViewProps } from '../view/index.js';
import Text from '../text/index.js';
import Icon from '../icon/index.js';
import Stack from '../stack/index.js';
import Spacer from '../spacer/index.js';

import { useStyles as useControlStyles } from '../control/Control.js';

type ListProps = {
  value: string,
  options: { [value: string]: string; },
  onValueChange?: (value: string) => void,
};

const List = ({ value, options, onValueChange }: ListProps) => {
  const handleValueChange = (value: string) => {
    if (onValueChange) {
      onValueChange(value);
    }
  };

  return (
    <Stack horizontal spacing="large">
      {Object.entries(options).map(([radiobuttonValue, label]) => (
        <RadioButton
          key={radiobuttonValue}
          label={label}
          value={radiobuttonValue === value}
          onValueChange={() => handleValueChange(radiobuttonValue)}
        />
      ))}
    </Stack>
  );
};

type RadioButtonProps = {
  label: string,
  value: boolean,
  onValueChange?: (value: boolean) => void,
};

const RadioButton = ({ label, value, onValueChange, ...props }: RadioButtonProps) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onValueChange) {
      onValueChange(event.target.checked);
    }
  };

  return (
    <View as="label" horizontal align="middle left" {...props}>
      <View border={!value} fillColor={value ? 'blue-5' : 'white'} align="center" minWidth={24} minHeight={24} style={{ overflow: 'hidden', borderRadius: 1000 }}>
        <input type="radio" checked={value} style={{ position: 'absolute', left: -1000 }} onChange={handleInputChange} />
        {value && (
          <Icon
            color={value ? 'white' : 'gray-3'}
            icon={'check'}
          />
        )}
      </View>
      <Spacer size="small" />
      <Text>{label}</Text>
    </View>
  );

  return (
    <View as="label" horizontal align="middle left" {...props}>
      <input hidden type="radio" checked={value} onChange={handleInputChange} />
      <Icon
        size="xl"
        color={value ? 'blue-5' : 'gray-3'}
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
