import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react';

import { KopiArray, KopiFunction, KopiNumber, KopiString, KopiTuple } from 'kopi-language';
import { Context, KopiValue } from 'kopi-language';

import { Button, Text, View } from 'bare';

class KopiElement extends KopiValue {
  component: React.ComponentType | string;
  props: any;
  children?: KopiArray;

  constructor(component: React.ComponentType | string, props: any, children?: KopiArray) {
    super();

    this.component = component;
    this.props = props;
    this.children = children;
  }

  async inspectChildren(children: any): Promise<React.ReactNode> {
    return Promise.all(
      children.map(async (child: any, index: number) => {
        const awaitedChild = await child;

        if (awaitedChild.children instanceof KopiString) {
          return React.createElement(
            this.component,
            awaitedChild.props,
            awaitedChild.children.value
          );
        } else if (awaitedChild.children) {
          return React.createElement(
            awaitedChild.component,
            { key: index, ...awaitedChild.props },
            await this.inspectChildren(awaitedChild.children._elements)
          );
        }

        return React.createElement(
          awaitedChild.component,
          { key: index, ...awaitedChild.props }
        );
      })
    );
  }

  async inspect() {
    if (this.children instanceof KopiString) {
      return React.createElement(
        this.component,
        this.props,
        this.children.value
      );
    } else if (this.children) {
      return React.createElement(
        this.component,
        this.props,
        await this.inspectChildren(this.children._elements)
      );
    }

    return React.createElement(
      this.component,
      this.props,
    ) as any;
  }
}

const Component = (component: KopiFunction, context: Context) => function _({ props }: any) {
  const functionRef = useRef<KopiFunction>();

  const [state, _setState] = useState<KopiValue | Promise<KopiValue>>(KopiTuple.empty);
  const [value, setValue] = useState<any>(null);

  const setState = useCallback(async (value: KopiFunction) => {
    if ('apply' in value) {
      _setState(async (state) => await value.apply(KopiTuple.empty, [await state, context]));
    } else {
      _setState(value);
    }
  }, []);

  useEffect(() => {
    (async () => {
      if (!functionRef.current) {
        functionRef.current = await component.apply(KopiTuple.empty, [setState, context]) as KopiFunction;
      }
    })();
  }, [setState]);

  useEffect(() => {
    (async () => {
      if (!functionRef.current) {
        return;
      }

      const value = await functionRef.current.apply(KopiTuple.empty, [await state, context]);

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
      // style: { gap: 16 }
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

async function kopi_Circle(props: KopiTuple, context: Context) {
  const [cx, cy, r] = await Promise.all([
    (props as any).cx,
    (props as any).cy,
    (props as any).r
  ]);

  return new KopiElement('circle', {
    cx: cx.value,
    cy: cy.value,
    r: r.value,
  });
}

async function kopi_Svg(props: KopiTuple, context: Context) {
  const [title, solid] = await Promise.all([
    (props as any).onAnimationFrame,
    (props as any).solid
  ]);

  return (children: any) => {
    return new KopiElement('svg', {
      style: { height: 150 },
      // solid: solid?.value,
      // primary: true,
      // title: title?.value,
    }, children);
  };
}

async function kopi_requestAnimationFrame(func: KopiFunction, context: Context) {
  window.requestAnimationFrame(() => {
    func.apply(KopiTuple.empty, [func, context]);
  });
  // setTimeout(() => {
  //   func.apply(KopiTuple.empty, [KopiTuple.empty, context]);
  // }, 1000 / 30);
}

export {
  kopi_element,
  kopi_component,
  kopi_requestAnimationFrame,
  kopi_View,
  kopi_Text,
  kopi_Button,
  kopi_Svg,
  kopi_Circle,
};

globalThis.environment = {
  ...(globalThis.environment || {}),
  element: kopi_element,
  component: kopi_component,
  View: kopi_View,
  Text: kopi_Text,
  Button: kopi_Button,
};
