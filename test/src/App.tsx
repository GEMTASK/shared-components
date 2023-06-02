import React from 'react';

import styles from './App.module.css';
import { View, Text } from 'bare';

function App() {
  return (
    <View fillColor="gray-5" className={styles.App}>
      <View flex horizontal>
        <Text flex fillColor="white" alignVertical="middle">
          Hello<br />World
        </Text>
        <Text flex fillColor="gray-2" alignHorizontal="center">
          Hello, <Text fontWeight="bold">World<Text fontWeight="normal">!!!</Text></Text>
        </Text>
      </View>
      <View flex horizontal>
        <Text flex fillColor="gray-2" alignVertical="middle" textAlign="center">
          {'Hello\\nWorld'}
        </Text>
        <Text flex fillColor="white" alignVertical="middle" textAlign="center">
          {'Hello\nWorld'}
        </Text>
      </View>
    </View>
  );
}

export default App;
