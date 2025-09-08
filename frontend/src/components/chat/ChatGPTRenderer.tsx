'use client';

import { cn } from '@/lib/utils';
import { div } from 'framer-motion/client';
import { Check, Copy } from 'lucide-react';
import { useState } from 'react';

// ChatGPT exact minimal color scheme
const colors = {
  // ChatGPT exact colors - minimal and clean
  background: '#ffffff', // Pure white background
  text: '#374151', // Dark gray text
  textSecondary: '#6b7280', // Medium gray
  textMuted: '#9ca3af', // Light gray
  accent: '#10a37f', // ChatGPT green
  codeBackground: '#f8f9fa', // Very light gray for code
  codeBorder: '#e5e7eb', // Light border
  border: '#e5e7eb', // Light borders
  hover: '#f9fafb', // Subtle hover
  success: '#10a37f', // Success color
  copyButton: '#f3f4f6', // Copy button background
};

// Content type detection - improved
const detectContentType = (text: string) => {
  const trimmed = text.trim();

  if (trimmed.startsWith('```')) return 'codeblock';
  if (trimmed.startsWith('#')) return 'heading';
  if (
    trimmed.startsWith('- ') ||
    trimmed.startsWith('* ') ||
    /^\d+\./.test(trimmed)
  )
    return 'list';
  if (trimmed.startsWith('>')) return 'blockquote';
  if (trimmed.includes('|') && trimmed.includes('\n')) return 'table';
  if (
    trimmed.includes('Key Points:') ||
    trimmed.includes('Functions of') ||
    trimmed.includes('Steps in') ||
    trimmed.includes('Types of')
  )
    return 'keypoints';
  if (
    trimmed.includes('Question:') ||
    /^[A-D]\)/.test(trimmed) ||
    trimmed.includes('A)') ||
    trimmed.includes('B)') ||
    trimmed.includes('C)') ||
    trimmed.includes('D)')
  )
    return 'mcq';
  if (
    trimmed.includes('Formula:') ||
    trimmed.includes('Equation:') ||
    trimmed.includes('$') ||
    trimmed.includes('\\(') ||
    trimmed.includes('\\[')
  )
    return 'formula';
  if (
    trimmed.includes('Diagram:') ||
    trimmed.includes('Graph:') ||
    trimmed.includes('Chart:')
  )
    return 'diagram';
  if (
    trimmed.includes('Theory:') ||
    trimmed.includes('Concept:') ||
    trimmed.includes('Definition:')
  )
    return 'theory';
  if (trimmed.includes('Example:') || trimmed.includes('Case Study:'))
    return 'example';
  if (
    trimmed.includes('Functions of') ||
    trimmed.includes('Steps in') ||
    trimmed.includes('Types of') ||
    trimmed.includes('Exam Tips') ||
    trimmed.includes('Related Concepts') ||
    trimmed.includes('Quick Quiz')
  )
    return 'keypoints';
  if (trimmed.includes('Next Steps') || trimmed.includes('Need clarification') || trimmed.includes('Ask me!'))
    return 'followup';
  return 'paragraph';
};

// Split content into blocks - professional parsing
const splitIntoBlocks = (content: string) => {
  const lines = content.split('\n');
  const blocks = [];
  let currentBlock = '';
  let currentType = 'paragraph';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();

    // Skip empty lines but preserve structure
    if (!trimmedLine) {
      if (currentBlock.trim()) {
        currentBlock += '\n';
      }
      continue;
    }

    const type = detectContentType(trimmedLine);

    // Special handling for headings that might be mixed with text
    if (type === 'heading') {
      // If we have accumulated content, save it first
      if (currentBlock.trim() && currentType !== 'heading') {
        blocks.push({ type: currentType, content: currentBlock.trim() });
        currentBlock = '';
      }

      // Check if this is a standalone heading or mixed with text
      const nextLines = lines.slice(i + 1);
      const nextNonEmptyLine = nextLines.find(l => l.trim());

      if (
        nextNonEmptyLine &&
        !nextNonEmptyLine.trim().startsWith('#') &&
        !nextNonEmptyLine.trim().startsWith('|') &&
        !nextNonEmptyLine.trim().startsWith('-') &&
        !nextNonEmptyLine.trim().startsWith('*')
      ) {
        // This heading has text after it, combine them
        let combinedContent = line;
        let j = i + 1;
        while (j < lines.length) {
          const nextLine = lines[j];
          if (!nextLine.trim()) {
            combinedContent += '\n';
            j++;
            continue;
          }
          if (
            nextLine.trim().startsWith('#') ||
            nextLine.trim().startsWith('|') ||
            nextLine.trim().startsWith('-') ||
            nextLine.trim().startsWith('*')
          ) {
            break;
          }
          combinedContent += '\n' + nextLine;
          j++;
        }
        blocks.push({ type: 'heading', content: combinedContent.trim() });
        i = j - 1; // Skip the lines we've already processed
        currentBlock = '';
        currentType = 'paragraph';
        continue;
      } else {
        // Standalone heading
        blocks.push({ type: 'heading', content: line.trim() });
        currentBlock = '';
        currentType = 'paragraph';
        continue;
      }
    }

    // If we hit a new block type and have content, save the current block
    if (type !== currentType && currentBlock.trim()) {
      blocks.push({ type: currentType, content: currentBlock.trim() });
      currentBlock = line;
      currentType = type;
    } else {
      currentBlock += (currentBlock ? '\n' : '') + line;
    }
  }

  if (currentBlock.trim()) {
    blocks.push({ type: currentType, content: currentBlock.trim() });
  }

  return blocks;
};

// Copy Button Component (ChatGPT style)
const CopyButton = ({
  code,
  className,
}: {
  code: string;
  className?: string;
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={cn(
        'absolute top-3 right-3 p-2 rounded-md transition-all duration-200 opacity-0 group-hover:opacity-100',
        'hover:scale-105 active:scale-95',
        copied ? 'text-green-400' : 'text-gray-400 hover:text-white',
        className
      )}
      style={{
        backgroundColor: copied ? colors.success : colors.copyButton,
      }}
      title={copied ? 'Copied!' : 'Copy code'}
    >
      {copied ? <Check className='w-4 h-4' /> : <Copy className='w-4 h-4' />}
    </button>
  );
};

// Code Block Component (Educational Platform Enhanced)
const CodeBlock = ({ content }: { content: string }) => {
  const lines = content.split('\n');
  const language = lines[0]?.replace(/```/, '').trim() || '';
  const code = lines.slice(1, -1).join('\n');

  // Handle Mermaid diagrams
  if (language === 'mermaid') {
    return (
      <div className='relative group my-6'>
        <div className='bg-white border border-gray-200 rounded-lg p-6 shadow-sm'>
          <div className='flex items-center justify-between mb-4'>
            <div className='flex items-center gap-2'>
              <div className='w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center'>
                <span className='text-white text-xs font-bold'>📊</span>
              </div>
              <span className='text-sm font-medium text-gray-600'>
                Mermaid Diagram
              </span>
            </div>
            <CopyButton code={code} />
          </div>
          <div className='bg-gray-50 p-6 rounded text-center'>
            <div className='text-4xl mb-2'>📈</div>
            <div className='text-sm text-gray-600 mb-2'>
              Interactive Diagram
            </div>
            <div className='text-xs text-gray-500 font-mono bg-white p-2 rounded border'>
              {code.split('\n')[0]}...
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Handle math equations
  if (language === 'math' || language === 'latex') {
    return (
      <div className='relative group my-6'>
        <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-6'>
          <div className='flex items-center justify-between mb-4'>
            <div className='flex items-center gap-2'>
              <div className='w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center'>
                <span className='text-white text-xs font-bold'>∑</span>
              </div>
              <span className='text-sm font-medium text-yellow-800'>
                Mathematical Equation
              </span>
            </div>
            <CopyButton code={code} />
          </div>
          <div className='bg-white p-4 rounded border text-center'>
            <div className='text-lg font-mono text-gray-800'>{code}</div>
          </div>
        </div>
      </div>
    );
  }

  // Regular code blocks
  return (
    <div className='relative group my-6'>
      <div
        className='rounded-md overflow-hidden shadow-sm'
        style={{
          backgroundColor: colors.codeBackground,
          border: `1px solid ${colors.codeBorder}`,
        }}
      >
        {/* Language header */}
        {language && (
          <div
            className='px-4 py-2 text-sm font-medium border-b'
            style={{
              backgroundColor: colors.hover,
              borderColor: colors.codeBorder,
              color: colors.textSecondary,
            }}
          >
            {language}
          </div>
        )}

        {/* Code content */}
        <div className='relative'>
          <pre
            className='p-4 overflow-x-auto text-sm leading-relaxed'
            style={{
              color: colors.text,
              fontFamily:
                'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
            }}
          >
            <code>{code}</code>
          </pre>
          <CopyButton code={code} />
        </div>
      </div>
    </div>
  );
};

// Heading Component (ChatGPT style) - improved
const HeadingComponent = ({
  content,
  level,
}: {
  content: string;
  level: number;
}) => {
  // Handle cases where heading is mixed with text
  const lines = content.split('\n');
  const headingLine = lines.find(line => line.trim().startsWith('#'));

  if (!headingLine) {
    // If no heading found, treat as paragraph
    return <ParagraphComponent content={content} />;
  }

  const text = headingLine.replace(/^#+\s*/, '').trim();
  const remainingText = lines
    .filter(line => !line.trim().startsWith('#'))
    .join('\n')
    .trim();

  const styles = {
    1: 'text-2xl font-bold mb-4 mt-6 text-gray-900',
    2: 'text-xl font-semibold mb-3 mt-5 text-gray-800',
    3: 'text-lg font-medium mb-2 mt-4 text-gray-700',
    4: 'text-base font-medium mb-2 mt-3 text-gray-700',
    5: 'text-sm font-medium mb-1 mt-2 text-gray-600',
    6: 'text-sm font-medium mb-1 mt-2 text-gray-600',
  };

  const className = styles[level as keyof typeof styles] || styles[6];

  return (
    <div className='mb-4'>
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

// List Component (ChatGPT minimal style) - professional
const ListComponent = ({ content }: { content: string }) => {
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
        'my-3 space-y-1',
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

// MCQ Component (Educational style)
const MCQComponent = ({ content }: { content: string }) => {
  const lines = content.split('\n').filter(line => line.trim());
  const question = lines.find(line => line.includes('Question:')) || '';
  const options = lines.filter(line => /^[A-D]\)/.test(line.trim()));
  const explanation = lines.find(line => line.includes('Explanation:')) || '';

  return (
    <div className='my-8 p-6 bg-white border-2 border-blue-200 rounded-xl shadow-lg'>
      {/* Question Header */}
      <div className='flex items-center gap-3 mb-6'>
        <div className='w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-md'>
          <span className='text-white text-sm font-bold'>?</span>
        </div>
        <div>
          <h3 className='text-lg font-bold text-gray-900'>Question</h3>
          <p className='text-sm text-gray-500'>Choose the correct answer</p>
        </div>
      </div>

      {/* Question Text */}
      {question && (
        <div className='mb-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500'>
          <p className='text-base font-medium text-gray-800 leading-relaxed'>
            {question}
          </p>
        </div>
      )}

      {/* Options - Interactive Style */}
      <div className='space-y-3 mb-6'>
        {options.map((option, index) => (
          <div
            key={index}
            className='group cursor-pointer p-4 bg-gray-50 hover:bg-blue-50 border-2 border-gray-200 hover:border-blue-300 rounded-lg transition-all duration-200 hover:shadow-md'
          >
            <div className='flex items-center gap-4'>
              <div className='w-8 h-8 bg-white group-hover:bg-blue-100 border-2 border-gray-300 group-hover:border-blue-400 rounded-full flex items-center justify-center transition-all duration-200'>
                <span className='text-sm font-bold text-gray-600 group-hover:text-blue-600'>
                  {option.charAt(0)}
                </span>
              </div>
              <span className='text-base text-gray-700 group-hover:text-gray-900 font-medium'>
                {option.substring(2)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Explanation */}
      {explanation && (
        <div className='mt-6 p-4 bg-green-50 rounded-lg border-l-4 border-green-500'>
          <div className='flex items-center gap-2 mb-2'>
            <div className='w-5 h-5 bg-green-500 rounded-full flex items-center justify-center'>
              <span className='text-white text-xs font-bold'>✓</span>
            </div>
            <p className='text-sm font-semibold text-green-800'>Explanation</p>
          </div>
          <p className='text-sm text-green-700 leading-relaxed'>
            {explanation}
          </p>
        </div>
      )}
    </div>
  );
};

// Formula Component (Educational style)
const FormulaComponent = ({ content }: { content: string }) => {
  const lines = content.split('\n').filter(line => line.trim());
  const title =
    lines.find(
      line => line.includes('Formula:') || line.includes('Equation:')
    ) || '';
  const formula =
    lines.find(
      line => line.includes('$') || line.includes('\\(') || line.includes('\\[')
    ) || '';

  return (
    <div className='my-4 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500'>
      <div className='flex items-center gap-2 mb-3'>
        <div className='w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center'>
          <span className='text-white text-xs font-bold'>F</span>
        </div>
        <h4 className='text-sm font-semibold text-yellow-800'>Formula</h4>
      </div>

      {title && <p className='text-sm text-gray-700 mb-2'>{title}</p>}

      <div className='bg-white p-4 rounded border text-center'>
        <div className='text-lg font-mono text-gray-800'>{formula}</div>
      </div>
    </div>
  );
};

// Diagram Component (Educational style)
const DiagramComponent = ({ content }: { content: string }) => {
  const lines = content.split('\n').filter(line => line.trim());
  const title =
    lines.find(
      line =>
        line.includes('Diagram:') ||
        line.includes('Graph:') ||
        line.includes('Chart:')
    ) || '';
  const description =
    lines.find(
      line =>
        !line.includes('Diagram:') &&
        !line.includes('Graph:') &&
        !line.includes('Chart:')
    ) || '';

  return (
    <div className='my-6 p-6 bg-purple-50 rounded-lg border-l-4 border-purple-500'>
      <div className='flex items-center gap-2 mb-4'>
        <div className='w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center'>
          <span className='text-white text-xs font-bold'>📊</span>
        </div>
        <h4 className='text-sm font-semibold text-purple-800'>
          Visual Diagram
        </h4>
      </div>

      {title && <p className='text-sm text-gray-700 mb-3'>{title}</p>}

      <div className='bg-white p-6 rounded border text-center'>
        <div className='text-4xl mb-2'>📈</div>
        <div className='text-sm text-gray-600 mb-2'>Interactive Diagram</div>
        <div className='text-xs text-gray-500'>{description}</div>
      </div>
    </div>
  );
};

// Theory Component (Educational style)
const TheoryComponent = ({ content }: { content: string }) => {
  const lines = content.split('\n').filter(line => line.trim());
  const title =
    lines.find(
      line =>
        line.includes('Theory:') ||
        line.includes('Concept:') ||
        line.includes('Definition:')
    ) || '';
  const content_text = lines
    .filter(
      line =>
        !line.includes('Theory:') &&
        !line.includes('Concept:') &&
        !line.includes('Definition:')
    )
    .join(' ');

  return (
    <div className='my-6 p-6 bg-green-50 rounded-lg border-l-4 border-green-500'>
      <div className='flex items-center gap-2 mb-4'>
        <div className='w-6 h-6 bg-green-500 rounded-full flex items-center justify-center'>
          <span className='text-white text-xs font-bold'>T</span>
        </div>
        <h4 className='text-sm font-semibold text-green-800'>
          Theory & Concept
        </h4>
      </div>

      {title && (
        <p className='text-sm font-medium text-gray-800 mb-3'>{title}</p>
      )}

      <div className='text-sm text-gray-700 leading-relaxed'>
        {content_text}
      </div>
    </div>
  );
};

// Example Component (Educational style)
const ExampleComponent = ({ content }: { content: string }) => {
  const lines = content.split('\n').filter(line => line.trim());
  const title =
    lines.find(
      line => line.includes('Example:') || line.includes('Case Study:')
    ) || '';
  const content_text = lines
    .filter(line => !line.includes('Example:') && !line.includes('Case Study:'))
    .join(' ');

  return (
    <div className='my-6 p-6 bg-orange-50 rounded-lg border-l-4 border-orange-500'>
      <div className='flex items-center gap-2 mb-4'>
        <div className='w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center'>
          <span className='text-white text-xs font-bold'>E</span>
        </div>
        <h4 className='text-sm font-semibold text-orange-800'>
          Example & Case Study
        </h4>
      </div>

      {title && (
        <p className='text-sm font-medium text-gray-800 mb-3'>{title}</p>
      )}

      <div className='text-sm text-gray-700 leading-relaxed'>
        {content_text}
      </div>
    </div>
  );
};

// Followup Component (Simple and clean)
const FollowupComponent = ({ content }: { content: string }) => {
  return (
    <div className='my-6 p-4 bg-teal-50 rounded-lg border-l-4 border-teal-500'>
      <div className='flex items-center gap-2'>
        <div className='w-5 h-5 bg-teal-600 rounded-full flex items-center justify-center'>
          <span className='text-white text-xs font-bold'>💬</span>
        </div>
        <p className='text-sm font-medium text-teal-800'>
          Give more followup questions
        </p>
      </div>
    </div>
  );
};

// Key Points Component (Professional style) - Enhanced for educational content
const KeyPointsComponent = ({ content }: { content: string }) => {
  const lines = content.split('\n').filter(line => line.trim());
  const title = lines[0] || '';
  const remainingContent = lines.slice(1).join('\n');

  // Parse different types of structured content
  const parseStructuredContent = (text: string) => {
    const sections: Array<{ type: string; content: string; items: string[] }> =
      [];
    const lines = text.split('\n');
    let currentSection: { type: string; content: string; items: string[] } = {
      type: 'text',
      content: '',
      items: [],
    };

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      // Check for numbered lists (1. 2. 3.)
      if (/^\d+\./.test(trimmed)) {
        if (
          currentSection.type === 'numbered' ||
          currentSection.type === 'text'
        ) {
          if (currentSection.content || currentSection.items.length > 0) {
            sections.push({ ...currentSection });
          }
          currentSection = { type: 'numbered', content: '', items: [] };
        }
        currentSection.items.push(trimmed);
      }
      // Check for bullet points (- or *)
      else if (/^[-*]\s/.test(trimmed)) {
        if (
          currentSection.type === 'bullets' ||
          currentSection.type === 'text'
        ) {
          if (currentSection.content || currentSection.items.length > 0) {
            sections.push({ ...currentSection });
          }
          currentSection = { type: 'bullets', content: '', items: [] };
        }
        currentSection.items.push(trimmed);
      }
      // Check for table-like content (|)
      else if (trimmed.includes('|')) {
        if (currentSection.type === 'table' || currentSection.type === 'text') {
          if (currentSection.content || currentSection.items.length > 0) {
            sections.push({ ...currentSection });
          }
          currentSection = { type: 'table', content: '', items: [] };
        }
        currentSection.items.push(trimmed);
      }
      // Regular text
      else {
        if (currentSection.type === 'text') {
          currentSection.content +=
            (currentSection.content ? '\n' : '') + trimmed;
        } else {
          if (currentSection.content || currentSection.items.length > 0) {
            sections.push({ ...currentSection });
          }
          currentSection = { type: 'text', content: trimmed, items: [] };
        }
      }
    }

    if (currentSection.content || currentSection.items.length > 0) {
      sections.push(currentSection);
    }

    return sections;
  };

  const sections = parseStructuredContent(remainingContent);

  const renderSection = (
    section: { type: string; content: string; items: string[] },
    index: number
  ) => {
    switch (section.type) {
      case 'numbered':
        return (
          <ol key={index} className='space-y-2 mb-4'>
            {section.items.map((item: string, itemIndex: number) => {
              const cleanItem = item.replace(/^\d+\.\s*/, '').trim();
              const processedItem = cleanItem.replace(
                /\*\*([^*]+?)\*\*/g,
                '<strong style="font-weight: 600; color: #1f2937;">$1</strong>'
              );
              return (
                <li
                  key={itemIndex}
                  className='text-sm leading-relaxed flex items-start'
                >
                  <span className='text-teal-600 font-medium mr-2'>
                    {itemIndex + 1}.
                  </span>
                  <span dangerouslySetInnerHTML={{ __html: processedItem }} />
                </li>
              );
            })}
          </ol>
        );

      case 'bullets':
        return (
          <ul key={index} className='space-y-2 mb-4'>
            {section.items.map((item: string, itemIndex: number) => {
              const cleanItem = item.replace(/^[-*]\s*/, '').trim();
              const processedItem = cleanItem.replace(
                /\*\*([^*]+?)\*\*/g,
                '<strong style="font-weight: 600; color: #1f2937;">$1</strong>'
              );
              return (
                <li
                  key={itemIndex}
                  className='text-sm leading-relaxed flex items-start'
                >
                  <span className='text-teal-600 mr-2'>•</span>
                  <span dangerouslySetInnerHTML={{ __html: processedItem }} />
                </li>
              );
            })}
          </ul>
        );

      case 'table':
        if (section.items.length >= 2) {
          const headers = section.items[0]
            .split('|')
            .map((h: string) => h.trim())
            .filter((h: string) => h);
          const rows = section.items.slice(2).map((row: string) =>
            row
              .split('|')
              .map((cell: string) => cell.trim())
              .filter((cell: string) => cell)
          );

          return (
            <div key={index} className='overflow-x-auto mb-4'>
              <table className='min-w-full border border-gray-200 rounded-lg overflow-hidden'>
                <thead className='bg-gray-50'>
                  <tr>
                    {headers.map((header: string, i: number) => (
                      <th
                        key={i}
                        className='px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b border-gray-200'
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row: string[], i: number) => (
                    <tr
                      key={i}
                      className='border-b border-gray-200 last:border-b-0'
                    >
                      {row.map((cell: string, j: number) => (
                        <td key={j} className='px-4 py-3 text-sm text-gray-700'>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
        return null;

      default:
        if (section.content) {
          const processedContent = section.content.replace(
            /\*\*([^*]+?)\*\*/g,
            '<strong style="font-weight: 600; color: #1f2937;">$1</strong>'
          );
          return (
            <div key={index} className='mb-4'>
              <p
                className='text-sm leading-relaxed text-gray-700'
                dangerouslySetInnerHTML={{ __html: processedContent }}
              />
            </div>
          );
        }
        return null;
    }
  };

  return (
    <div
      className='my-6 p-6 bg-gray-50 rounded-lg border-l-4 shadow-sm'
      style={{ borderColor: colors.accent }}
    >
      <h4 className='text-lg font-semibold mb-4 text-gray-800 flex items-center'>
        <div className='w-6 h-6 bg-teal-600 rounded-full flex items-center justify-center mr-3'>
          <span className='text-white text-xs font-bold'>📋</span>
        </div>
        {title}
      </h4>
      <div className='space-y-2'>
        {sections.map((section, index) => renderSection(section, index))}
      </div>
    </div>
  );
};

// Blockquote Component (ChatGPT minimal style)
const BlockquoteComponent = ({ content }: { content: string }) => {
  const text = content.replace(/^>\s*/, '');

  return (
    <blockquote
      className='my-4 pl-4 border-l-2 italic text-sm'
      style={{
        borderColor: colors.accent,
        color: colors.textSecondary,
      }}
    >
      {text}
    </blockquote>
  );
};

// Paragraph Component (ChatGPT minimal style) - professional
const ParagraphComponent = ({ content }: { content: string }) => {
  // Clean up the content first
  const cleanContent = content.trim();

  if (!cleanContent) return null;

  // Handle inline code
  let processedContent = cleanContent.replace(/`([^`]+)`/g, (match, code) => {
    return `<code style="background-color: ${colors.codeBackground}; color: ${colors.text}; padding: 2px 4px; border-radius: 3px; font-family: ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace; font-size: 0.875em; border: 1px solid ${colors.codeBorder};">${code}</code>`;
  });

  // Handle bold text - multiple passes to catch nested cases
  processedContent = processedContent.replace(
    /\*\*([^*]+?)\*\*/g,
    '<strong style="font-weight: 600; color: #1f2937;">$1</strong>'
  );

  // Handle italic text
  processedContent = processedContent.replace(
    /\*([^*]+?)\*/g,
    '<em style="font-style: italic;">$1</em>'
  );

  // Handle any remaining ** that might have been missed
  processedContent = processedContent.replace(/\*\*/g, '');

  // Handle numbered lists that might be in paragraphs
  if (/^\d+\./.test(cleanContent)) {
    const lines = cleanContent.split('\n');
    const listItems = lines.filter(line => /^\d+\./.test(line.trim()));

    if (listItems.length > 0) {
      return (
        <ol className='space-y-2 mb-4 ml-4'>
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

  // Handle bullet points that might be in paragraphs
  if (/^[-*]\s/.test(cleanContent)) {
    const lines = cleanContent.split('\n');
    const listItems = lines.filter(line => /^[-*]\s/.test(line.trim()));

    if (listItems.length > 0) {
      return (
        <ul className='space-y-2 mb-4 ml-4'>
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
      className='leading-relaxed mb-3 text-sm'
      style={{ color: colors.text }}
      dangerouslySetInnerHTML={{ __html: processedContent }}
    />
  );
};

// Table Component (ChatGPT minimal style)
const TableComponent = ({ content }: { content: string }) => {
  const lines = content.split('\n').filter(line => line.trim());
  const [header, ...rows] = lines;

  const headerCells = header
    .split('|')
    .map(cell => cell.trim())
    .filter(cell => cell);
  const dataRows = rows
    .filter(line => !line.includes('---')) // Remove separator lines
    .map(line =>
      line
        .split('|')
        .map(cell => cell.trim())
        .filter(cell => cell)
    );

  return (
    <div className='my-3 overflow-x-auto'>
      <table
        className='w-full border-collapse text-sm'
        style={{ borderColor: colors.border }}
      >
        <thead>
          <tr>
            {headerCells.map((cell, index) => (
              <th
                key={index}
                className='px-2 py-1 text-left font-medium border-b'
                style={{
                  color: colors.text,
                  borderColor: colors.border,
                }}
              >
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dataRows.map((row, rowIndex) => (
            <tr key={rowIndex} className='hover:bg-gray-50 transition-colors'>
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className='px-2 py-1 border-b'
                  style={{
                    color: colors.textSecondary,
                    borderColor: colors.border,
                  }}
                >
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

// Component mapping - Educational Platform Enhanced
const ComponentMap = {
  codeblock: CodeBlock,
  heading: ({ content }: { content: string }) => {
    const level = (content.match(/^#+/) || [''])[0].length;
    return <HeadingComponent content={content} level={level} />;
  },
  list: ListComponent,
  blockquote: BlockquoteComponent,
  table: TableComponent,
  keypoints: KeyPointsComponent,
  mcq: MCQComponent,
  formula: FormulaComponent,
  diagram: DiagramComponent,
  theory: TheoryComponent,
  example: ExampleComponent,
  followup: FollowupComponent,
  paragraph: ParagraphComponent,
};

// Main ChatGPT Renderer - Minimal and Clean
interface ChatGPTRendererProps {
  content: string;
  className?: string;
}

export function ChatGPTRenderer({ content, className }: ChatGPTRendererProps) {
  const blocks = splitIntoBlocks(content);

  return (
    <div
      className={cn('prose prose-sm max-w-none', className)}
      style={{
        backgroundColor: 'transparent',
        color: colors.text,
        lineHeight: '1.6',
      }}
    >
      {blocks.map((block, index) => {
        const Component =
          ComponentMap[block.type as keyof typeof ComponentMap] ||
          ComponentMap.paragraph;
        return <Component key={index} content={block.content} />;
      })}
    </div>
  );
}

    </div>
  );
}
