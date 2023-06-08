import React from 'react';

import styles from './App.module.css';
import { View, Text, Button, Stack, Spacer, Divider, Input, Menu } from 'bare';

const Header = () => {
  return (
    <View horizontal align="middle left" paddingVertical="small" paddingHorizontal="medium">
      <View flex horizontal align="middle left">
        <img src="https://mike-austin.com/new/images/Escher_Circle_Limit_III.jpg" style={{ margin: '-5px 0', height: 40, objectFit: 'contain' }} />
        <Spacer size="small" />
        <View flex>
          <Text>Title</Text>
          <Spacer size="small" />
          <Text fontSize="xsmall" textColor="gray-6">Subtitle</Text>
        </View>
      </View>
      <Button primary title="Press Me" />
    </View>
  );
};

function App() {
  return (
    <View tabIndex={0} className={styles.App}>
      <View flex className={styles.Container} paddingVertical="large" paddingHorizontal="large">
        <View horizontal>
          <Stack align="middle center" spacing="small" spacingColor="gray-2">
            <View />
            <Text fontSize="xxlarge">XXLarge (42)</Text>
            <Text fontSize="xlarge">XLarge (32)</Text>
            <Text fontSize="large">Large (24)</Text>
            <Text fontSize="medium">Medium (18)</Text>
            <Text fontSize="small">Small (14)</Text>
            <Text fontSize="xsmall">XSmall (12)</Text>
            <Text fontSize="xsmall">XXSmall (11)</Text>
            <View />
          </Stack>
          <Divider spacing="large" />
          <Stack flex alignHorizontal="center" align="middle center">
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
              {/* <Button hover icon="house" title="Hover" /> */}
              <Button icon="house" title="Icon" />
              <Button solid round icon="magnifying-glass" title="Icon Round" />
              <Button primary icon="check" title="Icon" />
              <Button primary solid round icon="download" title="Icon Round" />
            </Stack>
            <Spacer size="small" />
            <Stack horizontal spacing="small">
              <Button hover title="Multiline\nHover" />
              <Button title="Multiline\nDefault" />
              <Button solid title="Multiline\nSolid" />
              <Button primary title="Multiline\nPrimary" />
              <Button primary solid title="Multiline\nPrimary Solid" />
            </Stack>
            <Spacer size="small" />
            <Stack horizontal spacing="small">
              <Button hover selected title="Hover" />
              <Button selected title="Default" />
              <Button solid selected title="Solid" />
              <Button primary selected title="Primary" />
              <Button primary solid selected title="Primary Solid" />
            </Stack>
            <Spacer size="small" />
            <Stack horizontal spacing="small">
              <Button hover disabled title="Hover" />
              <Button disabled title="Default" />
              <Button solid disabled title="Solid" />
              <Button primary disabled title="Primary" />
              <Button primary solid disabled title="Primary Solid" />
            </Stack>
            <Spacer size="small" />
            <Stack horizontal spacing="small">
              <Button hover size="xsmall" title="Hover" />
              <Button size="xsmall" title="Default" />
              <Button solid size="xsmall" title="Solid" />
              <Button primary size="xsmall" title="Primary" />
              <Button primary solid size="xsmall" title="Primary Solid" />
            </Stack>
          </Stack>
        </View>
        <Divider spacing="large" />
        <View flex horizontal>
          {Array.from({ length: 10 }).map((_, index) => (
            <View flex fillColor={`${View.colors[0]}-${index}`} minHeight={32} title={`${View.colors[0]}-${index}`} />
          ))}
        </View>
        <Stack horizontal style={{ flexWrap: 'wrap' }}>
          {View.colors.slice(1).map((hue) => (
            <View flex horizontal>
              {Array.from({ length: 10 }).map((_, index) => (
                <View flex fillColor={`${hue}-${index}`} minHeight={32} title={`${hue}-${index}`} />
              ))}
            </View>
          ))}
        </Stack>
        <Divider spacing="large" />
        <Stack horizontal spacing="large">
          <Text flex fontSize="xxlarge">
            Lorem ipsum dolor sit amet...
          </Text>
          <Text flex fontSize="xlarge">
            Lorem ipsum dolor sit amet, consectetur...
          </Text>
        </Stack>
        <Spacer size="large" />
        <Stack horizontal spacing="large">
          <Text flex fontSize="large">
            Lorem ipsum dolor sit amet, consectetur...
          </Text>
          <Text flex fontSize="medium">
            Lorem ipsum dolor sit amet, consectetur adipiscing...
          </Text>
          <Text flex>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do...
          </Text>
        </Stack>
        <Spacer size="large" />
        <Stack horizontal spacing="large">
          <Text flex fontSize="xsmall">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...
          </Text>
          <Text flex fontSize="xxsmall">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim...
          </Text>
        </Stack>

        <Spacer size="large" />

        <Stack horizontal spacing="large">
          <View flex fillColor="gray-0" paddingVertical="large" paddingHorizontal="large" style={{ maxWidth: 500 }}>
            <Stack horizontal spacing="small">
              <Input />
              <Button solid title="Search" />
            </Stack>
            <Spacer size="large" />
            <Stack spacing="large">
              <Input label="Username" />
              <Input label="Password" />
            </Stack>
            <Spacer size="large" />
            <Stack horizontal>
              <Menu />
              <Menu />
            </Stack>
          </View>

          <Stack flex divider border style={{ maxWidth: 500 }}>
            <View horizontal paddingHorizontal="medium">
              <Text flex fontSize="xxlarge">Heading</Text>
              <Button primary title="Press Me" />
            </View>
            <View horizontal paddingHorizontal="medium">
              <Text flex fontSize="xlarge">Heading</Text>
              <Button primary size="xsmall" title="Press Me" />
            </View>
            <Spacer size="small" fillColor="gray-2" />
            <Header />
            <Header />
            <Header />
          </Stack>
        </Stack>

        <Spacer size="large" />

        <Stack flex divider minHeight={200}>
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
    </View>
  );
}

export default App;
