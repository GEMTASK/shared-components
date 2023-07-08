import React, { useCallback, useLayoutEffect, useRef } from 'react';
import { createUseStyles } from 'react-jss';

import View, { ViewProps } from '../view/index.js';
import Text from '../text/index.js';
import Divider from '../divider/index.js';

type Pointer = Pick<React.PointerEvent, 'clientX' | 'clientY'>;
type Rect = Partial<Pick<DOMRect, 'x' | 'y' | 'width' | 'height'>>;

const useStyles = createUseStyles({
  Window: {
    position: 'absolute',
    borderRadius: 4,
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.25), 0 0 0 1px hsla(0, 0%, 50%, 0.25)'
  },
});

type WindowProps = {
  id: string,
  title: string,
  rect?: Rect,
  onWindowChange?: (id: string, rect: DOMRect) => void,
} & ViewProps;

const Window = React.memo(({
  id,
  title,
  rect,
  children,
  onWindowChange,
  ...props
}: WindowProps) => {
  console.log('Window()');

  const windowElementRef = useRef<HTMLElement>(null);
  const windowRectRef = useRef<DOMRect>(new DOMRect());
  const pointerRef = useRef<Pointer | null>(null);

  const styles = useStyles();

  useLayoutEffect(() => {
    if (rect && windowElementRef.current) {
      if (rect.x) windowElementRef.current.style.left = `${rect.x}px`;
      if (rect.y) windowElementRef.current.style.top = `${rect.y}px`;
      if (rect.width) windowElementRef.current.style.width = `${rect.width}px`;
    }
  }, [rect]);

  const handlePointerDown = useCallback((event: React.PointerEvent) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    event.preventDefault();

    if (windowElementRef.current) {
      pointerRef.current = {
        clientX: event.nativeEvent.clientX,
        clientY: event.nativeEvent.clientY,
      };

      windowRectRef.current = new DOMRect(
        windowElementRef.current.offsetLeft,
        windowElementRef.current.offsetTop,
      );
    }
  }, []);

  const handlePointerMove = useCallback((event: React.PointerEvent) => {
    if (pointerRef.current && windowElementRef.current) {
      const windowRect = windowRectRef.current;
      const pointer = pointerRef.current;

      windowElementRef.current.style.left = `${windowRect.left + (event.clientX - pointer.clientX)}px`;
      windowElementRef.current.style.top = `${windowRect.top + (event.clientY - pointer.clientY)}px`;
    }
  }, []);

  const handlePointerUp = useCallback((event: React.PointerEvent) => {
    pointerRef.current = null;

    if (onWindowChange && windowElementRef.current) {
      onWindowChange(id, new DOMRect(
        windowElementRef.current.offsetLeft,
        windowElementRef.current.offsetTop,
        windowElementRef.current.offsetWidth,
        windowElementRef.current.offsetHeight
      ));
    }
  }, []);

  return (
    <View ref={windowElementRef} className={styles.Window} {...props}>
      <View
        fillColor="gray-3"
        padding="small"
        alignVertical="middle"
        style={{ borderTopLeftRadius: 4, borderTopRightRadius: 4, height: 32 }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <Text fontWeight="bold" textColor="gray-7" textAlign="center" style={{ marginBottom: -2 }}>{title}</Text>
      </View>
      <Divider fillColor="gray-4" />
      <View fillColor="white" style={{ borderBottomLeftRadius: 4, borderBottomRightRadius: 4 }}>
        {children}
      </View>
    </View>
  );
});

//
//
//

type DesktopProps = {
  windows: {
    id: string,
    title: string,
    element: React.ReactElement;
    rect?: Rect,
  }[],
  wallpaper: string,
  onWindowChange?: (id: string, rect: DOMRect) => void,
};

const Desktop = ({
  windows,
  wallpaper,
  onWindowChange,
}: DesktopProps) => {
  console.log('Desktop()');

  return (
    <View flex style={{ position: 'relative', background: `url(${wallpaper}) center center / cover` }}>
      {windows.map(({ id, title, element, rect }) => (
        <Window key={id} id={id} title={title} rect={rect} onWindowChange={onWindowChange}>
          {element}
        </Window>
      ))}
    </View>
  );
};

export default Desktop;
