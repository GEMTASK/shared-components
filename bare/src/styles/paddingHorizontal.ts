import { createUseStyles } from 'react-jss';

import Size from '../types/Size.js';

const usePaddingHorizontalStyles = createUseStyles({
  xxsmall: {
    paddingLeft: Size.xxsmall,
    paddingRight: Size.xxsmall,
  },
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
  xlarge: {
    paddingLeft: Size.xlarge,
    paddingRight: Size.xlarge,
  },
  xxlarge: {
    paddingLeft: Size.xxlarge,
    paddingRight: Size.xxlarge,
  },
});

export default usePaddingHorizontalStyles;
