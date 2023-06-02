import OpenColor from 'open-color';
import { createUseStyles } from 'react-jss';

const colors = ['gray-0', 'gray-1', 'gray-2', 'gray-3', 'gray-4', 'gray-5', 'gray-6', 'gray-7', 'gray-8', 'gray-9'] as const;

type Color = typeof colors[number];

const gray2 = OpenColor.gray.reduce((accum, color, index) => ({
  ...accum,
  [`gray-${index}`]: {
    background: color
  },
}), {} as { [key in Color]: string; });

const gray = {
  'gray-0': {
    background: OpenColor.gray[0],
  },
  'gray-1': {
    background: OpenColor.gray[1],
  },
  'gray-2': {
    background: OpenColor.gray[2],
  },
  'gray-3': {
    background: OpenColor.gray[3],
  },
  'gray-4': {
    background: OpenColor.gray[4],
  },
  'gray-5': {
    background: OpenColor.gray[5],
  },
  'gray-6': {
    background: OpenColor.gray[6],
  },
  'gray-7': {
    background: OpenColor.gray[7],
  },
  'gray-8': {
    background: OpenColor.gray[8],
  },
  'gray-9': {
    background: OpenColor.gray[9],
  },
};

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
  ...gray2,
});

export default useFillColorStyles;
