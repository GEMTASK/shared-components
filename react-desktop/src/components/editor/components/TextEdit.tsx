import React, { useEffect, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { LRLanguage, LanguageSupport, indentNodeProp, foldNodeProp, foldInside, delimitedIndent } from "@codemirror/language";
import { styleTags, tags as t } from "@lezer/highlight";

import { parser } from './kopi-parser';

import { View } from 'bare';

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

const TextEdit = ({ value, onChange, ...props }: any) => {
  return (
    <View flex {...props} style={{ minHeight: 0 }}>
      <CodeMirror
        value={value}
        height="100%"
        style={{ flex: 1, overflow: 'auto' }}
        extensions={[kopiLanguage]}
        onChange={onChange}
      />
    </View>
  );
};

export default TextEdit;
