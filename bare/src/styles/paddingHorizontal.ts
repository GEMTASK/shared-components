import { createUseStyles } from 'react-jss';

import Size from '../types/Size.js';

const usePaddingHorizontalStyles = createUseStyles({
  xsmall: {
    paddingLeft: Size.xsmall,
    paddingRight: Size.xsmall,
  },
  small: {
    paddingLeft: Size.small,
    paddingRight: Size.small,
  },
  medium: {
    paddingLeft: Size.medium,
    paddingRight: Size.medium,
  },
  large: {
    paddingLeft: Size.large,
    paddingRight: Size.large,
  },
});

export default usePaddingHorizontalStyles;