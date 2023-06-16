import React, { useEffect, useRef, useState } from 'react';
import { createUseStyles } from 'react-jss';

import View, { ViewProps } from '../view/index.js';
import Text from '../text/index.js';
import Button from '../button/index.js';

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
  element: React.ReactElement,
} & ViewProps;

const preventDefault = (event: React.PointerEvent) => {
  event.preventDefault();
};

const Popup = ({
  element,
  children,
}: PopupProps) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const menuElementRef = useRef<HTMLDivElement>(null);

  const handleButtonClick = (event: React.PointerEvent) => {
    setIsMenuVisible(isMenuVisible => !isMenuVisible);
  };

  const handleHideMenu = () => {
    setIsMenuVisible(false);
  };

  const handleDocumentPointerDown = (event: PointerEvent) => {
    if (event.relatedTarget !== menuElementRef.current && !menuElementRef.current?.contains(event.target as Node)) {
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
      {/* <Button solid title="Menu" selected={isMenuVisible} onPointerDown={handleButtonClick} rightIcon="chevron-down" /> */}
      {React.isValidElement(element) && React.cloneElement(element as any, {
        onPointerDown: handleButtonClick,
      })}
      {isMenuVisible && (
        <View
          border
          fillColor="white"
          paddingVertical="small"
          paddingHorizontal="small"
          style={{ position: 'absolute', top: '100%', borderRadius: 2 }}
          onPointerDown={preventDefault}
        >
          {children}
        </View>
      )}
    </View>
  );
};

export default Popup;
