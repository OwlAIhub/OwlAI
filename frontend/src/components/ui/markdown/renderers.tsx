import React from 'react';

// A helper to parse custom component data from a code block
const parseComponentProps = (jsonString: string) => {
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    console.error("Failed to parse component JSON:", e);
    return null;
  }
};

// Simple CodeBlock component
const CodeBlock = ({ language, children }: { language?: string; children: string }) => (
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

// Simple MCQ component placeholder
const MCQComponent = (props: { question?: string; options?: string[]; correctAnswer?: number; explanation?: string }) => (
  <div className='bg-gray-50 border border-gray-200 rounded-lg p-6 my-4'>
    <p className='text-gray-600'>MCQ Component: {props.question || 'Interactive quiz will be rendered here'}</p>
  </div>
);

// Simple Chart component placeholder
const ChartComponent = (props: { type?: string; title?: string; data?: Record<string, unknown> }) => (
  <div className='my-6 p-4 border border-gray-300'>
    <p className='text-gray-600'>Chart Component: {props.title || 'Chart will be rendered here'}</p>
  </div>
);

// Simple Mermaid component placeholder
const MermaidComponent = ({ chart }: { chart: string }) => (
  <div className='my-6 p-4 border border-gray-300 text-center'>
    <p className='text-gray-600'>Mermaid Diagram: {chart.substring(0, 50)}...</p>
  </div>
);

export const renderers = {
  // Handle all code blocks (both inline and block-level)
  code: ({ className, children }: { className?: string; children?: React.ReactNode }) => {
    const language = className?.replace('language-', '');
    const codeString = String(children).trim();

    // Render custom components based on language
    switch (language) {
      case 'mcq': {
        const props = parseComponentProps(codeString);
        return props ? <MCQComponent {...props} /> : null;
      }
      case 'chart': {
        const props = parseComponentProps(codeString);
        return props ? <ChartComponent {...props} /> : null;
      }
      case 'mermaid':
        return <MermaidComponent chart={codeString} />;
      default:
        // Render a standard code block
        return <CodeBlock language={language}>{codeString}</CodeBlock>;
    }
  },

  // Handle styled paragraphs for educational content
  p: ({ children }: { children?: React.ReactNode }) => {
    const text = String(children);
    
    // Definition blocks
    if (text.startsWith('Definition:')) {
      return (
        <div className='border-l-2 border-gray-600 pl-4 py-2 my-3'>
          <p className='text-gray-900 font-semibold text-base leading-relaxed'><strong>Definition:</strong> {children}</p>
        </div>
      );
    }
    
    // Key Points
    if (text.startsWith('Key Points:')) {
      return (
        <div className='border-l-2 border-gray-600 pl-4 py-2 my-3'>
          <p className='text-gray-900 font-medium text-base leading-relaxed'><strong>Key Points:</strong> {children}</p>
        </div>
      );
    }
    
    // Theory/Theoretical Framework
    if (text.startsWith('Theory:') || text.startsWith('Theoretical Framework:')) {
      return (
        <div className='border-l-2 border-gray-600 pl-4 py-2 my-3'>
          <p className='text-gray-900 text-base leading-relaxed'><strong>Theory:</strong> {children}</p>
        </div>
      );
    }
    
    // Examples
    if (text.startsWith('Example:')) {
      return (
        <div className='border-l-2 border-gray-500 pl-4 py-2 my-3'>
          <p className='text-gray-900 font-mono text-sm leading-relaxed'><strong>Example:</strong> {children}</p>
        </div>
      );
    }
    
    // Important Notes
    if (text.startsWith('Important:') || text.startsWith('Note:')) {
      return (
        <div className='border-l-2 border-gray-700 pl-4 py-2 my-3'>
          <p className='text-gray-900 font-semibold text-base leading-relaxed'><strong>Important:</strong> {children}</p>
        </div>
      );
    }
    
    // Summary/Conclusion
    if (text.startsWith('Summary:') || text.startsWith('Conclusion:')) {
      return (
        <div className='border-l-2 border-gray-600 pl-4 py-2 my-3'>
          <p className='text-gray-900 font-medium text-base leading-relaxed'><strong>Summary:</strong> {children}</p>
        </div>
      );
    }
    
    // Default paragraph
    return <p className='mb-4 leading-relaxed text-gray-900 text-base'>{children}</p>;
  },

  // Clean Headers for educational content
  h1: ({ children }: { children?: React.ReactNode }) => (
    <h1 className='text-xl font-bold text-gray-900 mt-6 mb-4 pb-2 border-b border-gray-400'>
      {children}
    </h1>
  ),
  h2: ({ children }: { children?: React.ReactNode }) => (
    <h2 className='text-lg font-semibold text-gray-800 mt-5 mb-3 pb-1 border-b border-gray-300'>
      {children}
    </h2>
  ),
  h3: ({ children }: { children?: React.ReactNode }) => (
    <h3 className='text-base font-semibold text-gray-700 mt-4 mb-2'>
      {children}
    </h3>
  ),
  h4: ({ children }: { children?: React.ReactNode }) => (
    <h4 className='text-base font-medium text-gray-700 mt-3 mb-2'>
      {children}
    </h4>
  ),

  // Clean Lists for educational content
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className='list-disc pl-6 my-4 space-y-1 text-gray-900'>
      {children}
    </ul>
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol className='list-decimal pl-6 my-4 space-y-1 text-gray-900'>
      {children}
    </ol>
  ),
  li: ({ children }: { children?: React.ReactNode }) => (
    <li className='text-gray-900 leading-relaxed text-base py-1'>
      {children}
    </li>
  ),
  
  // Styled Tables
  table: ({ children }: { children?: React.ReactNode }) => (
    <div className='overflow-x-auto my-6 border rounded-lg'>
      <table className='min-w-full divide-y divide-gray-200'>{children}</table>
    </div>
  ),
  th: ({ children }: { children?: React.ReactNode }) => (
    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50'>{children}</th>
  ),
  td: ({ children }: { children?: React.ReactNode }) => (
    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800'>{children}</td>
  ),

  // Other elements
  blockquote: ({ children }: { children?: React.ReactNode }) => (
    <blockquote className='border-l-4 border-gray-300 pl-4 my-4 italic text-gray-600'>
      {children}
    </blockquote>
  ),

  // Links
  a: (props: { href?: string; children?: React.ReactNode }) => (
    <a
      href={props.href}
      target='_blank'
      rel='noopener noreferrer'
      className='text-blue-600 hover:text-blue-800 underline'
    >
      {props.children}
    </a>
  ),

  // Strong and emphasis
  strong: ({ children }: { children?: React.ReactNode }) => (
    <strong className='font-medium text-gray-800'>{children}</strong>
  ),
  em: ({ children }: { children?: React.ReactNode }) => (
    <em className='italic text-gray-600'>{children}</em>
  ),
};