/**
 * Response Parser Utilities
 * Converts markdown content to structured response format
 */

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
} from '@/lib/types/response';

/**
 * Parses markdown content and converts it to structured response format
 */
export const parseMarkdownToStructured = (
  content: string
): StructuredResponse => {
  const lines = content.split('\n').filter(line => line.trim());

  // Extract title (first heading or first line)
  const title = extractTitle(lines);

  // Parse sections
  const sections = parseSections(lines);

  return {
    title,
    sections,
    metadata: {
      subject: 'General',
      difficulty: 'intermediate',
      estimatedTime: '5-10 minutes',
    },
  };
};

/**
 * Extracts title from content
 */
const extractTitle = (lines: string[]): string => {
  // Look for first heading
  const headingLine = lines.find(line => line.trim().startsWith('#'));
  if (headingLine) {
    return headingLine.replace(/^#+\s*/, '').trim();
  }

  // Fallback to first line
  return lines[0]?.trim() || 'Study Material';
};

/**
 * Parses sections from markdown content
 */
const parseSections = (lines: string[]): ResponseSection[] => {
  const sections: ResponseSection[] = [];
  let currentSection: any = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (!line) continue;

    // Check for headings
    if (line.startsWith('#')) {
      // Save previous section
      if (currentSection) {
        sections.push(currentSection);
      }

      // Start new section
      const heading = line.replace(/^#+\s*/, '').trim();
      currentSection = createSectionFromHeading(heading);
    } else if (currentSection) {
      // Add content to current section
      addContentToSection(currentSection, line);
    }
  }

  // Add last section
  if (currentSection) {
    sections.push(currentSection);
  }

  return sections;
};

/**
 * Creates a section based on heading content
 */
const createSectionFromHeading = (heading: string): ResponseSection => {
  const lowerHeading = heading.toLowerCase();

  if (lowerHeading.includes('definition') || lowerHeading.includes('concept')) {
    return {
      type: 'definition',
      heading,
      content: '',
      keywords: [],
    } as DefinitionSection;
  }

  if (lowerHeading.includes('formula') || lowerHeading.includes('equation')) {
    return {
      type: 'formula',
      heading,
      formula: '',
      variables: [],
    } as FormulaSection;
  }

  if (lowerHeading.includes('example') || lowerHeading.includes('case study')) {
    return {
      type: 'example',
      heading,
      content: '',
      examples: [],
    } as ExampleSection;
  }

  if (lowerHeading.includes('quiz') || lowerHeading.includes('question')) {
    return {
      type: 'quiz',
      heading,
      questions: [],
    } as QuizSection;
  }

  if (lowerHeading.includes('step') || lowerHeading.includes('solution')) {
    return {
      type: 'step-by-step',
      heading,
      steps: [],
    } as StepByStepSection;
  }

  if (
    lowerHeading.includes('key point') ||
    lowerHeading.includes('important')
  ) {
    return {
      type: 'key-points',
      heading,
      points: [],
    } as KeyPointsSection;
  }

  // Default to list section
  return {
    type: 'list',
    heading,
    list: [],
    listType: 'bullets',
  } as ListSection;
};

/**
 * Adds content to the current section
 */
const addContentToSection = (section: ResponseSection, line: string): void => {
  switch (section.type) {
    case 'definition':
      if (section.content) {
        section.content += ' ' + line;
      } else {
        section.content = line;
      }
      break;

    case 'list':
      if (line.startsWith('- ') || line.startsWith('* ')) {
        (section as ListSection).list.push(line.replace(/^[-*]\s*/, '').trim());
      } else if (/^\d+\./.test(line)) {
        (section as ListSection).list.push(
          line.replace(/^\d+\.\s*/, '').trim()
        );
        (section as ListSection).listType = 'numbered';
      }
      break;

    case 'example':
      if (line.startsWith('- ') || line.startsWith('* ')) {
        (section as ExampleSection).examples.push(
          line.replace(/^[-*]\s*/, '').trim()
        );
      } else if (!(section as ExampleSection).content) {
        (section as ExampleSection).content = line;
      }
      break;

    case 'quiz':
      if (line.startsWith('Q') || line.includes('?')) {
        (section as QuizSection).questions.push({
          question: line,
          options: [],
          answer: '',
          explanation: '',
        });
      }
      break;

    case 'step-by-step':
      if (/^\d+\./.test(line)) {
        const stepNumber = parseInt(line.match(/^(\d+)\./)?.[1] || '1');
        (section as StepByStepSection).steps.push({
          step: stepNumber,
          title: line.replace(/^\d+\.\s*/, '').trim(),
          description: '',
          formula: '',
          calculation: '',
        });
      }
      break;

    case 'key-points':
      if (line.startsWith('- ') || line.startsWith('* ')) {
        (section as KeyPointsSection).points.push({
          title: line.replace(/^[-*]\s*/, '').trim(),
          description: '',
          importance: 'medium',
        });
      }
      break;
  }
};

/**
 * Example structured response for Simple Interest
 */
export const createSimpleInterestResponse = (): StructuredResponse => ({
  title: 'Simple Interest',
  sections: [
    {
      type: 'definition',
      heading: 'Definition',
      content:
        'Simple Interest is a method of calculating the interest charged or earned on a principal amount over a specific period at a fixed rate. Unlike compound interest, simple interest does not take into account the interest on previously earned interest.',
      keywords: ['Principal', 'Rate', 'Time', 'Interest'],
    },
    {
      type: 'formula',
      heading: 'Key Formula',
      formula: 'SI = (P × R × T) / 100',
      variables: [
        { symbol: 'P', description: 'Principal amount (initial investment)' },
        { symbol: 'R', description: 'Rate of interest per annum' },
        { symbol: 'T', description: 'Time (in years)' },
      ],
      example: {
        given: { P: '₹10,000', R: '5%', T: '3 years' },
        solution: 'SI = (10,000 × 5 × 3) / 100 = ₹1,500',
      },
    },
    {
      type: 'step-by-step',
      heading: 'Step-by-Step Solution',
      steps: [
        {
          step: 1,
          title: 'Identify Given Values',
          description:
            'Principal (P) = ₹10,000, Rate (R) = 5%, Time (T) = 3 years',
        },
        {
          step: 2,
          title: 'Apply Formula',
          description: 'Use the formula: SI = (P × R × T) / 100',
          formula: 'SI = (10,000 × 5 × 3) / 100',
        },
        {
          step: 3,
          title: 'Calculate',
          description: 'Perform the calculation',
          calculation: 'SI = 150,000 / 100 = ₹1,500',
        },
      ],
    },
    {
      type: 'key-points',
      heading: 'Key Points',
      points: [
        {
          title: 'Formula',
          description: 'SI = (P × R × T) / 100',
          importance: 'high',
        },
        {
          title: 'No Compounding',
          description: 'Simple interest does not compound over time',
          importance: 'high',
        },
        {
          title: 'Linear Growth',
          description: 'Interest grows linearly with time',
          importance: 'medium',
        },
      ],
    },
    {
      type: 'quiz',
      heading: 'Quick Quiz',
      questions: [
        {
          question:
            'What is the simple interest on ₹15,000 at a rate of 6% for 4 years?',
          answer: '₹3,600',
          explanation: 'SI = (15,000 × 6 × 4) / 100 = 3,600',
        },
        {
          question: 'How does simple interest differ from compound interest?',
          answer:
            'Simple interest does not compound, while compound interest includes interest on previously earned interest',
        },
      ],
    },
  ],
  metadata: {
    subject: 'Mathematics',
    difficulty: 'beginner',
    estimatedTime: '5 minutes',
    tags: ['interest', 'finance', 'mathematics'],
  },
});
