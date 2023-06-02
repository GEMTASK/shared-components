type ShorthandAlign =
  | 'top left' | 'top' | 'top center' | 'top right'
  | 'left' | 'middle left' | 'center' | 'middle center' | 'middle right' | 'right'
  | 'bottom left' | 'bottom' | 'bottom center' | 'bottom right'
  ;

type AlignVertical = 'top' | 'middle' | 'bottom';
type AlignHorizontal = 'left' | 'center' | 'right';

export type {
  ShorthandAlign,
  AlignVertical,
  AlignHorizontal
};
