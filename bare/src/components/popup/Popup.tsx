import React, { useRef, useState } from 'react';
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

const Popup = ({
  element,
  children,
}: PopupProps) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const menuElementRef = useRef<HTMLDivElement>(null);

  const handleButtonClick = () => {
    setIsMenuVisible(isMenuVisible => !isMenuVisible);
  };

  const handleHideMenu = () => {
    setIsMenuVisible(false);
  };

  const handleBlur = (event: React.FocusEvent) => {
    if (event.relatedTarget !== menuElementRef.current && !menuElementRef.current?.contains(event.relatedTarget)) {
      setIsMenuVisible(false);
    }
  };

  const id = `element-${Date.now()}`;

  const handlePointerDown = (event: React.PointerEvent) => {
    const element = document.getElementById(id) as HTMLElement;

    setTimeout(() => {
      // element.focus();
    });
  };

  return (
    <View tabIndex={0} style={{ position: 'relative' }} onBlur={handleBlur} onPointerDown={handlePointerDown}>
      {/* <Button solid title="Menu" selected={isMenuVisible} onPointerDown={handleButtonClick} rightIcon="chevron-down" /> */}
      {React.isValidElement(element) && React.cloneElement(element as any, {
        id: id,
        onPointerDown: handleButtonClick
      })}
      {isMenuVisible && (
        <View ref={menuElementRef} border fillColor="white" paddingVertical="small" paddingHorizontal="small" style={{ position: 'absolute', top: '100%', borderRadius: 2 }}>
          {children}
        </View>
      )}
    </View>
  );
};

export default Popup;
