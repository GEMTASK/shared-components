import { useState } from 'react';
import { LoremIpsum } from 'lorem-ipsum';

import { Button, Divider, Grid, Spacer, Splitter, Text, View } from 'bare';

const lorem = new LoremIpsum();

const files = Array.from({ length: 30 }, (_, index) => ({
  filename: lorem.generateWords(4),
}));

enum ViewType {
  Icon,
  List,
  Table,
}

const IconView = () => {
  return (
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
  );
};

const ListView = () => {
  return (
    <View>

    </View>
  );
};

const Filesystem = () => {
  const [selectedViewType, setViewType] = useState<ViewType>(ViewType.Icon);

  const ToolbarButton = ({ viewType, ...props }: any) => {
    const handleClick = () => setViewType(viewType);

    return (
      <Button hover selected={selectedViewType === viewType} {...props} onClick={handleClick} />
    );
  };

  return (
    <>
      <Splitter flex horizontal style={{ minHeight: 0 }}>
        <View padding="large" minWidth={112} style={{ width: 192 }}>
          <Text>Tree</Text>
        </View>
        <View flex>
          <View horizontal padding="small" fillColor="gray-1">
            <ToolbarButton icon="square" viewType={ViewType.Icon} />
            <ToolbarButton icon="list" viewType={ViewType.List} />
            <ToolbarButton icon="border-all" viewType={ViewType.Table} />
          </View>
          <Divider />
          <IconView />
        </View>
      </Splitter>
    </>
  );
};

export default Filesystem;
