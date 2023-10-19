import React, { useCallback, useEffect, useRef, useState } from 'react';
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

type ItemProps = {
  type: 'file' | 'directory',
  basename: string,
  filename: string,
  selectedItem: string | null,
  initialSelectedItem: string | null,
  onItemSelect: (filename: string) => void;
};

const Item = React.memo(({
  type,
  basename,
  filename,
  selectedItem,
  initialSelectedItem,
  onItemSelect
}: ItemProps) => {
  console.log('Item');

  const [directoryItems, setDirectoryItems] = useState<WebDAV.FileStat[]>();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleArrowClick = useCallback(async () => {
    setIsExpanded(isExpanded => !isExpanded);
  }, []);

  const handleDoubleClick = useCallback(async () => {
    if (type === 'directory') {
      setIsExpanded(isExpanded => !isExpanded);
    }
  }, [type]);

  useEffect(() => {
    if (isExpanded) {
      console.log(1, filename);

      (async () => {
        const directoryItems = await webdavClient.getDirectoryContents(filename);

        if (Array.isArray(directoryItems)) {
          setDirectoryItems(directoryItems);
        }
      })();
    }
  }, [filename, isExpanded]);

  useEffect(() => {
    if (type === 'directory' && initialSelectedItem?.startsWith(filename)) {
      console.log(2, filename);

      (async () => {
        const directoryItems = await webdavClient.getDirectoryContents(filename);

        if (Array.isArray(directoryItems)) {
          setDirectoryItems(directoryItems);
          setIsExpanded(true);
        }
      })();
    }
  }, [filename, initialSelectedItem, type]);

  const icon = type === 'directory' ? 'folder' : 'file';
  const iconColor = type === 'directory' ? 'yellow-4' : 'gray-4';

  const arrowIcon = isExpanded ? 'angle-down' : 'angle-right';
  const arrowVisibility = type === 'directory' ? 'visible' : 'hidden';

  return (
    <View>
      <View
        key={filename}
        horizontal
        align="left"
        padding="small"
        style={{ paddingLeft: (filename.split('/').length - 2) * 20 + 8 }}
        border={selectedItem === filename}
        borderColor="alpha-1"
        fillColor={selectedItem === filename ? 'blue-0' : undefined}
        onPointerDown={() => onItemSelect(filename)}
        onDoubleClick={handleDoubleClick}
      >
        <Icon fixedWidth icon={arrowIcon} style={{ marginTop: -2, marginBottom: -2, width: 20, height: 14, visibility: arrowVisibility }} onClick={handleArrowClick} />
        <Icon fixedWidth icon={icon} color={iconColor} style={{ marginTop: -3, marginBottom: -3, width: 20, height: 18 }} />
        <Spacer size="xsmall" />
        <Text lineClamp={1}>{basename}</Text>
      </View>
      {isExpanded && (
        <View>
          {directoryItems?.map(({ type, basename, filename }) => (
            <Item
              key={filename}
              type={type}
              basename={basename}
              filename={filename}
              selectedItem={selectedItem}
              initialSelectedItem={initialSelectedItem}
              onItemSelect={onItemSelect}
            />
          ))}
        </View>
      )}
    </View>
  );
});

//

const Shape = ({ id, children, x, y, onUpdate }: any) => {
  const firstEventRef = useRef<React.PointerEvent<SVGElement> | null>(null);
  const shapeMatrixRef = useRef<React.PointerEvent<DOMMatrix> | null>(null);

  const handlePointerDown = (event: React.PointerEvent<SVGGElement>) => {
    console.log('here', event.currentTarget.transform.baseVal[0].matrix.e);

    event.currentTarget.setPointerCapture(event.pointerId);

    firstEventRef.current = event;
    shapeMatrixRef.current = event.currentTarget.transform.baseVal[0].matrix;
  };

  const handlePointerMove = (event: React.PointerEvent<SVGGElement>) => {
    if (firstEventRef.current !== null && shapeMatrixRef.current) {
      console.log('here', shapeMatrixRef.current.e);

      event.currentTarget.setAttribute(
        'transform',
        `translate(${event.clientX - firstEventRef.current.clientX + shapeMatrixRef.current.e}, ${event.clientY - firstEventRef.current.clientY + shapeMatrixRef.current.f})`
      );
    }
  };

  const handlePointerUp = (event: React.PointerEvent<SVGGElement>) => {
    firstEventRef.current = null;

    onUpdate(id, event.currentTarget.transform.baseVal[0].matrix.e, event.currentTarget.transform.baseVal[0].matrix.f);
  };

  return (
    <g
      transform={`translate(${x} ${y})`}
      fill="gray"
      stroke="black"
      strokeWidth={2}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {children}
    </g>
  );
};

const Circle = (
  { diameter, ...props }: { x: number, y: number, diameter: number; }
) => {
  return (
    <Shape {...props}>
      <circle cx={diameter / 2} cy={diameter / 2} r={diameter / 2} />
    </Shape>
  );
};

const Rect = (
  { width, height, ...props }: { x: number, y: number, width: number, height: number; }
) => {
  return (
    <Shape {...props}>
      <rect width={width} height={height} />
    </Shape>
  );
};

const shapesMap = {
  'circle': Circle,
  'rect': Rect,
};

interface ShapeType {
  type: keyof typeof shapesMap,
  x: number,
  y: number,
  [key: number | string]: any;
}

interface ICircle {
  type: 'circle',
  x: number,
  y: number,
  diameter: number,
}

interface IRect {
  type: 'rect',
  x: number,
  y: number,
  width: number,
  height: number;
}

// type ShapeType = ICircle | IRect;

const Designer = ({ args, ...props }: any) => {
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(window.innerWidth >= 1440);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);
  const [text, setText] = useState<string>();
  const [value, setValue] = useState<React.ReactElement>();

  const [directoryItems, setDirectoryItems] = useState<WebDAV.FileStat[]>();
  const [currentDirectory, setCurrentDirectory] = useState('/');
  const [selectedItem, setSelectedItem] = useState<string | null>(args);

  const [shapes, setShapes] = useState<ShapeType[]>([
    { id: 0, type: 'circle', x: 50, y: 50, diameter: 100 },
    { id: 1, type: 'rect', x: 100, y: 100, width: 100, height: 100 },
  ]);

  const handleItemSelect = (filename: string) => {
    setSelectedItem(filename);
  };

  // const interpret = async (source: string) => {
  //   try {
  //     const value = await (await kopi.interpret(source, environment, bind))?.inspect();

  //     if (typeof value === 'string') {
  //       setValue(
  //         <Text padding="large">
  //           {value}
  //         </Text>
  //       );
  //     } else if (value) {
  //       setValue(value);
  //     }
  //   } catch (error) {
  //     console.warn(error);

  //     setValue(
  //       <Text padding="large" fillColor="red-1">
  //         {(error as Error).toString()}
  //       </Text>
  //     );
  //   }
  // };

  const handleEditorChange = async (source: string) => {
    // interpret(source);
  };

  const handleUpdate = (id: number, x: number, y: number) => {
    setShapes(shapes => shapes.map(shape => shape.id === id ? { ...shape, x, y } : shape));
  };

  useEffect(() => {
    (async () => {
      const directoryItems = await webdavClient.getDirectoryContents(currentDirectory);

      if (Array.isArray(directoryItems)) {
        setDirectoryItems(directoryItems);
      }
    })();
  }, [currentDirectory]);

  // useEffect(() => {
  //   (async () => {
  //     const source = await (await fetch(`//webdav.mike-austin.com/${args}?${Date.now()}`)).text();

  //     if (typeof source === 'string') {
  //       setText(source);
  //     }

  //     interpret(source);
  //   })();
  // }, [args]);

  return (
    <Splitter flex horizontal {...props}>
      {isLeftSidebarOpen && (
        <View style={{ width: 278 }}>
          <View horizontal fillColor="gray-1" padding="small">
            <Button icon="house" />
          </View>
          <Divider />
          <View padding="small" style={{ overflow: 'auto' }}>
            {directoryItems?.map(({ type, basename, filename }) => (
              <Item
                key={filename}
                type={type}
                basename={basename}
                filename={filename}
                selectedItem={selectedItem}
                initialSelectedItem={args}
                onItemSelect={handleItemSelect}
              />
            ))}
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
        <View flex>
          <svg width="100%" height="100%">
            {shapes.map(({ type, id, ...props }) => (
              React.createElement(shapesMap[type], {
                key: id,
                id,
                onUpdate: handleUpdate,
                ...props
              })
            ))}
          </svg>
        </View>
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

export default Designer;
