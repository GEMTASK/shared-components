import React from 'react';

import styles from './App.module.css';
import { View, Text, Button, Stack, Spacer, Divider } from 'bare';

function App() {
  return (
    <View className={styles.App}>
      <View horizontal paddingVertical="large" paddingHorizontal="large">
        <Stack alignHorizontal="center" spacing="small" spacingColor="gray-2">
          <Text fontSize="xxlarge">XXLarge (40)</Text>
          <Text fontSize="xlarge">XLarge (32)</Text>
          <Text fontSize="large">Large (24)</Text>
          <Text fontSize="medium">Medium (18)</Text>
          <Text fontSize="small">Small (14)</Text>
          <Text fontSize="xsmall">XSmall (12)</Text>
          <Text fontSize="xsmall">XXSmall (11)</Text>
        </Stack>
        <Divider spacing="large" />
        <Stack alignHorizontal="center" paddingVertical="small">
          {/* <Spacer size="small" fillColor="gray-1" /> */}
          <Stack horizontal spacing="small">
            <Button hover title="Hover" />
            <Button title="Default" />
            <Button solid title="Solid" />
            <Button primary title="Primary" />
            <Button primary solid title="Primary Solid" />
          </Stack>
          {/* <Spacer size="small" fillColor="gray-4" /> */}
          <Spacer size="small" />
          <Stack horizontal spacing="small">
            <Button solid title="Multiline\nPrimary" />
            <Button primary solid title="Multiline\nPrimary Solid" />
          </Stack>
        </Stack>
      </View>
      <Divider />
      <Stack flex divider>
        <Stack flex horizontal divider>
          <Text flex align="top left" fillColor="white">Top Left</Text>
          <Text flex align="top center" fillColor="white">Top Center</Text>
          <Text flex align="top right" fillColor="white">Top Right</Text>
        </Stack>
        <Stack flex horizontal divider>
          <Text flex align="middle left" fillColor="white">Middle Left</Text>
          <Text flex align="middle center" fillColor="white" textAlign="center">
            Middle Center<br />
            Hello, <Text fontWeight="bold">World <Text textColor="red-9">!!!</Text></Text>
          </Text>
          <Text flex align="middle right" fillColor="white">Middle Right</Text>
        </Stack>
        <Stack flex horizontal divider>
          <Text flex align="bottom left" fillColor="white">Bottom Left</Text>
          <Text flex align="bottom center" fillColor="white">Bottom Center</Text>
          <Text flex align="bottom right" fillColor="white">Bottom Right</Text>
        </Stack>
      </Stack>
    </View>
  );
}

export default App;
