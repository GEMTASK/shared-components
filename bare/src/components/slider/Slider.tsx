import OpenColor from 'open-color';
import { createUseStyles } from 'react-jss';

import View from '../view/index.js';
import Input from '../input/index.js';
import Spacer from '../spacer/Spacer.js';

const useStyles = createUseStyles({
  Inner: {
    appearance: 'none',
    flex: 1,
    background: OpenColor.gray[3],
    // boxShadow: 'inset 0 0 0 1px hsla(0, 0%, 0%, 0.15)',
    borderRadius: 1000,
    padding: 0,
    margin: 0,
    marginTop: 8,
    marginBottom: 8,
    height: 4,
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
      boxShadow: 'inset 0 0 0 1px hsla(0, 0%, 0%, 0.15)',
    }
  }
});

type SliderProps = {
  value: number,
  onChange?: (value: number) => void,
};

const Slider = ({
  value,
  onChange,
}: SliderProps) => {
  const styles = useStyles();

  const handleRangeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(Number(event.target.value));
  };

  return (
    <View flex horizontal align="left">
      <Input type="number" value={`${value}`} style={{ width: 60 }} />
      <Spacer size="small" />
      <input type="range" value={value} className={styles.Inner} onChange={handleRangeChange} />
    </View>
  );
};

export default Slider;
