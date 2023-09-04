import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import { createUseStyles } from 'react-jss';

import * as kopi from '../terminal/kopi-language';

import { Button, Divider, Icon, Input, Spacer, Stack, Text, View, ViewProps } from 'bare';

const useSidebarStyles = createUseStyles({
  h1: {
    '&:not(:first-child)': {
      marginTop: 32,
    },
    '&:not(:last-child)': {
      marginBottom: 24,
    },
  },
  h2: {
    '&:not(:first-child)': {
      marginTop: 16,
    },
    '&:not(:last-child)': {
      marginBottom: 16,
    },
  },
  h3: {
    padding: '0 16px',
    '&:not(:first-child)': {
      marginTop: 16,
    },
    '&:not(:last-child)': {
      marginBottom: 16,
    },
  },
});

const useMarkdownStyles = createUseStyles({
  h1: {
    '&:not(:first-child)': {
      marginTop: 32,
    },
    '&:not(:last-child)': {
      marginBottom: 24,
    },
  },
  h2: {
    '&:not(:first-child)': {
      marginTop: 32,
    },
    '&:not(:last-child)': {
      marginBottom: 16,
    },
  },
  h3: {
    '&:not(:first-child)': {
      marginTop: 24,
    },
    '&:not(:last-child)': {
      marginBottom: 16,
    },
  },
  p: {
    '&:not(:first-child)': {
      marginTop: 16,
    },
    '&:not(:last-child)': {
      marginBottom: 16,
    },
  },
});

const markdown = `
# Learning Kopi

## Introduction

Kopi is a small, immutable, 100% async programming language. It supports several literal types, pattern matching, lazy streams, and coroutines.

## Kopi Basics

Kopi has a handful of syntax rules which can be nested and combined to create larger structures. Patterns are used for assignment, destructuring and matching values.

### Basic Types

Kopi supports several literal types. Here, we have a tuple containing a Number, a String, a Boolean, a Range, an Array, and a Dict.

\`\`\`kopi
(1, "Two", false, 1..5, [3, 4], { 5: "Five" })
\`\`\`

We'll talk more about functions and expression trees later on.

### Math Operations

Infix math operators are supported such as add, subtract, multiply, divide, remainer, and exponent. Operator precedence is similar to other languages where multiplication is more tighly bound that addition for example.

\`\`\`kopi
1 + 2 * 3 ^ 4
\`\`\`

### Tuples and Arrays

A **Tuple** is a fixed structure with any number of types. You can name tuple fields to make code easier to read and work with, and mix and match non-named and named fields. There is a special value 0-tuple, which is used to represent "no value".


`;

// \`\`\`kopi
// ()   (1, "Two", false)   (x: 2, y: 3)
// \`\`\`

const Code = ({ children }: { children: string[]; }) => {
  const textElementRef = useRef(null);
  const observerRef = useRef<MutationObserver>();
  const [value, setValue] = useState<string | React.ReactElement>();

  useEffect(() => {
    (async () => {
      observerRef.current = new MutationObserver(async (mutationList) => {
        if (mutationList[0].target.textContent) {
          try {
            const value = await kopi.interpret(mutationList[0].target.textContent, {}, () => { });

            if (value) {
              setValue(await value.inspect());
            }
          } catch (error) {
            setValue((error as Error).toString());
          }
        }
      });

      if (textElementRef.current) {
        observerRef.current.observe(textElementRef.current, { characterData: true, subtree: true });
      }

      const value = await kopi.interpret(children[0], {}, () => { });

      if (value) {
        setValue(await value.inspect());
      }
    })();

    return () => {
      observerRef.current?.disconnect();
    };
  }, [children]);

  return (
    <View border fillColor="gray-1">
      <Text innerProps={{ ref: textElementRef, contentEditable: true }} padding="large" textColor="gray-9" style={{ fontFamily: 'Iosevka' }}>
        {children}
      </Text>
      {typeof value === 'string' ? (
        <Text fillColor="white" padding="large" textColor="gray-9" style={{ fontFamily: 'Iosevka' }}>
          {value}
        </Text>
      ) : (
        value
      )}
    </View>
  );
};

//
//
//

const Markdown = ({ ...props }) => {
  const [markdownAst, setMarkdownAst] = useState<{}>();

  const sidebarStyles = useSidebarStyles();
  const markdownStyles = useMarkdownStyles();

  const sidebarComponents = React.useMemo(() => ({
    h1: ({ children }: { children: any; }) => (
      <Text fontSize="large" fontWeight="thin" className={sidebarStyles.h1}>{children}</Text>
    ),
    h2: ({ children }: { children: any; }) => (
      <Text fontSize="medium" fontWeight="semibold" className={sidebarStyles.h2}>{children}</Text>
    ),
    h3: ({ children }: { children: any; }) => (
      <Text fontWeight="medium" className={sidebarStyles.h3}>{children}</Text>
    ),
    p: ({ children }: { children: any; }) => null,
    strong: ({ children }: { children: any; }) => (
      <Text fontWeight="bold" textColor="gray-7">{children}</Text>
    ),
    code: ({ children }: { children: any; }) => null,
    pre: () => null,
  }), [sidebarStyles.h1, sidebarStyles.h2, sidebarStyles.h3]);

  const markdownComponents = React.useMemo(() => ({
    h1: ({ children }: { children: any; }) => (
      <Text fontSize="xlarge" fontWeight="bold" className={markdownStyles.h1}>{children}</Text>
    ),
    h2: ({ children }: { children: any; }) => (
      <Text fontSize="large" fontWeight="semibold" className={markdownStyles.h2}>{children}</Text>
    ),
    h3: ({ children }: { children: any; }) => (
      <Text fontSize="medium" fontWeight="medium" className={markdownStyles.h3}>{children}</Text>
    ),
    p: ({ children, ...props }: { children: any; }) => (
      <Text textColor="gray-7" className={markdownStyles.p}>{children}</Text>
    ),
    strong: ({ children }: { children: any; }) => (
      <Text fontWeight="bold" textColor="gray-7">{children}</Text>
    ),
    code: ({ children }: { children: any; }) => (
      <Code>{children}</Code>
    ),
  }), [markdownStyles.h1, markdownStyles.h2, markdownStyles.h3, markdownStyles.p]);;

  useEffect(() => {
    // (async () => {
    //   const ast = await unified()
    //     .use(remarkParse as any)
    //     .parse(markdown);

    //   console.log(ast);

    //   setMarkdownAst(ast);
    // })();
  }, []);

  return (
    <Stack horizontal divider {...props} style={{ userSelect: 'text' }}>
      <View padding="large" minWidth={224} style={{ display: 'block', overflow: 'auto' }}>
        <ReactMarkdown components={sidebarComponents}>
          {markdown}
        </ReactMarkdown>
      </View>
      <View padding="xxlarge" style={{ display: 'block', overflow: 'auto' }}>
        <ReactMarkdown components={markdownComponents}>
          {markdown}
        </ReactMarkdown>
      </View>
    </Stack>
  );
};

export default Markdown;
