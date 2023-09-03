import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { createUseStyles } from 'react-jss';

import { Button, Divider, Icon, Input, Spacer, Stack, Text, View, ViewProps } from 'bare';

const useStyles = createUseStyles({
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

### Mathematical Operations

Infix math operators are supported such as add, subtract, multiply, divide, remainer, and exponent. Operator precedence is similar to other languages where multiplication is more tighly bound that addition for example.

\`\`\`kopi
1 + 2 * 3 ^ 4
\`\`\`
`;

const Markdown = ({ ...props }) => {
  const styles = useStyles();

  const markdownComponents = {
    h1: ({ children }: { children: any; }) => (
      <Text fontSize="xlarge" fontWeight="bold" className={styles.h1}>{children}</Text>
    ),
    h2: ({ children }: { children: any; }) => (
      <Text fontSize="large" fontWeight="semibold" className={styles.h2}>{children}</Text>
    ),
    h3: ({ children }: { children: any; }) => (
      <Text fontSize="medium" fontWeight="medium" className={styles.h3}>{children}</Text>
    ),
    p: ({ children }: { children: any; }) => (
      <Text textColor="gray-7" className={styles.p}>{children}</Text>
    ),
    code: ({ children }: { children: any; }) => (
      <View border fillColor="gray-1">
        <Text padding="large" textColor="gray-9" style={{ fontFamily: 'Iosevka' }}>
          {children}
        </Text>
        <Text fillColor="white" padding="large" textColor="gray-9" style={{ fontFamily: 'Iosevka' }}>
          120
        </Text>
      </View>
    ),
  };

  return (
    <View {...props} padding="xxlarge" style={{ display: 'block', overflow: 'auto' }}>
      <ReactMarkdown components={markdownComponents}>
        {markdown}
      </ReactMarkdown>
    </View>
  );
};

export default Markdown;
