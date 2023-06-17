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
      <Icon size="xl" color={OpenColor.blue[5]} icon="check-square" />
      <Spacer size="small" />
      <Text>{label}</Text>
    </View>
  );
};

export default Checkbox;
