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
    '&:not($text):enabled:hover': { background: OpenColor.gray[3] },
    '&:enabled:active': { background: OpenColor.gray[3] },
  },
  hover: {
    '&:enabled:hover': {
      background: `${OpenColor.gray[3]}`,
      // background: `${OpenColor.gray[6]}30`,
    },
    '&:enabled:active': {
      background: `${OpenColor.gray[3]}`,
      // background: `${OpenColor.gray[8]}30`,
    },
  },
  primary: {
    '&:enabled:hover': {
      background: OpenColor.blue[0],
    },
    '&:enabled:active': {
      background: OpenColor.blue[1],
    },
  },
  primarySolid: {
    '&:enabled:hover': {
      filter: 'brightness(1.08)'
    },
    '&:enabled:active': {
      filter: 'brightness(0.96)'
    }
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
  text: {
    minWidth: 0,
    minHeight: 0,
    '&:enabled:hover': { filter: 'brightness(1.08)' },
    '&:enabled:active': { background: OpenColor.gray[3] },
  },
  disabled: {
    opacity: 0.5,
  }
});

export default useStyles;
