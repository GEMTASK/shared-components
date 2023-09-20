import React, { useEffect, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';

import { View } from 'bare';

const Editor = ({ args, ...props }: any) => {
  const [text, setText] = useState(args);

  useEffect(() => {
    (async () => {
      const text = await (await fetch(`//webdav.mike-austin.com/${args}`)).text();

      if (typeof text === 'string') {
        setText(text);
      }
    })();
  }, [args]);

  return (
    <View flex {...props}>
      <CodeMirror
        value={text}
        height="100%"
        style={{ flex: 1, overflow: 'auto' }}
      // onChange={onChange}
      />
    </View>
  );
};

export default Editor;
