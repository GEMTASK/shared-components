import React, { useCallback, useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { View, Text, Image, Button, Spacer, Divider, Stack, Grid } from 'bare';
import { Input, Popup, Menu, Tabs, Modal, Form, Card, Table, Desktop } from 'bare';

import Calendar from './components/calendar';
import Clock from './components/clock';
import Calculator from './components/calculator';
import Notes from './components/notes';
import Browser from './components/browser';

const App = () => {
  console.log('App()');

  const [windows, setWindows] = useState([
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
        x: 980, y: 15, width: 600, height: 332,
      }
    },
    {
      id: uuidv4(), title: 'Browser', element: <Browser />, rect: {
        x: 15, y: 360, width: 1280, height: 800,
      }
    },
  ]);

  const handleWindowChange = useCallback((id: string, rect: DOMRect) => {
    setWindows(windows => windows.map(window => window.id === id
      ? { ...window, rect }
      : window));
  }, []);

  return (
    <View style={{ minHeight: '100vh' }}>
      <Stack horizontal paddingHorizontal="large">
        <Menu hover />
        <Menu hover />
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
