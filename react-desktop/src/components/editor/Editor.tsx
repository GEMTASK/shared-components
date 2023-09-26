import React, { useEffect, useState } from 'react';

import { View } from 'bare';

import TextEdit from './components/TextEdit';

const Editor = ({ args, onChange, ...props }: any) => {
  const [value, setValue] = useState(args);

  useEffect(() => {
    (async () => {
      const text = await (await fetch(`//webdav.mike-austin.com/${args}`)).text();

      if (typeof text === 'string') {
        setValue(text);
      }
    })();
  }, [args]);

  return (
    <View flex {...props}>
      <TextEdit
        value={value}
        onChange={onChange}
      />
    </View>
  );
};

export default Editor;
