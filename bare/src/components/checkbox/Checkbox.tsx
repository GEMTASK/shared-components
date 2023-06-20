import { useContext } from 'react';
import { concat, without } from 'rambda';

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
import useStyles from '../view/ViewStyles.js';

type ListProps = {
  value: string[],
  options: { [value: string]: string; },
  onChange?: (value: string[]) => void,
};

const List = ({ value, options, onChange }: ListProps) => {
  const handleChange = (value: string[]) => {
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <Stack horizontal style={{ columnGap: 16, rowGap: 8, flexWrap: 'wrap' }}>
      {Object.entries(options).map(([checkboxValue, label]) => (
        <Checkbox
          flex
          key={checkboxValue}
          label={label}
          value={value.includes(checkboxValue)}
          onChange={(checked: boolean) => handleChange(
            checked ? concat([checkboxValue], value) : without([checkboxValue], value)
          )}
        />
      ))}
      <View flex />
      <View flex />
    </Stack>
  );
};

type CheckboxProps = {
  label: string,
  value: boolean,
  onChange?: (value: boolean) => void,
} & Omit<ViewProps, 'onChange'>;

const Checkbox = ({ label, value, onChange, ...props }: CheckboxProps) => {
  const styles = useControlStyles();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(event.target.checked);
    }
  };

  return (
    <View as="label" horizontal align="middle left" {...props}>
      <View border fillColor={value ? 'blue-5' : 'white'} align="center" minWidth={24} minHeight={24} style={{ overflow: 'hidden', boxShadow: value ? 'none' : undefined }}>
        <input type="checkbox" checked={value} style={{ position: 'absolute', left: -1000 }} onChange={handleInputChange} />
        {value && (
          <Icon
            size="sm"
            color={value ? OpenColor.white : OpenColor.gray[3]}
            icon={'check'}
          />
        )}
      </View>
      <Spacer size="small" />
      <Text>{label}</Text>
    </View>
  );
};

Checkbox.List = List;

export default Checkbox;
