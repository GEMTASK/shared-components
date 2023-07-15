import React, { useEffect, useRef, useState } from 'react';
import { createUseStyles } from 'react-jss';
import OpenColor from 'open-color';

import View, { ViewProps } from '../view/index.js';
import Button, { ButtonProps } from '../button/index.js';
import Divider from '../divider/index.js';
import Text from '../text/index.js';

const preventDefault = (event: React.PointerEvent) => {
  event.preventDefault();
};

const useStyles = createUseStyles({
  Item: {
    margin: '0 1px',
    '&:hover': {
      background: OpenColor.gray[2],
    },
    '&:active': {
      background: OpenColor.gray[3],
    },
  }
});

type ItemDefinition = {
  title: string,
  action?: () => void,
} | string | null;

const defaultItems: ItemDefinition[] = [
  'Section 1',
  { title: 'Lorem ipsum dolor sit amet', action: () => console.log('1') },
  { title: 'Ut enim ad minim veniam', action: () => console.log('2') },
  null,
  'Section 2',
  { title: 'Duis aute irure dolor', action: () => console.log('3') },
];

type ListProps = {
  items: ItemDefinition[],
  onItemSelect?: (itemIndex: number) => void,
} & ViewProps;

const List = ({
  items,
  onItemSelect,
  ...props
}: ListProps) => {
  const handleItemClick = (itemIndex: number) => {
    onItemSelect?.(itemIndex);
  };

  return (
    <View {...props}>
      {items.map((item, index) => (
        item === null ? (
          <Divider key={index} spacing="small" />
        ) : typeof item === 'string' ? (
          <Text key={index} caps fontSize="xxsmall" fontWeight="semibold" textColor="gray-6" padding="small large">
            {item}
          </Text>
        ) : (
          <Item key={index} index={index} title={item.title} onItemSelect={handleItemClick} />
        )
      ))}
    </View>
  );
};

type ItemProps = {
  index: number,
  title: string,
  onItemSelect?: (itemIndex: number) => void,
} & ViewProps;

const Item = ({
  index,
  title,
  onItemSelect,
  ...props
}: ItemProps) => {
  const styles = useStyles();

  const handleClick = (event: React.MouseEvent) => {
    onItemSelect?.(index);
  };

  return (
    <View horizontal padding="small large" className={styles.Item} onClick={handleClick} {...props}>
      <Text fontWeight="semibold" style={{ whiteSpace: 'nowrap' }}>{title}</Text>
    </View>
  );
};

type MenuProps = {
  title: string,
  items?: ItemDefinition[],
} & ButtonProps;

const Menu = ({ title, items = defaultItems, ...props }: MenuProps) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const styles = useStyles();

  const handleButtonClick = (event: React.MouseEvent) => {
    setIsMenuVisible(true);
  };

  const handleBlur = (event: React.FocusEvent) => {
    setIsMenuVisible(false);
  };

  const handleListItemSelect = (itemIndex: number) => {
    const item = items[itemIndex];

    if (item && typeof item === 'object') {
      item.action?.();
    }

    setIsMenuVisible(false);
  };

  return (
    <View style={{ zIndex: 3000 }}>
      <Button
        // solid
        // size={size ?? 'small'}
        title={title ?? 'Menu'}
        rightIcon="chevron-down"
        selected={isMenuVisible}
        {...props}
        onPointerDown={handleButtonClick}
        onClick={handleButtonClick}
        onBlur={handleBlur}
      />
      {isMenuVisible && (
        <List
          border
          shadow
          items={items}
          fillColor="white"
          padding="small none"
          style={{ position: 'absolute', top: '100%', borderRadius: 2.5 }}
          onPointerDown={preventDefault}
          onItemSelect={handleListItemSelect}
        />
      )}
    </View>
  );
};

export default Menu;
