import { createUseStyles } from 'react-jss';

import Size from '../types/Size.js';

const useSpacingStyles = createUseStyles({
  xxsmall: {
    gap: Size.xxsmall,
  },
  xsmall: {
    gap: Size.xsmall,
  },
  small: {
    gap: Size.small,
  },
  medium: {
    gap: Size.medium,
  },
  large: {
    gap: Size.large,
  },
  xlarge: {
    gap: Size.xlarge,
  },
  xxlarge: {
    gap: Size.xxlarge,
  },
});

export default useSpacingStyles;
