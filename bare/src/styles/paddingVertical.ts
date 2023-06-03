import { createUseStyles } from 'react-jss';

import Size from '../types/Size.js';

const usePaddingVerticalStyles = createUseStyles({
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
});

export default usePaddingVerticalStyles;
