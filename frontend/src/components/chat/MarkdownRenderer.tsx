'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({
  content,
  className,
}: MarkdownRendererProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={cn('markdown-content', className)}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          // Headings with beautiful styling
          h1: ({ children }) => (
            <h1 className='text-xl font-bold text-gray-900 mb-4 mt-6 first:mt-0 border-b-2 border-teal-200 pb-2'>
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className='text-lg font-semibold text-gray-800 mb-3 mt-5 first:mt-0 border-b border-gray-200 pb-1'>
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className='text-base font-medium text-gray-700 mb-2 mt-4 first:mt-0'>
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className='text-sm font-medium text-gray-700 mb-2 mt-3 first:mt-0'>
              {children}
            </h4>
          ),

          // Paragraphs with proper spacing
          p: ({ children }) => (
            <p className='text-sm leading-relaxed text-gray-700 mb-3 last:mb-0'>
              {children}
            </p>
          ),

          // Lists with beautiful styling
          ul: ({ children }) => (
            <ul className='list-disc list-inside space-y-1 mb-4 text-sm text-gray-700 ml-2'>
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className='list-decimal list-inside space-y-1 mb-4 text-sm text-gray-700 ml-2'>
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className='leading-relaxed text-gray-700'>{children}</li>
          ),

          // Code blocks with syntax highlighting
          code: ({ children, className }) => {
            const isInline = !className;
            if (isInline) {
              return (
                <code className='bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-mono border'>
                  {children}
                </code>
              );
            }
            return <code className={className}>{children}</code>;
          },
          pre: ({ children }) => (
            <pre className='bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4 text-sm font-mono border shadow-sm'>
              {children}
            </pre>
          ),

          // Tables with beautiful styling
          table: ({ children }) => (
            <div className='overflow-x-auto mb-4 border border-gray-200 rounded-lg shadow-sm'>
              <table className='min-w-full'>{children}</table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className='bg-gray-50'>{children}</thead>
          ),
          tbody: ({ children }) => (
            <tbody className='divide-y divide-gray-200'>{children}</tbody>
          ),
          tr: ({ children }) => (
            <tr className='hover:bg-gray-50 transition-colors duration-150'>
              {children}
            </tr>
          ),
          th: ({ children }) => (
            <th className='px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200'>
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className='px-4 py-3 text-sm text-gray-700 border-b border-gray-100'>
              {children}
            </td>
          ),

          // Blockquotes with beautiful styling
          blockquote: ({ children }) => (
            <blockquote className='border-l-4 border-teal-500 pl-4 py-2 bg-teal-50 rounded-r-lg mb-4 shadow-sm'>
              <div className='text-sm text-gray-700 italic'>{children}</div>
            </blockquote>
          ),

          // Links with hover effects
          a: ({ children, href }) => (
            <a
              href={href}
              target='_blank'
              rel='noopener noreferrer'
              className='text-teal-600 hover:text-teal-700 underline decoration-teal-300 hover:decoration-teal-500 transition-colors duration-200 font-medium'
            >
              {children}
            </a>
          ),

          // Horizontal rules
          hr: () => <hr className='border-gray-200 my-6' />,

          // Strong/Bold text
          strong: ({ children }) => (
            <strong className='font-semibold text-gray-900'>{children}</strong>
          ),

          // Emphasis/Italic text
          em: ({ children }) => (
            <em className='italic text-gray-600'>{children}</em>
          ),

          // Strikethrough
          del: ({ children }) => (
            <del className='line-through text-gray-500'>{children}</del>
          ),

          // Task lists (checkboxes)
          input: ({ type, checked, ...props }) => {
            if (type === 'checkbox') {
              return (
                <input
                  type='checkbox'
                  checked={checked}
                  readOnly
                  className='mr-2 accent-teal-600'
                  {...props}
                />
              );
            }
            return <input type={type} {...props} />;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </motion.div>
  );
}
