import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import styles from './App.module.css';

import { hues, View, Text, Image, Button, Stack, Spacer, Divider, Card } from 'bare';
import { Input, Popup, Menu, Tabs, Modal, Form } from 'bare';

import { TextProps } from 'bare/dist/components/text/Text';

type LinkProps = {

} & TextProps<'a'> & React.ComponentProps<typeof RouterLink>;

const Link = ({
  children,
  to,
  ...props
}: LinkProps) => {
  return (
    <Text inner={RouterLink} innerProps={{ to }} textColor="blue-5" {...props}>{children}</Text>
  );
};

const Header = () => {
  return (
    <View horizontal align="middle left" padding="medium large">
      <View flex horizontal align="middle left">
        <Image
          src="https://mike-austin.com/new/images/Escher_Circle_Limit_III.jpg"
          width={40}
          height={40}
          style={{ margin: '-5px 0' }}
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
      <View flex id="container" className={styles.Container} padding="large">

        <Stack horizontal spacing="large" align="center">
          <Link to="grid" fillColor="gray-3" padding="small">Grid</Link>
          <Text>
            Go to <Link to="live">Live</Link> to learn more.
          </Text>
        </Stack>

        <Divider spacing="large" />
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
        <Spacer size="large" />
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
          <View flex border fillColor="gray-0" padding="large" style={{ maxWidth: 500 }}>
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
                {
                  key: 'state', label: 'State', type: 'select', options: {
                    'AL': 'Alabama',
                    'AK': 'Alaska',
                    'AZ': 'Arizona',
                  }
                },
                {
                  key: 'state', label: 'State', type: 'radio', options: {
                    'AL': 'Alabama',
                    'AK': 'Alaska',
                    'AZ': 'Arizona',
                  }
                },
                {
                  key: 'states', label: 'states', type: 'checkboxlist', options: {
                    'AL': 'Alabama',
                    'AK': 'Alaska',
                    'AZ': 'Arizona',
                    'AR': 'Arkansas',
                    'CA': 'California',
                    'CO': 'Colorado',
                  }
                },
                {
                  key: 'states', label: 'states', type: 'checkboxlist', options: {
                    'AL': 'Alabama',
                    'AK': 'Alaska',
                    'AZ': 'Arizona',
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
            <View horizontal>
              <Button solid primary type="submit" form="form" title="Save" />
            </View>
          </View>

          <Stack flex border style={{ maxWidth: 500 }}>
            <Stack divider dividerInset={64}>
              <Header />
              <Header />
              <Header />
            </Stack>
            <Divider />
            <View flex fillColor="gray-0" padding="large" style={{ mixBlendMode: 'multiply' }}>
              <Card
                imageSrc="./images/istockphoto-1396508734-612x612.jpg"
                title="Entire villa hosted by Johan"
                subtitle="5 Bedrooms &nbsp;&middot;&nbsp; 4 Bathrooms"
                extra={(
                  <View>
                    <Text fontSize="medium" fontWeight="medium" textAlign="right">
                      $1,200
                    </Text>
                    <Spacer size="small" />
                    <Text fontSize="xsmall" textAlign="right" textColor="gray-6">
                      per night
                    </Text>
                  </View>
                )}
              >
                <Text>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </Text>
              </Card>
            </View>
            <Divider />
            <Stack horizontal negativeSpacing="small" padding="large">
              <Image src="/images/leilani-angel-K84vnnzxmTQ-unsplash.jpg" width={40} height={40} style={{ borderRadius: 1000, boxShadow: '0 0 0 1px white' }} />
              <Image src="/images/foto-sushi-6anudmpILw4-unsplash.jpg" width={40} height={40} style={{ borderRadius: 1000, boxShadow: '0 0 0 1px white' }} />
              <Image src="/images/luis-villasmil-6qf1uljGpU4-unsplash.jpg" width={40} height={40} style={{ borderRadius: 1000, boxShadow: '0 0 0 1px white' }} />
              <Image src="/images/christian-buehner-DItYlc26zVI-unsplash.jpg" width={40} height={40} style={{ borderRadius: 1000, boxShadow: '0 0 0 1px white' }} />
            </Stack>
          </Stack>
        </Stack>

        <Spacer size="large" />

        <Tabs
          labels={['Simple Tab 1', 'Simple Tab 2', 'Simple Tab 3']}
          actions={[
            <Button hover size="small" icon="gear" title="Options" onClick={() => setIsModalOpen(true)} />,
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
