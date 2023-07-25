import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import { View, Text, Image, Button, Spacer, Divider, Stack, Grid, createLink } from 'bare';
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

const Link = createLink(RouterLink);

const About = () => {
  return (
    <View flex fillColor="gray-1" padding="large" align="center">
      <Text fontSize="large">React Desktop</Text>
      <Spacer size="xxlarge" />
      <Text textAlign="center">
        A React-based desktop environment, component library,<br />
        and integrated programming language (Kopi)
      </Text>
      <Spacer size="large" />
      <Text fontSize="xsmall" textColor="gray-6" textAlign="center">
        2022 – 2023 Mike Austin
      </Text>
      <Spacer size="xxlarge" />
      <Text textAlign="center" maxWidth={300}>
        <Link to="https://www.npmjs.com/package/open-color" target="_blank">open-color</Link>
        <Text> &nbsp; </Text>
        <Link to="https://www.npmjs.com/package/react-jss" target="_blank">react-jss</Link>
        <Text> &nbsp; </Text>
        <Link to="https://www.npmjs.com/package/clsx" target="_blank">clsx</Link>
        <Text> &nbsp; </Text>
        <Link to="https://www.npmjs.com/package/react-responsive" target="_blank">react-responsive</Link>
        <Text> &nbsp; </Text>
        <Link to="https://www.npmjs.com/package/uuid" target="_blank">uuid</Link>
        <Text> &nbsp; </Text>
        <Link to="https://www.npmjs.com/package/@fortawesome/react-fontawesome" target="_blank">react-fontawesome</Link>
        <Text> &nbsp; </Text>
        <Link to="https://www.npmjs.com/package/lorem-ipsum" target="_blank">lorem-ipsum</Link>
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
      x: 615, y: 360, width: 510, height: 540,
    }
  },
  {
    id: uuidv4(), title: 'Terminal', element: <Terminal />, rect: {
      x: 1140, y: 360, width: 525, height: 540,
    }
  },
  {
    id: uuidv4(), title: 'Files', element: <Filesystem />, rect: {
      x: 15, y: 360, width: 585, height: 540,
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
    const height = rect?.height ?? 250;

    setWindows(windows => [
      ...windows,
      {
        id, title, element, rect: {
          x: (window.innerWidth - width) / 2,
          y: (window.innerHeight - height - 32) / 2,
          width,
          height,
        }
      }
    ]);

    setWindowOrder(windowOrder => [...windowOrder, id]);
  };

  const desktopMenuItems = [
    { title: 'Preferences', action: () => addWindow('Preferences', <Preferences />) },
    null,
    { title: 'About React Desktop', action: () => addWindow('React Desktop', <About />) },
  ];

  const utilitiesMenuItems = [
    { title: 'Calendar', action: () => addWindow('Calendar', <Calendar />, { width: 360, height: 332 }) },
    { title: 'Clock', action: () => addWindow('Clock', <Clock />, { width: 300, height: 332 }) },
    { title: 'Calculator', action: () => addWindow('Calculator', <Calculator />, { width: 255, height: 332 }) },
    { title: 'Notes', action: () => addWindow('Notes', <Notes />, { width: 800, height: 600 }) },
    { title: 'Music', action: () => addWindow('Music', <Music />, { width: 400, height: 500 }) },
    { title: 'Files', action: () => addWindow('Files', <Filesystem />, { width: 800, height: 600 }) },
    { title: 'Contacts', action: () => addWindow('Contacts', <Contacts />, { width: 800, height: 600 }) },
    { title: 'Terminal', action: () => addWindow('Terminal', <Terminal />, { width: 800, height: 600 }) },
    null,
    { title: 'Browser', action: () => addWindow('Browser', <Browser />, { width: 1280, height: 800 }) },
    { title: 'Email', action: () => addWindow('Email', <Email />, { width: 1280, height: 800 }) },
  ];

  const applicationMenuItems = [
    'Programs',
    { title: 'Grid Draw', action: () => addWindow('Grid Draw', <View as="iframe" frameBorder="0" src="https://mike-austin.com/draw-2" />, { width: 1280, height: 800 }) },
    { title: 'Bestest Movies Ever', action: () => addWindow('Bestest Movies Ever', <View as="iframe" frameBorder="0" src="https://bestestmoviesever.com" />, { width: 1280, height: 800 }) },
    { title: 'Kopi Notebook', action: () => addWindow('Kopi Notebook', <View as="iframe" frameBorder="0" src="https://mike-austin.com/react-desktop/clients/kopi-ide" />, { width: 1280, height: 800 }) },
    { title: 'UI Builder', action: () => addWindow('UI Builder', <View as="iframe" frameBorder="0" src="https://mike-austin.com/react-desktop/clients/builder" />, { width: 1280, height: 800 }) },
    { title: 'Virtual Machine', action: () => addWindow('Virtual Machine', <View as="iframe" frameBorder="0" src="https://mike-austin.com/react-desktop/clients/vmachine" />, { width: 455, height: 845 }) },
    null,
    'Games',
    { title: 'React Asteroids', action: () => addWindow('Virtual Machine', <View as="iframe" frameBorder="0" src="https://codepen.io/mikeaustin/embed/mdpYMym?default-tab=js%2Cresult" />, { width: 1440, height: 800 }) },
    { title: 'Stetegic Asteroids', action: () => addWindow('Stetegic Asteroids', <View as="iframe" frameBorder="0" src="https://editor.p5js.org/mike_ekim1024/full/q8nWdZV0U" />, { width: 800, height: 873 }) },
    { title: 'Snakey Snake', action: () => addWindow('Snakey Snake', <View as="iframe" frameBorder="0" src="https://editor.p5js.org/mike_ekim1024/full/8c5ovMThX" />, { width: 400, height: 474 }) },
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
      <Stack horizontal shadow paddingHorizontal="large" style={{ zIndex: 1 }}>
        <Menu hover title="React-Desktop" titleFontWeight="bold" rightIcon={undefined} items={desktopMenuItems} />
        <Menu hover title="Utilities" rightIcon={undefined} items={utilitiesMenuItems} />
        <Menu hover title="Applications" rightIcon={undefined} items={applicationMenuItems} />
      </Stack>
      <View flex horizontal style={{ zIndex: 0 }}>
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
