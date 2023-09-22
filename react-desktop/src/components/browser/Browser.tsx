import React, { useCallback, useEffect, useState } from 'react';
import { createUseStyles } from 'react-jss';

import { View, Input, Divider, Button, Stack, Splitter, Spacer } from 'bare';

const bookmarks = [
  { title: "Google", url: 'https://google.com' },
  { title: "React | Web and Native UI", url: 'https://react.dev' },
  { title: "8Base | Low-Code Platform", url: 'https://8base.com' },
  { title: "Home | Haiku Project", url: 'https://www.haiku-os.org' },
  { title: "io Programming Language", url: 'https://iolanguage.org' },
] as const;

const useStyles = createUseStyles({
  Menu: {
    top: 0,
    bottom: 0,
    left: 0,
    zIndex: 1,
    transition: 'transform 0.3s',
  },
  Iframe: {
    border: 'none',
  }
});

const Browser = ({ ...props }: any) => {
  console.log('Browser()');

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [value, setValue] = useState('');
  const [url, setUrl] = useState(value);

  const styles = useStyles();

  const handleBlur = () => {
    setUrl(value);
  };

  useEffect(() => {
    setUrl(value);
  }, [value]);

  const srcDoc = `
    <a
      href="https://chrome.google.com/webstore/detail/hiframe-the-hyper-iframe/joibipdfkleencgfgbbncoheaekffdfn"
      target="_blank"
    >
      Install the HiFrame Chrome extension to be able to use this browser
    </a>
  `;

  return (
    <View horizontal {...props} style={{ overflow: 'hidden' }}>
      <Splitter flex horizontal>
        {isSidebarOpen && (
          <View minWidth={240}>
            <View horizontal fillColor="gray-1" padding="small">
              <Button hover icon="bars" onClick={() => setIsMenuOpen(isMenuOpen => !isMenuOpen)} />
              <Spacer flex size="small" />
              <Button hover icon="window-restore" /* title="Tabs" */ />
              <Button hover selected icon="bookmark" /* title="Bookmarks" */ />
              <Button hover icon="clock-rotate-left" /* title="History" */ />
              <Spacer flex size="small" />
              <Button hover icon="add" /* title="History" */ />
            </View>
            <Divider />
            <View flex>
              <View
                horizontal
                absolute
                fillColor="gray-1"
                className={styles.Menu}
                style={{
                  transform: !isMenuOpen ? 'translate(-100%, 0)' : undefined,
                  boxShadow: isMenuOpen ? '2px 0 4px hsla(0, 0%, 0%, 0.1)' : undefined
                }}
              >
                <View padding="small">
                  <Button hover icon="bookmark" title="Bookmarks" align="left" />
                  <Button hover icon="sliders" title="Settings" align="left" />
                </View>
                <Divider />
              </View>
              <Stack flex padding="small">
                {bookmarks.map(({ title, url }) => (
                  <Button hover size="xsmall" align="left" icon="bookmark" title={title} onClick={() => setValue(url)} />
                ))}
              </Stack>
            </View>
          </View>
        )}
        <View flex>
          <Stack horizontal spacing="small" padding="small" fillColor="gray-1">
            <Button
              hover
              icon="table-columns"
              selected={isSidebarOpen}
              onClick={() => setIsSidebarOpen(isSidebarOpen => !isSidebarOpen)}
            />
            <Button hover icon="home" />
            <Input flex value={value} onValueChange={setValue} onBlur={handleBlur} />
          </Stack>
          <Divider />
          {/* <View as="iframe" flex fillColor="white" className={styles.Iframe} srcDoc={url === '' ? srcDoc : undefined} src={url} /> */}
          <View as="iframe" flex fillColor="white" className={styles.Iframe} {...url === '' && { srcDoc }} src={url} />
        </View>
      </Splitter>
    </View>
  );
};

export default React.memo(Browser);
