import { View, Text, Card, Spacer, Image, Popup, Button, Stack, Icon, Divider, Input, Menu, Modal, Form, Splitter } from 'bare';
import { ViewProps } from 'bare/dist/components/view';
import { LoremIpsum } from 'lorem-ipsum';
import React, { useEffect, useRef, useState } from 'react';

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

type MessageProps = {
  subject: string,
  unread?: boolean,
} & ViewProps;

const Message = React.forwardRef(({
  subject,
  unread,
  ...props
}: MessageProps, ref) => {
  return (
    <View ref={ref as any} padding="medium large" fillColor="white" style={{ position: 'relative' }} {...props}>
      {unread && (
        <View style={{ position: 'absolute', top: 0, left: 0, borderTop: '20px solid lightblue', borderRight: '20px solid transparent' }} />
      )}
      <Text fontWeight="semibold" lineClamp={1}>
        testuser@example.com
      </Text>
      <Spacer size="small" />
      <Text fontSize="xxsmall" textColor="gray-6" lineClamp={1}>
        {subject}
      </Text>
      <Spacer size="medium" />
      <Text fontSize="xsmall" lineClamp={2}>
        Preview asdfadsfsf asdfasdf asdfasdf adfadsf adfadsf adsfa asdfadsf asdfadsf asdfadsf adsfasdf adsfasdfa dsfasdfasd fasdf asdfadsf
      </Text>
    </View>
  );
});

const List = ({
  itemHeight,
  items,
  onItemAtIndex
}: any) => {
  const listElementRef = useRef<HTMLElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [height, setHeight] = useState(0);

  const handleScroll = () => {
    if (listElementRef.current) {
      setScrollTop(listElementRef.current.scrollTop);
    }

    // onItemAtIndex(0);
  };

  useEffect(() => {
    if (listElementRef.current) {
      setHeight(listElementRef.current.clientHeight);
    }
  }, [itemHeight]);

  const offset = Math.floor(scrollTop / itemHeight);

  return (
    <View flex ref={listElementRef} /* padding="large" */ style={{ minHeight: 0, overflow: 'auto', position: 'relative' }} onScroll={handleScroll}>
      <View style={{ position: 'absolute', inset: 0, height: items.length * itemHeight }} />
      {Array.from({ length: height / itemHeight + 1 }, (_, index) => (
        <Message
          key={(offset + index) % (height / itemHeight)}
          subject={items[offset + index].subject}
          style={{ transform: `translate(0, ${itemHeight * offset}px)` }}
        />
      ))}
    </View>
  );
};

const MessageList = React.forwardRef(({
  style,
  onComposeMessage,
  ...props
}: any, ref) => {
  const handleItemAtIndex = () => {
    // return (
    //   <Message />
    // );
  };

  const messages = Array.from({ length: 100 }, (_, index) => ({
    sender: 'someone@example.com',
    subject: `Subject ${index + 1}`,
    body: 'Body',
  }));

  return (
    <View ref={ref} style={{ minHeight: 0, ...style }} {...props}>
      <View paddingHorizontal="large">
        <Spacer size="large" />
        <View horizontal>
          <Button solid primary icon="file-alt" title="Compose" onClick={onComposeMessage} />
        </View>
        <Spacer size="small" />
        <View horizontal align="left">
          <Text flex fontSize="large" fontWeight="semibold">
            Inbox
          </Text>
          <Menu hover title="Sort by" style={{ paddingTop: 14 }} />
        </View>
        {/* <Spacer size="small" /> */}
        <Input icon="search" placeholder="Search" style={{ borderRadius: 1000 }} />
      </View>

      <List padding="large" items={messages} itemHeight={93} onItemAtIndex={handleItemAtIndex} />

      {/* <View paddingHorizontal="large" style={{ minHeight: 0, overflow: 'auto' }}>
        <View fillColor="gray-1" style={{ position: 'sticky', top: 0, zIndex: 2 }}>
          <Divider style={{ marginTop: -1 }} />
          <Spacer size="large" />
          <Text caps fontSize="xxsmall" fontWeight="semibold" textColor="gray-6">
            Today
          </Text>
          <Spacer size="small" />
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
      </View> */}

    </View>
  );
});

const MessageDetails = () => {
  return (
    <View flex fillColor="white">
      <View padding="large">
        <Stack horizontal>
          <Stack horizontal spacing="small">
            <Button primary icon="reply" title="Reply" tabletTitleHidden />
            <Button primary icon="reply-all" title="Reply All" tabletTitleHidden />
            <Button primary icon="share" title="Forward" tabletTitleHidden />
          </Stack>
          <Spacer flex size="large" />
          <Stack horizontal spacing="small">
            <Menu icon="folder-open" title="Move to Folder" tabletTitleHidden />
            <Button icon="envelopes-bulk" title="Mark as Junk" tabletTitleHidden />
          </Stack>
          <Spacer flex size="large" />
          <Stack horizontal>
            {/* <Button titleTextColor="red-8" borderColor="red-8" icon="trash" title="Delete" /> */}
            <Button titleTextColor="red-6" icon="trash-can" title="Delete" tabletTitleHidden />
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
      <Text flex fillColor="white" style={{ overflow: 'auto', padding: 32 }} padding="xxlarge">
        {emailBody}
      </Text>
    </View>
  );
};

const Email = () => {
  const [isNewMessageModalOpen, setIsNewMessageModalOpen] = useState(false);

  return (
    <>
      <Stack flex horizontal fillColor="gray-1" style={{ height: '100vh', minHeight: 0 }}>
        <Stack padding="large small" fillColor="gray-4">
          <Button hover icon="home" />
          <Button hover icon="envelope" />
          <Button hover icon="sliders" />
        </Stack>
        <Splitter flex horizontal initialWidth={360}>
          <MessageList onComposeMessage={() => setIsNewMessageModalOpen(true)} />
          <MessageDetails />
        </Splitter>
      </Stack>

      <Modal
        isOpen={isNewMessageModalOpen}
        title="New Message"
        minWidth={800}
        actions={[
          <Button solid title="Discard" onClick={() => setIsNewMessageModalOpen(false)} />,
          <Button solid primary title="Send Message" onClick={() => setIsNewMessageModalOpen(false)} />,
        ]}
        onRequestClose={() => setIsNewMessageModalOpen(false)}
      >
        <Form
          fields={[
            { key: 'recipient', label: 'To', type: 'text' },
            { key: 'subject', label: 'Subject' },
            { key: 'body', label: 'Message', lines: 15 },
          ]}
        />
      </Modal>
    </>
  );
};

export default Email;
