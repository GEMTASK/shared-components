import { createUseStyles } from 'react-jss';

const useAlignHorizontalStyles = createUseStyles({
  leftVertical: {
    alignItems: 'flex-start',
  },
  centerVertical: {
    alignItems: 'center',
  },
  rightVertical: {
    alignItems: 'flex-end',
  },
  leftHorizontal: {
    justifyContent: 'flex-start',
  },
  centerHorizontal: {
    justifyContent: 'center',
  },
  rightHorizontal: {
    justifyContent: 'flex-end',
  },
});

export default useAlignHorizontalStyles;
