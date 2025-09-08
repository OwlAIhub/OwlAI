/**
 * Structured Response Renderer
 * Renders structured LLM responses as clean, organized study material
 */

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/buttons/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/cards/card';
import type {
  DefinitionSection,
  ExampleSection,
  FormulaSection,
  KeyPointsSection,
  ListSection,
  QuizSection,
  ResponseSection,
  StepByStepSection,
  StructuredResponse,
  TableSection,
} from '@/lib/types/response';
import { cn } from '@/lib/utils';
import {
  BarChart3,
  BookOpen,
  Calculator,
  Check,
  Copy,
  FileText,
  Lightbulb,
} from 'lucide-react';
import { useState } from 'react';

// ChatGPT exact minimal color scheme - smooth and clean
// const colors = {
//   background: '#ffffff',
//   text: '#374151',
//   textSecondary: '#6b7280',
//   textMuted: '#9ca3af',
//   accent: '#10a37f',
//   codeBackground: '#f8f9fa',
//   codeBorder: '#e5e7eb',
//   border: '#e5e7eb',
//   hover: '#f9fafb',
//   success: '#10a37f',
//   copyButton: '#f3f4f6',
// };

interface StructuredResponseRendererProps {
  response: StructuredResponse;
  className?: string;
}

// Copy to clipboard utility
const CopyButton = ({
  text,
  className,
}: {
  text: string;
  className?: string;
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <Button
      variant='ghost'
      size='sm'
      onClick={handleCopy}
      className={cn('h-8 w-8 p-0', className)}
    >
      {copied ? (
        <Check className='h-4 w-4 text-green-600' />
      ) : (
        <Copy className='h-4 w-4' />
      )}
    </Button>
  );
};

// Section renderers
const DefinitionSectionRenderer = ({
  section,
}: {
  section: DefinitionSection;
}) => (
  <Card className='border-l-4 border-l-blue-500'>
    <CardHeader className='pb-3'>
      <CardTitle className='flex items-center gap-2 text-lg'>
        <BookOpen className='h-5 w-5 text-blue-600' />
        {section.heading}
        <CopyButton text={section.content} />
      </CardTitle>
    </CardHeader>
    <CardContent className='space-y-3'>
      <p className='text-gray-700 leading-relaxed'>{section.content}</p>
      {section.keywords && (
        <div className='flex flex-wrap gap-2'>
          {section.keywords.map((keyword, index) => (
            <Badge key={index} variant='secondary' className='text-xs'>
              {keyword}
            </Badge>
          ))}
        </div>
      )}
    </CardContent>
  </Card>
);

const ListSectionRenderer = ({ section }: { section: ListSection }) => (
  <Card className='border-l-4 border-l-green-500'>
    <CardHeader className='pb-3'>
      <CardTitle className='flex items-center gap-2 text-lg'>
        <FileText className='h-5 w-5 text-green-600' />
        {section.heading}
      </CardTitle>
    </CardHeader>
    <CardContent>
      {section.listType === 'numbered' ? (
        <ol className='space-y-2'>
          {section.list.map((item, index) => (
            <li key={index} className='flex items-start gap-3'>
              <span className='flex-shrink-0 w-6 h-6 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-sm font-medium'>
                {index + 1}
              </span>
              <span className='text-gray-700 leading-relaxed'>{item}</span>
            </li>
          ))}
        </ol>
      ) : (
        <ul className='space-y-2'>
          {section.list.map((item, index) => (
            <li key={index} className='flex items-start gap-3'>
              <span className='flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2'></span>
              <span className='text-gray-700 leading-relaxed'>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </CardContent>
  </Card>
);

const TableSectionRenderer = ({ section }: { section: TableSection }) => (
  <Card className='border-l-4 border-l-purple-500'>
    <CardHeader className='pb-3'>
      <CardTitle className='flex items-center gap-2 text-lg'>
        <BarChart3 className='h-5 w-5 text-purple-600' />
        {section.heading}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className='overflow-x-auto'>
        <table className='w-full border-collapse border border-gray-200 rounded-lg'>
          <thead>
            <tr className='bg-gray-50'>
              {section.table.headers.map((header, index) => (
                <th
                  key={index}
                  className='border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-900'
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {section.table.rows.map((row, rowIndex) => (
              <tr key={rowIndex} className='hover:bg-gray-50'>
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className='border border-gray-200 px-4 py-3 text-sm text-gray-700'
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </CardContent>
  </Card>
);

const ExampleSectionRenderer = ({ section }: { section: ExampleSection }) => (
  <Card className='border-l-4 border-l-yellow-500'>
    <CardHeader className='pb-3'>
      <CardTitle className='flex items-center gap-2 text-lg'>
        <Lightbulb className='h-5 w-5 text-yellow-600' />
        {section.heading}
      </CardTitle>
    </CardHeader>
    <CardContent className='space-y-4'>
      {section.content && (
        <p className='text-gray-700 leading-relaxed'>{section.content}</p>
      )}
      <div className='space-y-3'>
        {section.examples.map((example, index) => (
          <div
            key={index}
            className='bg-yellow-50 p-3 rounded-lg border border-yellow-200'
          >
            <p className='text-sm text-gray-700'>{example}</p>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const QuizSectionRenderer = ({ section }: { section: QuizSection }) => (
  <Card className='border-l-4 border-l-indigo-500'>
    <CardHeader className='pb-3'>
      <CardTitle className='flex items-center gap-2 text-lg'>
        <FileText className='h-5 w-5 text-indigo-600' />
        {section.heading}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className='space-y-4'>
        {section.questions.map((question, index) => (
          <div key={index} className='border border-gray-200 rounded-lg p-4'>
            <p className='font-medium text-gray-900 mb-3'>
              ❓ {question.question}
            </p>
            {question.options && (
              <div className='space-y-2'>
                {question.options.map((option, optIndex) => (
                  <div key={optIndex} className='flex items-center gap-2'>
                    <span className='w-4 h-4 border border-gray-300 rounded'></span>
                    <span className='text-sm text-gray-700'>{option}</span>
                  </div>
                ))}
              </div>
            )}
            {question.answer && (
              <div className='mt-3 p-3 bg-green-50 rounded-lg border border-green-200'>
                <p className='text-sm font-medium text-green-800'>
                  Answer: {question.answer}
                </p>
                {question.explanation && (
                  <p className='text-sm text-green-700 mt-1'>
                    {question.explanation}
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const FormulaSectionRenderer = ({ section }: { section: FormulaSection }) => (
  <Card className='border-l-4 border-l-red-500'>
    <CardHeader className='pb-3'>
      <CardTitle className='flex items-center gap-2 text-lg'>
        <Calculator className='h-5 w-5 text-red-600' />
        {section.heading}
      </CardTitle>
    </CardHeader>
    <CardContent className='space-y-4'>
      <div className='bg-gray-900 text-white p-4 rounded-lg font-mono text-center'>
        <div className='text-lg'>{section.formula}</div>
      </div>

      <div className='space-y-2'>
        <h4 className='font-medium text-gray-900'>Variables:</h4>
        {section.variables.map((variable, index) => (
          <div key={index} className='flex items-center gap-3'>
            <Badge variant='outline' className='font-mono'>
              {variable.symbol}
            </Badge>
            <span className='text-sm text-gray-700'>
              {variable.description}
            </span>
          </div>
        ))}
      </div>

      {section.example && (
        <div className='bg-gray-50 p-4 rounded-lg'>
          <h4 className='font-medium text-gray-900 mb-2'>Example:</h4>
          <div className='space-y-2'>
            <p className='text-sm text-gray-700'>
              Given:{' '}
              {Object.entries(section.example.given)
                .map(([key, value]) => `${key} = ${value}`)
                .join(', ')}
            </p>
            <p className='text-sm font-medium text-gray-900'>
              Solution: {section.example.solution}
            </p>
          </div>
        </div>
      )}
    </CardContent>
  </Card>
);

const StepByStepSectionRenderer = ({
  section,
}: {
  section: StepByStepSection;
}) => (
  <Card className='border-l-4 border-l-teal-500'>
    <CardHeader className='pb-3'>
      <CardTitle className='flex items-center gap-2 text-lg'>
        <FileText className='h-5 w-5 text-teal-600' />
        {section.heading}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className='space-y-4'>
        {section.steps.map((step, index) => (
          <div key={index} className='flex gap-4'>
            <div className='flex-shrink-0 w-8 h-8 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center text-sm font-medium'>
              {step.step}
            </div>
            <div className='flex-1 space-y-2'>
              <h4 className='font-medium text-gray-900'>{step.title}</h4>
              <p className='text-sm text-gray-700 leading-relaxed'>
                {step.description}
              </p>
              {step.formula && (
                <div className='bg-gray-100 p-2 rounded font-mono text-sm'>
                  {step.formula}
                </div>
              )}
              {step.calculation && (
                <div className='bg-blue-50 p-2 rounded text-sm text-blue-800'>
                  {step.calculation}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const KeyPointsSectionRenderer = ({
  section,
}: {
  section: KeyPointsSection;
}) => (
  <Card className='border-l-4 border-l-orange-500'>
    <CardHeader className='pb-3'>
      <CardTitle className='flex items-center gap-2 text-lg'>
        <FileText className='h-5 w-5 text-orange-600' />
        {section.heading}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className='space-y-3'>
        {section.points.map((point, index) => (
          <div key={index} className='flex items-start gap-3'>
            <span className='flex-shrink-0 w-2 h-2 bg-orange-500 rounded-full mt-2'></span>
            <div className='flex-1'>
              <h4 className='font-medium text-gray-900'>{point.title}</h4>
              <p className='text-sm text-gray-700 leading-relaxed'>
                {point.description}
              </p>
              {point.importance && (
                <Badge
                  variant={
                    point.importance === 'high'
                      ? 'destructive'
                      : point.importance === 'medium'
                        ? 'default'
                        : 'secondary'
                  }
                  className='mt-1 text-xs'
                >
                  {point.importance}
                </Badge>
              )}
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

// Main section renderer
const SectionRenderer = ({ section }: { section: ResponseSection }) => {
  switch (section.type) {
    case 'definition':
      return (
        <DefinitionSectionRenderer section={section as DefinitionSection} />
      );
    case 'list':
      return <ListSectionRenderer section={section as ListSection} />;
    case 'table':
      return <TableSectionRenderer section={section as TableSection} />;
    case 'example':
      return <ExampleSectionRenderer section={section as ExampleSection} />;
    case 'quiz':
      return <QuizSectionRenderer section={section as QuizSection} />;
    case 'formula':
      return <FormulaSectionRenderer section={section as FormulaSection} />;
    case 'step-by-step':
      return (
        <StepByStepSectionRenderer section={section as StepByStepSection} />
      );
    case 'key-points':
      return <KeyPointsSectionRenderer section={section as KeyPointsSection} />;
    default:
      return (
        <Card>
          <CardContent className='p-4'>
            <p className='text-gray-700'>
              Unknown section type: {(section as ResponseSection).type}
            </p>
          </CardContent>
        </Card>
      );
  }
};

// Main renderer component
export function StructuredResponseRenderer({
  response,
  className,
}: StructuredResponseRendererProps) {
  return (
    <div className={cn('space-y-6 overflow-hidden', className)}>
      {/* Title */}
      <div className='text-center space-y-2'>
        <h1 className='text-3xl font-bold text-gray-900'>{response.title}</h1>
        {response.metadata && (
          <div className='flex items-center justify-center gap-4 text-sm text-gray-600'>
            {response.metadata.subject && (
              <Badge variant='outline'>{response.metadata.subject}</Badge>
            )}
            {response.metadata.difficulty && (
              <Badge variant='secondary'>{response.metadata.difficulty}</Badge>
            )}
            {response.metadata.estimatedTime && (
              <span>⏱️ {response.metadata.estimatedTime}</span>
            )}
          </div>
        )}
      </div>

      {/* Sections */}
      <div className='space-y-6'>
        {response.sections.map((section, index) => (
          <SectionRenderer key={index} section={section} />
        ))}
      </div>

      {/* Follow-up */}
      <Card className='border-l-4 border-l-gray-400 bg-gray-50'>
        <CardContent className='p-4'>
          <p className='text-sm text-gray-600 text-center'>
            Need more clarification? Ask me!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
