import { useState } from 'react';
import { LoremIpsum } from 'lorem-ipsum';

import { Button, Divider, Grid, Icon, Spacer, Splitter, Table, Text, View, ViewProps } from 'bare';
import { ButtonProps } from 'bare/dist/components/button';

const lorem = new LoremIpsum();

const files = Array.from({ length: 31 }, () => ({
  filename: lorem.generateWords(4)
    .split(' ')
    .map(([a, ...rest]) => a.toUpperCase() + rest.join(''))
    .join(' ') + '.png',
  size: Math.random() * 100,
})).sort((a, b) => a.filename < b.filename ? -1 : 1);

// enum Display {
//   Icon,
//   List,
//   Table,
// }

type DisplayItemProps = {
  filename: string,
  selected: boolean,
  onFileSelect?: (filename: string) => void,
} & ViewProps;

const DisplayItem = ({
  filename,
  selected,
  children,
  onFileSelect,
  ...props
}: DisplayItemProps) => {
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

//
//
//

type DisplayProps = {
  selectedFile: string | null;
  onFileSelect?: (filename: string) => void;
} & ViewProps;

const IconDisplay = ({
  selectedFile,
  onFileSelect,
}: DisplayProps) => {
  const itemProps = { align: 'top', onFileSelect } as const;

  return (
    <Grid align="top left" style={{ rowGap: 8, gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
      {files.map(({ filename }) => (
        <DisplayItem key={filename} filename={filename} selected={filename === selectedFile} {...itemProps}>
          <View fillColor="gray-3" style={{ width: 64, height: 64, borderRadius: 2.5 }} />
          <Spacer size="small" />
          <Text lineClamp={2} textAlign="center">{filename}</Text>
        </DisplayItem>
      ))}
    </Grid>
  );
};

const TileDisplay = ({
  selectedFile,
  onFileSelect,
}: DisplayProps) => {
  const itemProps = { horizontal: true, align: 'left', onFileSelect } as const;

  return (
    <Grid align="top left" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
      {files.map(({ filename, size }) => (
        <DisplayItem key={filename} filename={filename} selected={filename === selectedFile} {...itemProps}>
          <View fillColor="gray-3" style={{ width: 40, height: 40, borderRadius: 2.5, flexShrink: 0 }} />
          <Spacer size="small" />
          <View>
            <Text lineClamp={1}>{filename}</Text>
            <Spacer size="small" />
            <Text fontSize="xsmall" textColor="gray-6" lineClamp={1}>{size.toFixed(2)} KiB</Text>
          </View>
        </DisplayItem>
      ))}
    </Grid>
  );
};

const ListDisplay = ({
  selectedFile,
  onFileSelect,
}: DisplayProps) => {
  const itemProps = { horizontal: true, align: 'left', onFileSelect } as const;

  return (
    <Grid align="top left" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
      {files.map(({ filename }) => (
        <DisplayItem key={filename} filename={filename} selected={filename === selectedFile} {...itemProps}>
          <View fillColor="gray-3" style={{ width: 24, height: 24, borderRadius: 2.5, flexShrink: 0 }} />
          <Spacer size="small" />
          <Text lineClamp={1}>{filename}</Text>
        </DisplayItem>
      ))}
    </Grid>
  );
};

const TableDisplay = () => {
  return (
    <Table />
  );
};

type Display = React.ElementType<DisplayProps>;

//
//
//

const Filesystem = ({ ...props }: any) => {
  const [selectedDisplay, setSelectedDisplay] = useState<Display>(() => IconDisplay);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const DisplayButton = ({ display, ...props }: { display: Display; } & ButtonProps) => {
    const handleClick = () => setSelectedDisplay(() => display);

    return (
      <Button hover selected={selectedDisplay === display} {...props} onClick={handleClick} />
    );
  };

  const handleFileSelect = (filename: string) => {
    setSelectedFile(filename);
  };

  const DisplayComponent = selectedDisplay;

  return (
    <View {...props}>
      <Splitter flex horizontal style={{ minHeight: 0 }}>
        <View padding="small" minWidth={112} style={{ width: 192 }}>
          <DisplayItem horizontal align="left" key={0} filename={'Foo Bar'} selected={false}>
            <Icon fixedWidth icon="chevron-right" style={{ width: 20 }} />
            <Icon fixedWidth icon="folder" color="yellow-5" size="lg" style={{ width: 20 }} />
            <Spacer size="xsmall" />
            <Text lineClamp={1}>{'Foo Bar'}</Text>
          </DisplayItem>
          <DisplayItem horizontal align="left" key={1} filename={'Foo Bar'} selected={true}>
            <Icon fixedWidth icon="chevron-right" style={{ width: 20 }} />
            <Icon fixedWidth icon="folder" color="yellow-5" size="lg" style={{ width: 20 }} />
            <Spacer size="xsmall" />
            <Text lineClamp={1}>{'Foo Bar'}</Text>
          </DisplayItem>
        </View>
        <View flex>
          <View horizontal padding="small" fillColor="gray-1">
            <DisplayButton icon="square" display={IconDisplay} />
            <DisplayButton icon="table-list" display={TileDisplay} />
            <DisplayButton icon="list" display={ListDisplay} />
            <DisplayButton icon="border-all" display={TableDisplay} />
          </View>
          <Divider />
          <View padding="small" style={{ overflow: 'auto' }}>
            <DisplayComponent selectedFile={selectedFile} onFileSelect={handleFileSelect} />
          </View>
        </View>
      </Splitter>
    </View>
  );
};

export default Filesystem;
