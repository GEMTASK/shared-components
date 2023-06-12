import { createUseStyles } from 'react-jss';
import OpenColor from 'open-color';

import Size from '../../types/Size.js';

const useStyles = createUseStyles({
  Button: {
    appearance: 'none',
    border: 'none',
    borderRadius: Size.xxsmall,
    '&:enabled:hover': {
      filter: 'brightness(1.04)'
    },
    '&:enabled:active': {
      filter: 'brightness(0.90)'
    }
  },
  default: {
    '&:enabled:hover': { background: OpenColor.gray[3] },
    '&:enabled:active': { background: OpenColor.gray[3] },
  },
  hover: {
    '&:enabled:hover': {
      background: `${OpenColor.gray[6]}30`,
    },
    '&:enabled:active': {
      background: `${OpenColor.gray[5]}30`,
      filter: 'brightness(0.0)',
    },
  },
  primary: {
    '&:enabled:hover': {
      background: OpenColor.blue[1]
    },
    '&:enabled:active': {
      background: OpenColor.blue[1]
    },
  },
  round: {
    borderRadius: 1000,
  },
  selected: {
    filter: 'brightness(0.90)',
  },
  xsmall: {
    minHeight: 24,
  },
  small: {
    minHeight: 32,
  },
  medium: {
    minHeight: 40,
  },
  disabled: {
    opacity: 0.5,
  }
});

export default useStyles;
