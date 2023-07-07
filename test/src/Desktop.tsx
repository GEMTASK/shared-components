import React, { useRef, useState } from 'react';

import { hues, View, Text, Image, Button, Stack, Spacer, Divider } from 'bare';
import { Input, Popup, Menu, Tabs, Modal, Form, Card, Table } from 'bare';

import { ViewProps } from 'bare/dist/components/view';

type Pointer = Pick<React.PointerEvent, 'clientX' | 'clientY'>;

type WindowProps = {
  title: string,
} & ViewProps;

const Window = ({
  title,
  children,
  ...props
}: WindowProps) => {
  const windowElementRef = useRef<HTMLElement>(null);
  const windowRectRef = useRef<DOMRect>(new DOMRect());
  const pointerRef = useRef<Pointer | null>(null);

  const handlePointerDown = (event: React.PointerEvent) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    event.preventDefault();

    if (windowElementRef.current) {
      pointerRef.current = {
        clientX: event.nativeEvent.clientX,
        clientY: event.nativeEvent.clientY,
      };

      windowRectRef.current = windowElementRef.current.getBoundingClientRect();
    }
  };

  const handlePointerMove = (event: React.PointerEvent) => {
    if (pointerRef.current && windowElementRef.current) {
      const windowRect = windowRectRef.current;
      const pointer = pointerRef.current;

      windowElementRef.current.style.left = `${windowRect.left + (event.clientX - pointer.clientX)}px`;
      windowElementRef.current.style.top = `${windowRect.top + (event.clientY - pointer.clientY)}px`;
    }
  };

  const handlePointerUp = (event: React.PointerEvent) => {
    pointerRef.current = null;
  };

  return (
    <View ref={windowElementRef} fillColor="gray-3" style={{ position: 'absolute' }} {...props}>
      <View
        fillColor="gray-3"
        padding="small large"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <Text fontWeight="bold" textAlign="center">{title}</Text>
      </View>
      <Divider />
      <View fillColor="white">
        {children}
      </View>
    </View>
  );
};

const Desktop = () => {
  const [windows, setWindows] = useState([
    { title: 'Clock', client: <Text padding="large">Hello, world.</Text> },
    { title: 'Calc', client: <Text padding="large">Hello, world.</Text> },
  ]);

  return (
    <View fillColor="gray-1" style={{ position: 'relative', minHeight: '100vh' }}>
      {windows.map(({ title, client }, index) => (
        <Window key={index} title={title}>
          {client}
        </Window>
      ))}
    </View>
  );
};

export default Desktop;
