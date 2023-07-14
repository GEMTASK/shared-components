import { useState } from 'react';
import { LoremIpsum } from 'lorem-ipsum';

import { Button, Divider, Grid, Spacer, Splitter, Table, Text, View, ViewProps } from 'bare';

const lorem = new LoremIpsum();

const files = Array.from({ length: 31 }, () => ({
  filename: lorem.generateWords(4)
    .split(' ')
    .map(([a, ...rest]) => a.toUpperCase() + rest.join(''))
    .join(' ') + '.png',
  size: Math.random() * 100,
})).sort((a, b) => a.filename < b.filename ? -1 : 1);

// enum ViewType {
//   Icon,
//   List,
//   Table,
// }

type GridViewItemProps = {
  filename: string,
  selected: boolean,
  onFileSelect?: (filename: string) => void,
} & ViewProps;

const GridViewItem = ({
  filename,
  selected,
  children,
  onFileSelect,
  ...props
}: GridViewItemProps) => {
  return (
    <View
      padding="small"
      border={selected}
      borderColor="alpha-1"
      fillColor={selected ? 'blue-0' : undefined}
      onPointerDown={() => onFileSelect?.(filename)}
      {...props}
    >
      {children}
    </View>
  );
};

type GridViewProps = {
  selectedFile: string | null;
  onFileSelect?: (filename: string) => void;
} & ViewProps;

const IconView = ({
  selectedFile,
  onFileSelect,
}: GridViewProps) => {
  const itemProps = { align: 'top', onFileSelect } as const;

  return (
    <Grid align="top left" style={{ rowGap: 0, gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
      {files.map(({ filename }) => (
        <GridViewItem key={filename} filename={filename} selected={filename === selectedFile} {...itemProps}>
          <View fillColor="gray-3" style={{ width: 48, height: 48, borderRadius: 2.5 }} />
          <Spacer size="small" />
          <Text lineClamp={2} textAlign="center">{filename}</Text>
        </GridViewItem>
      ))}
    </Grid>
  );
};

const DetailsView = ({
  selectedFile,
  onFileSelect,
}: GridViewProps) => {
  const itemProps = { horizontal: true, align: 'left', onFileSelect } as const;

  return (
    <Grid align="top left" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
      {files.map(({ filename, size }) => (
        <GridViewItem key={filename} filename={filename} selected={filename === selectedFile} {...itemProps}>
          <View fillColor="gray-3" style={{ width: 40, height: 40, borderRadius: 2.5, flexShrink: 0 }} />
          <Spacer size="small" />
          <View>
            <Text lineClamp={1}>{filename}</Text>
            <Spacer size="small" />
            <Text fontSize="xsmall" textColor="gray-6" lineClamp={1}>{size.toFixed(2)} KiB</Text>
          </View>
        </GridViewItem>
      ))}
    </Grid>
  );
};

const ListView = ({
  selectedFile,
  onFileSelect,
}: GridViewProps) => {
  const itemProps = { horizontal: true, align: 'left', onFileSelect } as const;

  return (
    <Grid align="top left" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
      {files.map(({ filename }) => (
        <GridViewItem key={filename} filename={filename} selected={filename === selectedFile} {...itemProps}>
          <View fillColor="gray-3" style={{ width: 24, height: 24, borderRadius: 2.5, flexShrink: 0 }} />
          <Spacer size="small" />
          <Text lineClamp={1}>{filename}</Text>
        </GridViewItem>
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

//
//
//

const Filesystem = () => {
  const [selectedView, setSelectedView] = useState<ViewType>(() => IconView);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const ToolbarButton = ({ viewType, ...props }: any) => {
    const handleClick = () => setSelectedView(() => viewType);

    return (
      <Button hover selected={selectedView === viewType} {...props} onClick={handleClick} />
    );
  };

  const handleFileSelect = (filename: string) => {
    setSelectedFile(filename);
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
          <View padding="small" style={{ overflow: 'auto' }}>
            <Component selectedFile={selectedFile} onFileSelect={handleFileSelect} />
          </View>
        </View>
      </Splitter>
    </>
  );
};

export default Filesystem;
