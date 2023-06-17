import React, { useState } from 'react';

import styles from './App.module.css';
import { hues, View, Text, Image, Button, Stack, Spacer, Divider } from 'bare';
import { Input, Popup, Menu, Tabs, Modal, Form } from 'bare';

const Header = () => {
  return (
    <View horizontal align="middle left" paddingVertical="medium" paddingHorizontal="medium">
      <View flex horizontal align="middle left">
        <Image
          src="https://mike-austin.com/new/images/Escher_Circle_Limit_III.jpg"
          style={{ margin: '-5px 0', height: 40, objectFit: 'contain' }}
        />
        <Spacer size="small" />
        <View flex>
          <Text fontWeight="semibold">Title</Text>
          <Spacer size="small" />
          <Text fontSize="xsmall" textColor="gray-6">Subtitle</Text>
        </View>
      </View>
      <Button primary title="Press Me" />
    </View>
  );
};

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <View className={styles.App}>
      <View flex id="container" className={styles.Container} paddingVertical="large" paddingHorizontal="large">

        <View horizontal align="middle left">
          <Text flex fontSize="xlarge" fontWeight="bold" textColor="gray-8">Page Header</Text>
          <Button primary title="Action Button" />
          <Spacer size="small" />
          <Button solid primary title="Action Button" />
        </View>
        <Divider spacing="large" />

        <View horizontal align="middle left">
          <Text flex fontSize="large" fontWeight="thin">Section Header</Text>
          <Button primary size="xsmall" title="Action Button" />
          <Spacer size="small" />
          <Button solid primary size="xsmall" title="Action Button" />
        </View>
        <Spacer size="small" />
        <Divider />
        <Spacer size="large" />

        <Stack horizontal spacing="large">
          <Popup element={<Button solid title="Popup" />}>
            <Button tabIndex={-1} title="One" />
          </Popup>
          <Popup element={<Input />}>
            <Button title="One" onClick={() => console.log('ff')} />
            <Button title="Two" onClick={() => console.log('ff')} />
          </Popup>
        </Stack>

        <Divider spacing="large" />
        <View horizontal>
          <Stack align="middle center" spacing="small" spacingColor="gray-2">
            <View />
            <Text fontSize="xxlarge">XXLarge (40)</Text>
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
              <Button hover round icon="house" title="Hover Icon" />
              <Button icon="house" title="Icon" />
              <Button solid round icon="magnifying-glass" />
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
          </Stack>
          <Divider spacing="large" />
          <Stack spacing="small" alignVertical="middle">
            <Button primary size="xsmall" title="XSmall" />
            <Button primary size="small" title="Small" />
            <Button primary size="medium" title="Medium" />
          </Stack>
        </View>
        <Divider spacing="large" />
        <View horizontal>
          {Array.from({ length: 10 }).map((_, index) => (
            <View key={index} flex fillColor={`${hues[0]}-${index}` as any} minHeight={32} title={`${hues[0]}-${index}`} />
          ))}
        </View>
        <Stack horizontal style={{ flexWrap: 'wrap' }}>
          {hues.slice(1).map((hue) => (
            <View key={hue} flex horizontal>
              {Array.from({ length: 10 }).map((_, index) => (
                <View key={index} flex fillColor={`${hue}-${index}` as any} minHeight={32} title={`${hue}-${index}`} />
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
              <Menu />
              <Menu />
            </Stack>
            <Spacer size="large" />
            <Stack horizontal spacing="small">
              <Input />
              <Button solid title="Search" />
            </Stack>
            <Spacer size="large" />

            <Form
              id="form"
              fields={[
                { key: 'firstName', label: 'First Name', type: 'text' },
                { key: 'dueDate', label: 'Due Date', type: 'date' },
                { key: 'fillColor', label: 'Fill Color', type: 'color' },
                { key: 'married', label: 'Married', type: 'checkbox' },
                {
                  key: 'state', label: 'State', type: 'select', options: {
                    'AL': 'Alabama',
                    'AK': 'Alaska',
                  }
                },
              ]}
              initialValues={{
                firstName: 'Joe Smith',
                dueDate: '2020-01-01',
                fillColor: '#408040',
                married: true,
                state: 'AK',
              }}
            >
            </Form>
            <Spacer size="large" />
            <Button solid primary type="submit" form="form" title="Save" />

          </View>
          <Stack flex border style={{ maxWidth: 500 }}>
            <View horizontal paddingHorizontal="medium" align="middle center">
              <Text flex fontSize="xlarge">Heading</Text>
              <Button primary title="Press Me" />
            </View>
            <Stack flex divider dividerInset={60}>
              <View horizontal paddingHorizontal="medium" align="middle center">
                <Text flex fontSize="large">Heading</Text>
                <Button primary size="xsmall" title="Press Me" />
              </View>
              <Spacer size="small" fillColor="gray-2" />
              <Header />
              <Header />
              <Header />
            </Stack>
          </Stack>
        </Stack>

        <Spacer size="large" />

        <Tabs
          labels={['Simple Tab 1', 'Simple Tab 2', 'Simple Tab 3']}
          actions={[
            <Button hover size="xsmall" icon="gear" title="Options" onClick={() => setIsModalOpen(true)} />,
            // <Button hover icon="gear" />,
          ]}>
          <Text>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
          </Text>
          <Text>
            At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.
          </Text>
          <Text>
            Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.
          </Text>
        </Tabs>

        <Divider spacing="large" />

        <Tabs labels={['Conrolled Tab 1', 'Conrolled Tab 2']} onTabSelect={(index: number) => console.log(index)} />

        <Divider spacing="large" />

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
      <Modal
        isOpen={isModalOpen}
        actions={[
          <Button solid primary title="Save" onClick={() => setIsModalOpen(false)} />,
          <Button solid title="Cancel" onClick={() => setIsModalOpen(false)} />,
        ]}
        onRequestClose={() => setIsModalOpen(false)}
      >
        <Text>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
        </Text>
      </Modal>
    </View>
  );
}

export default App;
