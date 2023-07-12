import React, { useCallback, useEffect, useRef, useState } from 'react';

import { View, Input, Divider, Button, Stack, Splitter } from 'bare';

const Browser = () => {
  const [value, setValue] = useState('http://google.com');
  const [url, setUrl] = useState(value);

  const handleBlur = () => {
    console.log(value);
    setUrl(value);
  };

  return (
    <>
      <Splitter flex horizontal>
        <View>
          <View horizontal fillColor="gray-1" padding="small">
            <Button hover icon="window-restore" title="Tabs" />
            <Button hover selected icon="clock-rotate-left" title="Bookmarks" />
            <Button hover icon="clock-rotate-left" title="History" />
          </View>
          <Divider />
          <Stack flex padding="small" minWidth={300}>
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
          <View as="iframe" flex style={{ border: 'none' }} src={url} />
        </View>
      </Splitter>
    </>
  );
};

export default Browser;
