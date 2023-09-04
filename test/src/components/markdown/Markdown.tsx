import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import { createUseStyles } from 'react-jss';

import * as kopi from '../terminal/kopi-language';
import * as functions from '../terminal/functions';

import markdownUrl from '../../assets/kopi.md';

import { Button, Divider, Icon, Input, Spacer, Stack, Text, View, ViewProps } from 'bare';
import { KopiValue } from '../terminal/kopi-language/src/types';

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
  code: {
    '&:not(:first-child)': {
      marginTop: 16,
    },
    '&:not(:last-child)': {
      marginBottom: 16,
    },
  },
});

// \`\`\`kopi
// ()   (1, "Two", false)   (x: 2, y: 3)
// \`\`\`

let environment = {
  let: functions.kopi_let,
  loop: functions.kopi_loop,
  match: functions.kopi_match,
};

const bind = (bindings: { [name: string]: KopiValue; }) => {
  console.log('bind');
  environment = {
    ...environment,
    ...bindings
  };
};

const Code = ({ children, language, className }: { children: string[]; language?: string, className?: string; }) => {
  const textElementRef = useRef(null);
  const observerRef = useRef<MutationObserver>();
  const [value, setValue] = useState<string | React.ReactElement>();

  useEffect(() => {
    if (language !== 'language-kopi') {
      return;
    }

    (async () => {
      observerRef.current = new MutationObserver(async (mutationList) => {
        if (mutationList[0].target.textContent) {
          try {
            const value = await kopi.interpret(mutationList[0].target.textContent, environment, bind);

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
      console.log(environment);
      const value = await kopi.interpret(children[0], environment, bind);

      if (value) {
        setValue(await value.inspect());
      }
    })();

    return () => {
      observerRef.current?.disconnect();
    };
  }, [children, className, language]);

  const innerProps = { ref: textElementRef, contentEditable: true, suppressContentEditableWarning: true };

  return (
    <View border fillColor="gray-1" className={className}>
      <Text innerProps={innerProps} padding="large" textColor="gray-9" style={{ fontFamily: 'Iosevka', whiteSpace: 'pre-wrap' }}>
        {children}
      </Text>
      {language === 'language-kopi' && (
        typeof value === 'string' ? (
          <Text fillColor="white" padding="large" textColor="gray-9" style={{ fontFamily: 'Iosevka', whiteSpace: 'pre-wrap' }}>
            {value}
          </Text>
        ) : (
          value
        )
      )}
    </View>
  );
};

//
//
//

const Markdown = ({ ...props }) => {
  const [markdown, setMarkdown] = useState('');

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
      <Text fontSize="xlarge" fontWeight="thin" className={markdownStyles.h1}>{children}</Text>
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
    pre: ({ children }: any) => children,
    code: ({ children, className }: { children: any; className?: string; }) => (
      <Code language={className} className={markdownStyles.code}>{children}</Code>
    ),
  }), [markdownStyles.code, markdownStyles.h1, markdownStyles.h2, markdownStyles.h3, markdownStyles.p]);;

  useEffect(() => {
    (async () => {
      setMarkdown(await (await fetch(markdownUrl)).text());
    })();
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
