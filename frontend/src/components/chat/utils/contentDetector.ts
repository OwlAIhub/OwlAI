/**
 * Content Type Detection Utilities
 * Detects different types of content in markdown text
 */

export type ContentType =
  | 'skip'
  | 'codeblock'
  | 'heading'
  | 'list'
  | 'blockquote'
  | 'table'
  | 'keypoints'
  | 'mcq'
  | 'formula'
  | 'diagram'
  | 'theory'
  | 'example'
  | 'followup'
  | 'paragraph';

/**
 * Detects the content type of a given text block
 */
export const detectContentType = (text: string): ContentType => {
  const trimmed = text.trim();

  // Skip markdown code block markers
  if (trimmed === '```' || trimmed === '```markdown' || trimmed === '```md') {
    return 'skip';
  }

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

  // Educational content types
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

  if (
    trimmed.includes('Next Steps') ||
    trimmed.includes('Need clarification') ||
    trimmed.includes('Ask me!')
  )
    return 'followup';

  return 'paragraph';
};

/**
 * Splits content into blocks based on content type
 */
export const splitIntoBlocks = (content: string) => {
  // Clean the content first
  const cleanedContent = cleanContent(content);
  const lines = cleanedContent.split('\n');
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

    // Skip markdown markers
    if (type === 'skip') {
      continue;
    }

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

/**
 * Cleans content from markdown artifacts
 */
export const cleanContent = (content: string) => {
  return content
    .replace(/^```markdown\s*\n?/gm, '') // Remove ```markdown at start
    .replace(/^```md\s*\n?/gm, '') // Remove ```md at start
    .replace(/^```\s*$/gm, '') // Remove standalone ```
    .replace(/\n```\s*$/gm, '') // Remove ``` at end of lines
    .replace(/```markdown/g, '') // Remove any remaining ```markdown
    .replace(/```md/g, '') // Remove any remaining ```md
    .replace(/```/g, '') // Remove any remaining ```
    .replace(/\*\*\*/g, '') // Remove any remaining ***
    .replace(/\*\*/g, '') // Remove any remaining **
    .trim();
};
