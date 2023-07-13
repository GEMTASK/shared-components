import React, { useCallback, useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { View, Text, Image, Button, Spacer, Divider, Stack, Grid } from 'bare';
import { Input, Popup, Menu, Tabs, Modal, Form, Card, Table, Desktop } from 'bare';

import Calendar from './components/calendar';
import Clock from './components/clock';
import Calculator from './components/calculator';
import Notes from './components/notes';
import Browser from './components/browser';
import Music from './components/music';

const About = () => {
  return (
    <Text flex textAlign="center" padding="large" align="center">
      A React-based desktop environment and component library<br /><br />
      2023 Mike Austin
    </Text>
  );
};

const App = () => {
  console.log('App()');

  const [windows, setWindows] = useState<React.ComponentProps<typeof Desktop>['windows']>([
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
        x: 15, y: 360, width: 1280, height: 540,
      }
    },
  ]);

  const desktopMenuItems = [
    {
      title: 'About React-Desktop...', action: () => setWindows(windows => [
        ...windows,
        {
          id: uuidv4(), title: 'About React-Desktop', element: <About />, rect: {
            x: 100, y: 100, width: 500, height: 200,
          }
        }
      ])
    },
  ];

  const applicationMenuItems = [
    'Utilities',
    { title: 'Calendar', action: () => console.log('1') },
    { title: 'Clock', action: () => console.log('2') },
    { title: 'Calculator', action: () => console.log('2') },
    { title: 'Notes', action: () => console.log('2') },
    { title: 'Music', action: () => console.log('2') },
    null,
    'Games',
    { title: 'Duis aute irure dolor', action: () => console.log('3') },
  ];

  const handleWindowChange = useCallback((id: string, rect: DOMRect) => {
    setWindows(windows => windows.map(window => window.id === id
      ? { ...window, rect }
      : window));
  }, []);

  return (
    <View style={{ minHeight: '100vh' }}>
      <Stack horizontal paddingHorizontal="large">
        <Menu hover title="React-Desktop" rightIcon={undefined} items={desktopMenuItems} />
        <Menu hover title="Applications" rightIcon={undefined} items={applicationMenuItems} />
      </Stack>
      <Desktop
        wallpaper="images/d1e91a4058a8a1082da711095b4e0163.jpg"
        windows={windows}
        onWindowChange={handleWindowChange}
      />
    </View>
  );
};

export default App;
