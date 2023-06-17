import { createUseStyles } from 'react-jss';

import Size from '../types/Size.js';

const usePaddingVerticalStyles = createUseStyles({
  none: {
    paddingTop: Size.none,
    paddingBottom: Size.none,
  },
  xxsmall: {
    paddingTop: Size.xxsmall,
    paddingBottom: Size.xxsmall,
  },
  xsmall: {
    paddingTop: Size.xsmall,
    paddingBottom: Size.xsmall,
  },
  small: {
    paddingTop: Size.small,
    paddingBottom: Size.small,
  },
  medium: {
    paddingTop: Size.medium,
    paddingBottom: Size.medium,
  },
  large: {
    paddingTop: Size.large,
    paddingBottom: Size.large,
  },
  xlarge: {
    paddingTop: Size.xlarge,
    paddingBottom: Size.xlarge,
  },
  xxlarge: {
    paddingTop: Size.xxlarge,
    paddingBottom: Size.xxlarge,
  },
});

export default usePaddingVerticalStyles;
