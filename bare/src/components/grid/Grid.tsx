import { useContext } from 'react';
import clsx from 'clsx';
import { createUseStyles } from 'react-jss';

import Size from '../../types/Size.js';
import Color from '../../types/Color.js';

import View, { ViewProps } from '../view/index.js';
import Spacer from '../spacer/index.js';

import ViewContext from '../view/ViewContext.js';

const useStyles = createUseStyles({
  Grid: {
    display: 'grid'
  },
});

type GridProps = {
  columns?: number,
  className?: string,
} & ViewProps;

const Grid = ({
  columns,
  className,
  style,
  children,
  ...props
}: GridProps) => {
  const styles = useStyles();

  const gridClassName = clsx(
    styles.Grid,
    className,
  );

  // gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))'

  const gridStyle = {
    ...(columns && { gridTemplateColumns: `repeat(${columns ?? ''}, 1fr)` }),
    ...style,
  };

  return (
    <View className={gridClassName} style={gridStyle} {...props}>
      {children}
    </View>
  );
};

export default Grid;
