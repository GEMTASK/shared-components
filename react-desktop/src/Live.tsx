import { LiveProvider, LiveEditor, LiveError, LivePreview } from "react-live";

import { View, Text, Card, Stack, Spacer } from 'bare';

const code = `
  <Stack horizontal spacing="large" padding="large">
    <Card
      title="Entire villa hosted by Johan"
      subtitle="5 Bedrooms &nbsp;&middot;&nbsp; 4 Bathrooms"
      imageSrc="images/istockphoto-1396508734-612x612.jpg"
    >
      <Text>asdf</Text>
    </Card>
    <View border fillColor="white" minWidth={300} align="center">
      <Text>Hello, <Text fontWeight="bold">world</Text></Text>
      <Spacer fillColor="red-5" />
    </View>
  </Stack>
`;

const scope = {
  View,
  Text,
  Card,
  Stack,
  Spacer,
};

const Grid = ({ ...props }: any) => {
  return (
    <View {...props}>
      <LiveProvider code={code} scope={scope}>
        <LiveEditor />
        <LiveError />
        <LivePreview />
      </LiveProvider>
    </View>
  );
};

export default Grid;
