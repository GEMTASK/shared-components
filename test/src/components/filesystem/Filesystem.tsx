import React, { useCallback, useEffect, useMemo, useState } from 'react';
import * as WebDAV from 'webdav';
import HumanReadable from '@tsmx/human-readable';

import { Button, Divider, Grid, Icon, Spacer, Splitter, Table, Text, View, ViewProps } from 'bare';
import { ButtonProps } from 'bare/dist/components/button';

const webdavClient = WebDAV.createClient("https://webdav.mike-austin.com", {});

type DisplayItemProps = {
  basename: string,
  filename: string,
  type: 'file' | 'directory',
  selected: boolean,
  onFileSelect?: (basename: string) => void,
  onFolderOpen?: (basename: string) => void;
  onFileOpen?: (filename: string) => void;
} & ViewProps;

const DisplayItem = ({
  basename,
  filename,
  type,
  selected,
  children,
  onFileSelect,
  onFolderOpen,
  onFileOpen,
  ...props
}: DisplayItemProps) => {
  const handlePointerDown = () => {
    onFileSelect?.(basename);
  };

  const handleDoubleClick = () => {
    if (type === 'directory') {
      onFolderOpen?.(basename);
    } else {
      onFileOpen?.(filename);
    }
  };

  return (
    <View
      padding="small"
      border={selected}
      borderColor="alpha-1"
      fillColor={selected ? 'blue-0' : undefined}
      onPointerDown={handlePointerDown}
      onDoubleClick={handleDoubleClick}
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
  files: WebDAV.FileStat[] | null,
  selectedFile: string | null;
  onFileSelect?: (basename: string) => void;
  onFolderOpen?: (basename: string) => void;
  onFileOpen?: (filename: string) => void;
} & ViewProps;

const IconDisplay = ({
  files,
  selectedFile,
  onFileSelect,
  onFolderOpen,
  onFileOpen,
}: DisplayProps) => {
  const itemProps = { align: 'top', onFileSelect, onFolderOpen, onFileOpen } as const;

  return (
    <Grid style={{ rowGap: 8, gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
      {files?.map(({ basename, filename, type }) => (
        <DisplayItem key={basename} type={type} basename={basename} filename={filename} selected={basename === selectedFile} {...itemProps}>
          <Icon fixedWidth icon={type === 'directory' ? 'folder' : 'file'} size="4x" color={type === 'directory' ? 'yellow-5' : 'gray-5'} />
          <Spacer size="small" />
          <Text lineClamp={2} textAlign="center" style={{ overflowWrap: 'anywhere' }}>{basename}</Text>
        </DisplayItem>
      ))}
    </Grid>
  );
};

const TileDisplay = ({
  files,
  selectedFile,
  onFileSelect,
  onFolderOpen,
  onFileOpen,
}: DisplayProps) => {
  const itemProps = { horizontal: true, align: 'left', onFileSelect, onFolderOpen, onFileOpen } as const;

  return (
    <Grid align="top left" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
      {files?.map(({ basename, filename, type, size }) => (
        <DisplayItem key={basename} type={type} basename={basename} filename={filename} selected={basename === selectedFile} {...itemProps}>
          <Icon fixedWidth icon={type === 'directory' ? 'folder' : 'file'} size="3x" color={type === 'directory' ? 'yellow-5' : 'gray-5'} />
          <Spacer size="small" />
          <View>
            <Text lineClamp={1} style={{ overflowWrap: 'anywhere' }}>{basename}</Text>
            <Spacer size="small" />
            <Text fontSize="xsmall" textColor="gray-6" lineClamp={1}>{HumanReadable.fromBytes(size, {})}</Text>
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
  onFolderOpen,
  onFileOpen,
}: DisplayProps) => {
  const itemProps = { horizontal: true, align: 'left', onFileSelect, onFolderOpen, onFileOpen } as const;

  return (
    <Grid align="top left" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
      {files?.map(({ basename, filename, type }) => (
        <DisplayItem key={basename} type={type} basename={basename} filename={filename} selected={basename === selectedFile} {...itemProps}>
          <Icon fixedWidth icon={type === 'directory' ? 'folder' : 'file'} size="2x" color={type === 'directory' ? 'yellow-5' : 'gray-5'} />
          <Spacer size="small" />
          <Text lineClamp={1} style={{ overflowWrap: 'anywhere' }}>{basename}</Text>
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

const Files = ({ ...props }: any) => {
  console.log('Files()');

  const [selectedDisplayType, setSelectedDisplayType] = useState<keyof typeof DisplayType>('Icon');
  const [currentDirectory, setCurrentDirectory] = useState('/');
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [files, setFiles] = useState<WebDAV.FileStat[] | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const DisplayButton = useMemo(() => ({ displayType, ...props }: { displayType: keyof typeof DisplayType; } & ButtonProps) => {
    const handleClick = () => {
      setSelectedDisplayType(displayType);
    };

    return (
      <Button hover iconSize="lg" selected={selectedDisplayType === displayType} {...props} onClick={handleClick} />
    );
  }, [selectedDisplayType]);

  const handleHomeClick = useCallback(() => {
    setCurrentDirectory('/');
    setSelectedFile(null);
  }, []);

  const handleFileSelect = useCallback((basename: string) => {
    setSelectedFile(basename);
  }, []);

  const handleFolderOpen = useCallback((basename: string) => {
    setCurrentDirectory(`/${basename}`);
    setSelectedFile(null);
  }, []);

  const handleFileOpen = useCallback((filename: string) => {
    window.postMessage({ type: 'openFile', payload: filename });
  }, []);

  useEffect(() => {
    (async () => {
      const directoryItems = await webdavClient.getDirectoryContents(currentDirectory);

      if (Array.isArray(directoryItems)) {
        setFiles(directoryItems);
      }
    })();
  }, [currentDirectory]);

  const DisplayComponent = DisplayType[selectedDisplayType];

  return (
    <View {...props}>
      <Splitter flex horizontal style={{ minHeight: 0, overflow: 'auto' }}>
        {isSidebarOpen && (
          <View padding="small" minWidth={112} style={{ width: 192 }}>
            <DisplayItem horizontal align="left" key={0} type="directory" basename={'Foo Bar'} filename="" selected={false}>
              <Icon fixedWidth icon="angle-right" style={{ width: 20 }} />
              <Icon fixedWidth icon="folder" color="yellow-5" size="lg" style={{ width: 20 }} />
              <Spacer size="xsmall" />
              <Text lineClamp={1}>{'Foo Bar'}</Text>
            </DisplayItem>
            <DisplayItem horizontal align="left" key={1} type="directory" basename={'Foo Bar'} filename="" selected={true}>
              <Icon fixedWidth icon="angle-right" style={{ width: 20 }} />
              <Icon fixedWidth icon="folder" color="yellow-5" size="lg" style={{ width: 20 }} />
              <Spacer size="xsmall" />
              <Text lineClamp={1}>{'Foo Bar'}</Text>
            </DisplayItem>
          </View>
        )}
        <View flex>
          <View>
            <View horizontal padding="small large" fillColor="gray-1">
              <Button
                hover
                icon="table-columns"
                selected={isSidebarOpen}
                onClick={() => setIsSidebarOpen(isSidebarOpen => !isSidebarOpen)}
              />
              <Spacer size="small" />
              <Button hover icon="home" onClick={handleHomeClick} />
              {/* <Spacer size="large" /> */}
              {/* <View>
                <Text fontSize="xsmall" textColor="gray-6">webdav.mike-austin.com</Text>
                <Spacer size="small" />
                <Text fontWeight="semibold">{currentDirectory}</Text>
              </View> */}
              <Spacer flex size="large" />
              <DisplayButton icon="square" displayType={'Icon'} />
              <DisplayButton icon="table-list" displayType={'Tile'} />
              <DisplayButton icon="list" displayType={'List'} />
              <DisplayButton icon="border-all" displayType={'Table'} />
              <Spacer flex size="large" />
              <Button title="Action" />
            </View>
          </View>
          <Divider />
          <View flex padding="small" style={{ overflow: 'auto' }}>
            <DisplayComponent
              files={files}
              selectedFile={selectedFile}
              onFileSelect={handleFileSelect}
              onFolderOpen={handleFolderOpen}
              onFileOpen={handleFileOpen}
            />
          </View>
          <Divider />
          <View padding="small large" fillColor="gray-1">
            <Text fontSize="xsmall" textColor="gray-6">
              https://webdav.mike-austin.com
              <Text fontWeight="bold">{currentDirectory}</Text>
            </Text>
            {/* <Spacer size="small" />
              <Text fontWeight="semibold">{currentDirectory}</Text> */}
          </View>

        </View>
      </Splitter>
    </View>
  );
};

export default React.memo(Files);
