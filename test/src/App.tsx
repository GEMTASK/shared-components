import React from 'react';

import styles from './App.module.css';
import { View, Text, Stack } from 'bare';

function App() {
  return (
    <View fillColor="red-4" className={styles.App}>
      <View flex horizontal>
        <Text flex fillColor="white" alignVertical="middle">
          Hello<br />World
        </Text>
        <Text flex fillColor="gray-2" alignHorizontal="center">
          Hello, <Text fontWeight="bold">World<Text fontWeight="normal">!!!</Text></Text>
        </Text>
      </View>
      <Stack horizontal spacing="small" alignHorizontal="center" paddingVertical="medium">
        <Text>1</Text>
        <Text>2</Text>
        <Text>3</Text>
      </Stack>
      <View flex horizontal>
        <Text flex fillColor="gray-2" align="center" textAlign="center">
          {'Hello\\nWorld'}
        </Text>
        <Text flex fillColor="white" align="right" textAlign="right">
          {'Hello\nWorld'}
        </Text>
      </View>
    </View>
  );
}

export default App;
