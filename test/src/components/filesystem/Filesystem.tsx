import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { createClient, FileStat } from 'webdav';

import { Button, Divider, Grid, Icon, Spacer, Splitter, Table, Text, View, ViewProps } from 'bare';
import { ButtonProps } from 'bare/dist/components/button';

const webdavClient = createClient("https://webdav.mike-austin.com", {});

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
  files: FileStat[] | null,
  selectedFile: string | null;
  onFileSelect?: (filename: string) => void;
} & ViewProps;

const IconDisplay = ({
  files,
  selectedFile,
  onFileSelect,
}: DisplayProps) => {
  const itemProps = { align: 'top', onFileSelect } as const;

  return (
    <Grid align="top left" style={{ rowGap: 8, gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
      {files?.map(({ basename, type }) => (
        <DisplayItem key={basename} filename={basename} selected={basename === selectedFile} {...itemProps}>
          <Icon fixedWidth icon={type === 'directory' ? 'folder' : 'file'} size="4x" color={type === 'directory' ? 'yellow-5' : 'gray-5'} />
          <Spacer size="small" />
          <Text lineClamp={2} textAlign="center">{basename}</Text>
        </DisplayItem>
      ))}
    </Grid>
  );
};

const TileDisplay = ({
  files,
  selectedFile,
  onFileSelect,
}: DisplayProps) => {
  const itemProps = { horizontal: true, align: 'left', onFileSelect } as const;

  return (
    <Grid align="top left" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
      {files?.map(({ basename, type, size }) => (
        <DisplayItem key={basename} filename={basename} selected={basename === selectedFile} {...itemProps}>
          <Icon fixedWidth icon={type === 'directory' ? 'folder' : 'file'} size="3x" color={type === 'directory' ? 'yellow-5' : 'gray-5'} />
          <Spacer size="small" />
          <View>
            <Text lineClamp={1}>{basename}</Text>
            <Spacer size="small" />
            <Text fontSize="xsmall" textColor="gray-6" lineClamp={1}>{(size / 1000).toFixed(2)} KiB</Text>
          </View>
        </DisplayItem>
      ))}
    </Grid>
  );
};

const ListDisplay = ({
  files,
  selectedFile,
  onFileSelect,
}: DisplayProps) => {
  const itemProps = { horizontal: true, align: 'left', onFileSelect } as const;

  return (
    <Grid align="top left" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
      {files?.map(({ basename, type }) => (
        <DisplayItem key={basename} filename={basename} selected={basename === selectedFile} {...itemProps}>
          <Icon fixedWidth icon={type === 'directory' ? 'folder' : 'file'} size="2x" color={type === 'directory' ? 'yellow-5' : 'gray-5'} />
          <Spacer size="small" />
          <Text lineClamp={1}>{basename}</Text>
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

const DisplayType = {
  Icon: IconDisplay,
  Tile: TileDisplay,
  List: ListDisplay,
  Table: TableDisplay,
} as const;

//
// Files
//

const Filesystem = ({ ...props }: any) => {
  console.log('Files()');

  const [selectedDisplayType, setSelectedDisplayType] = useState<keyof typeof DisplayType>('Icon');
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [files, setFiles] = useState<FileStat[] | null>(null);

  const DisplayButton = useMemo(() => ({ displayType, ...props }: { displayType: keyof typeof DisplayType; } & ButtonProps) => {
    const handleClick = () => {
      setSelectedDisplayType(displayType);
    };

    return (
      <Button hover iconSize="lg" selected={selectedDisplayType === displayType} {...props} onClick={handleClick} />
    );
  }, [selectedDisplayType]);

  const handleFileSelect = useCallback((filename: string) => {
    setSelectedFile(filename);
  }, []);

  useEffect(() => {
    (async () => {
      const directoryItems = await webdavClient.getDirectoryContents('/');

      if (Array.isArray(directoryItems)) {
        setFiles(directoryItems);
      }
    })();
  }, []);

  const DisplayComponent = DisplayType[selectedDisplayType];

  return (
    <View {...props}>
      <Splitter flex horizontal style={{ minHeight: 0 }}>
        <View padding="small" minWidth={112} style={{ width: 192 }}>
          <DisplayItem horizontal align="left" key={0} filename={'Foo Bar'} selected={false}>
            <Icon fixedWidth icon="angle-right" style={{ width: 20 }} />
            <Icon fixedWidth icon="folder" color="yellow-5" size="lg" style={{ width: 20 }} />
            <Spacer size="xsmall" />
            <Text lineClamp={1}>{'Foo Bar'}</Text>
          </DisplayItem>
          <DisplayItem horizontal align="left" key={1} filename={'Foo Bar'} selected={true}>
            <Icon fixedWidth icon="angle-right" style={{ width: 20 }} />
            <Icon fixedWidth icon="folder" color="yellow-5" size="lg" style={{ width: 20 }} />
            <Spacer size="xsmall" />
            <Text lineClamp={1}>{'Foo Bar'}</Text>
          </DisplayItem>
        </View>
        <View flex>
          <View horizontal padding="small large" fillColor="gray-1">
            <View>
              <Text fontSize="xsmall" textColor="gray-6">file://localhost</Text>
              <Spacer size="small" />
              <Text fontWeight="semibold">/photos/beach/</Text>
            </View>
            <Spacer flex size="large" />
            <DisplayButton icon="square" displayType={'Icon'} />
            <DisplayButton icon="table-list" displayType={'Tile'} />
            <DisplayButton icon="list" displayType={'List'} />
            <DisplayButton icon="border-all" displayType={'Table'} />
            <Spacer flex size="large" />
            <Button title="Action" />
          </View>
          <Divider />
          <View padding="small" style={{ overflow: 'auto' }}>
            <DisplayComponent files={files} selectedFile={selectedFile} onFileSelect={handleFileSelect} />
          </View>
        </View>
      </Splitter>
    </View>
  );
};

export default React.memo(Filesystem);
