import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { createUseStyles } from 'react-jss';

import View, { ViewProps } from '../view/index.js';
import Text from '../text/index.js';
import Divider from '../divider/index.js';
import Button from '../button/Button.js';
import Spacer from '../spacer/Spacer.js';

type Rect = Partial<Pick<DOMRect, 'x' | 'y' | 'width' | 'height'>>;

const useStyles = createUseStyles({
  Window: {
    position: 'absolute',
    borderRadius: 4,
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.25), 0 0 0 1px hsla(0, 0%, 50%, 0.25)',
    transition: 'box-shadow 0.05s',
    '&:focus, &:focus-within': {
      boxShadow: '0 16px 32px rgba(0, 0, 0, 0.25), 0 0 0 1px hsla(0, 0%, 50%, 0.25)',
    },
    willChange: 'left, top',
  },
  Titlebar: {
    // height: 32,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    paddingLeft: 4,
    paddingRight: 4,
    transition: 'height 0.1s 0.1s',
    height: 8,
    '&:hover': {
      height: 32,
    },
  },
  Extender: {
    left: 0,
    right: 0,
    bottom: -8,
    height: 8,
    zIndex: 2,
  }
});

function getOffsetsRect(windowElement: HTMLElement) {
  return new DOMRect(
    windowElement.offsetLeft,
    windowElement.offsetTop,
    windowElement.offsetWidth,
    windowElement.offsetHeight,
  );
}

type WindowProps = {
  id: string,
  title: string,
  order: number,
  rect?: Rect,
  onWindowFocus?: (id: string) => void,
  onWindowChange?: (id: string, rect: DOMRect) => void,
  onWindowClose?: (id: string) => void,
} & ViewProps;

const Window = React.memo(({
  id,
  title,
  order,
  rect,
  children,
  onWindowFocus,
  onWindowChange,
  onWindowClose,
  ...props
}: WindowProps) => {
  console.log('Window()');

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const windowElementRef = useRef<HTMLElement>(null);
  const leftWindowRectsRef = useRef<DOMRect>(new DOMRect());
  const firstEventRef = useRef<React.PointerEvent | null>(null);

  const styles = useStyles();

  useLayoutEffect(() => {
    if (rect && windowElementRef.current) {
      if (rect.x) windowElementRef.current.style.left = `${rect.x}px`;
      if (rect.y) windowElementRef.current.style.top = `${rect.y}px`;
      if (rect.width) windowElementRef.current.style.width = `${rect.width}px`;
      if (rect.height) windowElementRef.current.style.height = `${rect.height}px`;
    }
  }, [rect]);

  const handleTitlePointerDown = useCallback((event: React.PointerEvent) => {
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);

    firstEventRef.current = event;

    if (windowElementRef.current) {
      leftWindowRectsRef.current = getOffsetsRect(windowElementRef.current);
    }
  }, []);

  const handleTitlePointerMove = useCallback((event: React.PointerEvent) => {
    if (firstEventRef.current && windowElementRef.current) {
      const windowRect = leftWindowRectsRef.current;
      const firstEvent = firstEventRef.current;

      windowElementRef.current.style.left = `${windowRect.left + (event.clientX - firstEvent.clientX)}px`;
      windowElementRef.current.style.top = `${windowRect.top + (event.clientY - firstEvent.clientY)}px`;
    }
  }, []);

  const handleTitlePointerUp = useCallback((event: React.PointerEvent) => {
    firstEventRef.current = null;

    if (onWindowChange && windowElementRef.current) {
      const rect = getOffsetsRect(windowElementRef.current);

      onWindowChange(id, {
        ...rect,
        x: Math.round(rect.x / 5) * 5,
        y: Math.round(rect.y / 5) * 5
      });
    }
  }, []);

  const handleCloseButtonPointerDown = (event: React.PointerEvent) => {
    event.stopPropagation();
  };

  const handleCloseButtonClick = useCallback(() => {
    if (onWindowClose) {
      onWindowClose(id);
    }
  }, []);

  const handleMenuButtonClick = () => {
    setIsMenuOpen(isMenuOpen => !isMenuOpen);
  };

  const handleWindowPointerDown = () => {
    onWindowFocus?.(id);
  };

  const events = {
    onPointerDown: handleTitlePointerDown,
    onPointerMove: handleTitlePointerMove,
    onPointerUp: handleTitlePointerUp,
  };

  const client = React.Children.only(children);

  return (
    <View
      ref={windowElementRef}
      style={{ zIndex: order }}
      minWidth={React.isValidElement(client) && client.props.minWidth}
      tabIndex={0}
      className={styles.Window}
      {...props}
      onPointerDown={handleWindowPointerDown}
    >
      <View
        fillColor="gray-4"
        className={styles.Titlebar}
        {...events}
      >
        <View absolute className={styles.Extender} />
        <View horizontal alignVertical="middle" style={{ height: 32, flexShrink: 0 }}>
          <Button hover size="xsmall" icon="close" onPointerDown={handleCloseButtonPointerDown} onClick={handleCloseButtonClick} />
          <Button hover size="xsmall" icon="bars" onPointerDown={handleCloseButtonPointerDown} onClick={handleMenuButtonClick} />
          <Spacer flex size="small" />
          <Text fontWeight="bold" textColor="gray-7" textAlign="center" padding="small large" style={{ marginBottom: -1 }}>
            {title}
          </Text>
          <Spacer flex size="small" />
          <Button hover size="xsmall" icon="arrows-left-right" />
          <Button hover size="xsmall" icon="arrows-up-down" />
        </View>
      </View>
      {/* <Divider fillColor="gray-4" /> */}
      {React.cloneElement(client as React.ReactElement, {
        fillColor: 'white',
        flex: true,
        minHeight: 0,
        isMenuOpen,
      })}
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
  const firstEventRef = useRef<React.PointerEvent | null>(null);
  const leftWindowRectsRef = useRef<DOMRect[]>([]);
  const leftWindowsRef = useRef<HTMLElement[]>([]);
  const rightWindowRectsRef = useRef<DOMRect[]>([]);
  const rightWindowsRef = useRef<HTMLElement[]>([]);

  const handlePointerDown = useCallback((event: React.PointerEvent) => {
    if (event.currentTarget !== desktopElementRef.current) {
      return;
    }

    event.preventDefault();
    // event.currentTarget.setPointerCapture(event.pointerId);

    firstEventRef.current = event;

    if (desktopElementRef.current) {
      const children = [...desktopElementRef.current.children] as HTMLElement[];

      leftWindowsRef.current = children.filter(
        ({ offsetLeft }) => offsetLeft - event.clientX >= 0 && offsetLeft - event.clientX <= 15
      );

      rightWindowsRef.current = children.filter(
        ({ offsetLeft, offsetWidth }) => event.clientX - (offsetLeft + offsetWidth) >= 0 && event.clientX - (offsetLeft + offsetWidth) <= 15
      );

      leftWindowRectsRef.current = leftWindowsRef.current.map(window => getOffsetsRect(window));
      rightWindowRectsRef.current = rightWindowsRef.current.map(window => getOffsetsRect(window));
    }
  }, []);

  const handlePointerMove = useCallback((event: React.PointerEvent) => {
    if (firstEventRef.current && leftWindowsRef.current && leftWindowRectsRef.current) {
      const firstEvent = firstEventRef.current;

      leftWindowsRef.current.forEach((window, index) => {
        window.style.left = `${leftWindowRectsRef.current[index].x + (event.clientX - firstEvent.clientX)}px`;
        window.style.width = `${leftWindowRectsRef.current[index].width - (event.clientX - firstEvent.clientX)}px`;
      });

      rightWindowsRef.current.forEach((window, index) => {
        // window.style.left = `${leftWindowRectsRef.current[index].x + (event.clientX - firstEvent.clientX)}px`;
        window.style.width = `${rightWindowRectsRef.current[index].width - (firstEvent.clientX - event.clientX)}px`;
      });
    }
  }, []);

  const handlePointerUp = useCallback(() => {
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
