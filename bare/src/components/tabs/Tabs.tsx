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
    position: 'relative',
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

type ImageProps = {
  labels: string[],
} & ViewProps;

const Tabs = ({
  labels,
  children,
  ...props
}: ImageProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const childrenArray = React.Children.toArray(children);

  const handleTabSelect = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <View>
      <View horizontal>
        {labels.map((label, index) => (
          <Tab key={index} index={index} label={label} selected={index === currentIndex} onTabSelect={handleTabSelect} />
        ))}
      </View>
      {/* <Spacer size="small" /> */}
      <Divider />
      <Spacer size="large" />
      <View>
        {childrenArray[currentIndex] as React.ReactElement}
      </View>
    </View>
  );
};

export default Tabs;
