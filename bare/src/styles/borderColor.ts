import OpenColor from 'open-color';
import { createUseStyles } from 'react-jss';
import Color, { Hue } from '../types/Color.js';

const hues = [
  'gray', 'red', 'pink', 'grape', 'violet', 'indigo', 'blue', 'cyan', 'teal', 'green', 'lime', 'yellow', 'orange'
] as const;

const colors = Object.assign({}, ...hues.map(hue => OpenColor[hue].reduce((colors, color, index) => ({
  ...colors,
  [`${hue}-${index}`]: {
    '&::before': {
      boxShadow: `inset 0 0 0 1px ${color}`
    }
  }
}), {}))) as { [key in Hue]: string; };

const useBorderColorStyles = createUseStyles({
  'transparent': {
    '&::before': {
      boxShadow: `inset 0 0 0 1px transparent`
    }
  },
  'black': {
    '&::before': {
      boxShadow: `inset 0 0 0 1px ${OpenColor.black}`
    }
  },
  'white': {
    '&::before': {
      boxShadow: `inset 0 0 0 1px ${OpenColor.white}`
    }
  },
  ...colors,
  'alpha-1': {
    '&::before': {
      boxShadow: `inset 0 0 0 1px hsla(0, 0%, 0%, 0.1)`
    }
  }
});

export default useBorderColorStyles;
