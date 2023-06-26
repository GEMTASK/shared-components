import OpenColor from 'open-color';
import { createUseStyles } from 'react-jss';

import View from '../view/index.js';

const useStyles = createUseStyles({
  Inner: {
    appearance: 'none',
    background: 'none',
    padding: 0,
    margin: 0,
    '&::-webkit-slider-runnable-track': {
      background: OpenColor.gray[3],
      borderRadius: 1000,
      height: 8,
    },
    '&::-webkit-slider-thumb': {
      appearance: 'none',
      background: 'white',
      height: 8,
    }
  }
});

const Slider = ({ value }: any) => {
  const styles = useStyles();

  return (
    <View>
      <input type="range" className={styles.Inner} />
    </View>
  );
};

export default Slider;
