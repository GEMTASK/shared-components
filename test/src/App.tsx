import React from 'react';

import './App.css';
import { View } from 'bare';

function App() {
  return (
    <View horizontal className="App">
      <View flex as="a" href="abc" fillColor="gray-5">
        Hello
      </View>
      <View flex as="a" href="abc" fillColor="gray-6">
        Hello
      </View>
    </View>
  );
}

export default App;
