import React, { useCallback, useEffect, useRef, useState } from 'react';
import { LoremIpsum } from 'lorem-ipsum';

import { View, Text, Card, Spacer, Image, Popup, Button, Stack, Icon, Divider, Input, Menu, Modal, Form, Splitter } from 'bare';
import { ViewProps } from 'bare/dist/components/view';

const xemailBody = `Hi there,

I purchased the headphones at Perfect Music on Monday, August 11. Later, I discovered that the left headphone wasn’t working. Unfortunately, the staff refused to replace the headphones or return my money although I provided the receipt.

I’m deeply disappointed about the quality of the product and the disrespectful treatment I received in your store.

I hope to have this issue resolved and get my money back, otherwise, I will have to take further actions.

Best,
Joe
`;

const lorem = new LoremIpsum();

const emailBody = lorem.generateParagraphs(8).split('\n').join('\n\n');

type MessageProps = {
  subject: string,
  unread?: boolean,
} & ViewProps;

const Message = React.memo(({
  subject,
  unread,
  ...props
}: MessageProps) => {
  console.log('Message');

  return (
    <View padding="medium large" fillColor="white" style={{ borderBottom: `1px solid hsla(0, 0%, 0%, 0.1)` }} {...props}>
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

// const Inner = ({ height, itemHeight, items }: any) => {
//   const [scrollTop, setScrollTop] = useState(0);

//   const handleScroll = useCallback(() => {
//     if (listElementRef.current) {
//       setScrollTop(listElementRef.current.scrollTop);
//     }

//     // onItemAtIndex(0);
//   }, []);

//   const offset = Math.floor(scrollTop / itemHeight);
//   const count = Math.floor(height / itemHeight) + 1;

//   return Array.from({ length: count }, (_, index) => (
//     <Message
//       key={(offset + index) % count}
//       subject={items[offset + index].subject}
//     />
//   ));

// };

const List = ({
  itemHeight,
  items,
  onRender,
}: any) => {
  console.log('List()');

  const listElementRef = useRef<HTMLElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [height, setHeight] = useState(0);
  const scrollTopRef = useRef(0);

  const handleScroll = useCallback((event: React.UIEvent) => {
    if (Math.floor(scrollTopRef.current / itemHeight) !== Math.floor(event.currentTarget.scrollTop / itemHeight)) {
      setScrollTop(event.currentTarget.scrollTop);
    }

    scrollTopRef.current = event.currentTarget.scrollTop;

    // onItemAtIndex(0);
  }, [itemHeight]);

  useEffect(() => {
    if (listElementRef.current) {
      setHeight(listElementRef.current.clientHeight);
    }
  }, [itemHeight]);

  useEffect(() => {
    let resizeObserver: ResizeObserver;

    resizeObserver = new ResizeObserver((entries: any) => {
      if (listElementRef.current) {
        setHeight(listElementRef.current.clientHeight);
        setScrollTop(listElementRef.current.scrollTop);
      }
    });

    if (listElementRef.current) {
      resizeObserver.observe(listElementRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const offset = Math.floor(scrollTop / itemHeight);
  const count = Math.min(items.length, Math.ceil(height / itemHeight) + 1);

  return (
    <View flex ref={listElementRef} /* padding="large" */ style={{ minHeight: 0, overflow: 'auto' }} onScroll={handleScroll}>
      <View style={{ position: 'absolute', inset: 0, height: items.length * itemHeight }} />
      <View style={{ flexShrink: 0, flexBasis: itemHeight * offset }} />
      {Array.from({ length: count + (offset + count > items.length ? -1 : 0) }, (_, index) => (
        <Message
          key={(offset + index) % count}
          subject={items[offset + index].subject}
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
  console.log('MessageList()');

  const handleItemAtIndex = () => {
    // return (
    //   <Message />
    // );
  };

  const messages = Array.from({ length: 10 }, (_, index) => ({
    sender: 'someone@example.com',
    subject: `Subject ${index + 1}`,
    body: 'Body',
  }));

  return (
    <View ref={ref} style={{ minHeight: 0, ...style }} {...props}>
      <View paddingHorizontal="large">
        <Spacer size="small" />
        <View horizontal>
          <Button solid primary icon="file-alt" title="Compose" onClick={onComposeMessage} />
        </View>
        <Spacer size="large" />
        <View horizontal align="bottom left">
          <Text flex fontSize="large" fontWeight="semibold">
            Inbox
          </Text>
          <Menu text title="Sort by" />
        </View>
        <Spacer size="small" />
        <Input icon="search" placeholder="Search" style={{ borderRadius: 1000 }} />
      </View>

      <List padding="large" items={messages} itemHeight={94} onItemAtIndex={handleItemAtIndex} />

      {/* <View paddingHorizontal="large" style={{ minHeight: 0, overflow: 'auto' }}>
        <View fillColor="gray-1" style={{ position: 'sticky', top: 0, zIndex: 2 }}>
          <Divider style={{ marginTop: -1 }} />
          <Spacer size="large" />
          <Text caps fontSize="xxsmall" fontWeight="semibold" textColor="gray-6">
            Today
          </Text>
          <Spacer size="small" />
          <View style={{ zIndex: 3, marginBottom: -3, height: 3, borderTop: '1px solid hsla(0, 0%, 0%, 0.1)', borderTopLeftRadius: 2.5, borderTopRightRadius: 2.5 }} />
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
          <View style={{ zIndex: 3, marginBottom: -3, height: 3, borderTop: '1px solid hsla(0, 0%, 0%, 0.1)', borderTopLeftRadius: 2.5, borderTopRightRadius: 2.5 }} />
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
      <View padding="small large">
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
        <Text fontWeight="semibold" lineClamp={1} style={{ userSelect: 'text' }}>
          testuser@example.com
        </Text>
        <Spacer size="small" />
        <Text fontSize="xsmall" textColor="gray-6" lineClamp={1} style={{ userSelect: 'text' }}>
          Marketing Budget Q4: Please review till August, 31
        </Text>
      </View>
      <View paddingHorizontal="large">
        <Divider />
      </View>
      <Text flex fillColor="white" style={{ overflow: 'auto', padding: 32, userSelect: 'text' }} padding="xxlarge">
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
        <Splitter flex horizontal>
          <MessageList minWidth={192} style={{ width: 300 }} onComposeMessage={() => setIsNewMessageModalOpen(true)} />
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
