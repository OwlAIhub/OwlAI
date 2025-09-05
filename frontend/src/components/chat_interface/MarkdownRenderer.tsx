'use client';

import { cn } from '@/lib/utils';
import { CheckIcon, CopyIcon } from 'lucide-react';
import { memo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';

// Copy button component for code blocks
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type='button'
      onClick={() => {
        navigator.clipboard.writeText(text).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        });
      }}
      className='absolute top-2 right-2 p-1.5 rounded-md bg-muted/80 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors opacity-0 group-hover:opacity-100'
      aria-label='Copy code'
    >
      {copied ? (
        <CheckIcon className='w-3 h-3' />
      ) : (
        <CopyIcon className='w-3 h-3' />
      )}
    </button>
  );
}

// Custom components for markdown rendering
const markdownComponents = {
  // Code blocks with syntax highlighting
  code: ({
    inline,
    className,
    children,
    ...props
  }: {
    inline?: boolean;
    className?: string;
    children: React.ReactNode;
    [key: string]: unknown;
  }) => {
    const match = /language-(\w+)/.exec(className || '');
    const language = match ? match[1] : '';
    const codeText = String(children).replace(/\n$/, '');

    if (!inline && language) {
      return (
        <div className='relative group my-3 rounded-lg border border-border bg-muted/30 overflow-hidden'>
          <div className='flex items-center justify-between px-3 py-1.5 bg-muted/50 border-b border-border'>
            <span className='text-xs font-medium text-muted-foreground uppercase tracking-wide'>
              {language}
            </span>
            <CopyButton text={codeText} />
          </div>
          <pre className='p-3 overflow-x-auto text-sm leading-relaxed'>
            <code className={className} {...props}>
              {children}
            </code>
          </pre>
        </div>
      );
    }

    // Inline code
    return (
      <code
        className='px-1.5 py-0.5 rounded bg-muted text-foreground text-sm font-mono'
        {...props}
      >
        {children}
      </code>
    );
  },

  // Headings with proper hierarchy
  h1: ({
    children,
    ...props
  }: {
    children: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <h1
      className='text-xl font-bold text-foreground mt-4 mb-3 pb-1.5 border-b border-border'
      {...props}
    >
      {children}
    </h1>
  ),
  h2: ({
    children,
    ...props
  }: {
    children: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <h2
      className='text-lg font-semibold text-foreground mt-4 mb-2.5'
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({
    children,
    ...props
  }: {
    children: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <h3
      className='text-base font-semibold text-foreground mt-3 mb-2'
      {...props}
    >
      {children}
    </h3>
  ),
  h4: ({
    children,
    ...props
  }: {
    children: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <h4
      className='text-sm font-semibold text-foreground mt-2.5 mb-1.5'
      {...props}
    >
      {children}
    </h4>
  ),
  h5: ({
    children,
    ...props
  }: {
    children: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <h5
      className='text-sm font-semibold text-foreground mt-2.5 mb-1.5'
      {...props}
    >
      {children}
    </h5>
  ),
  h6: ({
    children,
    ...props
  }: {
    children: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <h6
      className='text-xs font-medium text-foreground mt-2.5 mb-1.5'
      {...props}
    >
      {children}
    </h6>
  ),

  // Paragraphs with proper spacing and educational focus
  p: ({
    children,
    ...props
  }: {
    children: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <p
      className='text-foreground leading-relaxed mb-4 last:mb-0 text-sm'
      {...props}
    >
      {children}
    </p>
  ),

  // Lists with enhanced educational styling
  ul: ({
    children,
    ...props
  }: {
    children: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <ul
      className='list-disc list-inside space-y-2 mb-4 text-foreground text-sm'
      {...props}
    >
      {children}
    </ul>
  ),
  ol: ({
    children,
    ...props
  }: {
    children: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <ol
      className='list-decimal list-inside space-y-2 mb-4 text-foreground text-sm'
      {...props}
    >
      {children}
    </ol>
  ),
  li: ({
    children,
    ...props
  }: {
    children: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <li className='leading-relaxed pl-1' {...props}>
      {children}
    </li>
  ),

  // Tables with professional styling
  table: ({
    children,
    ...props
  }: {
    children: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <div className='my-3 overflow-x-auto rounded-lg border border-border'>
      <table className='w-full border-collapse text-sm' {...props}>
        {children}
      </table>
    </div>
  ),
  thead: ({
    children,
    ...props
  }: {
    children: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <thead className='bg-muted' {...props}>
      {children}
    </thead>
  ),
  tbody: ({
    children,
    ...props
  }: {
    children: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <tbody className='divide-y divide-border' {...props}>
      {children}
    </tbody>
  ),
  tr: ({
    children,
    ...props
  }: {
    children: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <tr className='hover:bg-muted/50 transition-colors' {...props}>
      {children}
    </tr>
  ),
  th: ({
    children,
    ...props
  }: {
    children: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <th
      className='px-4 py-3 text-left font-semibold text-foreground border-b border-border'
      {...props}
    >
      {children}
    </th>
  ),
  td: ({
    children,
    ...props
  }: {
    children: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <td className='px-4 py-3 text-foreground border-b border-border' {...props}>
      {children}
    </td>
  ),

  // Blockquotes with proper styling
  blockquote: ({
    children,
    ...props
  }: {
    children: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <blockquote
      className='border-l-4 border-primary/30 pl-3 py-1.5 my-3 bg-muted/30 rounded-r-lg italic text-foreground'
      {...props}
    >
      {children}
    </blockquote>
  ),

  // Links with proper styling
  a: ({
    children,
    href,
    ...props
  }: {
    children?: React.ReactNode;
    href?: string;
    [key: string]: unknown;
  }) => (
    <a
      href={href}
      className='text-primary hover:text-primary/80 underline underline-offset-2 transition-colors'
      target='_blank'
      rel='noopener noreferrer'
      {...props}
    >
      {children}
    </a>
  ),

  // Horizontal rules
  hr: ({ ...props }: { [key: string]: unknown }) => (
    <hr className='my-4 border-border' {...props} />
  ),

  // Strong and emphasis
  strong: ({
    children,
    ...props
  }: {
    children: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <strong className='font-semibold text-foreground' {...props}>
      {children}
    </strong>
  ),
  em: ({
    children,
    ...props
  }: {
    children: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <em className='italic text-foreground' {...props}>
      {children}
    </em>
  ),

  // Pre blocks (fallback)
  pre: ({
    children,
    ...props
  }: {
    children: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <pre
      className='bg-muted/30 rounded-lg p-3 overflow-x-auto text-sm leading-relaxed my-3'
      {...props}
    >
      {children}
    </pre>
  ),
};

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer = memo(function MarkdownRenderer({
  content,
  className,
}: MarkdownRendererProps) {
  return (
    <div className={cn('prose prose-sm max-w-none', className)}>
      <ReactMarkdown
        components={
          markdownComponents as Record<string, React.ComponentType<unknown>>
        }
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeRaw]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
});
