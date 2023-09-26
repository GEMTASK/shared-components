import React, { useEffect, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { LRLanguage, LanguageSupport, indentNodeProp, foldNodeProp, foldInside, delimitedIndent } from "@codemirror/language";
import { styleTags, tags as t } from "@lezer/highlight";

import { parser } from './kopi-parser';

import * as kopi from 'kopi-language';
import { KopiValue } from 'kopi-language';

import { Button, Divider, View, Splitter, Text } from 'bare';

import { kopi_View, kopi_Text, kopi_Svg, kopi_Circle } from '../terminal/functions/react';

export const KopiLanguage = LRLanguage.define({
  parser: parser.configure({
    props: [
      indentNodeProp.add({
        Application: delimitedIndent({ closing: ")", align: false })
      }),
      foldNodeProp.add({
        Application: foldInside
      }),
      styleTags({
        Identifier: t.variableName,
        Number: t.number,
        Boolean: t.bool,
        String: t.string,
        LineComment: t.lineComment,
        "[ ]": t.bracket,
        "{ }": t.brace,
        "( )": t.paren
      })
    ]
  }),
  languageData: {
    closeBrackets: { brackets: ["[", "{", '"'] },
    commentTokens: { line: "#" }
  }
});

const kopiLanguage = new LanguageSupport(KopiLanguage);

const environment = {
  String: kopi.KopiString,
  Number: kopi.KopiNumber,
  let: kopi.kopi_let,
  loop: kopi.kopi_loop,
  match: kopi.kopi_match,
  print: (arg: any) => console.log(arg),
  export: (arg: any) => arg,
  View: kopi_View,
  Text: kopi_Text,
  Svg: kopi_Svg,
  Circle: kopi_Circle,
};

const Editor = ({ args, ...props }: any) => {
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);
  const [text, setText] = useState(args);
  const [value, setValue] = useState<React.ReactElement>();

  const interpret = async (source: string) => {
    try {
      const value = await (await kopi.interpret(source, environment, () => 0))?.inspect();

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
      setValue(
        <Text padding="large" fillColor="red-1">
          {(error as Error).toString()}
        </Text>
      );
    }
  };

  const handleCodeMirrorChange = async (source: string) => {
    interpret(source);
  };

  useEffect(() => {
    (async () => {
      const source = await (await fetch(`//webdav.mike-austin.com/${args}`)).text();

      if (typeof source === 'string') {
        setText(source);
      }

      interpret(source);
    })();
  }, [args]);

  return (
    <View flex {...props}>
      <Splitter flex horizontal>
        {isLeftSidebarOpen && (
          <View padding="small" style={{ width: 192 }}>
            <Text>Sidebar</Text>
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
          <CodeMirror
            value={text}
            height="100%"
            style={{ flex: 1, overflow: 'auto' }}
            extensions={[kopiLanguage]}
            onChange={handleCodeMirrorChange}
          />
        </View>
        {isRightSidebarOpen && (
          <View style={{ width: 360 }}>
            {value}
          </View>
        )}
      </Splitter>
    </View>
  );
};

export default Editor;
