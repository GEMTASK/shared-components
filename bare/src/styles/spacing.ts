import { createUseStyles } from 'react-jss';

import Size from '../types/Size.js';

const useSpacingStyles = createUseStyles({
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
