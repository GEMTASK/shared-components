import { Button, Divider, Form, Input, Spacer, Splitter, Stack, Text, View } from 'bare';

const Contacts = ({ ...props }) => {
  return (
    <Splitter horizontal {...props}>

      <View fillColor="gray-1">
        <View horizontal padding="small large">
          <Button solid title="New Contact" />
        </View>
        <Divider />
        <View padding="large">
          <Text fontSize="large">Contacts</Text>
          <Spacer size="small" />
          <Input />
        </View>
        <Divider />
        <View flex padding="small" fillColor="white">
          <Stack divider>
            <View padding="small">
              <Text>John Appleseed</Text>
            </View>
            <View padding="small">
              <Text>John Appleseed</Text>
            </View>
            <View padding="small">
              <Text>John Appleseed</Text>
            </View>
          </Stack>
          <Divider />
        </View>
      </View>

      <View flex>
        <Stack horizontal>
          <Stack horizontal spacing="small" padding="small large">
            <Button icon="edit" title="Edit" />
          </Stack>
          <Spacer flex size="large" />
          <Stack horizontal spacing="small" padding="small large">
            <Button icon="message" title="Message" />
            <Button icon="video" title="Facetime" />
            <Button icon="envelope" title="Email" />
          </Stack>
        </Stack>
        <Divider />
        <View padding="large">
          <Text fontSize="large">
            John Appleseed
          </Text>
          <Spacer size="xxlarge" />
          <View>
            <Form
              id="form"
              flush
              fields={[
                { key: 'firstName', label: 'First Name', type: 'text' },
                { key: 'lastName', label: 'Last Name', type: 'text' },
                { key: 'phone', label: 'phone', type: 'text' },
                { key: 'email', label: 'Email', type: 'text' },
              ]}
              initialValues={{
                firstName: 'Joe',
                lastName: 'Smith',
                email: 'john.appleseed@example.com',
              }}
            >
            </Form>
          </View>
        </View>
      </View>

    </Splitter>
  );
};

export default Contacts;
