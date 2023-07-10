import React, { useCallback, useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { hues, View, Text, Image, Button, Stack, Spacer, Divider } from 'bare';
import { Input, Popup, Menu, Tabs, Modal, Form, Card, Table } from 'bare';
import { Desktop } from 'bare';

import { ViewProps } from 'bare/dist/components/view';

const calculateHands = (date: Date) => {
  const hourAngle = ((date.getHours() + date.getMinutes() / 60) * 30 + 180) * (Math.PI / 180);
  const minuteAngle = ((date.getMinutes() + date.getSeconds() / 60) * 6 + 180) * (Math.PI / 180);
  const secondAngle = (date.getSeconds() * 6 + 180) * (Math.PI / 180);

  return ({
    hour: {
      x: Math.cos(hourAngle) * 0 - Math.sin(hourAngle) * 85,
      y: Math.cos(hourAngle) * 85 + Math.sin(hourAngle) * 0,
    },
    minute: {
      x: Math.cos(minuteAngle) * 0 - Math.sin(minuteAngle) * 85,
      y: Math.cos(minuteAngle) * 85 + Math.sin(minuteAngle) * 0,

    },
    second: {
      x: Math.cos(secondAngle) * 0 - Math.sin(secondAngle) * 85,
      y: Math.cos(secondAngle) * 85 + Math.sin(secondAngle) * 0,
    },
  });
};

const Clock = () => {
  const [date, setDate] = useState(new Date());
  const timerRef = useRef<number>();

  const hands = calculateHands(date);

  const updateDate = useCallback(() => {
    const now = new Date();

    setDate(now);

    timerRef.current = window.setTimeout(() => {
      updateDate();
    }, 1000 - now.getMilliseconds());
  }, []);

  useEffect(() => {
    updateDate();

    return () => {
      clearTimeout(timerRef.current);
    };
  }, [updateDate]);

  return (
    <>
      <View as="svg" flex viewBox="0 0 200 200">
        {Array.from({ length: 12 }, (_, index, angle = (index * 30 + 180) * (Math.PI / 180)) => (
          <circle
            key={index}
            cx={Math.cos(angle) * 0 - Math.sin(angle) * 85 + 100}
            cy={Math.cos(angle) * 85 + Math.sin(angle) * 0 + 100}
            r={index % 3 === 0 ? 3 : 1}
            fill="#343a40"
          />
        ))}
        <line
          x1={-(hands.hour.x / 5) + 100}
          y1={-(hands.hour.y / 5) + 100}
          x2={(hands.hour.x / 1.5) + 100}
          y2={(hands.hour.y / 1.5) + 100}
          stroke="#343a40"
          strokeWidth={7}
          style={{ filter: 'drop-shadow(0 0 1px hsla(0, 0%, 0%, 0.25))' }}
        />
        <line
          x1={-(hands.minute.x / 5) + 100}
          y1={-(hands.minute.y / 5) + 100}
          x2={hands.minute.x + 100}
          y2={hands.minute.y + 100}
          stroke="#343a40"
          strokeWidth={5}
          style={{ filter: 'drop-shadow(0 0 2px hsla(0, 0%, 0%, 0.25))' }}
        />
        <line
          x1={-(hands.second.x / 5) + 100}
          y1={-(hands.second.y / 5) + 100}
          x2={hands.second.x + 100}
          y2={hands.second.y + 100}
          stroke="#adb5bd"
          strokeWidth={1}
          style={{ filter: 'drop-shadow(0 0 3px hsla(0, 0%, 0%, 0.25))' }}
        />
        <circle cx="100" cy="100" r="2" fill="white" />
      </View>
    </>
  );
};

const Label = ({ children, ...props }: any) => {
  return (
    <Text caps fontSize="xxsmall" fontWeight="semibold" textColor="gray-6" {...props}>
      {children}
    </Text>
  );
};

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const Calendar = () => {
  const today = new Date();
  const firstDayInMonth = new Date(today.getFullYear(), today.getMonth());
  const lastDayInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

  return (
    <>
      <View fillColor="gray-1">
        <View horizontal align="left" padding="large">
          <Text flex fontSize="large">September</Text>
          <Stack horizontal spacing="small">
            <Button solid size="xsmall" icon="arrow-left" />
            <Button solid size="xsmall" icon="arrow-right" />
          </Stack>
        </View>
        <View horizontal paddingHorizontal="small">
          {days.map(day => (
            <Label flex align="right" paddingHorizontal="small">
              {day}
            </Label>
          ))}
        </View>
        <Spacer size="xsmall" />
      </View>
      <Divider />
      <View flex padding="small" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
        {Array.from({ length: firstDayInMonth.getDay() }, (_, day) => (
          <Text></Text>
        ))}
        {Array.from({ length: lastDayInMonth }).map((_, day) => (
          <Text
            align="top right"
            padding="small"
            fillColor={day + 1 === today.getDate() ? 'blue-5' : undefined}
            textColor={day + 1 === today.getDate() ? 'white' : undefined}
            fontWeight={day + 1 === today.getDate() ? 'bold' : undefined}
            style={{ borderRadius: 2.5 }}
          >
            {day + 1}
          </Text>
        ))}
      </View>
    </>
  );
};

//
//
//

const App = () => {
  console.log('App()');

  const [windows, setWindows] = useState([
    {
      id: uuidv4(), title: 'Calendar', element: <Calendar />, rect: {
        x: 900, y: 50, width: 375, height: 332,
      }
    },
    {
      id: uuidv4(), title: 'Clock', element: <Clock />, rect: {
        x: 100, y: 100, width: 300, height: 332,
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
