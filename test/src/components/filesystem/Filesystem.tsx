import { useState } from 'react';
import { LoremIpsum } from 'lorem-ipsum';

import { Button, Divider, Grid, Spacer, Splitter, Table, Text, View } from 'bare';

const lorem = new LoremIpsum();

const files = Array.from({ length: 30 }, () => ({
  filename: lorem.generateWords(4).split(' ').map(([a, ...rest]) => a.toUpperCase() + rest.join('')).join(' ') + '.png',
  size: Math.random() * 100,
})).sort((a, b) => a.filename < b.filename ? -1 : 1);

// enum ViewType {
//   Icon,
//   List,
//   Table,
// }

const IconView = () => {
  return (
    <Grid align="top left" gap={20} style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
      {files.map(({ filename }) => (
        <View align="top">
          <View fillColor="gray-3" style={{ width: 48, height: 48, borderRadius: 2.5 }} />
          <Spacer size="small" />
          <Text lineClamp={2} textAlign="center">{filename}</Text>
        </View>
      ))}
    </Grid>
  );
};

const ListView = () => {
  return (
    <Grid align="top left" gap={16} style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
      {files.map(({ filename }) => (
        <View horizontal align="left">
          <View fillColor="gray-3" style={{ width: 24, height: 24, borderRadius: 2.5, flexShrink: 0 }} />
          <Spacer size="small" />
          <Text lineClamp={1}>{filename}</Text>
        </View>
      ))}
    </Grid>
  );
};

const DetailsView = () => {
  return (
    <Grid align="top left" gap={16} style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
      {files.map(({ filename, size }) => (
        <View horizontal align="left">
          <View fillColor="gray-3" style={{ width: 40, height: 40, borderRadius: 2.5, flexShrink: 0 }} />
          <Spacer size="small" />
          <View>
            <Text lineClamp={1}>{filename}</Text>
            <Spacer size="small" />
            <Text fontSize="xsmall" textColor="gray-6" lineClamp={1}>{size.toFixed(2)} KiB</Text>
          </View>
        </View>
      ))}
    </Grid>
  );
};

const TableView = () => {
  return (
    <Table />
  );
};

type ViewType = typeof IconView | typeof ListView | typeof DetailsView;

const Filesystem = () => {
  const [selectedView, setView] = useState<ViewType>(() => IconView);

  const ToolbarButton = ({ viewType, ...props }: any) => {
    const handleClick = () => setView(() => viewType);

    console.log(selectedView === viewType);
    return (
      <Button hover selected={selectedView === viewType} {...props} onClick={handleClick} />
    );
  };

  const Component = selectedView;

  return (
    <>
      <Splitter flex horizontal style={{ minHeight: 0 }}>
        <View padding="large" minWidth={112} style={{ width: 192 }}>
          <Text>Tree</Text>
        </View>
        <View flex>
          <View horizontal padding="small" fillColor="gray-1">
            <ToolbarButton icon="square" viewType={IconView} />
            <ToolbarButton icon="table-list" viewType={DetailsView} />
            <ToolbarButton icon="list" viewType={ListView} />
            <ToolbarButton icon="border-all" viewType={TableView} />
          </View>
          <Divider />
          <View padding="large" style={{ overflow: 'auto' }}>
            <Component />
          </View>
        </View>
      </Splitter>
    </>
  );
};

export default Filesystem;
