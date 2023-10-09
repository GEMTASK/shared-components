import React, { useCallback, useEffect, useRef, useMemo, useState } from 'react';
import HumanReadable from '@tsmx/human-readable';
import * as WebDAV from 'webdav';

import { Button, Divider, Grid, Icon, Spacer, Splitter, Table, Text, View, Menu, ViewProps, Stack } from 'bare';
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
  onFileEdit?: (filename: string) => void;
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
  onFileEdit,
  ...props
}: DisplayItemProps) => {
  const [isContextMenuOpen, setIsMenuOpen] = useState(false);
  const firstEventRef = useRef<React.MouseEvent | null>(null);

  const handlePointerDown = (event: any) => {
    event.stopPropagation();

    onFileSelect?.(basename);
  };

  const handleDoubleClick = () => {
    if (type === 'directory') {
      onFolderOpen?.(filename);
    } else {
      onFileOpen?.(filename);
    }
  };

  const handleContextMenu = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();

    firstEventRef.current = event;

    setIsMenuOpen(true);
  };

  const handleItemSelect = (itemIndex: number) => {
    const item = menuItems[itemIndex];

    if (item && typeof item === 'object') {
      item.action?.();
    }

    setIsMenuOpen(false);
  };

  const handleDocumentPointerDown = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    document.addEventListener('pointerdown', handleDocumentPointerDown);

    return () => {
      document.removeEventListener('pointerdown', handleDocumentPointerDown);
    };
  }, []);

  const menuItems = [
    { title: 'Open', action: () => onFileOpen?.(filename) },
    { title: 'Edit', action: () => 0 },
  ];

  return (
    <View
      padding="small"
      border={selected}
      borderColor="alpha-1"
      fillColor={selected ? 'blue-0' : undefined}
      onPointerDown={handlePointerDown}
      onDoubleClick={handleDoubleClick}
      onContextMenu={handleContextMenu}
      {...props}
    >
      {isContextMenuOpen && (
        <Menu.List
          fillColor="white"
          padding="small none"
          items={menuItems}
          style={{
            position: 'fixed',
            left: firstEventRef.current?.clientX,
            top: firstEventRef.current?.clientY,
            zIndex: 1,
            borderRadius: 2.5,
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.25), 0 0 0 1px hsla(0, 0%, 50%, 0.1)',
          }}
          onItemSelect={handleItemSelect}
        />

      )}
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
  onFileEdit?: (filename: string) => void;
} & ViewProps;

const IconDisplay = ({
  files,
  selectedFile,
  ...props
}: DisplayProps) => {
  const itemProps = { align: 'top', ...props } as const;

  return (
    <Grid style={{ rowGap: 8, gridTemplateColumns: 'repeat(auto-fit, minmax(192px, 1fr))' }}>
      {files?.map(({ basename, filename, type }) => (
        <DisplayItem key={basename} type={type} basename={basename} filename={filename} selected={basename === selectedFile} {...itemProps}>
          <Icon fixedWidth icon={type === 'directory' ? 'folder' : 'file'} size="4x" color={type === 'directory' ? 'yellow-4' : 'gray-4'} />
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
  ...props
}: DisplayProps) => {
  const itemProps = { horizontal: true, align: 'left', ...props } as const;

  return (
    <Grid align="top left" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(256px, 1fr))' }}>
      {files?.map(({ basename, filename, type, size }) => (
        <DisplayItem key={basename} type={type} basename={basename} filename={filename} selected={basename === selectedFile} {...itemProps}>
          <Icon fixedWidth icon={type === 'directory' ? 'folder' : 'file'} size="3x" color={type === 'directory' ? 'yellow-4' : 'gray-4'} />
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
  ...props
}: DisplayProps) => {
  const itemProps = { horizontal: true, align: 'left', ...props } as const;

  return (
    <Grid align="top left" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
      {files?.map(({ basename, filename, type }) => (
        <DisplayItem key={basename} type={type} basename={basename} filename={filename} selected={basename === selectedFile} {...itemProps}>
          <Icon fixedWidth icon={type === 'directory' ? 'folder' : 'file'} size="2x" color={type === 'directory' ? 'yellow-4' : 'gray-4'} />
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 640);

  const DisplayButton = useMemo(() => ({ displayType, ...props }: { displayType: keyof typeof DisplayType; } & ButtonProps) => {
    const handleClick = () => {
      setSelectedDisplayType(displayType);
    };

    return (
      <Button hover iconSize="lg" selected={selectedDisplayType === displayType} {...props} onClick={handleClick} />
    );
  }, [selectedDisplayType]);

  const handleHomeClick = useCallback(() => {
    setCurrentDirectory(currentDirectory => {
      const lastIndex = currentDirectory.lastIndexOf('/');

      if (lastIndex === 0) {
        return '/';
      }

      return currentDirectory.slice(0, currentDirectory.lastIndexOf('/'));
    });

    setSelectedFile(null);
  }, []);

  const handleFileSelect = useCallback((basename: string) => {
    setSelectedFile(basename);
  }, []);

  const handleFolderOpen = useCallback((basename: string) => {
    setCurrentDirectory(`${basename}`);
    setSelectedFile(null);
  }, []);

  const handleFileOpen = useCallback((filename: string) => {
    globalThis.postMessage({ type: 'openFile', payload: filename });
  }, []);

  const handleFileEdit = useCallback((filename: string) => {
    globalThis.postMessage({ type: 'editFile', payload: filename });
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
          <View minWidth={112} style={{ width: 224 }}>
            <View horizontal padding="small" fillColor="gray-1">
              <Button
                hover
                icon="star"
                selected={false}
              // onClick={() => setIsSidebarOpen(isSidebarOpen => !isSidebarOpen)}
              />
            </View>
            <Divider />
            <View padding="small">
              <DisplayItem horizontal align="left" key={0} type="directory" basename={'Foo Bar'} filename="" selected={false}>
                <Icon fixedWidth icon="angle-right" style={{ width: 20 }} />
                <Icon fixedWidth icon="folder" color="yellow-4" size="lg" style={{ width: 20 }} />
                <Spacer size="xsmall" />
                <Text lineClamp={1}>{'Foo Bar'}</Text>
              </DisplayItem>
              <DisplayItem horizontal align="left" key={1} type="directory" basename={'Foo Bar'} filename="" selected={true}>
                <Icon fixedWidth icon="angle-right" style={{ width: 20 }} />
                <Icon fixedWidth icon="folder" color="yellow-4" size="lg" style={{ width: 20 }} />
                <Spacer size="xsmall" />
                <Text lineClamp={1}>{'Foo Bar'}</Text>
              </DisplayItem>
            </View>
          </View>
        )}
        <View flex>
          <View>
            <View horizontal padding="small" fillColor="gray-1">
              <Button
                hover
                icon="table-columns"
                selected={isSidebarOpen}
                onClick={() => setIsSidebarOpen(isSidebarOpen => !isSidebarOpen)}
              />
              {/* <Spacer size="small" /> */}
              <Button hover icon="angle-left" iconSize="lg" disabled={currentDirectory === '/'} onClick={handleHomeClick} />
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
              onFileEdit={handleFileEdit}
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
