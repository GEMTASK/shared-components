import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { createUseStyles } from 'react-jss';
import * as peggy from 'peggy';

import * as kopi from 'kopi-language';
import { KopiValue } from 'kopi-language';

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
      clear: 'right',
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
  table: {
    marginTop: 16,
    marginBottom: 16,
    borderSpacing: 0,
  },
  th: {
    textAlign: 'left',
    borderBottom: '1px solid #dee2e6',
    paddingBottom: 8,
    '&:not(:first-child)': {
      textAlign: 'left',
      paddingLeft: 16
    }
  },
  td: {
    borderBottom: '1px solid #dee2e6',
    paddingTop: 8,
    paddingBottom: 8,
    '&:not(:first-child)': {
      // textAlign: 'left',
      paddingLeft: 16,
    }
  },
});

let environment = {
  Any: kopi.KopiAny,
  Number: kopi.KopiNumber,
  String: kopi.KopiString,
  Boolean: kopi.KopiBoolean,
  let: kopi.kopi_let,
  loop: kopi.kopi_loop,
  match: kopi.kopi_match,
  sleep: kopi.kopi_sleep,
  struct: kopi.kopi_struct,
  extend: kopi.kopi_extend,
  random: kopi.kopi_random,
  spawn: kopi.kopi_spawn,
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
    if (language?.includes('kopi')) {
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
    } else if (language?.includes('peggy')) {
      let input = '';

      observerRef.current = new MutationObserver(async (mutationList) => {
        if (mutationList[0].target.textContent) {
          try {
            const parser = peggy.generate(mutationList[0].target.textContent);

            const ast = parser.parse(input);

            setValue(JSON.stringify(ast, undefined, 2));
          } catch (error) {
            setValue((error as Error).toString());
          }
        }
      });

      if (textElementRef.current) {
        observerRef.current.observe(textElementRef.current, { characterData: true, subtree: true });
      }

      try {
        const parser = peggy.generate(children[0]);

        const ast = parser.parse(input);

        setValue(JSON.stringify(ast, undefined, 2));
      } catch (error) {
        setValue((error as Error).toString());
      }
    }
  }, [children, className, inline, language]);

  const innerProps = {
    ref: textElementRef,
    contentEditable: language?.includes('kopi') || language?.includes('peggy'),
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

  const float = language?.includes('float') && {
    float: 'right',
    minWidth: 600,
    marginLeft: 32
  } as const;

  return (
    <View border fillColor="gray-1" className={className} style={{ ...float, clear: 'right' }}>
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
// Markdown
//

const Markdown = ({ args, ...props }: any) => {
  console.log('Markdown()', props);

  const [markdown, setMarkdown] = useState('');
  const markdownElementRef = useRef<HTMLElement>(null);

  const sidebarStyles = useSidebarStyles();
  const markdownStyles = useMarkdownStyles();

  const sidebarComponents = React.useMemo(() => ({
    h1: ({ children }: { children: any; }) => (
      <Text fontSize="large" fontWeight="thin" className={sidebarStyles.h1}>{children}</Text>
    ),
    h2: ({ children: [child] }: { children: any; }) => (
      <Text
        fontSize="medium"
        fontWeight="semibold"
        className={sidebarStyles.h2}
        onClick={() => markdownElementRef.current?.querySelector(`#${child.replaceAll(' ', '-')}`)?.scrollIntoView({
          behavior: 'smooth'
        })}
      >
        {child}
      </Text>
    ),
    h3: ({ children: [child] }: { children: any; }) => (
      <Text
        fontWeight="medium"
        className={sidebarStyles.h3}
        onClick={() => markdownElementRef.current?.querySelector(`#${child.replaceAll(' ', '-')}`)?.scrollIntoView({
          behavior: 'smooth'
        })}
      >
        {child}
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
    h2: ({ children: [child] }: { children: any; }) => (
      <Text id={child.replaceAll(' ', '-')} fontSize="large" fontWeight="semibold" className={markdownStyles.h2}>{child}</Text>
    ),
    h3: ({ children: [child] }: { children: any; }) => (
      <Text id={child.replaceAll(' ', '-')} fontSize="medium" fontWeight="medium" className={markdownStyles.h3}>{child}</Text>
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
    table: ({ children }: any) => (
      <table className={markdownStyles.table}>{children}</table>
    ),
    th: ({ children }: any) => (
      <th className={markdownStyles.th}>
        <Text caps fontSize="xxsmall" fontWeight="semibold" textColor="gray-6">
          {children}
        </Text>
      </th>
    ),
    td: ({ children, style, ...props }: any) => (
      <td className={markdownStyles.td}>
        <Text textAlign={style?.textAlign}>
          {children}
        </Text>
      </td>
    ),
  }), [markdownStyles.code, markdownStyles.h1, markdownStyles.h2, markdownStyles.h3, markdownStyles.p, markdownStyles.table, markdownStyles.td, markdownStyles.th]);;

  useEffect(() => {
    (async () => {
      const markdown = await (await fetch(`//webdav.mike-austin.com/${args}?${Date.now()}`)).text();

      if (typeof markdown === 'string') {
        setMarkdown(markdown);
      }
    })();
  }, [args]);

  return (
    <Stack horizontal divider {...props} style={{ userSelect: 'text' }}>
      <View padding="large" fillColor="gray-1" style={{ display: 'block', width: 256, overflow: 'auto' }}>
        <ReactMarkdown components={sidebarComponents}>
          {markdown}
        </ReactMarkdown>
      </View>
      <View ref={markdownElementRef} flex padding="xxlarge" style={{ display: 'block', overflow: 'auto' }}>
        <ReactMarkdown components={markdownComponents} remarkPlugins={[remarkGfm]}>
          {markdown}
        </ReactMarkdown>
      </View>
    </Stack>
  );
};

export default React.memo(Markdown);
