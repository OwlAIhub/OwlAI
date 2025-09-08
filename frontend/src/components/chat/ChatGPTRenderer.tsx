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
  FollowupComponent,
  FormulaComponent,
  KeyPointsComponent,
  MCQComponent,
  TheoryComponent,
} from './components/EducationalComponents';
import { splitIntoBlocks } from './utils/contentDetector';

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
  followup: FollowupComponent,
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

  // If useStructured is true, try to parse markdown to structured format
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
        'Failed to parse as structured response, falling back to markdown:',
        error
      );
    }
  }

  // Fallback to original markdown rendering
  const blocks = splitIntoBlocks(content as string);

  return (
    <div
      className={cn('prose prose-sm max-w-none', className)}
      style={{
        backgroundColor: 'transparent',
        color: colors.text,
        lineHeight: '1.6', // Smooth, readable line height
      }}
    >
      {blocks.map((block, index) => {
        const Component =
          ComponentMap[block.type as keyof typeof ComponentMap] ||
          ComponentMap.paragraph;

        // Special handling for headings to pass level
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
