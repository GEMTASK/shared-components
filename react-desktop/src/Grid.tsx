import { View, Text, Card, Spacer, Image, Popup, Button, Stack, Icon } from 'bare';

const Location = ({ children }: any) => {
  return (
    <Card
      border={false}
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
      borderColor="alpha-1"
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

const Location3 = ({ children }: any) => {
  return (
    <View>
      <Image border borderColor="alpha-1" src="./images/istockphoto-1396508734-612x612.jpg" width={200} style={{ flexShrink: 0, scrollSnapAlign: 'start', borderRadius: 2.5 }} />
      <Spacer size="small" />
      <Text fontWeight="semibold">Title title title</Text>
      <Spacer size="xsmall" />
      <Text fontSize="xsmall" style={{ opacity: 0.6 }}>Subtitle subtitle</Text>
    </View>
  );
};

const Grid = ({ ...props }: any) => {
  return (
    <View {...props}>
      <View fillColor="white" padding="large large" style={{ position: 'sticky', top: 0, boxShadow: '0 0 0 1px hsla(0, 0%, 0%, 0.1)', zIndex: 1 }}>
        <Text>Header</Text>
      </View>
      <View flex padding="xxlarge xxlarge" maxWidth="100%" fillColor="gray-1" style={{ margin: '0 auto', overflow: 'auto', boxShadow: '0 0 32px hsla(0, 0%, 0%, 0.15)' }}>
        <Text fontSize="large" fontWeight="bold" textColor="gray-9">
          Beautiful locations near the beach
        </Text>
        <Spacer size="large" />
        <View
          style={{
            display: 'grid',
            gap: 16,
            gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))'
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

        <Spacer size="xxlarge" />

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

        <Spacer size="xxlarge" />

        <View horizontal scrollbar={false} style={{ gap: 8, overflowX: 'auto', overflowY: 'hidden', scrollSnapType: 'x', paddingLeft: 24, scrollPaddingLeft: 24, paddingRight: 24, scrollPaddingRight: 24, margin: '0 -24px' }}>
          <Location3 />
          <Location3 />
          <Location3 />
          <Location3 />
          <Location3 />
          <Location3 />
          <Location3 />
          <Location3 />
          <Location3 />
          <Location3 />
        </View>
      </View>
      <View fillColor="gray-7" padding="large large" style={{ position: 'sticky', bottom: 0, zIndex: 1 }}>
        <Text textColor="white">Footer</Text>
      </View>
    </View>
  );
};

export default Grid;
