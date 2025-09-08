/**
 * Basic Markdown Components
 * Handles headings, paragraphs, lists, blockquotes, and tables
 */

import { cn } from '@/lib/utils';
import { cleanContent } from '../utils/contentDetector';

// ChatGPT exact minimal color scheme - smooth and clean
const colors = {
  background: '#ffffff',
  text: '#374151',
  textSecondary: '#6b7280',
  textMuted: '#9ca3af',
  accent: '#10a37f',
  codeBackground: '#f8f9fa',
  codeBorder: '#e5e7eb',
  border: '#e5e7eb',
  hover: '#f9fafb',
  success: '#10a37f',
  copyButton: '#f3f4f6',
};

// Heading Component (ChatGPT style) - smooth and clean
export const HeadingComponent = ({
  content,
  level,
}: {
  content: string;
  level: number;
}) => {
  const lines = content.split('\n');
  const headingLine = lines.find(line => line.trim().startsWith('#'));

  if (!headingLine) {
    return <ParagraphComponent content={content} />;
  }

  const text = headingLine.replace(/^#+\s*/, '').trim();
  const remainingText = lines
    .filter(line => !line.trim().startsWith('#'))
    .join('\n')
    .trim();

  // Smooth, clean typography with compact spacing
  const styles = {
    1: 'text-2xl font-bold mb-3 mt-4 text-gray-900 leading-relaxed',
    2: 'text-xl font-semibold mb-2 mt-3 text-gray-800 leading-relaxed',
    3: 'text-lg font-medium mb-2 mt-3 text-gray-700 leading-relaxed',
    4: 'text-base font-medium mb-1 mt-2 text-gray-700 leading-relaxed',
    5: 'text-sm font-medium mb-1 mt-2 text-gray-600 leading-relaxed',
    6: 'text-sm font-medium mb-1 mt-2 text-gray-600 leading-relaxed',
  };

  const className = styles[level as keyof typeof styles] || styles[6];

  return (
    <div className='mb-3'>
      {level === 1 && <h1 className={className}>{text}</h1>}
      {level === 2 && <h2 className={className}>{text}</h2>}
      {level === 3 && <h3 className={className}>{text}</h3>}
      {level === 4 && <h4 className={className}>{text}</h4>}
      {level === 5 && <h5 className={className}>{text}</h5>}
      {level === 6 && <h6 className={className}>{text}</h6>}
      {remainingText && <ParagraphComponent content={remainingText} />}
    </div>
  );
};

// Optimized paragraph processing with memoization
const processParagraphContent = (() => {
  const cache = new Map<string, string>();

  return (content: string): string => {
    if (cache.has(content)) {
      return cache.get(content)!;
    }

    // Clean any remaining markdown artifacts
    let processedContent = cleanContent(content);

    if (!processedContent) {
      cache.set(content, '');
      return '';
    }

    // Optimized regex processing
    processedContent = processedContent
      .replace(/`([^`]+)`/g, (match, code) => {
        return `<code style="background-color: ${colors.codeBackground}; color: ${colors.text}; padding: 2px 4px; border-radius: 3px; font-family: ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace; font-size: 0.875em; border: 1px solid ${colors.codeBorder};">${code}</code>`;
      })
      .replace(
        /\*\*([^*]+?)\*\*/g,
        '<strong style="font-weight: 600; color: #1f2937;">$1</strong>'
      )
      .replace(/\*([^*]+?)\*/g, '<em style="font-style: italic;">$1</em>')
      .replace(/\*\*/g, '');

    cache.set(content, processedContent);
    return processedContent;
  };
})();

// Paragraph Component (ChatGPT minimal style) - optimized
export const ParagraphComponent = ({ content }: { content: string }) => {
  const processedContent = processParagraphContent(content);

  if (!processedContent) return null;

  // Handle numbered lists in paragraphs - clean
  if (/^\d+\./.test(content)) {
    const lines = content.split('\n');
    const listItems = lines.filter(line => /^\d+\./.test(line.trim()));

    if (listItems.length > 0) {
      return (
        <ol className='space-y-1 mb-3 ml-4'>
          {listItems.map((item, index) => {
            const cleanItem = item.replace(/^\d+\.\s*/, '').trim();
            const processedItem = cleanItem.replace(
              /\*\*([^*]+?)\*\*/g,
              '<strong style="font-weight: 600; color: #1f2937;">$1</strong>'
            );
            return (
              <li
                key={index}
                className='text-sm leading-relaxed flex items-start'
              >
                <span className='text-teal-600 font-medium mr-2'>
                  {index + 1}.
                </span>
                <span dangerouslySetInnerHTML={{ __html: processedItem }} />
              </li>
            );
          })}
        </ol>
      );
    }
  }

  // Handle bullet points in paragraphs - clean
  if (/^[-*]\s/.test(content)) {
    const lines = content.split('\n');
    const listItems = lines.filter(line => /^[-*]\s/.test(line.trim()));

    if (listItems.length > 0) {
      return (
        <ul className='space-y-1 mb-3 ml-4'>
          {listItems.map((item, index) => {
            const cleanItem = item.replace(/^[-*]\s*/, '').trim();
            const processedItem = cleanItem.replace(
              /\*\*([^*]+?)\*\*/g,
              '<strong style="font-weight: 600; color: #1f2937;">$1</strong>'
            );
            return (
              <li
                key={index}
                className='text-sm leading-relaxed flex items-start'
              >
                <span className='text-teal-600 mr-2'>•</span>
                <span dangerouslySetInnerHTML={{ __html: processedItem }} />
              </li>
            );
          })}
        </ul>
      );
    }
  }

  return (
    <p
      className='leading-relaxed mb-2 text-sm'
      style={{ color: colors.text }}
      dangerouslySetInnerHTML={{ __html: processedContent }}
    />
  );
};

// List Component (ChatGPT minimal style) - smooth and clean
export const ListComponent = ({ content }: { content: string }) => {
  const lines = content.split('\n').filter(line => line.trim());
  const isOrdered = /^\d+\./.test(lines[0]?.trim() || '');

  const ListTag = isOrdered ? 'ol' : 'ul';

  const processListItem = (text: string) => {
    // Handle bold text in list items
    let processedText = text.replace(
      /\*\*([^*]+?)\*\*/g,
      '<strong style="font-weight: 600; color: #1f2937;">$1</strong>'
    );

    // Handle italic text
    processedText = processedText.replace(
      /\*([^*]+?)\*/g,
      '<em style="font-style: italic;">$1</em>'
    );

    // Clean up any remaining **
    processedText = processedText.replace(/\*\*/g, '');

    return processedText;
  };

  return (
    <ListTag
      className={cn(
        'my-2 space-y-0.5',
        isOrdered ? 'list-decimal list-inside' : 'list-disc list-inside'
      )}
      style={{ color: colors.text }}
    >
      {lines.map((line, index) => {
        const text = line.replace(/^[-*]\s*|\d+\.\s*/, '');
        return (
          <li
            key={index}
            className='leading-relaxed text-sm'
            dangerouslySetInnerHTML={{ __html: processListItem(text) }}
          />
        );
      })}
    </ListTag>
  );
};

// Blockquote Component - clean
export const BlockquoteComponent = ({ content }: { content: string }) => {
  const text = content.replace(/^>\s*/, '');
  return (
    <blockquote
      className='my-3 pl-4 border-l-4 border-gray-300 italic text-gray-600'
      style={{ borderColor: colors.accent }}
    >
      {text}
    </blockquote>
  );
};

// Table Component - clean
export const TableComponent = ({ content }: { content: string }) => {
  const lines = content.split('\n').filter(line => line.trim());
  const tableLines = lines.filter(line => line.includes('|'));

  if (tableLines.length < 2) return null;

  const headers = tableLines[0]
    .split('|')
    .map(cell => cell.trim())
    .filter(cell => cell);
  const rows = tableLines.slice(2).map(line =>
    line
      .split('|')
      .map(cell => cell.trim())
      .filter(cell => cell)
  );

  return (
    <div className='my-4 overflow-x-auto'>
      <table className='min-w-full border border-gray-200 rounded-lg overflow-hidden'>
        <thead className='bg-gray-50'>
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                className='px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b border-gray-200'
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr
              key={index}
              className='border-b border-gray-200 last:border-b-0'
            >
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className='px-4 py-3 text-sm text-gray-700'>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
