import React, { useEffect, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { LRLanguage, LanguageSupport, indentNodeProp, foldNodeProp, foldInside, delimitedIndent } from "@codemirror/language";
import { styleTags, tags as t } from "@lezer/highlight";

import { parser } from './kopi-parser';

import { Button, Divider, View, Splitter, Text } from 'bare';

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

const Editor = ({ args, ...props }: any) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [text, setText] = useState(args);

  useEffect(() => {
    (async () => {
      const text = await (await fetch(`//webdav.mike-austin.com/${args}`)).text();

      if (typeof text === 'string') {
        setText(text);
      }
    })();
  }, [args]);

  return (
    <View flex {...props}>
      <Splitter flex horizontal>
        {isSidebarOpen && (
          <View padding="small" style={{ width: 192 }}>
            <Text>Sidebar</Text>
          </View>
        )}
        <View flex>
          <View horizontal padding="small" fillColor="gray-1">
            <Button
              hover
              icon="table-columns"
              selected={isSidebarOpen}
              onClick={() => setIsSidebarOpen(isSidebarOpen => !isSidebarOpen)}
            />
          </View>
          <Divider />
          <CodeMirror
            value={text}
            height="100%"
            style={{ flex: 1, overflow: 'auto' }}
            extensions={[kopiLanguage]}
          // onChange={onChange}
          />
        </View>
      </Splitter>
    </View>
  );
};

export default Editor;
