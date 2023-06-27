import OpenColor from 'open-color';
import { createUseStyles } from 'react-jss';

import View from '../view/index.js';

const useStyles = createUseStyles({
  Inner: {
    appearance: 'none',
    background: OpenColor.gray[3],
    borderRadius: 1000,
    padding: 0,
    margin: 0,
    marginTop: 8,
    marginBottom: 8,
    height: 8,
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

const Slider = ({ value }: any) => {
  const styles = useStyles();

  return (
    <View>
      <input type="range" className={styles.Inner} />
    </View>
  );
};

export default Slider;
