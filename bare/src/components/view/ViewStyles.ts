import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  View: {
    display: 'flex',
    position: 'relative',
    appearance: 'none',
    flexDirection: 'column',
    boxSizing: 'border-box',
    margin: 0,
    padding: 0,
    // outline: 'none',
  },
  horizontal: {
    flexDirection: 'row',
  },
  flex: {
    flex: 1,
  },
  absolute: {
    position: 'absolute',
  },
  fixed: {
    position: 'fixed',
  },
  border: {
    borderRadius: 2.5,
    '&:before': {
      content: '""',
      position: 'absolute',
      inset: 0,
      borderRadius: 2.5,
      pointerEvents: 'none',
      zIndex: 1,
    }
  },
  shadow: {
    borderRadius: 2.5,
    boxShadow: '0 2px 4px hsla(0, 0%, 0%, 0.1)',
  },
  noScrollbar: {
    '&::-webkit-scrollbar': {
      display: 'none',
    },
    '-ms-overflow-style': 'none',
    'scrollbar-width': 'none',
  },
  hoverTarget: {
  },
  hoverParent: {
    opacity: 0.0,
    transition: 'opacity 0.1s',
    '$hoverTarget:hover &': {
      opacity: 1.0,
    }
  }
});

export default useStyles;
