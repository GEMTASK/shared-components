import { ShorthandAlign, AlignVertical, AlignHorizontal } from '../types/Align';

function shorthandAlignToStyle(align: ShorthandAlign | undefined): [AlignVertical | undefined, AlignHorizontal | undefined] {
  switch (align) {
    case 'top left':
      return ['top', 'left'];
    case 'top':
    case 'top center':
      return ['top', 'center'];
    case 'top right':
      return ['top', 'right'];
    case 'left':
    case 'middle left':
      return ['middle', 'center'];
    case 'center':
    case 'middle center':
      return ['middle', 'center'];
    case 'right':
    case 'middle right':
      return ['middle', 'right'];
    case 'bottom left':
      return ['bottom', 'left'];
    case 'bottom':
    case 'bottom center':
      return ['bottom', 'center'];
    case 'bottom right':
      return ['bottom', 'right'];
    default:
      return [undefined, undefined];
  }
}

export {
  shorthandAlignToStyle,
};
