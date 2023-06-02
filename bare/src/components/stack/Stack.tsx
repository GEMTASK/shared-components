import React, { useContext, useMemo } from 'react';
import { createUseStyles } from 'react-jss';
import clsx from 'clsx';

import View from '../view/index.js';

const useStyles = createUseStyles({
  Stack: {
  },
});

const useSpacingStyles = createUseStyles({
  xsmall: {
    gap: 4,
  },
  small: {
    gap: 8,
  },
  medium: {
    gap: 16,
  },
});

type StackProps = {
  spacing?: 'small',
  className?: string,
  children?: React.ComponentProps<typeof View>['children'],
} & React.ComponentProps<typeof View>;

const Stack = ({
  spacing,
  className,
  children,
  ...props
}: StackProps) => {
  const styles = useStyles();
  const spacingStyles = useSpacingStyles();

  const stackClassName = clsx(
    styles.Stack,
    spacing && spacingStyles[spacing],
    className,
  );

  return (
    <View className={stackClassName} {...props}>
      {children}
    </View>
  );
};

export default Stack;
