import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { createUseStyles } from 'react-jss';
import * as peggy from 'peggy';

import kopi from 'kopi-language';

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
    width: '100%',
    marginTop: 16,
    marginBottom: 16,
    borderSpacing: 0,
  },
  th: {
    whiteSpace: 'nowrap',
    textAlign: 'left',
    borderBottom: '1px solid #dee2e6',
    paddingBottom: 8,
    '&:not(:first-child)': {
      textAlign: 'left',
      paddingLeft: 16
    },
    '&:last-child': {
      width: '100%'
    }
  },
  tr: {
    // '&:last-child $td': {
    //   borderBottom: '1px solid #dee2e6',
    // },
    // '&:has(td:first-child:empty) $td': {
    //   padding: 0,
    //   borderBottom: '1px solid #dee2e6',
    // }
  },
  td: {
    borderBottom: '1px solid #dee2e6',
    paddingTop: 8,
    paddingBottom: 8,
    '&:not(:first-child)': {
      paddingLeft: 16,
    },
  },
});

const engines = {
  'language-kopi': async (code: string) => {
    const value = await kopi.interpret(code);

    if (value) {
      return value.inspect();
    }
  },
  'language-peggy': async (code: string) => {
    var input = '';

    const parser = peggy.generate(code);

    const ast = parser.parse(input);

    return JSON.stringify(ast, undefined, 2);
  }
};

//
// Code
//

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
  const textElementRef = useRef<HTMLSpanElement>(null);
  const observerRef = useRef<MutationObserver>();
  const [value, setValue] = useState<string | React.ReactElement>();

  useEffect(() => {
    if (language === 'language-kopi' || language === 'language-peggy') {
      (async () => {
        observerRef.current = new MutationObserver(async (mutationList) => {
          if (textElementRef.current) {
            try {
              const value = await engines[language](textElementRef.current.textContent);

              if (value) {
                setValue(await value);
              }
            } catch (error) {
              setValue((error as Error).toString());
            }
          }
        });

        if (textElementRef.current) {
          observerRef.current.observe(textElementRef.current, { characterData: true, subtree: true });
        }

        try {
          const value = await engines[language](children[0]);

          if (value) {
            setValue(await value);
          }
        } catch (error) {
          setValue((error as Error).toString());
        }
      })();

      return () => {
        observerRef.current?.disconnect();
      };
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
    minWidth: 550,
    marginTop: 0,
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
  console.log('Markdown()');

  const [markdown, setMarkdown] = useState('');
  const markdownElementRef = useRef<HTMLElement>(null);

  const sidebarStyles = useSidebarStyles();
  const markdownStyles = useMarkdownStyles();

  const sidebarComponents = React.useMemo(() => ({
    h1: () => null,
    h2: ({ children: [child] }: { children: any; }) => (
      <Text
        fontSize="medium"
        fontWeight="semibold"
        className={sidebarStyles.h2}
        onClick={() => markdownElementRef.current?.querySelector(`#${child.replaceAll(/[\d% ]/g, '-')}`)?.scrollIntoView({
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
        onClick={() => markdownElementRef.current?.querySelector(`#${child.replaceAll(/[\d% ]/g, '-')}`)?.scrollIntoView({
          behavior: 'smooth'
        })}
      >
        {child}
      </Text>
    ),
    p: () => null,
    strong: ({ children }: { children: any; }) => (
      <Text fontWeight="bold" textColor="gray-7">{children}</Text>
    ),
    code: () => null,
    pre: () => null,
  }), [sidebarStyles.h2, sidebarStyles.h3]);

  const markdownComponents = React.useMemo(() => ({
    h1: ({ children }: { children: any; }) => (
      <Text fontSize="xlarge" fontWeight="thin" className={markdownStyles.h1}>{children}</Text>
    ),
    h2: ({ children: [child] }: { children: any; }) => (
      <Text id={child.replaceAll(/[\d% ]/g, '-')} fontSize="large" fontWeight="semibold" className={markdownStyles.h2}>{child}</Text>
    ),
    h3: ({ children: [child] }: { children: any; }) => (
      <Text id={child.replaceAll(/[\d% ]/g, '-')} fontSize="medium" fontWeight="medium" className={markdownStyles.h3}>{child}</Text>
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
    tr: ({ children }: any) => (
      <tr className={markdownStyles.tr}>
        {children}
      </tr>
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
        {children && (
          <Text textAlign={style?.textAlign}>
            {children}
          </Text>
        )}
      </td>
    ),
  }), [markdownStyles.code, markdownStyles.h1, markdownStyles.h2, markdownStyles.h3, markdownStyles.p, markdownStyles.table, markdownStyles.td, markdownStyles.th, markdownStyles.tr]);;

  useEffect(() => {
    (async () => {
      const markdown = await (await fetch(`//webdav.mike-austin.com/${args}?${Date.now()}`)).text();

      if (typeof markdown === 'string') {
        setMarkdown(markdown);
      }

      if (markdown.includes('-float')) {
        const window = markdownElementRef.current?.parentElement?.parentElement?.parentElement;

        if (window && window.offsetWidth === 1024) {
          window.style.width = `${window.offsetWidth + 416}px`;
        }
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
