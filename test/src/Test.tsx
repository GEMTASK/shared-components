import React from 'react';

type ViewProps<T extends React.ElementType = 'div'> = {
  as?: T,
} & React.ComponentPropsWithoutRef<T>;

const View = <T extends React.ElementType = 'div'>({
  as,
  ...props
}: ViewProps<T>) => {
  const Component = as ?? 'div';

  return (
    <Component {...props} />
  );
};

type DefaultView = typeof View<'div'>;

const func = View;

type ButtonProps = {
  title?: string,
  // } & React.ComponentProps<DefaultView>;
} & ViewProps;

const Button = ({
  title
}: ButtonProps) => {
  return (
    <View as="button" />
  );
};

<Button title="Press Me" />;



type Z = Parameters<typeof View>;
type ZZ = Parameters<typeof View<'div'>>;

type A = typeof View;
type B = typeof View<'div'>;

type C = ViewProps;
type D = React.ComponentProps<typeof View>;

type W<Y = number> = { x: Y; };

type X = W;
type Y = W<number>;
