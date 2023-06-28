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
      zIndex: 1,
    }
  },
  shadow: {
    position: 'relative',
    borderRadius: 2.5,
    '&:after': {
      content: '""',
      position: 'absolute',
      inset: 0,
      boxShadow: '0 2px 2px hsla(0, 0%, 0%, 0.1)',
      borderRadius: 2.5,
      pointerEvents: 'none',
    }
  },
  noScrollbar: {
    '&::-webkit-scrollbar': {
      display: 'none',
    },
    '-ms-overflow-style': 'none',
    'scrollbar-width': 'none',
  }
});

export default useStyles;
