import React, { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
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
    willChange: 'left, top',
  },
  focused: {
    boxShadow: '0 16px 32px rgba(0, 0, 0, 0.25), 0 0 0 1px hsla(0, 0%, 50%, 0.25)',
  },
  Titlebar: {
    height: 32,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    paddingLeft: 4,
    paddingRight: 4,
    transition: 'height 0.1s 0.1s',
    // height: 8,
    touchAction: 'none',
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

const Sizer = ({ ...props }: any) => {
  const firstEventRef = useRef<React.PointerEvent | null>(null);
  const leftWindowRectsRef = useRef<DOMRect[]>([]);
  const leftWindowsRef = useRef<HTMLElement[]>([]);
  const rightWindowRectsRef = useRef<DOMRect[]>([]);
  const rightWindowsRef = useRef<HTMLElement[]>([]);

  const topWindowRectsRef = useRef<DOMRect[]>([]);
  const topWindowsRef = useRef<HTMLElement[]>([]);
  const bottomWindowRectsRef = useRef<DOMRect[]>([]);
  const bottomWindowsRef = useRef<HTMLElement[]>([]);

  const handlePointerDown = useCallback((event: React.PointerEvent) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);

    firstEventRef.current = event;

    const desktopElement = event.currentTarget.parentElement?.parentElement;

    if (desktopElement) {
      const children = [...desktopElement.children] as HTMLElement[];

      leftWindowsRef.current = children.filter(
        ({ offsetLeft, offsetTop, offsetWidth, offsetHeight }) => (
          event.clientX - (offsetLeft + offsetWidth) >= 0
          && event.clientX - (offsetLeft + offsetWidth) <= 15
          && (event.altKey ? event.clientY >= offsetTop + 32 - 15 : true)
          && (event.altKey ? event.clientY <= offsetTop + offsetHeight + 32 + 15 : true)
        )
      );

      rightWindowsRef.current = children.filter(
        ({ offsetLeft, offsetTop, offsetWidth, offsetHeight }) => (
          offsetLeft - event.clientX >= 0 && offsetLeft - event.clientX <= 15
          && (event.altKey ? event.clientY >= offsetTop + 32 - 15 && event.clientY <= offsetTop + offsetHeight + 32 + 15 : true)
        )
      );

      leftWindowRectsRef.current = leftWindowsRef.current.map(window => getOffsetsRect(window));
      rightWindowRectsRef.current = rightWindowsRef.current.map(window => getOffsetsRect(window));

      topWindowsRef.current = children.filter(
        ({ offsetLeft, offsetTop, offsetWidth, offsetHeight }) => (
          event.clientY - (offsetTop + offsetHeight + 32) >= 0
          && event.clientY - (offsetTop + offsetHeight + 32) <= 15
          && (event.altKey ? event.clientX >= offsetLeft - 15 : true)
          && (event.altKey ? event.clientX <= offsetLeft + offsetWidth + 15 : true)
        )
      );

      bottomWindowsRef.current = children.filter(
        ({ offsetLeft, offsetTop, offsetWidth, offsetHeight }) => (
          offsetTop - event.clientY + 32 >= 0 && offsetTop - event.clientY + 32 <= 15
          && (event.altKey ? event.clientX >= offsetLeft - 15 && event.clientX <= offsetLeft + offsetWidth + 15 : true)
        )
      );

      topWindowRectsRef.current = topWindowsRef.current.map(window => getOffsetsRect(window));
      bottomWindowRectsRef.current = bottomWindowsRef.current.map(window => getOffsetsRect(window));
    }

    // if (leftWindowsRef.current.length > 0 || rightWindowsRef.current.length > 0) {
    //   (event.currentTarget as HTMLElement).style.cursor = 'ns-reisze';
    // }
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

      topWindowsRef.current.forEach((window, index) => {
        window.style.height = `${topWindowRectsRef.current[index].height - (firstEvent.clientY - event.clientY)}px`;
      });

      bottomWindowsRef.current.forEach((window, index) => {
        window.style.top = `${bottomWindowRectsRef.current[index].y + (event.clientY - firstEvent.clientY)}px`;
        window.style.height = `${bottomWindowRectsRef.current[index].height - (event.clientY - firstEvent.clientY)}px`;
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

      topWindowsRef.current.forEach((window, index) => {
        window.style.height = `${Math.round(window.offsetHeight / 15) * 15}px`;
      });

      bottomWindowsRef.current.forEach((window, index) => {
        window.style.top = `${Math.round(window.offsetTop / 15) * 15}px`;
        window.style.height = `${Math.round(window.offsetHeight / 15) * 15}px`;
      });
    }

    firstEventRef.current = null;
  }, []);

  return (
    <View
      {...props}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* <View style={{ position: 'absolute', left: 0, top: 0, width: 15, height: 15, cursor: 'nwse-resize' }} />
      <View style={{ position: 'absolute', left: 15, top: 0, right: 15, height: 15, cursor: 'ns-resize' }} /> */}
    </View>
  );
};

const cloneProps = {
  fillColor: 'white',
  flex: true,
  minHeight: 0,
  // style: {
  //   borderBottomLeftRadius: 4,
  //   borderBottomRightRadius: 4,
  // },
};

//
// Window
//

type WindowProps = {
  id: string,
  title: string,
  order: number,
  focused: boolean,
  rect?: Rect,
  onWindowFocus?: (id: string) => void,
  onWindowChange?: (id: string, rect: DOMRect) => void,
  onWindowClose?: (id: string) => void,
} & ViewProps;

const Window = ({
  id,
  title,
  order,
  focused,
  rect,
  children,
  onWindowFocus,
  onWindowChange,
  onWindowClose,
  ...props
}: WindowProps) => {
  console.log('Window()');

  const windowElementRef = useRef<HTMLElement>(null);
  const rightWindowRectsRef = useRef<DOMRect>(new DOMRect());
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
      rightWindowRectsRef.current = getOffsetsRect(windowElementRef.current);
    }
  }, []);

  const handleTitlePointerMove = useCallback((event: React.PointerEvent) => {
    if (firstEventRef.current && windowElementRef.current) {
      const windowRect = rightWindowRectsRef.current;
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
        x: Math.round(rect.x / 15) * 15,
        y: Math.round(rect.y / 15) * 15,
      });
    }
  }, []);

  const handleCloseButtonPointerDown = useCallback((event: React.PointerEvent) => {
    event.stopPropagation();
  }, []);

  const handleCloseButtonClick = useCallback(() => {
    if (onWindowClose) {
      onWindowClose(id);
    }
  }, []);

  const handleWindowPointerDown = useCallback((event: React.PointerEvent) => {
    onWindowFocus?.(id);
  }, []);

  const style = useMemo(() => ({
    zIndex: order
  } as const), [order]);

  const titleBarEvents = {
    onPointerDown: handleTitlePointerDown,
    onPointerMove: handleTitlePointerMove,
    onPointerUp: handleTitlePointerUp,
  };

  const client = React.Children.only(children);

  return (
    <View
      ref={windowElementRef}
      style={style}
      minWidth={React.isValidElement(client) && client.props.minWidth}
      tabIndex={0}
      className={styles.Window + (focused ? ' ' + styles.focused : '')}
      {...props}
      onPointerDownCapture={handleWindowPointerDown}
    >
      <Sizer absolute style={{ inset: -15, touchAction: 'none', cursor: 'ns-resize' }} />
      <View flex style={{ overflow: 'hidden', borderRadius: 4 }}>
        <View fillColor="gray-3" className={styles.Titlebar} {...titleBarEvents}>
          <View absolute className={styles.Extender} />
          <View horizontal alignVertical="middle" style={{ height: 32, flexShrink: 0 }}>
            <Button
              hover
              size="xsmall"
              icon="close"
              onPointerDown={handleCloseButtonPointerDown}
              onClick={handleCloseButtonClick}
            />
            <Spacer flex size="small" />
            <Text fontWeight="bold" textColor="gray-7" textAlign="center" padding="small large" style={{ marginBottom: -1 }}>
              {title}
            </Text>
            <Spacer flex size="small" />
            <Button hover size="xsmall" icon="arrow-up-right-from-square" />
          </View>
        </View>
        <Divider fillColor="gray-4" />
        {React.cloneElement(client as React.ReactElement, cloneProps)}
      </View>
    </View>
  );
};

export default React.memo(Window);
