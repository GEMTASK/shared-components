import React, { useContext, useMemo } from 'react';

import Size from '../../types/Size.js';
import Color from '../../types/Color.js';

import View from '../view/index.js';
import Spacer from '../spacer/index.js';
import Divider from '../divider/index.js';

type StackProps = {
  spacing?: keyof typeof Size,
  spacingColor?: Color,
  negativeSpacing?: keyof typeof Size,
  divider?: boolean,
  dividerInset?: number,
} & React.ComponentProps<typeof View>;

const Stack = ({
  spacing,
  spacingColor,
  negativeSpacing,
  divider,
  dividerInset,
  children,
  ...props
}: StackProps) => {
  return (
    <View {...props}>
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
