type Transparent = 'transparent';

type White = 'white';
type Black = 'black';

type Gray =
  | 'gray-0'
  | 'gray-1'
  | 'gray-2'
  | 'gray-3'
  | 'gray-4'
  | 'gray-5'
  | 'gray-6'
  | 'gray-7'
  | 'gray-8'
  | 'gray-9';

type Color =
  | Transparent
  | White
  | Black
  | Gray
  ;

export default Color;
