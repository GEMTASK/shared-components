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
    <View style={{ height: '100vh' }}>
      <Stack flex horizontal divider fillColor="gray-1" style={{ minHeight: 0 }}>

        <View style={{ width: 360 }}>
          <View padding="large">
            <View horizontal>
              <Button solid icon="file-alt" title="Compose" />
            </View>
            <Spacer size="large" />
            <Input placeholder="Search..." />

            <View>
              <Spacer size="large" />
              <Text caps fontSize="xxsmall" fontWeight="semibold" textColor="gray-6">
                Today
              </Text>
              <Spacer size="small" />
              <Stack divider border style={{ overflow: 'hidden' }}>
                <View padding="small large" fillColor="white" style={{ position: 'relative' }}>
                  <Text fontWeight="semibold" lineClamp={1}>
                    testuser@example.com
                  </Text>
                  <Spacer size="small" />
                  <Text fontSize="xxsmall" textColor="gray-6" lineClamp={1}>
                    Marketing Budget Q4: Please review till August, 31 (Make this a longer subject)
                  </Text>
                  <Spacer size="large" />
                  <Text fontSize="xsmall" lineClamp={2}>
                    Preview asdfadsfsf asdfasdf asdfasdf adfadsf adfadsf adsfa asdfadsf asdfadsf asdfadsf adsfasdf adsfasdfa dsfasdfasd fasdf asdfadsf
                  </Text>
                </View>
                <View padding="small large" fillColor="white" style={{ position: 'relative' }}>
                  <View style={{ position: 'absolute', top: 0, left: 0, borderTop: '20px solid lightblue', borderRight: '20px solid transparent' }} />
                  <Text fontWeight="semibold" lineClamp={1}>
                    testuser@example.com
                  </Text>
                  <Spacer size="small" />
                  <Text fontSize="xxsmall" textColor="gray-6" lineClamp={1}>
                    Marketing Budget Q4: Please review till August, 31 (Make this a longer subject)
                  </Text>
                  <Spacer size="large" />
                  <Text fontSize="xsmall" lineClamp={2}>
                    Preview asdfadsfsf asdfasdf asdfasdf adfadsf adfadsf adsfa asdfadsf asdfadsf asdfadsf adsfasdf adsfasdfa dsfasdfasd fasdf asdfadsf
                  </Text>
                </View>
              </Stack>
            </View>
          </View>
        </View>

        <View flex fillColor="white">
          <View padding="large">
            <Stack horizontal spacing="small">
              <Button icon="reply" title="Reply" />
              <Button icon="reply-all" title="Reply All" />
            </Stack>
            <Spacer size="large" />
            <Text fontWeight="semibold" lineClamp={1}>
              testuser@example.com
            </Text>
            <Spacer size="small" />
            <Text fontSize="xsmall" textColor="gray-6" lineClamp={1}>
              Marketing Budget Q4: Please review till August, 31
            </Text>
          </View>
          <View paddingHorizontal="large">
            <Divider />
          </View>
          <Text flex fillColor="white" style={{ overflow: 'auto' }} padding="large">
            {emailBody}
          </Text>
        </View>

      </Stack>
    </View>
  );
};

export default Email;
