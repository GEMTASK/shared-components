import React, { useContext, useMemo } from 'react';
import { createUseStyles } from 'react-jss';
import clsx from 'clsx';

import Size from '../../types/Size.js';
import Color from '../../types/Color.js';

import View from '../view/index.js';
import Spacer from '../spacer/index.js';
import Divider from '../divider/index.js';

const useStyles = createUseStyles({
  Stack: {},
});

type StackProps = {
  spacing?: keyof typeof Size,
  spacingColor?: Color,
  negativeSpacing?: keyof typeof Size,
  divider?: boolean,
  dividerInset?: number,
  className?: string,
  children?: React.ComponentProps<typeof View>['children'],
} & React.ComponentProps<typeof View>;

const Stack = ({
  spacing,
  spacingColor,
  negativeSpacing,
  divider,
  dividerInset,
  className,
  children,
  ...props
}: StackProps) => {
  const styles = useStyles();

  const stackClassName = clsx(
    styles.Stack,
    className,
  );

  return (
    <View className={stackClassName} {...props}>
      {React.Children.map(children, (child, index) => (
        React.isValidElement(child) && <>
          {divider && index > 0 && (
            <Divider spacing={spacing} spacingColor={spacingColor} style={{ marginLeft: dividerInset }} />
          )}
          {(spacing || negativeSpacing) && !divider && index > 0 && (
            <Spacer size={spacing} negativeSize={negativeSpacing} fillColor={spacingColor} />
          )}
          {child}
        </>
      ))}
    </View>
  );
};

export default Stack;
