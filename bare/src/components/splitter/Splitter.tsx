import React, { useEffect, useRef, useState } from 'react';

import View from '../view/index.js';
import Divider from '../divider/index.js';

import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  Handle: {
    cursor: 'pointer',
  }
});

const Handle = ({ onDrag, onDragFinish }: any) => {
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

    onDragFinish(event.clientX - firstX.current);
  };

  return (
    <Divider style={{ zIndex: 1 }}>
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
  const widthRef = useRef(initialWidth);

  const handleDrag = (delta: number) => {
    if (elementRef.current) {
      elementRef.current.style.width = widthRef.current + delta + 'px';
    }
  };

  const handleDragFinish = (delta: number) => {
    if (elementRef.current) {
      widthRef.current = widthRef.current + delta;
    }
  };

  const childrenArray = React.Children.toArray(children);

  return (
    <View {...props}>
      {React.cloneElement(childrenArray[0] as React.ReactElement, {
        ref: elementRef,
        style: {
          width: widthRef.current + 'px'
        },
      })}
      <Handle onDrag={handleDrag} onDragFinish={handleDragFinish} />
      {childrenArray[1]}
    </View>
  );
};

export default Splitter;
