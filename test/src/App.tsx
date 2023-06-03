import React from 'react';

import styles from './App.module.css';
import { View, Text, Button, Stack, Divider } from 'bare';

function App() {
  return (
    <View className={styles.App}>
      <View flex fillColor="gray-2">
        <Stack flex horizontal spacing="line">
          <Text flex align="top left" fillColor="white">Top Left</Text>
          <Text flex align="top center" fillColor="white">Top Center</Text>
          <Text flex align="top right" fillColor="white">Top Right</Text>
        </Stack>
        <Divider />
        <Stack flex horizontal spacing="line">
          <Text flex align="middle left" fillColor="white">Middle Left</Text>
          <Text flex align="middle center" fillColor="white" textAlign="center">
            Middle Center<br />
            Hello, <Text fontWeight="bold">World <Text textColor="red-9">!!!</Text></Text>
          </Text>
          <Text flex align="middle right" fillColor="white">Middle Bottom</Text>
        </Stack>
        <Divider />
        <Stack flex horizontal spacing="line">
          <Text flex align="bottom left" fillColor="white">Bottom Left</Text>
          <Text flex align="bottom center" fillColor="white">Bottom Center</Text>
          <Text flex align="bottom right" fillColor="white">Bottom Right</Text>
        </Stack>
      </View>
      <Divider />
      <View paddingVertical="small" paddingHorizontal="small">
        <Divider />
        <Text flex fontSize="xsmall" alignVertical="middle">XSmall</Text>
        <Divider />
        <Text flex fontSize="small" alignVertical="middle">Small</Text>
        <Divider />
        <Text flex fontSize="medium" alignVertical="middle">Medium</Text>
        <Divider />
        <Text flex fontSize="large" alignVertical="middle">Large</Text>
        <Divider />
        <Text flex fontSize="xlarge" alignVertical="middle">XLarge</Text>
        <Divider />
      </View>
      <Stack horizontal spacing="small" alignHorizontal="center" paddingVertical="small">
        <Text>1</Text>
        <Text>2</Text>
        <Text>3</Text>
      </Stack>
      <Divider />
      <Stack spacing="small" alignHorizontal="center" paddingVertical="small">
        <Button title="Primary Solid" />
        <Button title="Multiline\nPrimary Solid" />
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
