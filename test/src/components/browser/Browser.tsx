import React, { useCallback, useEffect, useRef, useState } from 'react';

import { View, Input, Divider, Button, Stack, Splitter, Desktop, Text, Spacer } from 'bare';

const Browser = ({ ...props }: any) => {
  console.log('Browser()');

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [value, setValue] = useState('');
  const [url, setUrl] = useState(value);

  const handleBlur = () => {
    setUrl(value);
  };

  useEffect(() => {
    setUrl(value);
  }, [value]);

  const srcDoc = `
    <a href="https://chrome.google.com/webstore/detail/hiframe-the-hyper-iframe/joibipdfkleencgfgbbncoheaekffdfn" target="_blank">
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
              <View horizontal absolute fillColor="gray-1" style={{ top: 0, bottom: 0, left: 0, zIndex: 1, transform: !isMenuOpen ? 'translate(-100%, 0)' : undefined, transition: 'transform 0.3s', boxShadow: isMenuOpen ? '2px 0 4px hsla(0, 0%, 0%, 0.1)' : undefined }}>
                <View padding="small">
                  <Button hover icon="bookmark" title="Bookmarks" align="left" />
                  <Button hover icon="sliders" title="Settings" align="left" />
                </View>
                <Divider />
              </View>
              <Stack flex padding="small">
                <Button hover size="xsmall" align="left" icon="bookmark" title="Google" onClick={() => setValue('https://google.com')} />
                <Button hover size="xsmall" align="left" icon="bookmark" title="React | Web and Native UI" onClick={() => setValue('https://react.dev')} />
                <Button hover size="xsmall" align="left" icon="bookmark" title="8Base | Low-Code Platform" onClick={() => setValue('https://8base.com')} />
                <Button hover size="xsmall" align="left" icon="bookmark" title="Home | Haiku Project" onClick={() => setValue('https://www.haiku-os.org')} />
                <Button hover size="xsmall" align="left" icon="bookmark" title="io Programming Language" onClick={() => setValue('https://iolanguage.org')} />
              </Stack>
            </View>
          </View>
        )}
        <View flex>
          <Stack horizontal spacing="small" padding="small" fillColor="gray-1">
            <Button hover icon="table-columns" selected={isSidebarOpen} onClick={() => setIsSidebarOpen(isSidebarOpen => !isSidebarOpen)} />
            <Button hover icon="home" />
            <Input flex value={value} onValueChange={setValue} onBlur={handleBlur} />
          </Stack>
          <Divider />
          <View as="iframe" flex fillColor="white" style={{ border: 'none' }} srcDoc={url ? undefined : srcDoc} src={url} />
        </View>
      </Splitter>
    </View>
  );
};

export default React.memo(Browser);
