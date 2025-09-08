/**
 * Code Block Component
 * Handles syntax highlighting, copy functionality, and special content types
 */

import { cn } from '@/lib/utils';
import { Check, Copy } from 'lucide-react';
import { useState } from 'react';

// ChatGPT exact minimal color scheme - smooth and clean

interface CodeBlockProps {
  content: string;
}

export const CodeBlock = ({ content }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  // Extract language and code
  const lines = content.split('\n');
  const firstLine = lines[0]?.trim() || '';
  const language = firstLine.startsWith('```')
    ? firstLine.replace(/^```/, '').trim()
    : 'text';

  const code = lines.slice(1, -1).join('\n').trim();

  // Handle special content types
  if (language === 'mermaid') {
    return (
      <div className='my-6 p-4 bg-blue-50 rounded-lg border border-blue-200'>
        <div className='flex items-center justify-between mb-3'>
          <span className='text-sm font-medium text-blue-800'>
            Mermaid Diagram
          </span>
        </div>
        <div className='bg-white p-4 rounded border text-sm text-gray-700'>
          <pre className='whitespace-pre-wrap'>{code}</pre>
        </div>
      </div>
    );
  }

  if (language === 'math' || language === 'latex') {
    return (
      <div className='my-6 p-4 bg-green-50 rounded-lg border border-green-200'>
        <div className='flex items-center justify-between mb-3'>
          <span className='text-sm font-medium text-green-800'>
            Mathematical Expression
          </span>
        </div>
        <div className='bg-white p-4 rounded border text-center'>
          <div className='text-lg font-mono text-gray-800'>{code}</div>
        </div>
      </div>
    );
  }

  // Handle copy functionality
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <div className='my-6 relative group'>
      <div className='bg-gray-900 rounded-lg overflow-hidden border border-gray-700 shadow-sm'>
        {/* Header */}
        <div className='flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700'>
          <span className='text-xs font-medium text-gray-300 uppercase tracking-wider'>
            {language}
          </span>
          <button
            onClick={handleCopy}
            className={cn(
              'flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded transition-colors',
              copied
                ? 'text-green-400 bg-green-900/20'
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
            )}
          >
            {copied ? (
              <>
                <Check className='w-3 h-3' />
                Copied
              </>
            ) : (
              <>
                <Copy className='w-3 h-3' />
                Copy
              </>
            )}
          </button>
        </div>

        {/* Code Content */}
        <div className='relative'>
          <pre className='p-4 overflow-x-auto text-sm leading-relaxed'>
            <code
              className='text-gray-100 font-mono'
              style={{
                fontFamily:
                  'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
              }}
            >
              {code}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
};
