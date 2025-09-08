/**
 * ChatGPT-style Markdown Renderer
 * Clean, modular, and properly structured renderer for educational content
 */

import { cn } from '@/lib/utils';
import {
  StructuredResponse,
  isStructuredResponse,
} from '../../lib/types/response';
import { parseMarkdownToStructured } from '../../lib/utils/responseParser';
import { StructuredResponseRenderer } from './StructuredResponseRenderer';
import {
  BlockquoteComponent,
  HeadingComponent,
  ListComponent,
  ParagraphComponent,
  TableComponent,
} from './components/BasicComponents';
import { CodeBlock } from './components/CodeBlock';
import {
  DiagramComponent,
  ExampleComponent,
  FormulaComponent,
  KeyPointsComponent,
  MCQComponent,
  TheoryComponent,
} from './components/EducationalComponents';

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

// Component mapping for different content types
const ComponentMap = {
  heading: HeadingComponent,
  paragraph: ParagraphComponent,
  list: ListComponent,
  blockquote: BlockquoteComponent,
  table: TableComponent,
  codeblock: CodeBlock,
  mcq: MCQComponent,
  keypoints: KeyPointsComponent,
  formula: FormulaComponent,
  diagram: DiagramComponent,
  theory: TheoryComponent,
  example: ExampleComponent,
};

// Helper function to extract heading level
const getHeadingLevel = (content: string): number => {
  const match = content.match(/^(#+)/);
  return match ? match[1].length : 1;
};

interface ChatGPTRendererProps {
  content: string | StructuredResponse;
  className?: string;
  useStructured?: boolean;
}

// Optimized content type detection with memoization
const detectContentTypeOptimized = (() => {
  const cache = new Map<string, string>();

  return (line: string): string => {
    if (cache.has(line)) {
      return cache.get(line)!;
    }

    let type = 'paragraph';

    // Optimized detection with early returns
    if (line.startsWith('```')) {
      type = 'codeblock';
    } else if (line.startsWith('#')) {
      type = 'heading';
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      type = 'list';
    } else if (/^\d+\./.test(line)) {
      type = 'list';
    } else if (line.startsWith('>')) {
      type = 'blockquote';
    } else if (line.includes('|')) {
      type = 'table';
    } else if (
      line.includes('Key Points:') ||
      line.includes('Functions of') ||
      line.includes('Steps in') ||
      line.includes('Key Features/Characteristics')
    ) {
      type = 'keypoints';
    } else if (line.includes('Question:') || /^[A-D]\)/.test(line)) {
      type = 'mcq';
    } else if (line.includes('Formula:') || line.includes('Equation:')) {
      type = 'formula';
    } else if (line.includes('Example:') || line.includes('Case Study:')) {
      type = 'example';
    }

    cache.set(line, type);
    return type;
  };
})();

// Optimized block parsing with streaming
const parseContentOptimized = (content: string) => {
  const lines = content.split('\n');
  const blocks: Array<{ type: string; content: string }> = [];

  let currentBlock = '';
  let currentType = 'paragraph';
  let inTable = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (!line) {
      if (currentBlock.trim()) {
        currentBlock += '\n';
      }
      continue;
    }

    const type = detectContentTypeOptimized(line);

    // Special handling for tables - keep table lines together
    if (type === 'table') {
      if (!inTable) {
        // Start of a new table
        if (currentBlock.trim()) {
          blocks.push({ type: currentType, content: currentBlock.trim() });
        }
        currentBlock = line;
        currentType = 'table';
        inTable = true;
      } else {
        // Continue building the table
        currentBlock += '\n' + line;
      }
    } else {
      // End of table or other content
      if (inTable && type !== 'table') {
        blocks.push({ type: currentType, content: currentBlock.trim() });
        currentBlock = line;
        currentType = type;
        inTable = false;
      } else if (type !== currentType && currentBlock.trim()) {
        blocks.push({ type: currentType, content: currentBlock.trim() });
        currentBlock = line;
        currentType = type;
      } else {
        currentBlock += (currentBlock ? '\n' : '') + line;
      }
    }
  }

  if (currentBlock.trim()) {
    blocks.push({ type: currentType, content: currentBlock.trim() });
  }

  return blocks;
};

export function ChatGPTRenderer({
  content,
  className,
  useStructured = false,
}: ChatGPTRendererProps) {
  // Check if content is already a structured response
  if (typeof content === 'object' && isStructuredResponse(content)) {
    return (
      <StructuredResponseRenderer response={content} className={className} />
    );
  }

  // Optimized structured parsing with error handling
  if (useStructured && typeof content === 'string') {
    try {
      const structuredResponse = parseMarkdownToStructured(content);
      return (
        <StructuredResponseRenderer
          response={structuredResponse}
          className={className}
        />
      );
    } catch (error) {
      console.warn(
        'Structured parsing failed, using optimized markdown:',
        error
      );
    }
  }

  // Production-level optimized markdown rendering
  const blocks = parseContentOptimized(content as string);

  return (
    <div
      className={cn('prose prose-sm max-w-none overflow-hidden', className)}
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

        if (block.type === 'heading') {
          const level = getHeadingLevel(block.content);
          return (
            <HeadingComponent
              key={index}
              content={block.content}
              level={level}
            />
          );
        }

        return <Component key={index} content={block.content} level={0} />;
      })}
    </div>
  );
}
