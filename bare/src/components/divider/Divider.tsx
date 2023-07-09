import { useContext } from 'react';
import clsx from 'clsx';
import { createUseStyles } from 'react-jss';

import Size from '../../types/Size.js';
import Color from '../../types/Color.js';

import View, { ViewProps } from '../view/index.js';
import Spacer from '../spacer/index.js';

import ViewContext from '../view/ViewContext.js';

const useStyles = createUseStyles({
  Divider: {
  },
  horizontal: {
    minWidth: 1,
    justifySelf: 'stretch',
  },
  vertical: {
    minHeight: 1,
    alignSelf: 'stretch',
  }
});

type DividerProps = {
  spacing?: keyof typeof Size,
  fillColor?: Color,
  spacingColor?: Color,
  className?: string,
} & ViewProps;

const Divider = ({
  spacing,
  fillColor = 'gray-3',
  spacingColor,
  className,
  ...props
}: DividerProps) => {
  const { parentHorizontal } = useContext(ViewContext);

  const styles = useStyles();

  const dividerClassName = clsx(
    styles[parentHorizontal ? 'horizontal' : 'vertical'],
    className,
  );

  return (
    <>
      {spacing && <Spacer size={spacing} fillColor={spacingColor} />}
      <View fillColor={fillColor} className={dividerClassName} {...props} />
      {spacing && <Spacer size={spacing} fillColor={spacingColor} />}
    </>
  );
};

export default Divider;
