import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { createUseStyles } from 'react-jss';

import kopi from '../terminal/kopi-language';
import core from '../terminal/kopi-language/src/functions/core';

import { KopiValue } from '../terminal/kopi-language/src/types';
import { KopiAny, KopiBoolean, KopiNumber, KopiString } from '../terminal/kopi-language/src/classes';

import { Stack, Text, View } from 'bare';

const useSidebarStyles = createUseStyles({
  h1: {
    '&:not(:first-child)': {
      marginTop: 24,
    },
    '&:not(:last-child)': {
      marginBottom: 24,
    },
  },
  h2: {
    '& *': {
      cursor: 'pointer !important',
    },
    '&:not(:first-child)': {
      marginTop: 24,
    },
    '&:not(:last-child)': {
      marginBottom: 16,
    },
  },
  h3: {
    '& *': {
      cursor: 'pointer !important',
    },
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
      marginBottom: 32,
    },
  },
  h2: {
    '&:not(:first-child)': {
      marginTop: 32,
      scrollMarginTop: '24px',
    },
    '&:not(:last-child)': {
      marginBottom: 16,
    },
  },
  h3: {
    '&:not(:first-child)': {
      marginTop: 24,
      scrollMarginTop: '24px',
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

let environment = {
  Any: KopiAny,
  Number: KopiNumber,
  String: KopiString,
  Boolean: KopiBoolean,
  let: core.kopi_let,
  loop: core.kopi_loop,
  match: core.kopi_match,
  sleep: core.kopi_sleep,
  struct: core.kopi_struct,
  extend: core.kopi_extend,
  random: core.kopi_random,
  spawn: core.kopi_spawn,
};

const bind = (bindings: { [name: string]: KopiValue; }) => {
  environment = {
    ...environment,
    ...bindings
  };
};

const Code = ({
  children,
  language,
  inline,
  className
}: {
  children: string[];
  language?: string,
  inline?: boolean,
  className?: string;
}) => {
  const textElementRef = useRef(null);
  const observerRef = useRef<MutationObserver>();
  const [value, setValue] = useState<string | React.ReactElement>();

  useEffect(() => {
    if (inline || language !== 'language-kopi') {
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

      const value = await kopi.interpret(children[0], environment, bind);

      if (value) {
        setValue(await value.inspect());
      }
    })();

    return () => {
      observerRef.current?.disconnect();
    };
  }, [children, className, inline, language]);

  const innerProps = {
    ref: textElementRef,
    contentEditable: true,
    suppressContentEditableWarning: true
  };

  const inlineInnerProps = {
    style: {
      background: '#f1f3f5',
      padding: '0 4px',
      borderRadius: 2.5,
      fontFamily: 'Iosevka Fixed',
      color: '#212529',
      whiteSpace: 'pre-wrap'
    }
  };

  if (inline) {
    return (
      <Text border innerProps={inlineInnerProps} >
        {children}
      </Text>
    );
  }

  return (
    <View border fillColor="gray-1" className={className}>
      <Text innerProps={innerProps} padding="large" textColor="gray-9" style={{ fontFamily: 'Iosevka', whiteSpace: 'pre-wrap' }}>
        {children}
      </Text>
      {(!inline || language === 'language-kopi') && (
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

const Markdown = ({ args, ...props }: any) => {
  console.log('Markdown()', props);

  const [markdown, setMarkdown] = useState('');

  const sidebarStyles = useSidebarStyles();
  const markdownStyles = useMarkdownStyles();

  const sidebarComponents = React.useMemo(() => ({
    h1: ({ children }: { children: any; }) => (
      <Text fontSize="large" fontWeight="thin" className={sidebarStyles.h1}>{children}</Text>
    ),
    h2: ({ children }: { children: any; }) => (
      <Text
        fontSize="medium"
        fontWeight="semibold"
        className={sidebarStyles.h2}
        onClick={() => document.getElementById(children)?.scrollIntoView({
          behavior: 'smooth'
        })}
      >
        {children}
      </Text>
    ),
    h3: ({ children }: { children: any; }) => (
      <Text
        fontWeight="medium"
        className={sidebarStyles.h3}
        onClick={() => document.getElementById(children)?.scrollIntoView({
          behavior: 'smooth'
        })}
      >
        {children}
      </Text>
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
      <Text id={children} fontSize="large" fontWeight="semibold" className={markdownStyles.h2}>{children}</Text>
    ),
    h3: ({ children }: { children: any; }) => (
      <Text id={children} fontSize="medium" fontWeight="medium" className={markdownStyles.h3}>{children}</Text>
    ),
    p: ({ children, ...props }: { children: any; }) => (
      <Text textColor="gray-7" className={markdownStyles.p}>{children}</Text>
    ),
    strong: ({ children }: { children: any; }) => (
      <Text fontWeight="bold" textColor="gray-7">{children}</Text>
    ),
    pre: ({ children }: any) => children,
    code: ({ children, className, inline }: { inline?: boolean; children: any; className?: string; }) => (
      <Code language={className} inline={inline} className={markdownStyles.code}>{children}</Code>
    ),
  }), [markdownStyles.code, markdownStyles.h1, markdownStyles.h2, markdownStyles.h3, markdownStyles.p]);;

  useEffect(() => {
    (async () => {
      const markdown = await (await fetch(`//webdav.mike-austin.com/${args}`)).text();

      if (typeof markdown === 'string') {
        setMarkdown(markdown);
      }
    })();
  }, [args]);

  return (
    <Stack horizontal divider {...props} style={{ userSelect: 'text' }}>
      <View padding="large" minWidth={256} style={{ display: 'block', overflow: 'auto' }}>
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

export default React.memo(Markdown);
