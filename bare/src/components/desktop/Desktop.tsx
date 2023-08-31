import React, { useCallback, useLayoutEffect, useRef } from 'react';

import View from '../view/index.js';

import Window from './Window.js';

type Rect = Partial<Pick<DOMRect, 'x' | 'y' | 'width' | 'height'>>;

function getOffsetsRect(windowElement: HTMLElement) {
  return new DOMRect(
    windowElement.offsetLeft,
    windowElement.offsetTop,
    windowElement.offsetWidth,
    windowElement.offsetHeight,
  );
}

//
//
//

type DesktopProps = {
  windows: {
    id: string,
    icon?: string,
    title: string,
    element: React.ReactElement;
    rect?: Rect,
  }[],
  windowOrder: string[],
  wallpaper: string,
  onWindowFocus?: (id: string) => void,
  onWindowChange?: (id: string, rect: DOMRect) => void,
  onWindowClose?: (id: string) => void,
};

const Desktop = ({
  windows,
  windowOrder,
  wallpaper,
  onWindowFocus,
  onWindowChange,
  onWindowClose,
}: DesktopProps) => {
  // console.log('Desktop()');

  const desktopElementRef = useRef<HTMLElement>(null);
  const firstEventRef = useRef<React.PointerEvent | null>(null);
  const leftWindowRectsRef = useRef<DOMRect[]>([]);
  const leftWindowsRef = useRef<HTMLElement[]>([]);
  const rightWindowRectsRef = useRef<DOMRect[]>([]);
  const rightWindowsRef = useRef<HTMLElement[]>([]);

  const handleWindowBlur = () => {
    if (onWindowFocus && document.activeElement) {
      const id = document.activeElement.parentElement?.getAttribute('data-id');

      if (id) {
        onWindowFocus(id);
      }
    }
  };

  const handlePointerDown = useCallback((event: React.PointerEvent) => {
    if (event.currentTarget !== desktopElementRef.current) {
      return;
    }

    // event.preventDefault();
    // event.currentTarget.setPointerCapture(event.pointerId);

    firstEventRef.current = event;

    if (desktopElementRef.current) {
      const children = [...desktopElementRef.current.children] as HTMLElement[];

      leftWindowsRef.current = children.filter(
        ({ offsetLeft, offsetWidth }) => event.clientX - (offsetLeft + offsetWidth) >= 0 && event.clientX - (offsetLeft + offsetWidth) <= 15
      );

      rightWindowsRef.current = children.filter(
        ({ offsetLeft }) => offsetLeft - event.clientX >= 0 && offsetLeft - event.clientX <= 15
      );

      leftWindowRectsRef.current = leftWindowsRef.current.map(window => getOffsetsRect(window));
      rightWindowRectsRef.current = rightWindowsRef.current.map(window => getOffsetsRect(window));
    }

    window.addEventListener('blur', handleWindowBlur);

    return () => {
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, []);

  const handlePointerMove = useCallback((event: React.PointerEvent) => {
    if (firstEventRef.current && rightWindowsRef.current && rightWindowRectsRef.current) {
      const firstEvent = firstEventRef.current;

      leftWindowsRef.current.forEach((window, index) => {
        window.style.width = `${leftWindowRectsRef.current[index].width - (firstEvent.clientX - event.clientX)}px`;
      });

      rightWindowsRef.current.forEach((window, index) => {
        window.style.left = `${rightWindowRectsRef.current[index].x + (event.clientX - firstEvent.clientX)}px`;
        window.style.width = `${rightWindowRectsRef.current[index].width - (event.clientX - firstEvent.clientX)}px`;
      });
    }
  }, []);

  const handlePointerUp = useCallback(() => {
    if (firstEventRef.current && rightWindowsRef.current && rightWindowRectsRef.current) {
      leftWindowsRef.current.forEach((window, index) => {
        window.style.width = `${Math.round(window.offsetWidth / 15) * 15}px`;
      });

      rightWindowsRef.current.forEach((window, index) => {
        window.style.left = `${Math.round(window.offsetLeft / 15) * 15}px`;
        window.style.width = `${Math.round(window.offsetWidth / 15) * 15}px`;
      });
    }

    firstEventRef.current = null;
  }, []);

  return (
    <View
      flex
      ref={desktopElementRef}
      style={{ background: `url(${wallpaper}) center center / cover` }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {windows.map(({ id, title, element, rect }) => (
        <Window
          key={id}
          id={id}
          title={title}
          rect={rect}
          data-id={id}
          order={windowOrder.indexOf(id)}
          onWindowFocus={onWindowFocus}
          onWindowChange={onWindowChange}
          onWindowClose={onWindowClose}
        >
          {element}
        </Window>
      ))}
    </View>
  );
};

export default Desktop;

export {
  type Rect,
};
