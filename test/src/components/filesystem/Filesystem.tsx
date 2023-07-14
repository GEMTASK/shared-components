import { LoremIpsum } from 'lorem-ipsum';

import { Button, Divider, Grid, Spacer, Splitter, Text, View } from 'bare';

const lorem = new LoremIpsum();

const files = Array.from({ length: 30 }, (_, index) => ({
  filename: lorem.generateWords(4),
}));

const Filesystem = () => {
  return (
    <>
      <Splitter flex horizontal style={{ minHeight: 0 }}>
        <View padding="large" minWidth={112} style={{ width: 192 }}>
          <Text>Tree</Text>
        </View>
        <View flex>
          <View horizontal padding="small" fillColor="gray-1">
            <Button hover icon="square" />
            <Button hover icon="list" />
            <Button hover icon="border-all" />
          </View>
          <Divider />
          <View padding="large" style={{ overflow: 'auto' }}>
            <Grid align="top left" gap={20} style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))' }}>
              {files.map(({ filename }) => (
                <View align="top">
                  <View fillColor="gray-1" style={{ width: 48, height: 48 }} />
                  <Spacer size="small" />
                  <Text lineClamp={2} textAlign="center">{filename}</Text>
                </View>
              ))}
            </Grid>
          </View>
        </View>
      </Splitter>
    </>
  );
};

export default Filesystem;
