import OpenColor from 'open-color';
import { createUseStyles } from 'react-jss';

const colors = [
  'gray-0', 'gray-1', 'gray-2', 'gray-3', 'gray-4', 'gray-5', 'gray-6', 'gray-7', 'gray-8', 'gray-9',
  'red-0', 'red-1', 'red-2', 'red-3', 'red-4', 'red-5', 'red-6', 'red-7', 'red-8', 'red-9',
] as const;

type Color = typeof colors[number];

const gray2 = colors.reduce((accum, color) => {
  const [hue, level] = color.split('-');

  return ({
    ...accum,
    [`${hue}-${level}`]: {
      background: (OpenColor as any)[hue][level]
    },
  });
}, {} as { [key in Color]: string; });

// const hues = ['gray', 'red'];

// const gray3 = [...OpenColor.gray, ...OpenColor.red].reduce((accum, color, index) => ({
//   ...accum,
//   [`${hues[Math.floor(index / 10)]}-${index % 10}`]: {
//     background: color
//   }
// }), {} as { [key in Color]: string; });

// console.log('gray3', gray3);

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
