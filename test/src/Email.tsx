import { View, Text, Card, Spacer, Image, Popup, Button, Stack, Icon, Divider, Input } from 'bare';

const emailBody = `Hi there,

I purchased the headphones at Perfect Music on Monday, August 11. Later, I discovered that the left headphone wasn’t working. Unfortunately, the staff refused to replace the headphones or return my money although I provided the receipt.

I’m deeply disappointed about the quality of the product and the disrespectful treatment I received in your store.

I hope to have this issue resolved and get my money back, otherwise, I will have to take further actions.

Best,
Joe
`;

const Email = () => {
  return (
    <View minHeight="100vh">
      <Stack flex horizontal divider>

        <View minWidth={360} fillColor="gray-1">
          <View padding="large">
            <View horizontal>
              <Button solid title="Compose" />
            </View>
            <Spacer size="large" />
            <Input placeholder="Search..." />
          </View>

          <Divider />

          <View>
            <View>
              <Spacer size="small" />
              <Text caps fontSize="xxsmall" padding="small large">
                Today
              </Text>
            </View>
            <Divider />
            <Stack divider>
              <View padding="small large" fillColor="white" style={{ position: 'relative' }}>
                <View style={{ position: 'absolute', top: 0, left: 0, borderTop: '20px solid lightblue', borderRight: '20px solid transparent' }} />
                <Text fontWeight="semibold">testuser@example.com</Text>
                <Spacer size="small" />
                <Text fontSize="xsmall" textColor="gray-6">Marketing Budget Q4: Please review till August, 31</Text>
                <Spacer size="large" />
                <Text fontSize="xsmall">Preview</Text>
              </View>
              <View padding="small large" fillColor="white">
                <Text fontWeight="semibold">From</Text>
                <Spacer size="small" />
                <Text fontSize="xsmall" textColor="gray-6">Marketing Budget Q4: Please review till August, 31</Text>
              </View>
            </Stack>
            <Divider />
          </View>
        </View>

        <View flex fillColor="white">
          <View padding="large">
            <Stack horizontal spacing="small">
              <Button icon="reply" title="Reply" />
              <Button icon="reply-all" title="Reply All" />
            </Stack>
            <Spacer size="large" />
            <Text fontWeight="semibold">testuser@example.com</Text>
            <Spacer size="small" />
            <Text fontSize="xsmall" textColor="gray-6">Marketing Budget Q4: Please review till August, 31</Text>
          </View>
          <Divider />
          <View flex fillColor="white">
            <Text padding="large">
              {emailBody}
            </Text>
          </View>
        </View>

      </Stack>
    </View>
  );
};

export default Email;
