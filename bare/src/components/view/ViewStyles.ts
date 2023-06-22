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
  borderOrShadow: {
    position: 'relative',
    borderRadius: 2.5,
    '&:before': {
      content: '""',
      position: 'absolute',
      inset: 0,
      borderRadius: 2.5,
      pointerEvents: 'none',
    }
  },
  border: {
    '&:before': {
      boxShadow: 'inset 0 0 0 1px hsla(0, 0%, 0%, 0.15)',
    }
  },
  shadow: {
    '&:before': {
      boxShadow: '0 2px 4px hsla(0, 0%, 0%, 0.1)',
    }
  },
  borderAndShadow: {
    '&:before': {
      boxShadow: '0 2px 4px hsla(0, 0%, 0%, 0.1), inset 0 0 0 1px hsla(0, 0%, 0%, 0.15)',
    }
  },
});

export default useStyles;
