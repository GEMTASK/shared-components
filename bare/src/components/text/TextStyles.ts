import React, { useContext } from 'react';
import { createUseStyles } from 'react-jss';

const useInnerStyles = createUseStyles({
  Text: {
    fontSize: 14,
    lineHeight: '20px',
    margin: '-4px 0 -3px 0',
    display: 'inline-block',
    // height: '100%',
    // color: 'hsla(0, 0%, 0%, 0.8)',
    '&:not(a):not([contenteditable])': {
      cursor: 'default',
    },
    // '&[contenteditable], &:active': {
    //   cursor: 'text'
    // },

  },
  Inner: {
    '& p': {
      marginTop: '0.5em',
      marginBottom: 0,
    },
    '& p:first-child': {
      marginTop: 0,
    },
  },
  caps: {
    textTransform: 'uppercase',
  },
});

const useFontSizeStyles = createUseStyles({
  xxsmall: {
    fontSize: 11,
    lineHeight: '18px',
    margin: '-6px 0 -5px 0'
  },
  xsmall: {
    fontSize: 12,
    lineHeight: '18px',
    margin: '-3px 0 -4px 0'
  },
  small: {
    fontSize: 14,
    lineHeight: '20px',
    margin: '-4px 0 -3px 0'
  },
  medium: {
    fontSize: 18,
    lineHeight: '25px',
    margin: '-5px 0 -5px 0'
  },
  large: {
    fontSize: 24,
    lineHeight: '30px',
    margin: '-6px 0 -5px 0'
  },
  xlarge: {
    fontSize: 32,
    lineHeight: '35px',
    margin: '-6px 0 -4px 0'
  },
  xxlarge: {
    fontSize: 40,
    lineHeight: '40px',
    margin: '-4px 0 -3px 0'
  }
});

const useFontWeightStyles = createUseStyles({
  thin: {
    fontWeight: 300,
  },
  normal: {
    fontWeight: 400,
  },
  medium: {
    fontWeight: 500,
  },
  semibold: {
    fontWeight: 600,
  },
  bold: {
    fontWeight: 700,
  }
});

export {
  useInnerStyles,
  useFontSizeStyles,
  useFontWeightStyles,
};
