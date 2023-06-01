import React from 'react';
import { createUseStyles } from 'react-jss';
import OpenColor from 'open-color';

const useStyles = createUseStyles({
  View: {
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
    background: OpenColor.red[9],
  },
  horizontal: {
    flexDirection: 'row',
  },
  flex: {
    flex: 1,
  },
});

type ViewProps<T extends React.ElementType> = {
  as?: T,
  children?: React.ReactNode,
} & React.ComponentPropsWithoutRef<T>;

const View = <T extends React.ElementType = 'span'>({
  as,
  children,
  ...props
}: ViewProps<T>) => {
  const Component = as ?? 'div';

  const styles = useStyles();

  return (
    <Component className={styles.View} {...props}>
      {children}
    </Component>
  );
};

View.defaultProps = {
  as: 'div'
};

export default View;
