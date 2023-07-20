import React, { useCallback, useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { View, Text, Image, Button, Spacer, Divider, Stack, Grid } from 'bare';
import { Input, Popup, Menu, Tabs, Modal, Form, Card, Table, Desktop } from 'bare';
import { Rect } from 'bare/dist/components/desktop/Desktop';

import Calendar from './components/calendar';
import Clock from './components/clock';
import Calculator from './components/calculator';
import Notes from './components/notes';
import Music from './components/music';
import Browser from './components/browser';
import Email from './Email';
import Filesystem from './components/filesystem';
import Contacts from './components/contacts';
import Terminal from './components/terminal';
import Preferences from './components/preferences';

const About = () => {
  return (
    <View flex fillColor="gray-1" padding="large" align="center">
      <Text fontSize="large">React Desktop</Text>
      <Spacer size="xxlarge" />
      <Text textAlign="center">
        A React-based desktop environment and component library
      </Text>
      <Spacer size="large" />
      <Text textAlign="center">
        2023 Mike Austin
      </Text>
    </View>
  );
};

const initialState = [
  {
    id: uuidv4(), title: 'Calendar', element: <Calendar minWidth={360} />, rect: {
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
      x: 705, y: 15, width: 255, height: 332,
    }
  },
  {
    id: uuidv4(), title: 'Notes', element: <Notes />, rect: {
      x: 975, y: 15, width: 315, height: 332,
    }
  },
  {
    id: uuidv4(), title: 'Music', element: <Music />, rect: {
      x: 1305, y: 15, width: 360, height: 332,
    }
  },
  {
    id: uuidv4(), title: 'Contacts', element: <Contacts />, rect: {
      x: 390, y: 360, width: 570, height: 540,
    }
  },
  // {
  //   id: uuidv4(), title: 'Browser', element: <Browser />, rect: {
  //     x: 15, y: 360, width: 950, height: 540,
  //   }
  // },
  {
    id: uuidv4(), title: 'Terminal', element: <Terminal />, rect: {
      x: 15, y: 360, width: 360, height: 540,
    }
  },
  {
    id: uuidv4(), title: 'Files', element: <Filesystem />, rect: {
      x: 975, y: 360, width: 690, height: 540,
    }
  },
];

type WindowsProp = React.ComponentProps<typeof Desktop>['windows'];

const App = () => {
  console.log('App()');

  const [windows, setWindows] = useState<WindowsProp>(initialState);
  const [windowOrder, setWindowOrder] = useState<string[]>(windows.map(({ id }) => id));

  const addWindow = (title: string, element: React.ReactElement, rect?: Rect) => {
    const id = uuidv4();

    const width = rect?.width ?? 500;
    const height = rect?.height ?? 200;

    setWindows(windows => [
      ...windows,
      {
        id, title, element, rect: {
          x: (window.innerWidth - width) / 2,
          y: (window.innerHeight - height) / 2,
          width,
          height,
        }
      }
    ]);

    setWindowOrder(windowOrder => [...windowOrder, id]);
  };

  const desktopMenuItems = [
    { title: 'Preferences...', action: () => addWindow('Preferences', <Preferences />) },
    null,
    { title: 'About React Desktop...', action: () => addWindow('React Desktop', <About />) },
  ];

  const applicationMenuItems = [
    'Utilities',
    { title: 'Calendar', action: () => addWindow('Calendar', <Calendar />, { width: 360, height: 332 }) },
    { title: 'Clock', action: () => addWindow('Clock', <Clock />, { width: 300, height: 332 }) },
    { title: 'Calculator', action: () => addWindow('Calculator', <Calculator />, { width: 255, height: 332 }) },
    { title: 'Notes', action: () => addWindow('Notes', <Notes />, { width: 800, height: 600 }) },
    { title: 'Music', action: () => addWindow('Music', <Music />, { width: 400, height: 500 }) },
    { title: 'Browser', action: () => addWindow('Browser', <Browser />, { width: 1280, height: 800 }) },
    { title: 'Email', action: () => addWindow('Email', <Email />, { width: 1280, height: 800 }) },
    null,
    'Games',
    { title: 'Asteroids', action: () => console.log('3') },
  ];

  const handleWindowFocus = (windowId: string) => {
    // setWindowOrder(windowOrder => [
    //   ...windowOrder.filter((id) => id !== windowId),
    //   windowId,
    // ]);
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
      <Stack horizontal shadow paddingHorizontal="large" style={{ zIndex: 1 }}>
        <Menu hover title="React-Desktop" rightIcon={undefined} items={desktopMenuItems} />
        <Menu hover title="Applications" rightIcon={undefined} items={applicationMenuItems} />
      </Stack>
      <View flex horizontal>
        <Desktop
          wallpaper="images/d1e91a4058a8a1082da711095b4e0163.jpg"
          windows={windows}
          windowOrder={windowOrder}
          onWindowFocus={handleWindowFocus}
          onWindowChange={handleWindowChange}
          onWindowClose={handleWindowClose}
        />
        <Stack absolute fillColor="white-2" spacing="small" minWidth={240} style={{ top: 0, right: 0, bottom: 0, boxShadow: '0 0 16px hsla(0, 0%, 0%, 0.1)', backdropFilter: 'blur(10px)', padding: 15 }}>
          <Clock style={{ opacity: 1, borderRadius: 4, boxShadow: '0 0 0 1px hsla(0, 0%, 0%, 0.1)' }} />
          <Calculator style={{ opacity: 1, borderRadius: 4, boxShadow: '0 0 0 1px hsla(0, 0%, 0%, 0.1)' }} />
        </Stack>
      </View>
    </View>
  );
};

export default App;
