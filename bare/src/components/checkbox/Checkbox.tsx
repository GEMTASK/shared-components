import { useContext } from 'react';
import { concat, without } from 'rambda';
import OpenColor from 'open-color';

import View, { ViewProps } from '../view/index.js';
import Text from '../text/index.js';
import Icon from '../icon/index.js';
import Spacer from '../spacer/index.js';
import Stack from '../stack/index.js';

import { useStyles as useControlStyles } from '../control/Control.js';

type ListProps = {
  value: string[],
  options: { [value: string]: string; },
  onValueChange?: (value: string[]) => void,
};

const List = ({ value, options, onValueChange }: ListProps) => {
  const handleValueChange = (value: string[]) => {
    if (onValueChange) {
      onValueChange(value);
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
          onValueChange={(checked: boolean) => handleValueChange(
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
  onValueChange?: (value: boolean) => void,
} & Omit<ViewProps, 'onChange'>;

const Checkbox = ({ label, value, onValueChange, ...props }: CheckboxProps) => {
  const styles = useControlStyles();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onValueChange) {
      onValueChange(event.target.checked);
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
