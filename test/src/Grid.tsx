import { View, Text, Card, Spacer, Image, Popup, Button, Stack, Icon } from 'bare';

const Location = ({ children }: any) => {
  return (
    <Card
      shadow
      imageSrc="./images/istockphoto-1396508734-612x612.jpg"
      headingTitle="Entire villa hosted by Johan"
      headingTitleRight="$1,200"
      headingSubtitle="5 Bedrooms &nbsp;&middot;&nbsp; 4 Bathrooms"
      headingSubtitleRight={
        <Text fontSize="xsmall" textColor="gray-6" textAlign="right" style={{ fontStyle: 'italic' }}>
          per night
        </Text>
      }
      extra={<Icon size="sm" icon="star" />}
    >
      <Text>
        {children}
      </Text>
      <Spacer flex size="large" />
      <Stack horizontal>
        <Popup element={<Button icon="gear" title="Actions" />} >
          <Text padding="medium large">
            Hello
          </Text>
        </Popup>
      </Stack>
    </Card>
  );
};

const Location2 = ({ children }: any) => {
  return (
    <Card
      horizontal
      shadow
      imageSrc="./images/istockphoto-1396508734-612x612.jpg"
      imageWidth={150}
      headingTitle="Entire villa hosted by Johan"
      headingTitleRight="$1,200"
      headingSubtitle="5 Bedrooms &nbsp;&middot;&nbsp; 4 Bathrooms"
    >
      <Text>
        {children}
      </Text>
      <Spacer flex size="large" />
      <Stack horizontal>
        <Popup element={<Button icon="gear" title="Actions" />} >
          <Text padding="medium large">
            Hello
          </Text>
        </Popup>
      </Stack>
    </Card>
  );
};

const Grid = () => {
  return (
    <View fillColor="gray-2" minHeight="100vh">
      <View fillColor="white" padding="large large" style={{ position: 'sticky', top: 0, boxShadow: '0 0 0 1px hsla(0, 0%, 0%, 0.1)', zIndex: 2 }}>
        <Text>Header</Text>
      </View>
      <View flex padding="xxlarge xxlarge" maxWidth={'100vw'} fillColor="gray-0" style={{ width: 1400, margin: '0 auto', overflow: 'hidden', boxShadow: '0 0 32px hsla(0, 0%, 0%, 0.1)' }}>
        <Text fontSize="large" fontWeight="bold" textColor="gray-9">
          Beautiful locations near the beach
        </Text>
        <Spacer size="large" />
        <View
          style={{
            display: 'grid',
            gap: 16,
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))'
          }}
        >
          <Location>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </Location>
          <Location>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
          </Location>
          <Location>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </Location>
          <Location>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </Location>
        </View>
        <Spacer size="large" />

        <View
          style={{
            display: 'grid',
            gap: 16,
            gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))'
          }}
        >
          <Location2>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </Location2>
          <Location2>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
          </Location2>
          <Location2>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </Location2>
          <Location2>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </Location2>
        </View>


        <Spacer size="large" />
        <View horizontal scrollbar={false} style={{ gap: 8, overflowX: 'auto', scrollSnapType: 'x', paddingLeft: 24, scrollPaddingLeft: 24, paddingRight: 24, scrollPaddingRight: 24, margin: '0 -24px' }}>
          <Image border src="./images/istockphoto-1396508734-612x612.jpg" width={200} style={{ flexShrink: 0, scrollSnapAlign: 'start', borderRadius: 2.5 }} />
          <Image border src="./images/istockphoto-1396508734-612x612.jpg" width={200} style={{ flexShrink: 0, scrollSnapAlign: 'start', borderRadius: 2.5 }} />
          <Image border src="./images/istockphoto-1396508734-612x612.jpg" width={200} style={{ flexShrink: 0, scrollSnapAlign: 'start', borderRadius: 2.5 }} />
          <Image border src="./images/istockphoto-1396508734-612x612.jpg" width={200} style={{ flexShrink: 0, scrollSnapAlign: 'start', borderRadius: 2.5 }} />
          <Image border src="./images/istockphoto-1396508734-612x612.jpg" width={200} style={{ flexShrink: 0, scrollSnapAlign: 'start', borderRadius: 2.5 }} />
          <Image border src="./images/istockphoto-1396508734-612x612.jpg" width={200} style={{ flexShrink: 0, scrollSnapAlign: 'start', borderRadius: 2.5 }} />
          <Image border src="./images/istockphoto-1396508734-612x612.jpg" width={200} style={{ flexShrink: 0, scrollSnapAlign: 'start', borderRadius: 2.5 }} />
          <Image border src="./images/istockphoto-1396508734-612x612.jpg" width={200} style={{ flexShrink: 0, scrollSnapAlign: 'start', borderRadius: 2.5 }} />
          <Image border src="./images/istockphoto-1396508734-612x612.jpg" width={200} style={{ flexShrink: 0, scrollSnapAlign: 'start', borderRadius: 2.5 }} />
        </View>
      </View>
      <View fillColor="gray-7" padding="large large" style={{ position: 'sticky', bottom: 0, zIndex: 2 }}>
        <Text textColor="white">Footer</Text>
      </View>
    </View>
  );
};

export default Grid;
