import OpenColor from 'open-color';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  View: {
    display: 'flex',
    appearance: 'none',
    flexDirection: 'column',
    boxSizing: 'border-box',
    margin: 0,
    padding: 0,
  },
  horizontal: {
    flexDirection: 'row',
  },
  flex: {
    flex: 1,
  },
  border: {
    position: 'relative',
    borderRadius: 2.5,
    '&:before': {
      content: '""',
      position: 'absolute',
      inset: 0,
      boxShadow: `inset 0 0 0 1px hsla(0, 0%, 0%, 0.15)`,
      borderRadius: 2.5,
      pointerEvents: 'none',
    }
  },
  shadow: {
    position: 'relative',
    borderRadius: 2.5,
    '&:after': {
      content: '""',
      position: 'absolute',
      inset: 0,
      boxShadow: '0 2px 4px hsla(0, 0%, 0%, 0.1)',
      borderRadius: 2.5,
      pointerEvents: 'none',
    }
  },
});

export default useStyles;
