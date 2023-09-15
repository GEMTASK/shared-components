import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import { View, Text, Button, Spacer, Stack, createLink, Icon } from 'bare';
import { Menu, Desktop } from 'bare';
import { Rect } from 'bare/dist/components/desktop/Desktop';

import Calendar from './components/calendar';
import Clock from './components/clock';
import Calculator from './components/calculator';
import Notes from './components/notes';
import Music from './components/music';
import Browser from './components/browser';
import Filesystem from './components/filesystem';
import Contacts from './components/contacts';
import Terminal from './components/terminal';
import Preferences from './components/preferences';
import Markdown from './components/markdown';
import Eyes from './components/eyes';

import Styleguide from './App';
import Email from './Email';
import GridPage from './Grid';
import Live from './Live';

import styles from './App.module.css';

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

const DigitalClock = () => {
  const [date, setDate] = useState(new Date());
  const timerRef = useRef<number>();

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
    <Text fontWeight="semibold" align="center">
      {date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}
    </Text>
  );
};

const initialState = [
  {
    id: uuidv4(), icon: 'calendar', title: 'Calendar', element: <Calendar />, rect: {
      x: 15, y: 15, width: 360, height: 332,
    }
  },
  {
    id: uuidv4(), icon: 'clock', title: 'Clock', element: <Clock />, rect: {
      x: 390, y: 15, width: 300, height: 332,
    }
  },
  {
    id: uuidv4(), icon: 'calculator', title: 'Calculator', element: <Calculator />, rect: {
      x: 705, y: 15, width: 255, height: 332,
    }
  },
  {
    id: uuidv4(), icon: 'note-sticky', title: 'Notes', element: <Notes />, rect: {
      x: 975, y: 15, width: 315, height: 332,
    }
  },
  {
    id: uuidv4(), icon: 'music', title: 'Music', element: <Music />, rect: {
      x: 1305, y: 15, width: 360, height: 332,
    }
  },
  {
    id: uuidv4(), icon: 'folder-open', title: 'Files', element: <Filesystem />, rect: {
      x: 15, y: 360, width: 675, height: 540,
    }
  },
  {
    id: uuidv4(), icon: 'eye', title: 'Eyes', element: <Eyes />, rect: {
      x: 705, y: 360, width: 255, height: 130 + 32,
    }
  },
  // {
  //   id: uuidv4(), title: 'Contacts', element: <Contacts />, rect: {
  //     x: 615, y: 360, width: 510, height: 540,
  //   }
  // },
  {
    id: uuidv4(), icon: 'terminal', title: 'Terminal', element: <Terminal />, rect: {
      x: 975, y: 360, width: 690, height: 540,
    }
  },
];

const sideBarClientStyle = {
  opacity: 1, borderRadius: 4, boxShadow: '0 0 0 1px hsla(0, 0%, 0%, 0.1)'
};

type WindowsProp = React.ComponentProps<typeof Desktop>['windows'];

const App = () => {
  console.log('App()');

  const params = useMemo(() => new URLSearchParams(window.location.search), []);

  const [windows, setWindows] = useState<WindowsProp>(window.innerWidth < 1440 || params.get('app') ? [] : initialState);
  const [windowIdOrder, setWindowIdOrder] = useState<string[]>(windows.map(({ id }) => id));
  const [isSidebarHidden, setIsSidebarHidden] = useState(window.innerWidth < 1024);

  const addWindow = useCallback((icon: string, title: string, element: React.ReactElement, rect?: Rect) => {
    const id = uuidv4();

    const [right, bottom] = window.innerWidth >= 640
      ? [isSidebarHidden ? 15 : 240, 0]
      : [0, 30];

    let margin = window.innerWidth < 800 ? 15 : 30;
    let width = Math.min(rect?.width ?? 500, window.innerWidth - right - margin);
    let height = Math.min(rect?.height ?? 250, window.innerHeight - 32 - bottom - margin);

    setWindows(windows => [
      ...windows,
      {
        id, icon, title, element, rect: {
          x: (window.innerWidth - width - right) / 2,
          y: (window.innerHeight - height - bottom - 32) / 2,
          width,
          height,
        }
      }
    ]);

    setWindowIdOrder(windowIdOrder => [...windowIdOrder, id]);
  }, [isSidebarHidden]);

  const desktopMenuItems = useMemo(() => [
    { title: 'About React Desktop', action: () => addWindow('info-circle', 'Desktop', <About />) },
    null,
    { title: 'Preferences', action: () => addWindow('sliders', 'Preferences', <Preferences />) },
    { title: 'Enter Full Screen', action: () => document.body.requestFullscreen() },
  ], [addWindow]);

  const utilitiesMenuItems = useMemo(() => [
    { title: 'Calendar', action: () => addWindow('calendar', 'Calendar', <Calendar />, { width: 360, height: 332 }) },
    { title: 'Clock', action: () => addWindow('clock', 'Clock', <Clock />, { width: 300, height: 332 }) },
    { title: 'Calculator', action: () => addWindow('calculator', 'Calculator', <Calculator />, { width: 255, height: 332 }) },
    { title: 'Notes', action: () => addWindow('note-sticky', 'Notes', <Notes />, { width: 800, height: 600 }) },
    { title: 'Music', action: () => addWindow('music', 'Music', <Music />, { width: 400, height: 400 }) },
    { title: 'Files', action: () => addWindow('folder-open', 'Files', <Filesystem />, { width: 800, height: 600 }) },
    { title: 'Contacts', action: () => addWindow('address-book', 'Contacts', <Contacts />, { width: 800, height: 600 }) },
    { title: 'Terminal', action: () => addWindow('terminal', 'Terminal', <Terminal />, { width: 800, height: 600 }) },
    { title: 'Markdown', action: () => addWindow('marker', 'Markdown', <Markdown />, { width: 1024, height: 800 }) },
    { title: 'Eyes', action: () => addWindow('eye', 'Eyes', <Eyes />, { width: 255, height: 130 + 32 }) },
    null,
    { title: 'Browser', action: () => addWindow('globe', 'Browser', <Browser />, { width: 1440, height: 1024 }) },
    { title: 'Email', action: () => addWindow('inbox', 'Email', <Email />, { width: 1440, height: 1024 }) },
    { title: 'Grid', action: () => addWindow('question', 'Grid', <GridPage />, { width: 1024, height: 800 }) },
    { title: 'Live', action: () => addWindow('question', 'Live', <Live />, { width: 1024, height: 800 }) },
    null,
    { title: 'Styleguide', action: () => addWindow('palette', 'Styleguide', <Styleguide />, { width: 1024, height: 800 }) },
  ], [addWindow]);

  const applicationMenuItems = useMemo(() => [
    'Applications',
    { title: 'Grid Draw', action: () => addWindow('draw-polygon', 'Grid Draw', <View as="iframe" frameBorder="0" src="https://mike-austin.com/draw-2" />, { width: 1280, height: 900 }) },
    { title: 'Bestest Movies Ever', action: () => addWindow('film', 'Bestest Movies Ever', <View as="iframe" frameBorder="0" src="https://bestestmoviesever.com" />, { width: 1280, height: 900 }) },
    { title: 'Kopi Notebook', action: () => addWindow('book', 'Kopi Notebook', <View as="iframe" frameBorder="0" src="https://mike-austin.com/react-desktop-old/clients/kopi-ide" />, { width: 1280, height: 900 }) },
    { title: 'UI Builder', action: () => addWindow('display', 'UI Builder', <View as="iframe" frameBorder="0" src="https://mike-austin.com/react-desktop-old/clients/builder" />, { width: 1280, height: 900 }) },
    { title: 'Virtual Machine', action: () => addWindow('computer', 'Virtual Machine', <View as="iframe" frameBorder="0" src="https://mike-austin.com/react-desktop-old/clients/vmachine" />, { width: 455, height: 870 }) },
    { title: 'Generator Coroutines', action: () => addWindow('code', 'Generator Coroutines', <View as="iframe" frameBorder="0" src="https://codepen.io/mikeaustin/embed/gOQyPVE?default-tab=js%2Cresult&editable=true" />, { width: 1280, height: 900 }) },
    { title: 'Coroutines using await', action: () => addWindow('code', 'Coroutines using await', <View as="iframe" frameBorder="0" src="https://codepen.io/mikeaustin/embed/JjeqdeB?default-tab=js%2Cresult&editable=true" />, { width: 1280, height: 900 }) },
    { title: 'React Desktop 0.7', action: () => addWindow('display', 'React Desktop 0.7', <View as="iframe" frameBorder="0" src="https://mike-austin.com/react-desktop-old" />, { width: 1280, height: 900 }) },
    null,
    'Games',
    { title: 'React Asteroids', action: () => addWindow('gamepad', 'React Asteroids', <View as="iframe" frameBorder="0" src="https://codepen.io/mikeaustin/embed/mdpYMym?default-tab=js%2Cresult" />, { width: 1440, height: 1024 }) },
    { title: 'Stetegic Asteroids', action: () => addWindow('gamepad', 'Stetegic Asteroids', <View as="iframe" frameBorder="0" src="https://editor.p5js.org/mike_ekim1024/full/q8nWdZV0U" />, { width: 800, height: 873 }) },
    { title: 'Snakey Snake', action: () => addWindow('gamepad', 'Snakey Snake', <View as="iframe" frameBorder="0" src="https://editor.p5js.org/mike_ekim1024/full/8c5ovMThX" />, { width: 400, height: 474 }) },
  ], [addWindow]);

  const handleWindowFocus = useCallback((windowId: string) => {
    setWindowIdOrder(windowIdOrder => [
      ...windowIdOrder.filter((id) => id !== windowId),
      windowId,
    ]);
  }, []);

  const handleWindowChange = useCallback((id: string, rect: DOMRect) => {
    setWindows(windows => windows.map(window => window.id === id
      ? { ...window, rect }
      : window));
  }, []);

  const handleWindowClose = useCallback((id: string) => {
    setWindows(windows => windows.filter(window => window.id !== id));
  }, []);

  const handleWindowMessage = useCallback((event: MessageEvent) => {
    if (event.data.type === 'openFile') {
      addWindow('marker', 'Markdown', <Markdown path={event.data.payload} />, { width: 1024, height: 800 });
    }
  }, [addWindow]);

  const handleSidebarClientClick = useCallback((event: React.PointerEvent) => {
    event.stopPropagation();
  }, []);

  useEffect(() => {
    const app = utilitiesMenuItems.find(item => item?.title === params.get('app'));

    if (app) {
      app.action();
    }

    window.addEventListener('message', handleWindowMessage);

    return () => {
      window.removeEventListener('message', handleWindowMessage);
    };
  }, [handleWindowMessage, params, utilitiesMenuItems]);

  return (
    <View className={styles.App}>
      <Stack horizontal shadow fillColor="white" paddingHorizontal="large" style={{ zIndex: 1, paddingLeft: 8 }}>
        <Menu hover title="Desktop" titleFontWeight="bold" rightIcon={undefined} items={desktopMenuItems} style={{ paddingLeft: 8, paddingRight: 8 }} />
        <Menu hover title="Utilities" rightIcon={undefined} items={utilitiesMenuItems} style={{ paddingLeft: 8, paddingRight: 8 }} />
        <Menu hover title="Programs" rightIcon={undefined} items={applicationMenuItems} style={{ paddingLeft: 8, paddingRight: 8 }} />
        <Spacer flex size="large" />
        <DigitalClock />
      </Stack>
      <View flex horizontal style={{ zIndex: 0, width: '100vw', overflow: 'hidden' }}>
        <Desktop
          wallpaper="images/d1e91a4058a8a1082da711095b4e0163.jpg"
          windows={windows}
          windowOrder={windowIdOrder}
          onWindowFocus={handleWindowFocus}
          onWindowChange={handleWindowChange}
          onWindowClose={handleWindowClose}
        />
        <View
          absolute
          fillColor="white-2"
          minWidth={240}
          style={{
            zIndex: 1000,
            top: window.innerWidth < 640 ? undefined : 0, right: 0, bottom: 0, left: window.innerWidth < 640 ? 0 : undefined,
            boxShadow: '0 0 16px hsla(0, 0%, 0%, 0.1)',
            WebkitBackdropFilter: 'blur(10px)',
            backdropFilter: 'blur(10px)',
            padding: window.innerWidth < 640 ? 10 : 15,
            paddingTop: window.innerWidth < 640 ? 30 : 15,
            transform: isSidebarHidden ? (window.innerWidth < 640 ? 'translate(0, calc(100% - 30px))' : 'translate(225px, 0)') : '',
            transition: 'transform 0.3s ease-in-out'
          }}
          onClick={() => setIsSidebarHidden(isSidebarHidden => !isSidebarHidden)}
        >
          <View fillColor="gray-1" style={{ borderRadius: 2.5, boxShadow: '0 0 0 1px hsla(0, 0%, 0%, 0.1)' }}>
            <Spacer size="small" />
            <Stack onClick={(event: React.PointerEvent) => event.stopPropagation()}>
              {windows.map((window, index, _, isFocused = window.id === windowIdOrder.at(-1)) => (
                <View key={index} horizontal hoverTarget='a' align="left" padding="small large" fillColor={isFocused ? 'gray-3' : undefined} onClick={() => handleWindowFocus(window.id)}>
                  <Icon fixedWidth icon={window?.icon as any} />
                  <Spacer size="small" />
                  <Text fontWeight="semibold">{window.title}</Text>
                  <Spacer flex size="small" />
                  <View hoverParent='a' onClick={() => handleWindowClose(window.id)}>
                    <Button hover size="xsmall" icon="close" style={{ margin: -4 }} />
                  </View>
                </View>
              ))}
            </Stack>
            <Spacer size="small" />
          </View>
          <Spacer flex size={window.innerWidth < 640 ? 'small' : 'large'} />
          <Stack spacing={window.innerWidth < 640 ? 'small' : 'large'}>
            <Calculator
              style={sideBarClientStyle}
              onClick={handleSidebarClientClick}
            />
          </Stack>
        </View>
      </View>
    </View>
  );
};

export default App;
