import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as WebDAV from 'webdav';
import * as Tone from 'tone';

import * as kopi from 'kopi-language';

import { kopi_component, kopi_element, kopi_View, kopi_Text, kopi_Button, kopi_Svg, kopi_Circle, kopi_requestAnimationFrame, kopi_requestDebugAnimationFrame } from '../terminal/functions/react';

import { View, Splitter, Text, Button, Divider, Icon, Spacer, Input, Stack, Select } from 'bare';

import TextEdit from '../editor/components/TextEdit';

const webdavClient = WebDAV.createClient("https://webdav.mike-austin.com", {});

const synth = new Tone.Synth().toDestination();

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
    return kopi.interpret(source, environment);
  }
}

let environment = {
  String: kopi.KopiString,
  Number: kopi.KopiNumber,
  import: kopi_import,
  print: (arg: any) => console.log(arg),
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
        style={{ paddingLeft: (filename.split('/').length - 2) * 20 + 2 }}
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
// Shape
//

const Shape = ({ id, children, x, y, fill, selected, designMode, onShapeSelect, onShapeUpdate, onPress, onRelease }: any) => {
  const firstEventRef = useRef<React.PointerEvent<SVGElement> | null>(null);
  const shapeMatrixRef = useRef<React.PointerEvent<DOMMatrix> | null>(null);

  const handlePointerDown = (event: React.PointerEvent<SVGGElement>) => {
    if (designMode) {
      event.currentTarget.setPointerCapture(event.pointerId);
      event.stopPropagation();

      firstEventRef.current = event;
      shapeMatrixRef.current = event.currentTarget.transform.baseVal[0].matrix;

      onShapeSelect(id);
    } else {
      onPress?.(id);
    }
  };

  const handlePointerMove = (event: React.PointerEvent<SVGGElement>) => {
    if (designMode) {
      if (firstEventRef.current !== null && shapeMatrixRef.current) {
        event.currentTarget.setAttribute(
          'transform',
          `translate(${event.clientX - firstEventRef.current.clientX + shapeMatrixRef.current.e}, ${event.clientY - firstEventRef.current.clientY + shapeMatrixRef.current.f})`
        );
      }
    }
  };

  const handlePointerUp = (event: React.PointerEvent<SVGGElement>) => {
    if (designMode) {
      const shapeMatrix = event.currentTarget.transform.baseVal[0].matrix;

      if (firstEventRef.current !== null && shapeMatrixRef.current) {
        event.currentTarget.setAttribute(
          'transform',
          `translate(${shapeMatrixRef.current.e}, ${shapeMatrixRef.current.f})`
        );
      }

      firstEventRef.current = null;

      onShapeUpdate(id, Math.floor(shapeMatrix.e), Math.floor(shapeMatrix.f), {
        shiftKey: event.shiftKey,
        altKey: event.altKey,
      });
    } else {
      onRelease?.(id);
    }
  };

  return (
    <g
      transform={`translate(${x + 0.5} ${y + 0.5})`}
      fill={fill}
      stroke={selected ? '#339af0' : "black"}
      strokeWidth={1}
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

const actions = {
  setFillColor: (shape: any, fillColor: string) => {
    return { fill: fillColor };
  },

  playNote: (shape: any, note: string) => {
    synth.triggerAttackRelease(note, '8n');
  },
};

const Designer = ({ args, ...props }: any) => {
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(window.innerWidth >= 1440);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);
  const [text, setText] = useState<string>();
  const [value, setValue] = useState<React.ReactElement>();

  const [directoryItems, setDirectoryItems] = useState<WebDAV.FileStat[]>();
  const [currentDirectory, setCurrentDirectory] = useState('/');
  const [selectedItem, setSelectedItem] = useState<string | null>(args);

  const [nextShapeId, setNextShapeId] = useState(1000);
  const [shapes, setShapes] = useState<ShapeType[]>([
    // { id: 0, type: 'circle', x: 50, y: 50, diameter: 100, fill: 'white' },
    // { id: 1, type: 'circle', x: 250, y: 50, diameter: 100, fill: 'white' },
    {
      id: 2, type: 'rect', x: 50, y: 50, width: 50, height: 200, fill: 'white', events: {
        onPress: [
          { action: 'playNote', argument: 'C4' },
          { action: 'setFillColor', argument: 'red' },
        ],
        onRelease: [
          { action: 'setFillColor', argument: 'white' },
        ],
      }
    },
    {
      id: 3, type: 'rect', x: 100, y: 50, width: 50, height: 200, fill: 'white', events: {
        onPress: [{ action: 'playNote', argument: 'D4' }],
      }
    },
    {
      id: 4, type: 'rect', x: 150, y: 50, width: 50, height: 200, fill: 'white', events: {
        onPress: [{ action: 'playNote', argument: 'E4' }],
      }
    },
    { id: 5, type: 'rect', x: 200, y: 50, width: 50, height: 200, fill: 'white' },
    { id: 6, type: 'rect', x: 250, y: 50, width: 50, height: 200, fill: 'white' },
    { id: 7, type: 'rect', x: 300, y: 50, width: 50, height: 200, fill: 'white' },
    { id: 8, type: 'rect', x: 350, y: 50, width: 50, height: 200, fill: 'white' },
    { id: 9, type: 'rect', x: 400, y: 50, width: 50, height: 200, fill: 'white' },
    //
    { id: 100, type: 'rect', x: 80, y: 50, width: 30, height: 120, fill: 'black' },
    { id: 101, type: 'rect', x: 140, y: 50, width: 30, height: 120, fill: 'black' },
    { id: 102, type: 'rect', x: 230, y: 50, width: 30, height: 120, fill: 'black' },
    { id: 103, type: 'rect', x: 285, y: 50, width: 30, height: 120, fill: 'black' },
    { id: 104, type: 'rect', x: 340, y: 50, width: 30, height: 120, fill: 'black' },
  ]);
  const [selectedShapeId, setSelectedShapeId] = useState<number | null>(null);

  const selectedShape = shapes.find(shape => shape.id === selectedShapeId);

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

  const handleShapeSelect = (id: number) => {
    setSelectedShapeId(id);
  };

  const handleShapeUpdate = (id: number, x: number, y: number, {
    shiftKey, altKey
  }: { shiftKey: boolean, altKey: boolean; }) => {
    const scale = shiftKey && altKey ? 5 : shiftKey ? 20 : altKey ? 1 : 10;

    console.log('>>>', x);

    setShapes(shapes => shapes.map(shape => shape.id === id ? {
      ...shape,
      x: Math.round(x / scale) * scale,
      y: Math.round(y / scale) * scale,
    } : shape));
  };

  const handleSvgPointerDown = () => {
    setSelectedShapeId(null);
  };

  const handlePress = (id: number) => {
    setShapes(shapes => shapes.map(shape => shape.id === id ? {
      ...shape,
      ...(shape.events?.onPress?.reduce((z, { action, argument }: any) => (
        { ...z, ...actions[action as keyof typeof actions]?.(shape, argument) }
      ), {}))
    } : shape));
  };

  const handleRelease = (id: number) => {
    console.log('handleRelease');
    setShapes(shapes => shapes.map(shape => shape.id === id ? {
      ...shape,
      ...(shape.events?.onRelease?.reduce((z, { action, argument }: any) => (
        { ...z, ...actions[action as keyof typeof actions]?.(shape, argument) }
      ), {}))
    } : shape));
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

  const columns = Math.floor(window.innerWidth / 100);
  const rows = Math.floor(window.innerHeight / 100);

  const handleCanvasDrop = (event) => {
    event.preventDefault();

    const rect = event.currentTarget.getBoundingClientRect();

    const shapeProps = (() => {
      switch (event.dataTransfer.getData("text")) {
        case 'rect': return {
          x: event.clientX - rect.left - 50,
          y: event.clientY - rect.top - 50,
          width: 100, height: 100
        };
        case 'circle': return {
          x: event.clientX - rect.left - 50,
          y: event.clientY - rect.top - 50,
          diameter: 100
        };
      }
    })();

    setShapes(shapes => [
      ...shapes,
      {
        id: nextShapeId,
        type: event.dataTransfer.getData("text"),
        fill: 'white',
        x: 0,
        y: 0,
        ...shapeProps
      }
    ]);
    setNextShapeId(nextShapeId => nextShapeId + 1);
  };

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
          <View flex horizontal>

            <View
              flex
              onDragOver={event => event.preventDefault()}
              onDrop={handleCanvasDrop}
            >
              <svg width="100%" height="100%" onPointerDown={handleSvgPointerDown}>
                {Array.from({ length: rows }, (_, index) => (
                  <React.Fragment key={index}>
                    <line x1={0} y1={index * 100 + 100.5} x2={columns * 100} y2={index * 100 + 100.5} stroke="hsl(0, 0%, 50%)" strokeDasharray="1 9" style={{ pointerEvents: 'none' }} />
                    <line x1={0} y1={index * 100 + 50.5} x2={columns * 100} y2={index * 100 + 50.5} stroke="hsl(0, 0%, 75%)" strokeDasharray="1 9" style={{ pointerEvents: 'none' }} />
                  </React.Fragment>
                ))}
                {Array.from({ length: columns }, (_, index) => (
                  <React.Fragment key={index}>
                    <line key={index} x1={index * 100 + 100.5} y1={0} x2={index * 100 + 100.5} y2={columns * 100} stroke="hsl(0, 0%, 50%)" strokeDasharray="1 9" style={{ pointerEvents: 'none' }} />
                    <line key={index * 2 + 1} x1={index * 100 + 50.5} y1={0} x2={index * 100 + 50.5} y2={columns * 100} stroke="hsl(0, 0%, 75%)" strokeDasharray="1 9" style={{ pointerEvents: 'none' }} />
                  </React.Fragment>
                ))}
                {shapes.map(({ type, id, ...props }) => (
                  React.createElement(shapesMap[type], {
                    key: id,
                    id,
                    selected: id === selectedShapeId,
                    designMode: true,
                    onShapeSelect: handleShapeSelect,
                    onShapeUpdate: handleShapeUpdate,
                    ...props
                  })
                ))}
              </svg>
            </View>

            <Divider />
            <View flex>
              <svg width="100%" height="100%">
                {shapes.map(({ type, id, ...props }) => (
                  React.createElement(shapesMap[type], {
                    key: id,
                    id,
                    ...props,
                    onPress: handlePress,
                    onRelease: handleRelease,
                  })
                ))}
              </svg>
            </View>
          </View>
        </View>
        <Divider />

        <View style={{ height: 300 }}>
          <Text padding="small">Components</Text>
          <Stack horizontal>
            <View horizontal draggable padding="small" align="left" onDragStart={event => event.dataTransfer.setData("text", 'rect')}>
              <Icon fixedWidth icon="square" size='2x' />
              <Spacer size="xsmall" />
              <Text>Rectangle</Text>
            </View>
            <View horizontal draggable padding="small" align="left" onDragStart={event => event.dataTransfer.setData("text", 'circle')}>
              <Icon fixedWidth icon="circle" size='2x' />
              <Spacer size="xsmall" />
              <Text>Circle</Text>
            </View>
          </Stack>
        </View>

      </View>
      {isRightSidebarOpen && (
        <View style={{ width: 278 }}>
          <View horizontal fillColor="gray-1" padding="small">
            <Button icon="house" />
          </View>
          <Divider />
          {selectedShape && (
            <View>
              <View fillColor="gray-1" padding="small large">
                <Spacer size="small" />
                <Text caps fontSize="xxsmall">Shape</Text>
              </View>
              <Divider />
              <View padding="large">
                <Input value={selectedShape.x} />
              </View>
              <Divider />
              <View fillColor="gray-1" padding="small large">
                <Spacer size="small" />
                <Text caps fontSize="xxsmall">Events</Text>
              </View>
              <Divider />
              <Stack spacing="large" padding="large">
                {selectedShape.events && (
                  Object.entries(selectedShape.events)?.map(([key, value]: [string, any]) => (
                    <View>
                      <Text>{key}</Text>
                      <Spacer size="small" />
                      <Stack spacing="small">
                        {value.map(({ action, argument }: any) => (
                          <Stack horizontal spacing="small">
                            <Select value={action} options={{
                              playNote: 'playNote',
                              setFillColor: 'setFillColor',
                            }} />
                            <Input value={argument} />
                          </Stack>
                        ))}
                      </Stack>
                    </View>
                  ))
                )}
              </Stack>
            </View>
          )}
        </View>
      )}
    </Splitter>
  );
};

export default Designer;
