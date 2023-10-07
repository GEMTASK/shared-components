import React, { useEffect, useState } from 'react';
import * as WebDAV from 'webdav';

import * as kopi from 'kopi-language';

import { kopi_component, kopi_element, kopi_View, kopi_Text, kopi_Button, kopi_Svg, kopi_Circle, kopi_requestAnimationFrame, kopi_requestDebugAnimationFrame } from '../terminal/functions/react';

import { View, Splitter, Text, Button, Divider, Icon, Spacer } from 'bare';

import TextEdit from '../editor/components/TextEdit';

const webdavClient = WebDAV.createClient("https://webdav.mike-austin.com", {});

async function kopi_import(url: kopi.KopiString, context: kopi.Context) {
  if (url.value.endsWith('.js')) {
    const module = await import(/*webpackIgnore: true*/ `//webdav.mike-austin.com/${url.value}?${Date.now()}`);

    const [fields, names] = Object.entries(module).reduce(([fields, names], [name, value]) => {
      return [
        [...fields, value],
        [...names, name]
      ];
    }, [[] as any, [] as any]);

    return new kopi.KopiTuple(fields, names);
  }

  const source = await (await fetch(`//webdav.mike-austin.com/${url.value}?${Date.now()}`)).text();

  if (typeof source === 'string') {
    return kopi.interpret(source, environment, () => { });
  }
}

let environment = {
  String: kopi.KopiString,
  Number: kopi.KopiNumber,
  import: kopi_import,
  let: kopi.kopi_let,
  loop: kopi.kopi_loop,
  match: kopi.kopi_match,
  print: (arg: any) => console.log(arg),
  random: kopi.kopi_random,
  struct: kopi.kopi_struct,
  extend: kopi.kopi_extend,
  export: (arg: any) => arg,
  component: kopi_component,
  element: kopi_element,
  requestAnimationFrame: kopi_requestAnimationFrame,
  requestDebugAnimationFrame: kopi_requestDebugAnimationFrame,
  View: kopi_View,
  Text: kopi_Text,
  Button: kopi_Button,
  Svg: kopi_Svg,
  Circle: kopi_Circle,
};

const bind = (bindings: { [name: string]: kopi.KopiValue; }) => {
  const newEnvironment = { environment, ...bindings };

  environment = newEnvironment as any;
};

const Item = ({ type, basename, filename, selected, children, onItemSelect }: any) => {
  const icon = type === 'directory' ? 'folder' : 'file';
  const color = type === 'directory' ? 'yellow-4' : 'gray-4';

  return (
    <View>
      <View
        key={filename}
        horizontal
        align="left"
        padding="small"
        border={selected}
        borderColor="alpha-1"
        fillColor={selected ? 'blue-0' : undefined}
        onPointerDown={() => onItemSelect(filename)}
      >
        <Icon fixedWidth icon="angle-right" style={{ width: 20, visibility: type === 'directory' ? 'visible' : 'hidden' }} />
        <Icon fixedWidth icon={icon} color={color} size="lg" style={{ width: 20 }} />
        <Spacer size="xsmall" />
        <Text lineClamp={1}>{basename}</Text>
      </View>
      <View style={{ marginLeft: 20 }}>
        {children}
      </View>
    </View>
  );
};

const Develop = ({ args, ...props }: any) => {
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(window.innerWidth >= 1440);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);
  const [text, setText] = useState<string>();
  const [value, setValue] = useState<React.ReactElement>();

  const [items, setItems] = useState<WebDAV.FileStat[] | null>(null);
  const [currentDirectory, setCurrentDirectory] = useState('/');
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const handleItemSelect = (filename: string) => {
    setSelectedItem(filename);
  };

  const interpret = async (source: string) => {
    try {
      const value = await (await kopi.interpret(source, environment, bind))?.inspect();

      if (typeof value === 'string') {
        setValue(
          <Text padding="large">
            {value}
          </Text>
        );
      } else if (value) {
        setValue(value);
      }
    } catch (error) {
      console.warn(error);

      setValue(
        <Text padding="large" fillColor="red-1">
          {(error as Error).toString()}
        </Text>
      );
    }
  };

  const handleEditorChange = async (source: string) => {
    interpret(source);
  };

  useEffect(() => {
    (async () => {
      const directoryItems = await webdavClient.getDirectoryContents(currentDirectory);

      if (Array.isArray(directoryItems)) {
        setItems(directoryItems);
      }
    })();
  }, [currentDirectory]);

  useEffect(() => {
    (async () => {
      const text = await (await fetch(`//webdav.mike-austin.com/${args}?${Date.now()}`)).text();

      if (typeof text === 'string') {
        setText(text);
      }

      interpret(text);
    })();
  }, [args]);

  return (
    <Splitter flex horizontal {...props}>
      {isLeftSidebarOpen && (
        <View style={{ width: 278 }}>
          <View horizontal fillColor="gray-1" padding="small">
            <Button icon="house" />
          </View>
          <Divider />
          <View padding="small">
            <View>
              {items?.map(({ type, basename, filename }) => (
                <Item type={type} basename={basename} filename={filename} selected={filename === selectedItem} onItemSelect={handleItemSelect} />
              ))}
              {/* <Item type="directory" selected>
                <Item type="file" />
                <Item type="directory">
                  <Item type="file" />
                </Item>
                <Item type="file" />
              </Item> */}
            </View>
          </View>
        </View>
      )}
      <View flex>
        <View horizontal padding="small" fillColor="gray-1">
          <Button
            hover
            icon="table-columns"
            selected={isLeftSidebarOpen}
            onClick={() => setIsLeftSidebarOpen(isLeftSidebarOpen => !isLeftSidebarOpen)}
          />
        </View>
        <Divider />
        <TextEdit value={text} onChange={handleEditorChange} />
      </View>
      {isRightSidebarOpen && (
        <View style={{ width: 360 }}>
          <View horizontal fillColor="gray-1" padding="small">
            <Button icon="house" />
          </View>
          <Divider />
          {value}
        </View>
      )}
    </Splitter>
  );
};

export default Develop;
