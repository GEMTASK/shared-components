import React from 'react';

import styles from './App.module.css';
import { View, Text, Button, Stack, Spacer, Divider } from 'bare';

function App() {
  return (
    <View className={styles.App} paddingVertical="large" paddingHorizontal="large">
      <View horizontal>
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
        <Stack flex alignHorizontal="center" align="middle center">
          {/* <Spacer size="small" fillColor="gray-2" /> */}
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
            <Button solid title="Multiline\nPrimary" />
            <Button primary solid title="Multiline\nPrimary Solid" />
          </Stack>
          <Spacer size="small" />
          <Stack horizontal spacing="small">
            <Button hover round title="Hover" />
            <Button round title="Default" />
            <Button round solid title="Solid" />
            <Button round primary title="Primary" />
            <Button round primary solid title="Primary Solid" />
          </Stack>
        </Stack>
      </View>
      <Divider spacing="large" />
      <Text>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.      </Text>
      <Divider spacing="large" />
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
