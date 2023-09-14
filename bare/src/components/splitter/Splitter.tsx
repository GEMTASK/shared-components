import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';

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
  children,
  style,
  ...props
}: any) => {
  const elementRef = useRef<HTMLElement>(null);
  const widthRef = useRef(0);

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

  useLayoutEffect(() => {
    if (elementRef.current) {
      widthRef.current = Number(elementRef.current.offsetWidth);
      elementRef.current.style.width = `${widthRef.current}px`;
    }
  }, []);

  const childrenArray = React.Children.toArray(children);

  return (
    <View {...props} style={{ ...style, scrollSnapType: 'x mandatory' }}>
      {React.cloneElement(childrenArray[0] as React.ReactElement, {
        ref: elementRef,
        style: {
          scrollSnapAlign: 'start'
        }
      })}
      <Handle onDrag={handleDrag} onDragFinish={handleDragFinish} />
      {React.cloneElement(childrenArray[1] as React.ReactElement, {
        style: {
          scrollSnapAlign: 'start'
        }
      })}
    </View>
  );
};

export default Splitter;
