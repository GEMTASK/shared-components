import { createUseStyles } from 'react-jss';

const useAlignVerticalStyles = createUseStyles({
  topVertical: {
    justifyContent: 'flex-start',
  },
  middleVertical: {
    justifyContent: 'center',
  },
  bottomVertical: {
    justifyContent: 'flex-end',
  },
  topHorizontal: {
    alignItems: 'flex-start',
  },
  middleHorizontal: {
    alignItems: 'center',
  },
  bottomHorizontal: {
    alignItems: 'flex-end',
  },
});

export default useAlignVerticalStyles;
