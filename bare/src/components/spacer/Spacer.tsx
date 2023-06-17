import { useContext } from 'react';
import { createUseStyles } from 'react-jss';
import clsx from 'clsx';

import Size from '../../types/Size.js';

import View, { ViewProps } from '../view/index.js';

import ViewContext from '../view/ViewContext.js';

const useSpacingStyles = createUseStyles({
  noneVertical: {
    height: Size.none,
    alignSelf: 'stretch',
  },
  xxsmallVertical: {
    height: Size.xxsmall,
    alignSelf: 'stretch',
  },
  xsmallVertical: {
    height: Size.xsmall,
    alignSelf: 'stretch',
  },
  smallVertical: {
    height: Size.small,
    alignSelf: 'stretch',
  },
  mediumVertical: {
    height: Size.medium,
    alignSelf: 'stretch',
  },
  largeVertical: {
    height: Size.large,
    alignSelf: 'stretch',
  },
  xlargeVertical: {
    height: Size.xlarge,
    alignSelf: 'stretch',
  },
  xxlargeVertical: {
    height: Size.xxlarge,
    alignSelf: 'stretch',
  },
  noneHorizontal: {
    width: Size.none,
    justifySelf: 'stretch',
  },
  xxsmallHorizontal: {
    width: Size.xxsmall,
    justifySelf: 'stretch',
  },
  xsmallHorizontal: {
    width: Size.xsmall,
    justifySelf: 'stretch',
  },
  smallHorizontal: {
    width: Size.small,
    justifySelf: 'stretch',
  },
  mediumHorizontal: {
    width: Size.medium,
    justifySelf: 'stretch',
  },
  largeHorizontal: {
    width: Size.large,
    justifySelf: 'stretch',
  },
  xlargeHorizontal: {
    width: Size.xlarge,
    justifySelf: 'stretch',
  },
  xxlargeHorizontal: {
    width: Size.xxlarge,
    justifySelf: 'stretch',
  },
});

type SpacerProps = {
  size?: keyof typeof Size,
  className?: string,
} & ViewProps;

const Spacer = ({
  size,
  className,
  ...props
}: SpacerProps) => {
  const { isHorizontal } = useContext(ViewContext);

  const spacingStyles = useSpacingStyles();

  const spacerClassName = clsx(
    size && spacingStyles[`${size}${isHorizontal ? 'Horizontal' : 'Vertical'}`],
    className,
  );

  return (
    <View className={spacerClassName} {...props} />
  );
};

export default Spacer;
