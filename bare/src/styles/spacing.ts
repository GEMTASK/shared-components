import { createUseStyles } from 'react-jss';

import Size from '../types/Size.js';

const useSpacingStyles = createUseStyles({
  line: {
    gap: 1,
  },
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
});

export default useSpacingStyles;
