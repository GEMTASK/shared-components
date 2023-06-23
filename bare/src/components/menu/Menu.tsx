import React, { useEffect, useRef, useState } from 'react';
import { createUseStyles } from 'react-jss';

import View from '../view/index.js';
import Button from '../button/index.js';
import Divider from '../divider/index.js';

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

const items = [
  { title: 'Menu Item 1', action: () => console.log('1') },
  { title: 'Menu Item 2', action: () => console.log('2') },
  null,
  { title: 'Menu Item 3', action: () => console.log('3') },
];

type ItemProps = {
  onClick: React.EventHandler<React.MouseEvent>,
  onHideMenu: () => void,
} & React.ComponentProps<typeof Button>;

const Item = ({
  onClick,
  onHideMenu,
  ...props
}: ItemProps) => {
  const handleClick = (event: React.MouseEvent) => {
    onClick(event);

    onHideMenu();
  };

  return (
    <Button hover icon="house" titleFontWeight="normal" onClick={handleClick} {...props} />
  );
};

const Menu = () => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const menuElementRef = useRef<HTMLDivElement>(null);
  const styles = useStyles();

  const handleButtonClick = () => {
    setIsMenuVisible(isMenuVisible => !isMenuVisible);
  };

  const handleHideMenu = () => {
    setIsMenuVisible(false);
  };

  const handleBlur = (event: React.FocusEvent) => {
    if (!menuElementRef.current?.contains(event.relatedTarget)) {
      setIsMenuVisible(false);
    }
  };

  return (
    <View tabIndex={0} style={{ position: 'relative', zIndex: 1 }} onBlur={handleBlur}>
      <Button solid title="Menu" selected={isMenuVisible} onPointerDown={handleButtonClick} rightIcon="chevron-down" />
      {isMenuVisible && (
        <View ref={menuElementRef} border fillColor="white" padding="small none" style={{ position: 'absolute', top: '100%', borderRadius: 2.5 }}>
          {items.map((item, index) => (
            item ? (
              <Item key={index} title={item.title} onClick={item.action} onHideMenu={handleHideMenu} />
            ) : (
              <Divider key={index} spacing="small" />
            )
          ))}
        </View>
      )}
    </View>
  );
};

export default Menu;
