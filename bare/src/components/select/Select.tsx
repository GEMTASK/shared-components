import { useStyles as useControlStyles } from '../control/Control.js';

import View, { ViewProps } from '../view/index.js';
import Text from '../text/index.js';
import Spacer from '../spacer/index.js';
import Icon from '../icon/index.js';

type FieldProps<T extends React.ElementType> = {
  as: T,
  label: string,
} & React.ComponentProps<T>;

const Field = <T extends React.ElementType>({
  as,
  label,
  ...props
}: FieldProps<T>) => {
  const Component = as;

  return (
    <View>
      {!label && (
        <>
          <Text caps fontSize="xxsmall" fontWeight="semibold" textColor="gray-6">{label}</Text>
          <Spacer size="small" />
        </>
      )}
      <Component {...props} />
    </View>
  );
};

type SelectProps = {
  value: string,
  options?: { [value: string]: string; },
  onChange?: (value: string) => void,
} & Omit<ViewProps, 'onChange'>;

const Select = ({
  value,
  options = {},
  onChange,
}: SelectProps) => {
  const controlStyles = useControlStyles();

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (onChange) {
      onChange(event.target.value);
    }
  };

  return (
    <View style={{ position: 'relative' }}>
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
      <Icon icon="chevron-down" style={{ position: 'absolute', right: 12, top: '50%', marginTop: -8, pointerEvents: 'none' }} />
    </View>
  );
};

export default Select;
