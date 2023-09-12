import React, { useCallback, useLayoutEffect, useMemo, useRef } from 'react';

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
  console.log('Desktop()');

  const desktopElementRef = useRef<HTMLElement>(null);

  const handleWindowBlur = () => {
    if (onWindowFocus && document.activeElement) {
      const id = document.activeElement.parentElement?.getAttribute('data-id');

      if (id) {
        onWindowFocus(id);
      }
    }
  };

  const handlePointerDown = useCallback((event: React.PointerEvent) => {
    // event.preventDefault();

    window.removeEventListener('blur', handleWindowBlur);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, []);

  const style = useMemo(() => ({
    background: `url(${wallpaper}) center center / cover`, userSelect: 'none'
  } as const), [wallpaper]);

  return (
    <View
      flex
      ref={desktopElementRef}
      style={style}
      onPointerDown={handlePointerDown}
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
