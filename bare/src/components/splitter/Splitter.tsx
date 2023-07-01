import React, { useRef, useState } from 'react';

import View from '../view/index.js';
import Divider from '../divider/index.js';

import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  Handle: {
    cursor: 'pointer',
  }
});

const Handle = () => {
  const isDraggingRef = useRef(false);

  const handlePointerDown = (event: React.PointerEvent) => {
    event.preventDefault();

    event.currentTarget.setPointerCapture(event.pointerId);

    isDraggingRef.current = true;
  };

  const handlePointerMove = (event: React.PointerEvent) => {
    if (isDraggingRef.current) {
      console.log('here');
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

const Splitter = ({ initialWidth, children, ...props }: any) => {
  const childrenArray = React.Children.toArray(children);

  console.log(childrenArray[0]);

  return (
    <View {...props}>
      {React.cloneElement(childrenArray[0] as React.ReactElement, {
        style: { width: initialWidth }
      })}
      <Handle />
      {childrenArray[1]}
    </View>
  );
};

export default Splitter;
