import OpenColor from 'open-color';
import { createUseStyles } from 'react-jss';

import View, { ViewProps } from '../view/index.js';
import Input from '../input/index.js';
import Spacer from '../spacer/Spacer.js';

const useStyles = createUseStyles({
  Inner: {
    appearance: 'none',
    flex: 1,
    background: OpenColor.gray[4],
    // boxShadow: 'inset 0 0 0 1px hsla(0, 0%, 0%, 0.15)',
    borderRadius: 1000,
    padding: 0,
    margin: 0,
    marginTop: 8,
    marginBottom: 8,
    height: 6,
    // '&::-webkit-slider-runnable-track': {
    //   background: OpenColor.gray[3],
    //   borderRadius: 1000,
    //   height: 8,
    // },
    '&::-webkit-slider-thumb': {
      appearance: 'none',
      background: 'white',
      width: 24,
      height: 24,
      borderRadius: 1000,
      boxShadow: 'inset 0 0 0 1px hsla(0, 0%, 0%, 0.1)',
    }
  }
});

type SliderProps = {
  value: number,
  onValueChange?: (value: number) => void,
} & ViewProps;

const Slider = ({
  value,
  onValueChange,
  ...props
}: SliderProps) => {
  const styles = useStyles();

  const handleRangeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onValueChange?.(Number(event.target.value));
  };

  return (
    <View flex horizontal align="left" {...props}>
      {/* <Input type="number" value={`${value}`} style={{ width: 60 }} />
      <Spacer size="small" /> */}
      <input type="range" value={value} className={styles.Inner} onChange={handleRangeChange} />
    </View>
  );
};

export default Slider;
