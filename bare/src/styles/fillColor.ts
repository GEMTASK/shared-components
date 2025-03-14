import OpenColor from 'open-color';
import { createUseStyles } from 'react-jss';
import Color, { Hue } from '../types/Color.js';

const hues = [
  'gray', 'red', 'pink', 'grape', 'violet', 'indigo', 'blue', 'cyan', 'teal', 'green', 'lime', 'yellow', 'orange'
] as const;

const colors = Object.assign({}, ...hues.map(hue => OpenColor[hue].reduce((colors, color, index) => ({
  ...colors,
  [`${hue}-${index}`]: {
    background: color
  }
}), {}))) as { [key in Hue]: string; };

const useFillColorStyles = createUseStyles({
  'transparent': {
    background: 'transparent'
  },
  'black': {
    background: OpenColor.black
  },
  'white': {
    background: OpenColor.white
  },
  ...colors,
  'alpha-1': {
    background: 'hsla(0, 0%, 0%, 0.1)'
  },
  'white-2': {
    background: 'hsla(0, 0%, 100%, 0.2)'
  }
});

export default useFillColorStyles;

export {
  hues,
};
