import { createUseStyles } from 'react-jss';
import OpenColor from 'open-color';

import Size from '../../types/Size.js';

const useStyles = createUseStyles({
  Button: {
    appearance: 'none',
    border: 'none',
    borderRadius: 2.5,
    '&:enabled:hover': {
      filter: 'brightness(1.04)'
    },
    '&:enabled:active': {
      filter: 'brightness(0.96)'
    }
  },
  default: {
    '&:enabled:hover': { background: OpenColor.gray[3], '&:before': { boxShadow: 'none' } },
    '&:enabled:active': { background: OpenColor.gray[3] },
  },
  hover: {
    '&:enabled:hover': {
      background: `${OpenColor.gray[6]}30`,
    },
    '&:enabled:active': {
      background: `${OpenColor.gray[8]}30`,
    },
  },
  primary: {
    // '&:before': {
    //   boxShadow: 'none'
    // },
    '&:enabled:hover': {
      background: OpenColor.blue[0],
      filter: 'none',
    },
    '&:enabled:active': {
      background: OpenColor.blue[1],
      filter: 'none',
    },
  },
  round: {
    borderRadius: 1000,
  },
  selected: {
    filter: 'brightness(0.94)',
  },
  xsmall: {
    minWidth: 24,
    minHeight: 24,
  },
  small: {
    minWidth: 32,
    minHeight: 32,
  },
  medium: {
    minWidth: 40,
    minHeight: 40,
  },
  disabled: {
    opacity: 0.5,
  }
});

export default useStyles;
