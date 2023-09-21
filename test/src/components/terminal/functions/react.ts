import React, { useEffect, useReducer, useRef, useState } from 'react';

import { KopiArray, KopiFunction, KopiNumber, KopiString, KopiTuple } from 'kopi-language';
import { Context, KopiValue } from 'kopi-language';

import { Button, Text, View } from 'bare';

class KopiElement extends KopiValue {
  component: React.ComponentType;
  props: any;
  children?: KopiArray;

  constructor(component: React.ComponentType, props: any, children?: KopiArray) {
    super();

    this.component = component;
    this.props = props;
    this.children = children;
  }

  async inspectChildren(children: any): Promise<React.ReactNode> {
    return Promise.all(
      children.map(async (child: any) => {
        const awaitedChild = await child;

        if (awaitedChild.children instanceof KopiString) {
          return React.createElement(this.component, awaitedChild.props, awaitedChild.children.value) as any;
        } else if (awaitedChild.children) {
          return React.createElement(awaitedChild.component, awaitedChild.props, await this.inspectChildren(awaitedChild.children._elements));
        }

        return React.createElement(awaitedChild.component, awaitedChild.props) as any;
      })
    );
  }

  async inspect() {
    if (this.children instanceof KopiString) {
      return React.createElement(this.component, this.props, this.children.value) as any;
    } else if (this.children) {
      return React.createElement(this.component, this.props, await this.inspectChildren(this.children._elements)) as any;
    }

    return React.createElement(this.component, this.props) as any;
  }
}

const reducer = (state: any, action: any) => {
  console.log(action.payload);
  // return ({ ...state, ...action.payload });
  return action.payload;
};

const Component = (component: KopiFunction, context: Context) => function _({ props }: any) {
  const functionRef = useRef<KopiFunction>();

  const [value, setValue] = useState<any>(null);
  const [state, dispatch] = useReducer(reducer, new KopiNumber(0));

  const setState = (payload: any) => dispatch({ type: 'setState', payload });

  useEffect(() => {
    (async () => {
      if (!functionRef.current) {
        functionRef.current = await component.apply(KopiTuple.empty, [setState, context]) as KopiFunction;
      }

      const value = await functionRef.current.apply(KopiTuple.empty, [state, context]);

      setValue(await value.inspect());
    })();
  }, [state]);

  return value;
};

async function kopi_element(tuple: KopiTuple, context: Context) {
  const [component, props, children] = await Promise.all(tuple.fields) as [KopiFunction, KopiTuple, KopiArray];

  return new KopiElement(
    Component(component, context),
    {},
    children
  );
}

async function kopi_component(component: KopiFunction, context: Context) {
  // const [component, props, children] = await Promise.all(tuple.fields) as [KopiFunction, KopiTuple, KopiArray];

  return (props: any) => (children: any) => new KopiElement(
    Component(component, context),
    {},
    children
  );
}

async function kopi_View(props: KopiTuple) {
  const [horizontal, fillColor, padding, border] = await Promise.all([
    (props as any).horizontal,
    (props as any).fillColor,
    (props as any).padding,
    (props as any).border
  ]);

  return (children: any) => {
    return new KopiElement(View, {
      horizontal: horizontal?.value,
      fillColor: fillColor?.value,
      padding: padding?.value,
      border: border?.value,
      style: { gap: 16 }
    }, children);
  };
}

async function kopi_Text(props: KopiTuple, context: Context) {
  const [fillColor, padding, align, onClick] = await Promise.all([
    (props as any).fillColor,
    (props as any).padding,
    (props as any).align,
    (props as any).onClick
  ]);

  return (string: any) => {
    return new KopiElement(Text, {
      fillColor: fillColor?.value,
      padding: padding?.value,
      align: align?.value,
      onClick: () => onClick?.apply(KopiTuple.empty, [KopiTuple.empty, context])
    }, string);
  };
}

async function kopi_Button(props: KopiTuple, context: Context) {
  const [title, solid] = await Promise.all([
    (props as any).title,
    (props as any).solid
  ]);

  return new KopiElement(Button, {
    solid: solid?.value,
    primary: true,
    title: title?.value,
  });
}

globalThis.environment = {
  ...(globalThis.environment || {}),
  element: kopi_element,
  component: kopi_component,
  View: kopi_View,
  Text: kopi_Text,
  Button: kopi_Button,
};