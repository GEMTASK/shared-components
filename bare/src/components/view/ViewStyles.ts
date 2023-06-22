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
    overflow: 'hidden',
    '&:before': {
      content: '""',
      position: 'absolute',
      inset: 0,
      boxShadow: 'inset 0 0 0 1px hsla(0, 0%, 0%, 0.15)',
      borderRadius: 2.5,
    }
  }
});

export default useStyles;
