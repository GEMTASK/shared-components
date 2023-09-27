import React, { useEffect, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { createTheme } from '@uiw/codemirror-themes';
import { LRLanguage, LanguageSupport, indentNodeProp, foldNodeProp, foldInside, delimitedIndent } from "@codemirror/language";
import { styleTags, tags as t } from "@lezer/highlight";

import { parser } from './kopi-parser';

import { View } from 'bare';

const myTheme = createTheme({
  theme: 'light',
  settings: {
    fontFamily: 'Iosevka',
    background: '#ffffff',
    foreground: '#343a40',
    caret: 'black',
    selection: '#e7f5ff',
    selectionMatch: '#f1f3f5',
    // lineHighlight: '#adb5bd40',
    lineHighlight: 'transparent',
    gutterBackground: '#f1f3f5',
    gutterForeground: '#adb5bd',
  },
  styles: [
    { tag: t.comment, color: '#868e96' },
    // { tag: t.variableName, color: 'red' },
    { tag: t.typeName, color: '#495057', fontWeight: 600 },
    // { tag: t.typeName, color: '#495057', textShadow: '1px 0 0 #868e96' },
    { tag: t.string, color: '#1971c2' },
    { tag: t.number, color: '#1971c2' },
    { tag: t.bool, color: '#1971c2' },
    { tag: t.keyword, color: '#495057', fontWeight: 600 },
    // { tag: t.operator, color: '#5c6166' },
    // { tag: t.definition(t.typeName), color: '#5c6166' },
    // { tag: t.angleBracket, color: '#5c6166' },
    // { tag: t.tagName, color: '#5c6166' },
    // { tag: t.attributeName, color: '#5c6166' },
    // { tag: t.brace, color: '#adb5bd' },
    // { tag: t.bracket, color: '#adb5bd' }, // Parenthesis
  ],
});

export const KopiLanguage = LRLanguage.define({
  parser: parser.configure({
    props: [
      indentNodeProp.add({
        Perens: delimitedIndent({ closing: ")", align: false }),
        Braces: delimitedIndent({ closing: "}", align: false }),
        Brackets: delimitedIndent({ closing: "]", align: false })
      }),
      styleTags({
        Keyword: t.keyword,
        TypeName: t.typeName,
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

const TextEdit = ({ value, onChange, ...props }: any) => {
  return (
    <View flex {...props} style={{ minHeight: 0 }}>
      <CodeMirror
        value={value}
        height="100%"
        style={{ flex: 1, overflow: 'auto' }}
        theme={myTheme}
        extensions={[kopiLanguage]}
        onChange={onChange}
      />
    </View>
  );
};

export default TextEdit;
