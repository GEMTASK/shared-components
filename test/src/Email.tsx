import { View, Text, Card, Spacer, Image, Popup, Button, Stack, Icon, Divider, Input, Menu } from 'bare';
import { LoremIpsum } from 'lorem-ipsum';

const xemailBody = `Hi there,

I purchased the headphones at Perfect Music on Monday, August 11. Later, I discovered that the left headphone wasn’t working. Unfortunately, the staff refused to replace the headphones or return my money although I provided the receipt.

I’m deeply disappointed about the quality of the product and the disrespectful treatment I received in your store.

I hope to have this issue resolved and get my money back, otherwise, I will have to take further actions.

Best,
Joe
`;

const lorem = new LoremIpsum({
});

const emailBody = lorem.generateParagraphs(8).split('\n').join('\n\n');


const Message = ({ unread }: any) => {
  return (
    <View padding="medium large" fillColor="white" style={{ position: 'relative' }}>
      {unread && (
        <View style={{ position: 'absolute', top: 0, left: 0, borderTop: '20px solid lightblue', borderRight: '20px solid transparent' }} />
      )}
      <Text fontWeight="semibold" lineClamp={1}>
        testuser@example.com
      </Text>
      <Spacer size="small" />
      <Text fontSize="xxsmall" textColor="gray-6" lineClamp={1}>
        Marketing Budget Q4: Please review till August, 31 (Make this a longer subject)
      </Text>
      <Spacer size="medium" />
      <Text fontSize="xsmall" lineClamp={2}>
        {lorem.generateParagraphs(5)}
        Preview asdfadsfsf asdfasdf asdfasdf adfadsf adfadsf adsfa asdfadsf asdfadsf asdfadsf adsfasdf adsfasdfa dsfasdfasd fasdf asdfadsf
      </Text>
    </View>
  );
};

const Email = () => {
  return (
    <View style={{ height: '100vh' }}>
      <Stack flex horizontal divider fillColor="gray-1" style={{ minHeight: 0 }}>

        <View style={{ width: 360, minHeight: 0 }}>
          <View paddingHorizontal="large">
            <Spacer size="large" />
            <View horizontal>
              <Button solid primary icon="file-alt" title="Compose" />
            </View>
            <Spacer size="large" />
            <View horizontal align="left">
              <Text flex fontSize="large" fontWeight="semibold">
                Inbox
              </Text>
              <Menu hover size="xsmall" title="Sort by" style={{ marginBottom: -7 }} />
            </View>
            <Spacer size="small" />
            <Input icon="search" placeholder="Search" style={{ borderRadius: 1000 }} />
          </View>

          <View paddingHorizontal="large" style={{ minHeight: 0, overflow: 'auto' }}>
            <View fillColor="gray-1" style={{ position: 'sticky', top: 0, zIndex: 2 }}>
              <Divider style={{ marginTop: -1 }} />
              <Spacer size="xlarge" />
              <Text caps fontSize="xxsmall" fontWeight="semibold" textColor="gray-6">
                Today
              </Text>
              <Spacer size="small" />
              {/* <Divider /> */}
              <View style={{ position: 'relative', zIndex: 3, marginBottom: -3, height: 3, borderTop: '1px solid hsla(0, 0%, 0%, 0.1)', borderTopLeftRadius: 2.5, borderTopRightRadius: 2.5 }} />
            </View>
            <Stack divider border style={{ marginTop: -1 }}>
              <Message unread />
              <Message unread />
              <Message />
            </Stack>
            <View fillColor="gray-1" style={{ position: 'sticky', top: 0, zIndex: 2 }}>
              <Divider style={{ marginTop: -1 }} />
              <Spacer size="xlarge" />
              <Text caps fontSize="xxsmall" fontWeight="semibold" textColor="gray-6">
                Yesterday
              </Text>
              <Spacer size="small" />
              {/* <Divider /> */}
              <View style={{ position: 'relative', zIndex: 3, marginBottom: -3, height: 3, borderTop: '1px solid hsla(0, 0%, 0%, 0.1)', borderTopLeftRadius: 2.5, borderTopRightRadius: 2.5 }} />
            </View>
            <Stack divider border style={{ marginTop: -1 }}>
              <Message />
              <Message />
              <Message />
              <Message />
              <Message />
            </Stack>
            <Spacer size="large" />
          </View>

        </View>

        <View flex fillColor="white">
          <View padding="large">
            <Stack horizontal>
              <Stack horizontal spacing="large">
                <Stack horizontal spacing="small">
                  <Button primary icon="reply" title="Reply" />
                  <Button primary icon="reply-all" title="Reply All" />
                </Stack>
                <Button icon="share" title="Forward" />
              </Stack>
              <Spacer flex size="large" />
              <Stack horizontal spacing="small">
                <Menu title="Move to Folder" />
                <Button icon="trash" title="Mark as Junk" />
              </Stack>
              <Spacer flex size="large" />
              <Stack horizontal>
                <Button icon="trash" title="Delete" />
              </Stack>
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
