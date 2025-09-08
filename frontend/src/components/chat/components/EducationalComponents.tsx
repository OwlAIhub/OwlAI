/**
 * Educational Components
 * Handles MCQ, Key Points, Formula, Diagram, Theory, Example, and Followup components
 */

import { cn } from '@/lib/utils';
import { CheckCircle, Circle, BookOpen, Calculator, BarChart3, Lightbulb, FileText, MessageCircle } from 'lucide-react';

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

// MCQ Component (Educational style)
export const MCQComponent = ({ content }: { content: string }) => {
  const lines = content.split('\n').filter(line => line.trim());
  const question = lines.find(line => line.includes('Question:')) || '';
  const options = lines.filter(line => /^[A-D]\)/.test(line.trim()));

  return (
    <div className='my-6 p-6 bg-blue-50 rounded-lg border-l-4 border-blue-500 shadow-sm'>
      <h4 className='text-lg font-semibold mb-4 text-blue-800 flex items-center'>
        <div className='w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mr-3'>
          <span className='text-white text-xs font-bold'>?</span>
        </div>
        {question.replace('Question:', '').trim()}
      </h4>
      <div className='space-y-3'>
        {options.map((option, index) => {
          const optionText = option.replace(/^[A-D]\)\s*/, '').trim();
          const optionLetter = option.match(/^([A-D])\)/)?.[1] || '';
          
          return (
            <div
              key={index}
              className='flex items-center p-3 bg-white rounded-md border border-blue-200 hover:border-blue-300 transition-colors cursor-pointer'
            >
              <div className='flex items-center justify-center w-6 h-6 mr-3'>
                <Circle className='w-5 h-5 text-blue-600' />
              </div>
              <span className='text-sm font-medium text-blue-800 mr-2'>{optionLetter}.</span>
              <span className='text-sm text-gray-700'>{optionText}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Key Points Component (Educational style)
export const KeyPointsComponent = ({ content }: { content: string }) => {
  const lines = content.split('\n').filter(line => line.trim());
  const title = lines.find(line => 
    line.includes('Key Points:') || 
    line.includes('Functions of') || 
    line.includes('Steps in') || 
    line.includes('Types of')
  ) || 'Key Points';

  const parseStructuredContent = () => {
    const sections: { type: string; content: string; items: string[] }[] = [];
    let currentSection: { type: string; content: string; items: string[] } | null = null;

    for (const line of lines) {
      const trimmed = line.trim();
      
      if (trimmed.includes('Key Points:') || trimmed.includes('Functions of') || trimmed.includes('Steps in') || trimmed.includes('Types of')) {
        if (currentSection) sections.push(currentSection);
        currentSection = { type: 'header', content: trimmed, items: [] };
      } else if (/^\d+\./.test(trimmed)) {
        if (!currentSection) currentSection = { type: 'numbered', content: '', items: [] };
        currentSection.items.push(trimmed);
      } else if (/^[-*]\s/.test(trimmed)) {
        if (!currentSection) currentSection = { type: 'bullets', content: '', items: [] };
        currentSection.items.push(trimmed);
      } else if (trimmed.includes('|') && trimmed.includes('\n')) {
        if (!currentSection) currentSection = { type: 'table', content: '', items: [] };
        currentSection.items.push(trimmed);
      } else if (trimmed) {
        if (!currentSection) currentSection = { type: 'text', content: '', items: [] };
        currentSection.content += (currentSection.content ? '\n' : '') + trimmed;
      }
    }

    if (currentSection) sections.push(currentSection);
    return sections;
  };

  const sections = parseStructuredContent();

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
            .map((cell: string) => cell.trim())
            .filter((cell: string) => cell);
          const rows = section.items.slice(1).map((row: string) =>
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
                        <td
                          key={j}
                          className='px-4 py-3 text-sm text-gray-700'
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

// Formula Component (Educational style)
export const FormulaComponent = ({ content }: { content: string }) => {
  const text = content.replace(/^(Formula:|Equation:)\s*/, '').trim();
  
  return (
    <div className='my-4 p-4 bg-green-50 rounded-lg border-l-4 border-green-500 shadow-sm'>
      <h4 className='text-sm font-semibold mb-2 text-green-800 flex items-center'>
        <Calculator className='w-4 h-4 mr-2' />
        Formula
      </h4>
      <div className='text-sm text-gray-700 font-mono bg-white p-3 rounded border'>
        {text}
      </div>
    </div>
  );
};

// Diagram Component (Educational style)
export const DiagramComponent = ({ content }: { content: string }) => {
  const text = content.replace(/^(Diagram:|Graph:|Chart:)\s*/, '').trim();
  
  return (
    <div className='my-4 p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500 shadow-sm'>
      <h4 className='text-sm font-semibold mb-2 text-purple-800 flex items-center'>
        <BarChart3 className='w-4 h-4 mr-2' />
        Diagram
      </h4>
      <div className='text-sm text-gray-700'>
        {text}
      </div>
    </div>
  );
};

// Theory Component (Educational style)
export const TheoryComponent = ({ content }: { content: string }) => {
  const text = content.replace(/^(Theory:|Concept:|Definition:)\s*/, '').trim();
  
  return (
    <div className='my-4 p-4 bg-indigo-50 rounded-lg border-l-4 border-indigo-500 shadow-sm'>
      <h4 className='text-sm font-semibold mb-2 text-indigo-800 flex items-center'>
        <BookOpen className='w-4 h-4 mr-2' />
        Theory
      </h4>
      <div className='text-sm text-gray-700'>
        {text}
      </div>
    </div>
  );
};

// Example Component (Educational style)
export const ExampleComponent = ({ content }: { content: string }) => {
  const text = content.replace(/^(Example:|Case Study:)\s*/, '').trim();
  
  return (
    <div className='my-4 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500 shadow-sm'>
      <h4 className='text-sm font-semibold mb-2 text-yellow-800 flex items-center'>
        <Lightbulb className='w-4 h-4 mr-2' />
        Example
      </h4>
      <div className='text-sm text-gray-700'>
        {text}
      </div>
    </div>
  );
};

// Followup Component (Educational style)
export const FollowupComponent = ({ content }: { content: string }) => {
  return (
    <div className='my-4 p-4 bg-gray-100 rounded-lg border-l-4 border-gray-400 shadow-sm'>
      <h4 className='text-sm font-semibold mb-2 text-gray-700 flex items-center'>
        <MessageCircle className='w-4 h-4 mr-2' />
        Give more followup questions
      </h4>
    </div>
  );
};
