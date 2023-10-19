import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { v4 as uuidv4 } from 'uuid';

import { View, Text, Button, Spacer, Stack, Icon } from 'bare';
import { Menu, Desktop } from 'bare';
import { Rect } from 'bare/dist/components/desktop/Desktop';

import Applications from './applications';

import About from './components/about';
import Calendar from './components/calendar';
import Clock, { DigitalClock } from './components/clock';
import Calculator from './components/calculator';
import Notes from './components/notes';
import Editor from './components/editor';
import Music from './components/music';
import Files from './components/files';
import Terminal from './components/terminal';
import Preferences from './components/preferences';
import Eyes from './components/eyes';
import Todos from './components/todos';

import styles from './App.module.css';

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
    id: uuidv4(), icon: 'folder-open', title: 'Files', element: <Files />, rect: {
      x: 15, y: 360, width: 675, height: 535,
    }
  },
  {
    id: uuidv4(), icon: 'eye', title: 'Eyes', element: <Eyes />, rect: {
      x: 705, y: 360, width: 255, height: 130 + 32,
    }
  },
  {
    id: uuidv4(), icon: 'list', title: 'Todos', element: <Todos />, rect: {
      x: 705, y: 540, width: 255, height: 325 + 30,
    }
  },
  {
    id: uuidv4(), icon: 'terminal', title: 'Terminal', element: <Terminal />, rect: {
      x: 975, y: 360, width: 690, height: 535,
    }
  },
];

const sideBarClientStyle = {
  opacity: 1, borderRadius: 4, boxShadow: '0 0 0 1px hsla(0, 0%, 0%, 0.1)'
};

type WindowsProp = React.ComponentProps<typeof Desktop>['windows'];

const FileExtension = {
  'txt': Applications.editor,
  'md': Applications.markdown,
  'js': Applications.editor,
  'kopi': Applications.develop,
  'mp3': Applications.music,
  'jpg': Applications.media,
} as const;

const addApplication = (key: keyof typeof Applications, { addWindow }: any) => {
  const app = Applications[key];

  if (app !== undefined) {
    const { icon, title, client, rect } = app;

    addWindow(icon, title, client, rect);
  }
};

const getDesktopMenuItems = (addWindow: any) => [
  { title: 'About React Desktop', action: () => addWindow('info-circle', 'Desktop', <About />, { width: 500, height: 250 }) },
  null,
  { title: 'Preferences', action: () => addWindow('sliders', 'Preferences', <Preferences />, { width: 500, height: 250 }) },
  { title: 'Enter Full Screen', action: () => document.body.requestFullscreen() },
];

const getUtilitiesMenuItems = (addWindow: any) => [
  { title: 'Calendar', action: () => addApplication('calendar', { addWindow }) },
  { title: 'Clock', action: () => addApplication('clock', { addWindow }) },
  { title: 'Calculator', action: () => addApplication('calculator', { addWindow }) },
  { title: 'Notes', action: () => addApplication('notes', { addWindow }) },
  { title: 'Music', action: () => addApplication('music', { addWindow }) },
  { title: 'Files', action: () => addApplication('files', { addWindow }) },
  { title: 'Designer', action: () => addApplication('designer', { addWindow }) },
  { title: 'Contacts', action: () => addApplication('contacts', { addWindow }) },
  { title: 'Terminal', action: () => addApplication('terminal', { addWindow }) },
  { title: 'Markdown', action: () => addApplication('markdown', { addWindow }) },
  { title: 'Eyes', action: () => addApplication('eyes', { addWindow }) },
  null,
  { title: 'Browser', action: () => addApplication('browser', { addWindow }) },
  { title: 'Email', action: () => addApplication('email', { addWindow }) },
  { title: 'Grid', action: () => addApplication('grid', { addWindow }) },
  { title: 'Live', action: () => addApplication('live', { addWindow }) },
  null,
  { title: 'Styleguide', action: () => addApplication('styleguide', { addWindow }) },
];

const getApplicationsMenuItems = (addWindow: any) => [
  'Applications',
  { title: 'Grid Draw', action: () => addApplication('griddraw', { addWindow }) },
  { title: 'Bestest Movies Ever', action: () => addApplication('bestestmoviesever', { addWindow }) },
  { title: 'Kopi Notebook', action: () => addApplication('kopinotebook', { addWindow }) },
  { title: 'UI Builder', action: () => addApplication('uibuilder', { addWindow }) },
  { title: 'Virtual Machine', action: () => addWindow('computer', 'Virtual Machine', <View as="iframe" frameBorder="0" src="https://mike-austin.com/react-desktop-old/clients/vmachine" />, { width: 455, height: 870 }) },
  { title: 'Generator Coroutines', action: () => addWindow('code', 'Generator Coroutines', <View as="iframe" frameBorder="0" src="https://codepen.io/mikeaustin/embed/gOQyPVE?default-tab=js%2Cresult&editable=true" />, { width: 1280, height: 900 }) },
  { title: 'Coroutines using await', action: () => addWindow('code', 'Coroutines using await', <View as="iframe" frameBorder="0" src="https://codepen.io/mikeaustin/embed/JjeqdeB?default-tab=js%2Cresult&editable=true" />, { width: 1280, height: 900 }) },
  { title: 'React Desktop 0.7', action: () => addWindow('display', 'React Desktop 0.7', <View as="iframe" frameBorder="0" src="https://mike-austin.com/react-desktop-old" />, { width: 1280, height: 900 }) },
  null,
  'Games',
  { title: 'React Asteroids', action: () => addWindow('gamepad', 'React Asteroids', <View as="iframe" frameBorder="0" src="https://codepen.io/mikeaustin/embed/mdpYMym?default-tab=js%2Cresult" />, { width: 1440, height: 1024 }) },
  { title: 'Stetegic Asteroids', action: () => addWindow('gamepad', 'Stetegic Asteroids', <View as="iframe" frameBorder="0" src="https://editor.p5js.org/mike_ekim1024/full/q8nWdZV0U" />, { width: 800, height: 873 }) },
  { title: 'Snakey Snake', action: () => addWindow('gamepad', 'Snakey Snake', <View as="iframe" frameBorder="0" src="https://editor.p5js.org/mike_ekim1024/full/8c5ovMThX" />, { width: 400, height: 474 }) },
];

//
// App
//

const App = () => {
  console.log('App()');

  const params = useMemo(() => new URLSearchParams(window.location.search), []);

  const [windows, setWindows] = useState<WindowsProp>(window.innerWidth < 1440 || params.get('app') !== null ? [] : initialState);
  const [windowIdOrder, setWindowIdOrder] = useState<string[]>(windows.map(({ id }) => id));
  const [isSidebarHidden, setIsSidebarHidden] = useState(window.innerWidth < 1024);

  useHotkeys('alt+tab', () => console.log('here'), {
    preventDefault: true
  }, []);

  const addWindow = useCallback((icon: string, title: string, element: React.ReactElement, rect?: Rect) => {
    const id = uuidv4();

    const [right, bottom] = window.innerWidth >= 640
      ? [isSidebarHidden ? 15 : 240, 0]
      : [0, 30];

    let margin = window.innerWidth < 800 ? 15 : 30;

    let width = Math.min(rect?.width ?? 800, window.innerWidth - right - margin);
    let height = Math.min(rect?.height ?? 600, window.innerHeight - 32 - bottom - margin);

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

  const desktopMenuItems = useMemo(() => getDesktopMenuItems(addWindow), [addWindow]);
  const utilitiesMenuItems = useMemo(() => getUtilitiesMenuItems(addWindow), [addWindow]);
  const applicationsMenuItems = useMemo(() => getApplicationsMenuItems(addWindow), [addWindow]);

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
      const filename = event.data.payload as string;
      const ext = filename.slice(filename.lastIndexOf('.') + 1);

      if (ext) {
        const mapping = FileExtension[ext as keyof typeof FileExtension];

        if (mapping !== undefined) {
          const { icon, title, client, rect } = mapping;
          const titleArg = event.data.payload.split('/').at(-1);

          addWindow(icon, `${title}${titleArg !== undefined ? ' — ' + titleArg : ''}`, React.cloneElement(client, { args: event.data.payload }), rect);
        }
      }
    }
  }, [addWindow]);

  const handleSidebarClientClick = useCallback((event: React.PointerEvent) => {
    event.stopPropagation();
  }, []);

  useEffect(() => {
    const app = Applications[params.get('app') as keyof typeof Applications];

    if (app !== undefined) {
      const { icon, title, client, rect } = app;

      setWindows([]);
      setWindowIdOrder([]);

      addWindow(icon, title, client, rect);
    }

    window.addEventListener('message', handleWindowMessage);

    return () => {
      window.removeEventListener('message', handleWindowMessage);
    };
  }, [isSidebarHidden]);

  return (
    <View className={styles.App}>
      <Stack horizontal shadow fillColor="white" paddingHorizontal="large" style={{ zIndex: 1, paddingLeft: 8 }}>
        <Menu hover title="Desktop" titleFontWeight="bold" rightIcon={undefined} items={desktopMenuItems} style={{ paddingLeft: 8, paddingRight: 8 }} />
        <Menu hover title="Utilities" rightIcon={undefined} items={utilitiesMenuItems} style={{ paddingLeft: 8, paddingRight: 8 }} />
        <Menu hover title="Programs" rightIcon={undefined} items={applicationsMenuItems} style={{ paddingLeft: 8, paddingRight: 8 }} />
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
          style={{
            zIndex: 1000,
            top: window.innerWidth < 640 ? undefined : 0, right: 0, bottom: 0, left: window.innerWidth < 640 ? 0 : undefined,
            width: window.innerWidth >= 640 ? 240 : undefined,
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
                  <Text fontWeight="semibold" lineClamp={1}>{window.title}</Text>
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
