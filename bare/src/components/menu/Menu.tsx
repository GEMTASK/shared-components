import React, { useEffect, useRef, useState } from 'react';
import { createUseStyles } from 'react-jss';

import View from '../view/index.js';
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

const items = [
  { title: 'Menu Item 1', action: () => console.log('1') },
  { title: 'Menu Item 2', action: () => console.log('2') },
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
    <Button hover icon="house" onClick={handleClick} {...props} />
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
    <View tabIndex={0} style={{ position: 'relative' }} onBlur={handleBlur}>
      <Button hover={!isMenuVisible} selected={isMenuVisible} title="Menu" onPointerDown={handleButtonClick} />
      {isMenuVisible && (
        <View elementRef={menuElementRef} border fillColor="white" paddingVertical="small" paddingHorizontal="small" style={{ position: 'absolute', top: '100%', borderRadius: 2 }}>
          {items.map((item, index) => (
            <Item key={index} title={item.title} onClick={item.action} onHideMenu={handleHideMenu} />
          ))}
        </View>
      )}
    </View>
  );
};

export default Menu;
