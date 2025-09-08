/**
 * Structured Response Types
 * Defines the standard structure for LLM responses to ensure consistent UI rendering
 */

export interface StructuredResponse {
  title: string;
  sections: ResponseSection[];
  metadata?: {
    subject?: string;
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
    estimatedTime?: string;
    tags?: string[];
  };
}

export type ResponseSection =
  | DefinitionSection
  | ListSection
  | TableSection
  | ExampleSection
  | QuizSection
  | FormulaSection
  | DiagramSection
  | StepByStepSection
  | KeyPointsSection;

export interface BaseSection {
  heading: string;
  type: string;
}

export interface DefinitionSection extends BaseSection {
  type: 'definition';
  content: string;
  keywords?: string[];
}

export interface ListSection extends BaseSection {
  type: 'list';
  list: string[];
  listType?: 'bullets' | 'numbered';
}

export interface TableSection extends BaseSection {
  type: 'table';
  table: {
    headers: string[];
    rows: string[][];
  };
}

export interface ExampleSection extends BaseSection {
  type: 'example';
  content: string;
  examples: string[];
}

export interface QuizSection extends BaseSection {
  type: 'quiz';
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  question: string;
  options?: string[];
  answer?: string;
  explanation?: string;
}

export interface FormulaSection extends BaseSection {
  type: 'formula';
  formula: string;
  variables: {
    symbol: string;
    description: string;
  }[];
  example?: {
    given: Record<string, string>;
    solution: string;
  };
}

export interface DiagramSection extends BaseSection {
  type: 'diagram';
  description: string;
  diagramType: 'mermaid' | 'flowchart' | 'graph' | 'chart';
  content: string;
}

export interface StepByStepSection extends BaseSection {
  type: 'step-by-step';
  steps: {
    step: number;
    title: string;
    description: string;
    formula?: string;
    calculation?: string;
  }[];
}

export interface KeyPointsSection extends BaseSection {
  type: 'key-points';
  points: {
    title: string;
    description: string;
    importance?: 'high' | 'medium' | 'low';
  }[];
}

// Utility type for section type checking
export type SectionType = ResponseSection['type'];

// Helper function to check if a response is structured
export const isStructuredResponse = (data: any): data is StructuredResponse => {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof data.title === 'string' &&
    Array.isArray(data.sections) &&
    data.sections.every(
      (section: any) =>
        typeof section === 'object' &&
        typeof section.heading === 'string' &&
        typeof section.type === 'string'
    )
  );
};
