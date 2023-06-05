import React from 'react';

import styles from './App.module.css';
import { View, Text, Button, Stack, Divider } from 'bare';

function App() {
  return (
    <View className={styles.App}>
      <View paddingVertical="medium" paddingHorizontal="medium">
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
      <Divider />
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
          <Text flex align="middle right" fillColor="white">Middle Right</Text>
        </Stack>
        <Divider />
        <Stack flex horizontal spacing="line">
          <Text flex align="bottom left" fillColor="white">Bottom Left</Text>
          <Text flex align="bottom center" fillColor="white">Bottom Center</Text>
          <Text flex align="bottom right" fillColor="white">Bottom Right</Text>
        </Stack>
      </View>
      <Divider />
      <Stack alignHorizontal="center" paddingVertical="small">
        <Stack horizontal spacing="small">
          <Button hover title="Hover" />
          <Button title="Default" />
          <Button solid title="Solid" />
          <Button primary title="Primary" />
          <Button primary solid title="Primary Solid" />
        </Stack>
        <View /*fillColor="gray-4"*/ paddingVertical="small" style={{ alignSelf: 'stretch' }} />
        <Stack horizontal spacing="small">
          <Button solid title="Multiline\nPrimary" />
          <Button primary solid title="Multiline\nPrimary Solid" />
        </Stack>
      </Stack>
    </View>
  );
}

export default App;
