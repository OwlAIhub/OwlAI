'use client';

import React from 'react';

interface CodeBlockProps {
  language?: string;
  children: string;
}

export function CodeBlock({ language, children }: CodeBlockProps) {
  return (
    <div className='my-6 border border-gray-300 overflow-hidden'>
      {language && (
        <div className='bg-gray-200 text-gray-900 p-2 text-sm font-mono border-b border-gray-300'>
          {language}
        </div>
      )}
      <pre className='bg-gray-50 text-gray-900 p-4 overflow-x-auto text-sm leading-relaxed'>
        <code className='font-mono'>
          {children}
        </code>
      </pre>
    </div>
  );
}