'use client';

import { cn } from '@/lib/utils';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import 'katex/dist/katex.min.css';
import { renderers } from './markdown/renderers';

interface MarkdownProps {
  content: string;
  className?: string;
}

export function Markdown({ content, className }: MarkdownProps) {
  return (
    <div className={cn('prose prose-lg max-w-none', className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={renderers}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
