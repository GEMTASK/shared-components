import React, { useCallback, useLayoutEffect, useRef } from 'react';
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
    height: 32,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    paddingLeft: 4,
    paddingRight: 4,
    transition: 'margin-bottom 0.1s 0.1s',
    marginBottom: -24,
    '&:hover': {
      marginBottom: 0,
    }
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
  rect?: Rect,
  onWindowChange?: (id: string, rect: DOMRect) => void,
  onWindowClose?: (id: string) => void,
} & ViewProps;

const Window = React.memo(({
  id,
  title,
  rect,
  children,
  onWindowChange,
  onWindowClose,
  ...props
}: WindowProps) => {
  console.log('Window()');

  const windowElementRef = useRef<HTMLElement>(null);
  const windowRectRef = useRef<DOMRect>(new DOMRect());
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

  const handlePointerDown = useCallback((event: React.PointerEvent) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);

    firstEventRef.current = event;

    if (windowElementRef.current) {
      windowRectRef.current = getOffsetsRect(windowElementRef.current);
    }
  }, []);

  const handlePointerMove = useCallback((event: React.PointerEvent) => {
    if (firstEventRef.current && windowElementRef.current) {
      const windowRect = windowRectRef.current;
      const firstEvent = firstEventRef.current;

      windowElementRef.current.style.left = `${windowRect.left + (event.clientX - firstEvent.clientX)}px`;
      windowElementRef.current.style.top = `${windowRect.top + (event.clientY - firstEvent.clientY)}px`;
    }
  }, []);

  const handlePointerUp = useCallback((event: React.PointerEvent) => {
    firstEventRef.current = null;

    if (onWindowChange && windowElementRef.current) {
      onWindowChange(id, getOffsetsRect(windowElementRef.current));
    }
  }, []);

  const handleCloseButtonPointerDown = (event: React.PointerEvent) => {
    event.stopPropagation();
  };

  const handleCloseButtonClick = () => {
    if (onWindowClose) {
      onWindowClose(id);
    }
  };

  const events = {
    onPointerDown: handlePointerDown,
    onPointerMove: handlePointerMove,
    onPointerUp: handlePointerUp,
  };

  return (
    <View ref={windowElementRef} tabIndex={0} className={styles.Window} {...props}>
      <View
        horizontal
        fillColor="gray-3"
        alignVertical="middle"
        className={styles.Titlebar}
        {...events}
      >
        <View absolute style={{ inset: 0, height: 20, zIndex: 2 }} />
        <Button hover size="xsmall" icon="close" style={{ marginBottom: -2 }} onPointerDown={handleCloseButtonPointerDown} onClick={handleCloseButtonClick} />
        <Spacer flex size="small" />
        <Text fontWeight="bold" textColor="gray-7" textAlign="center" padding="small large" style={{ marginBottom: -2 }}>
          {title}
        </Text>
        <Spacer flex size="small" />
        <Button hover size="xsmall" icon="close" style={{ marginBottom: -2, visibility: 'hidden' }} />
      </View>
      <Divider fillColor="gray-4" />
      <View flex fillColor="white" style={{ minHeight: 0, borderBottomLeftRadius: 4, borderBottomRightRadius: 4 }}>
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
  onWindowClose?: (id: string) => void,
};

const Desktop = ({
  windows,
  wallpaper,
  onWindowChange,
  onWindowClose,
}: DesktopProps) => {
  console.log('Desktop()');

  return (
    <View flex style={{ background: `url(${wallpaper}) center center / cover` }}>
      {windows.map(({ id, title, element, rect }) => (
        <Window key={id} id={id} title={title} rect={rect} onWindowChange={onWindowChange} onWindowClose={onWindowClose}>
          {element}
        </Window>
      ))}
    </View>
  );
};

export default Desktop;
