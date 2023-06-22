import { View, Text, Card, Spacer, Image } from 'bare';

const Location = ({ children }: any) => {
  return (
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
        {children}
      </Text>
    </Card>

  );
};

const Grid = () => {
  return (
    <View fillColor="gray-2" minHeight="100vh">
      <View fillColor="white" padding="large large" style={{ position: 'sticky', top: 0, boxShadow: '0 0 0 1px hsla(0, 0%, 0%, 0.05)' }}>
        <Text>Header</Text>
      </View>
      <View flex padding="xxlarge xxlarge" maxWidth={'100vw'} fillColor="gray-0" style={{ width: 1000, margin: '0 auto', overflow: 'hidden', boxShadow: '0 0 32px hsla(0, 0%, 0%, 0.15)' }}>
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
        <View horizontal style={{ gap: 8, overflowX: 'auto', scrollSnapType: 'x', paddingLeft: 24, scrollPaddingLeft: 24, margin: '0 -24px' }}>
          <Image src="./images/istockphoto-1396508734-612x612.jpg" width={200} style={{ scrollSnapAlign: 'start', borderRadius: 2.5 }} />
          <Image src="./images/istockphoto-1396508734-612x612.jpg" width={200} style={{ scrollSnapAlign: 'start', borderRadius: 2.5 }} />
          <Image src="./images/istockphoto-1396508734-612x612.jpg" width={200} style={{ scrollSnapAlign: 'start', borderRadius: 2.5 }} />
          <Image src="./images/istockphoto-1396508734-612x612.jpg" width={200} style={{ scrollSnapAlign: 'start', borderRadius: 2.5 }} />
          <Image src="./images/istockphoto-1396508734-612x612.jpg" width={200} style={{ scrollSnapAlign: 'start', borderRadius: 2.5 }} />
          <Image src="./images/istockphoto-1396508734-612x612.jpg" width={200} style={{ scrollSnapAlign: 'start', borderRadius: 2.5 }} />
          <Image src="./images/istockphoto-1396508734-612x612.jpg" width={200} style={{ scrollSnapAlign: 'start', borderRadius: 2.5 }} />
          <Image src="./images/istockphoto-1396508734-612x612.jpg" width={200} style={{ scrollSnapAlign: 'start', borderRadius: 2.5 }} />
          <Image src="./images/istockphoto-1396508734-612x612.jpg" width={200} style={{ scrollSnapAlign: 'start', borderRadius: 2.5 }} />
        </View>
      </View>
      <View fillColor="gray-7" padding="large large" style={{ position: 'sticky', bottom: 0 }}>
        <Text textColor="white">Footer</Text>
      </View>
    </View>
  );
};

export default Grid;
