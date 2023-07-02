import React, { useEffect, useRef, useState } from 'react';

import View from '../view/index.js';
import Divider from '../divider/index.js';

import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  Handle: {
    cursor: 'pointer',
  }
});

const Handle = ({ onDrag }: any) => {
  const isDraggingRef = useRef(false);
  const firstX = useRef<number>(0);

  const handlePointerDown = (event: React.PointerEvent) => {
    event.preventDefault();

    event.currentTarget.setPointerCapture(event.pointerId);

    firstX.current = event.clientX;

    isDraggingRef.current = true;
  };

  const handlePointerMove = (event: React.PointerEvent) => {
    if (isDraggingRef.current) {
      onDrag(event.clientX - firstX.current);
    }
  };

  const handlePointerUp = (event: React.PointerEvent) => {
    isDraggingRef.current = false;
  };

  return (
    <Divider style={{ position: 'relative' }}>
      <View
        style={{ position: 'absolute', inset: '0 -8px', cursor: 'ew-resize' }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      />
    </Divider>
  );
};

const Splitter = ({
  initialWidth,
  children,
  ...props
}: any) => {
  const elementRef = useRef<HTMLElement>(null);

  const handleDrag = (delta: number) => {
    // console.log('here', delta);

    if (elementRef.current) {
      elementRef.current.style.width = initialWidth + delta + 'px';
    }
  };

  useEffect(() => {
    console.log(elementRef.current);
  }, []);

  const childrenArray = React.Children.toArray(children);

  console.log(childrenArray[0]);

  return (
    <View {...props}>
      {React.cloneElement(childrenArray[0] as React.ReactElement, {
        ref: elementRef,
        style: { width: initialWidth + 'px' },
      })}
      <Handle onDrag={handleDrag} />
      {childrenArray[1]}
    </View>
  );
};

export default Splitter;
