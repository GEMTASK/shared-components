import React, { useState } from 'react';
import { createUseStyles } from 'react-jss';
import OpenColor from 'open-color';
import clsx from 'clsx';

import View, { ViewProps } from '../view/index.js';
import Button from '../button/index.js';
import Divider from '../divider/index.js';
import Spacer from '../spacer/index.js';

const useTabStyles = createUseStyles({
  Tab: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottom: '1px solid transparent',
    marginBottom: -1,
  },
  selected: {
    background: 'none',
    filter: 'none',
    borderBottom: `2px solid ${OpenColor.blue[5]}`,
  }
});

type TabProps = {
  index: number,
  label: string,
  selected: boolean,
  onTabSelect: (index: number) => void,
};

const Tab = ({
  index,
  label,
  selected,
  onTabSelect
}: TabProps) => {
  const styles = useTabStyles();

  const tabClassName = clsx(
    styles.Tab,
    selected && styles.selected,
  );

  const handleClick = () => {
    onTabSelect(index);
  };

  return (
    <Button
      hover
      title={label}
      titleFontWeight={!selected ? 'normal' : undefined}
      titleTextColor={!selected ? 'gray-5' : undefined}
      selected={selected}
      className={tabClassName}
      onPointerDown={handleClick}
    />
  );
};

//

type TabsProps = {
  labels: string[],
  actions?: React.ReactElement[],
  onTabSelect?: (index: number) => void,
} & ViewProps;

const Tabs = ({
  labels,
  actions,
  children,
  onTabSelect,
  ...props
}: TabsProps) => {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  const handleTabSelect = (index: number) => {
    if (onTabSelect) {
      onTabSelect(index);
    }

    setSelectedTabIndex(index);
  };

  const childrenArray = React.Children.toArray(children);

  return (
    <View {...props}>
      <View horizontal align="middle left">
        <View flex horizontal>
          {labels.map((label, index) => (
            <Tab key={index} index={index} label={label} selected={index === selectedTabIndex} onTabSelect={handleTabSelect} />
          ))}
        </View>
        {React.Children.map(actions, child => (
          React.isValidElement(child) && React.cloneElement(child)
        ))}
      </View>
      <Divider />
      {childrenArray[selectedTabIndex] as React.ReactElement}
    </View>
  );
};

export default Tabs;
