import React from 'react';

import './App.css';
import { View, Text } from 'bare';

function App() {
  return (
    <View horizontal className="App">
      <Text flex fillColor="gray-2" style={{ alignItems: 'center' }}>
        Hello<br />World
      </Text>
      <Text flex fillColor="gray-3" style={{ alignItems: 'center', justifyContent: 'center' }}>
        Hello, <Text fontWeight="bold">World<Text fontWeight="normal">!!!</Text></Text>
      </Text>
    </View>
  );
}

export default App;
