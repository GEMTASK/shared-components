import React, { useCallback, useEffect, useRef, useState } from 'react';

import { View, Input, Divider, Button, Stack, Splitter, Desktop, Text } from 'bare';

const Browser = ({ isMenuOpen, ...props }: any) => {
  // const [value, setValue] = useState('http://google.com');
  const [value, setValue] = useState('');
  const [url, setUrl] = useState(value);

  const handleBlur = () => {
    console.log(value);
    setUrl(value);
  };

  return (
    <View horizontal {...props}>
      <View horizontal absolute fillColor="gray-1" style={{ top: 0, bottom: 0, left: 0, zIndex: 1, transform: !isMenuOpen ? 'translate(-100%, 0)' : undefined, transition: 'transform 0.1s', boxShadow: isMenuOpen ? '2px 0 4px hsla(0, 0%, 0%, 0.1)' : undefined }}>
        <View padding="small">
          <Button hover icon="bookmark" title="Bookmarks" align="left" />
          <Button hover icon="sliders" title="Settings" align="left" />
        </View>
        <Divider />
      </View>
      <Splitter flex horizontal>
        <View minWidth={112}>
          <View horizontal fillColor="gray-1" padding="small">
            <Button hover icon="window-restore" /* title="Tabs" */ />
            <Button hover selected icon="bookmark" /* title="Bookmarks" */ />
            <Button hover icon="clock-rotate-left" /* title="History" */ />
          </View>
          <Divider />
          <Stack flex padding="small" minWidth={192}>
            <Button hover size="xsmall" align="left" icon="star" title="Google" />
            <Button hover size="xsmall" align="left" icon="star" title="React" onClick={() => setUrl('http://react.dev')} />
            <Button hover size="xsmall" align="left" icon="star" title="Smashing Magazine" onClick={() => setUrl('https://www.smashingmagazine.com')} />
          </Stack>
        </View>
        <View flex>
          <Stack horizontal spacing="small" padding="small" fillColor="gray-1">
            <Button hover icon="home" />
            <Input flex value={value} onChange={setValue} onBlur={handleBlur} />
          </Stack>
          <Divider />
          <View as="iframe" flex fillColor="white" style={{ border: 'none' }} src={url} />
        </View>
      </Splitter>
    </View>
  );
};

export default Browser;
