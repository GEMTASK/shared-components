import { useContext } from 'react';
import { createUseStyles } from 'react-jss';
import clsx from 'clsx';

import Size from '../../types/Size.js';

import View, { ViewProps } from '../view/index.js';

import ViewContext from '../view/ViewContext.js';

const useSpacingStyles = createUseStyles({
  noneVertical: {
    minHeight: Size.none,
    alignSelf: 'stretch',
  },
  xxsmallVertical: {
    minHeight: Size.xxsmall,
    alignSelf: 'stretch',
  },
  xsmallVertical: {
    minHeight: Size.xsmall,
    alignSelf: 'stretch',
  },
  smallVertical: {
    minHeight: Size.small,
    alignSelf: 'stretch',
  },
  mediumVertical: {
    minHeight: Size.medium,
    alignSelf: 'stretch',
  },
  largeVertical: {
    minHeight: Size.large,
    alignSelf: 'stretch',
  },
  xlargeVertical: {
    minHeight: Size.xlarge,
    alignSelf: 'stretch',
  },
  xxlargeVertical: {
    minHeight: Size.xxlarge,
    alignSelf: 'stretch',
  },
  //
  noneHorizontal: {
    minWidth: Size.none,
    justifySelf: 'stretch',
  },
  xxsmallHorizontal: {
    minWidth: Size.xxsmall,
    justifySelf: 'stretch',
  },
  xsmallHorizontal: {
    minWidth: Size.xsmall,
    justifySelf: 'stretch',
  },
  smallHorizontal: {
    minWidth: Size.small,
    justifySelf: 'stretch',
  },
  mediumHorizontal: {
    minWidth: Size.medium,
    justifySelf: 'stretch',
  },
  largeHorizontal: {
    minWidth: Size.large,
    justifySelf: 'stretch',
  },
  xlargeHorizontal: {
    minWidth: Size.xlarge,
    justifySelf: 'stretch',
  },
  xxlargeHorizontal: {
    minWidth: Size.xxlarge,
    justifySelf: 'stretch',
  },
});

const useNegativeSpacingStyles = createUseStyles({
  noneVertical: {
    marginTop: Size.none,
    alignSelf: 'stretch',
  },
  xxsmallVertical: {
    marginTop: -Size.xxsmall,
    alignSelf: 'stretch',
  },
  xsmallVertical: {
    marginTop: -Size.xsmall,
    alignSelf: 'stretch',
  },
  smallVertical: {
    marginTop: -Size.small,
    alignSelf: 'stretch',
  },
  mediumVertical: {
    marginTop: -Size.medium,
    alignSelf: 'stretch',
  },
  largeVertical: {
    marginTop: -Size.large,
    alignSelf: 'stretch',
  },
  xlargeVertical: {
    marginTop: -Size.xlarge,
    alignSelf: 'stretch',
  },
  xxlargeVertical: {
    marginTop: -Size.xxlarge,
    alignSelf: 'stretch',
  },
  //
  noneHorizontal: {
    marginLeft: Size.none,
    justifySelf: 'stretch',
  },
  xxsmallHorizontal: {
    marginLeft: -Size.xxsmall,
    justifySelf: 'stretch',
  },
  xsmallHorizontal: {
    marginLeft: -Size.xsmall,
    justifySelf: 'stretch',
  },
  smallHorizontal: {
    marginLeft: -Size.small,
    justifySelf: 'stretch',
  },
  mediumHorizontal: {
    marginLeft: -Size.medium,
    justifySelf: 'stretch',
  },
  largeHorizontal: {
    marginLeft: -Size.large,
    justifySelf: 'stretch',
  },
  xlargeHorizontal: {
    marginLeft: -Size.xlarge,
    justifySelf: 'stretch',
  },
  xxlargeHorizontal: {
    marginLeft: -Size.xxlarge,
    justifySelf: 'stretch',
  },
});

type SpacerProps = {
  size?: keyof typeof Size,
  negativeSize?: keyof typeof Size,
  className?: string,
} & ViewProps;

const Spacer = ({
  size,
  negativeSize,
  className,
  ...props
}: SpacerProps) => {
  const { isHorizontal } = useContext(ViewContext);

  const spacingStyles = useSpacingStyles();
  const negativeSpacingStyles = useNegativeSpacingStyles();

  const spacerClassName = clsx(
    size && spacingStyles[`${size}${isHorizontal ? 'Horizontal' : 'Vertical'}`],
    negativeSize && negativeSpacingStyles[`${negativeSize}${isHorizontal ? 'Horizontal' : 'Vertical'}`],
    className,
  );

  return (
    <View className={spacerClassName} {...props} />
  );
};

export default Spacer;
