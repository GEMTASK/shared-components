import React, { useCallback, useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { View, Text, Image, Button, Spacer, Divider, Stack, Grid } from 'bare';
import { Input, Popup, Menu, Tabs, Modal, Form, Card, Table, Desktop } from 'bare';

import Calendar from './components/calendar';
import Clock from './components/clock';
import Calculator from './components/calculator';
import Notes from './components/notes';
import Music from './components/music';
import Browser from './components/browser';
import Filesystem from './components/filesystem';

const About = () => {
  return (
    <View flex fillColor="gray-1" padding="large" align="center">
      <Text textAlign="center">
        A React-based desktop environment and component library<br /><br />
        2023 Mike Austin
      </Text>
    </View>
  );
};

const initialState = [
  {
    id: uuidv4(), title: 'Calendar', element: <Calendar />, rect: {
      x: 15, y: 15, width: 360, height: 332,
    }
  },
  {
    id: uuidv4(), title: 'Clock', element: <Clock />, rect: {
      x: 390, y: 15, width: 300, height: 332,
    }
  },
  {
    id: uuidv4(), title: 'Calculator', element: <Calculator />, rect: {
      x: 705, y: 15, width: 260, height: 332,
    }
  },
  {
    id: uuidv4(), title: 'Notes', element: <Notes />, rect: {
      x: 980, y: 15, width: 310, height: 332,
    }
  },
  {
    id: uuidv4(), title: 'Music', element: <Music />, rect: {
      x: 1305, y: 15, width: 360, height: 332,
    }
  },
  {
    id: uuidv4(), title: 'Browser', element: <Browser />, rect: {
      x: 15, y: 360, width: 950, height: 540,
    }
  },
  {
    id: uuidv4(), title: 'Files', element: <Filesystem />, rect: {
      x: 980, y: 360, width: 685, height: 540,
    }
  },
];

type WindowsProp = React.ComponentProps<typeof Desktop>['windows'];

const App = () => {
  console.log('App()');

  const [windows, setWindows] = useState<WindowsProp>(initialState);
  const [windowOrder, setWindowOrder] = useState<string[]>(windows.map(({ id }) => id));

  const desktopMenuItems = [
    {
      title: 'About React-Desktop...', action: () => {
        const id = uuidv4();

        setWindows(windows => [
          ...windows,
          {
            id, title: 'About React-Desktop', element: <About />, rect: {
              x: (window.innerWidth - 500) / 2, y: (window.innerHeight - 200) / 2, width: 500, height: 200,
            }
          }
        ]);
        setWindowOrder(windowOrder => [...windowOrder, id]);
      }
    },
  ];

  const applicationMenuItems = [
    'Utilities',
    { title: 'Calendar', action: () => console.log('1') },
    { title: 'Clock', action: () => console.log('2') },
    { title: 'Calculator', action: () => console.log('2') },
    { title: 'Notes', action: () => console.log('2') },
    { title: 'Music', action: () => console.log('2') },
    { title: 'Browser', action: () => console.log('2') },
    null,
    'Games',
    { title: 'Duis aute irure dolor', action: () => console.log('3') },
  ];

  const handleWindowFocus = (windowId: string) => {
    setWindowOrder(windowOrder => [
      ...windowOrder.filter((id) => id !== windowId),
      windowId,
    ]);
  };

  const handleWindowChange = useCallback((id: string, rect: DOMRect) => {
    setWindows(windows => windows.map(window => window.id === id
      ? { ...window, rect }
      : window));
  }, []);

  const handleWindowClose = (id: string) => {
    setWindows(windows => windows.filter(window => window.id !== id));
  };

  return (
    <View style={{ minHeight: '100vh' }}>
      <Stack horizontal paddingHorizontal="large">
        <Menu hover title="React-Desktop" rightIcon={undefined} items={desktopMenuItems} />
        <Menu hover title="Applications" rightIcon={undefined} items={applicationMenuItems} />
      </Stack>
      <Desktop
        wallpaper="images/d1e91a4058a8a1082da711095b4e0163.jpg"
        windows={windows}
        windowOrder={windowOrder}
        onWindowFocus={handleWindowFocus}
        onWindowChange={handleWindowChange}
        onWindowClose={handleWindowClose}
      />
    </View>
  );
};

export default App;
