import React, { useEffect, useRef, useState } from 'react';
import { createUseStyles } from 'react-jss';

import View, { ViewProps } from '../view/index.js';

const useStyles = createUseStyles({
  Menu: {
    '&:focus': {
      background: 'red',
    },
    '&:focus $Button': {
      background: 'red',
    },
  },
  Button: {}
});

type PopupProps = {
  isOpen?: boolean,
  element: React.ReactElement,
} & ViewProps;

const preventDefault = (event: React.PointerEvent) => {
  event.preventDefault();
};

const Popup = ({
  isOpen,
  element,
  children,
  ...props
}: PopupProps) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const menuElementRef = useRef<HTMLDivElement>(null);

  const handleButtonPointerDown = (event: React.PointerEvent) => {
    setIsMenuVisible(isMenuVisible => !isMenuVisible);
  };

  const handleButtonFocus = (event: React.FocusEvent) => {
    setIsMenuVisible(true);
  };

  const handleButtonBlur = (event: React.FocusEvent) => {
    setIsMenuVisible(false);
  };

  const handleDocumentPointerDown = (event: PointerEvent) => {
    if (
      event.relatedTarget !== menuElementRef.current
      && !menuElementRef.current?.contains(event.target as Node)
    ) {
      setIsMenuVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener('pointerdown', handleDocumentPointerDown);

    return () => {
      document.removeEventListener('pointerdown', handleDocumentPointerDown);
    };
  }, []);

  return (
    <View ref={menuElementRef} style={{ position: 'relative' }}>
      {/* <Button solid title="Menu" selected={isMenuVisible} onPointerDown={handleButtonFocus} rightIcon="chevron-down" /> */}
      {React.isValidElement(element) && React.cloneElement(element as any, {
        onFocus: handleButtonFocus,
        onBlur: handleButtonBlur,
        onPointerDown: handleButtonPointerDown,
      })}
      {isMenuVisible && (
        <View
          border
          shadow
          fillColor="white"
          style={{ position: 'absolute', zIndex: 2, top: '100%', borderRadius: 2.5 }}
          onPointerDown={preventDefault}
          {...props}
        >
          {children}
        </View>
      )}
    </View>
  );
};

export default Popup;
