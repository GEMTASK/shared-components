import OpenColor from 'open-color';
import { createUseStyles } from 'react-jss';
import Color, { Hue } from '../types/Color.js';

const hues = [
  'gray', 'red', 'pink', 'grape', 'violet', 'indigo', 'blue', 'cyan', 'teal', 'green', 'lime', 'yellow', 'orange'
] as const;

const colors = Object.assign({}, ...hues.map(hue => OpenColor[hue].reduce((colors, color, index) => ({
  ...colors,
  [`${hue}-${index}`]: {
    color: color
  }
}), {}))) as { [key in Hue]: string; };

const useTextColorStyles = createUseStyles({
  'transparent': {
    color: 'transparent'
  },
  'black': {
    color: OpenColor.black
  },
  'white': {
    color: OpenColor.white
  },
  ...colors,
  'alpha-1': {
    color: 'hsla(0, 0%, 0%, 0.1)'
  }
});

export default useTextColorStyles;
