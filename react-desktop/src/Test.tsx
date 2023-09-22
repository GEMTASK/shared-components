/* eslint-disable @typescript-eslint/no-redeclare */
/* eslint-disable @typescript-eslint/no-unused-vars */

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


/*
  IntrinsicElements 'div', 'span', ...

  interface JSX.IntrinsicAttributes extends React.Attributes { }

*/

type jsxType = JSX.IntrinsicElements[keyof JSX.IntrinsicElements];
type AS = Extract<keyof JSX.IntrinsicElements, 'p' | 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5'>;

var reactNode: React.HTMLAttributes<'div'>['children'];
var reactNode: React.HTMLAttributes<HTMLDivElement>['children'];
var x: React.LinkHTMLAttributes<HTMLLinkElement>['href'];
// var error: React.HTMLAttributes<HTMLLinkElement>['href'];

// var d: React.HTMLProps<'div'>['children'];
// var e: React.HTMLProps<HTMLDivElement>;

var d: React.HTMLFactory<HTMLDivElement>;

var e: HTMLElementTagNameMap['div'];

var divElement: HTMLDivElement = new HTMLDivElement();

var componentProps: React.ComponentProps<'div'>;
// var error: React.ComponentProps<HTMLDivElement>;

var elementType: React.ElementType<{ children: React.ReactNode; }>;

var a: React.ObjectHTMLAttributes<'div'>;
var b: React.ObjectHTMLAttributes<HTMLDivElement>;

var c: React.DetailedHTMLProps<React.ObjectHTMLAttributes<HTMLDivElement>, HTMLDivElement>;

var reactNode: JSX.IntrinsicElements['div']['children'];

var f: JSX.IntrinsicAttributes

/*
  type React.ElementType<P = any> =
    (P extends React.SVGProps<SVGSymbolElement> ? "symbol" : never)
    | (P extends React.DetailedHTMLProps<React.ObjectHTMLAttributes<HTMLObjectElement>, HTMLObjectElement> ? "object" : never)
    | ... 174 more ... | React.ComponentType<...>
*/
