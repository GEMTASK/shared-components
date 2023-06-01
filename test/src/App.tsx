import React from 'react';

import './App.css';
import { View, Text } from 'bare';

function App() {
  return (
    <View className="App">
      <Text horizontal flex fillColor="gray-2" alignVertical="middle">
        Hello<br />World
      </Text>
      <Text flex fillColor="gray-3">
        Hello, <Text fontWeight="bold">World<Text fontWeight="normal">!!!</Text></Text>
      </Text>
    </View>
  );
}

export default App;
