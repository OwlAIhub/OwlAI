import React from "react";

// A helper to parse custom component data from a code block
const parseComponentProps = (jsonString: string) => {
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    console.error("Failed to parse component JSON:", e);
    return null;
  }
};

// Enhanced CodeBlock component for educational content
const CodeBlock = ({
  language,
  children,
}: {
  language?: string;
  children: string;
}) => (
  <div className="my-8 border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white">
    {language && (
      <div className="bg-gradient-to-r from-gray-100 to-gray-50 text-gray-800 px-4 py-3 text-sm font-semibold border-b border-gray-200 flex items-center gap-2">
        <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
        <span className="uppercase tracking-wide">{language}</span>
      </div>
    )}
    <pre className="bg-gray-50/50 text-gray-900 p-6 overflow-x-auto text-sm leading-loose hover:bg-gray-50 transition-colors">
      <code className="font-mono text-gray-800">{children}</code>
    </pre>
  </div>
);

// Simple MCQ component placeholder
const MCQComponent = (props: {
  question?: string;
  options?: string[];
  correctAnswer?: number;
  explanation?: string;
}) => (
  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 my-4">
    <p className="text-gray-600">
      MCQ Component:{" "}
      {props.question || "Interactive quiz will be rendered here"}
    </p>
  </div>
);

// Simple Chart component placeholder
const ChartComponent = (props: {
  type?: string;
  title?: string;
  data?: Record<string, unknown>;
}) => (
  <div className="my-6 p-4 border border-gray-300">
    <p className="text-gray-600">
      Chart Component: {props.title || "Chart will be rendered here"}
    </p>
  </div>
);

// Simple Mermaid component placeholder
const MermaidComponent = ({ chart }: { chart: string }) => (
  <div className="my-6 p-4 border border-gray-300 text-center">
    <p className="text-gray-600">
      Mermaid Diagram: {chart.substring(0, 50)}...
    </p>
  </div>
);

export const renderers = {
  // Handle all code blocks (both inline and block-level)
  code: ({
    className,
    children,
  }: {
    className?: string;
    children?: React.ReactNode;
  }) => {
    const language = className?.replace("language-", "");
    const codeString = String(children).trim();

    // Render custom components based on language
    switch (language) {
      case "mcq": {
        const props = parseComponentProps(codeString);
        return props ? <MCQComponent {...props} /> : null;
      }
      case "chart": {
        const props = parseComponentProps(codeString);
        return props ? <ChartComponent {...props} /> : null;
      }
      case "mermaid":
        return <MermaidComponent chart={codeString} />;
      default:
        // Render a standard code block
        return <CodeBlock language={language}>{codeString}</CodeBlock>;
    }
  },

  // Handle styled paragraphs for educational content
  p: ({ children }: { children?: React.ReactNode }) => {
    const text = String(children);

    // Definition blocks - Enhanced for educational content
    if (text.startsWith("Definition:")) {
      return (
        <div className="border-l-4 border-blue-500 bg-blue-50/50 rounded-r-lg pl-6 pr-4 py-4 my-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-blue-800 font-bold text-sm uppercase tracking-wide">Definition</span>
          </div>
          <p className="text-gray-900 text-base leading-relaxed font-medium">
            {String(children).replace(/^Definition:\s*/, '')}
          </p>
        </div>
      );
    }

    // Key Points - Enhanced
    if (text.startsWith("Key Points:")) {
      return (
        <div className="border-l-4 border-green-500 bg-green-50/50 rounded-r-lg pl-6 pr-4 py-4 my-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-green-800 font-bold text-sm uppercase tracking-wide">Key Points</span>
          </div>
          <p className="text-gray-900 text-base leading-relaxed font-medium">
            {String(children).replace(/^Key Points:\s*/, '')}
          </p>
        </div>
      );
    }

    // Theory/Theoretical Framework - Enhanced
    if (
      text.startsWith("Theory:") ||
      text.startsWith("Theoretical Framework:")
    ) {
      return (
        <div className="border-l-4 border-purple-500 bg-purple-50/50 rounded-r-lg pl-6 pr-4 py-4 my-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span className="text-purple-800 font-bold text-sm uppercase tracking-wide">Theory</span>
          </div>
          <p className="text-gray-900 text-base leading-relaxed">
            {String(children).replace(/^(Theory:|Theoretical Framework:)\s*/, '')}
          </p>
        </div>
      );
    }

    // Examples - Enhanced
    if (text.startsWith("Example:")) {
      return (
        <div className="border-l-4 border-orange-500 bg-orange-50/50 rounded-r-lg pl-6 pr-4 py-4 my-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            <span className="text-orange-800 font-bold text-sm uppercase tracking-wide">Example</span>
          </div>
          <p className="text-gray-900 text-base leading-relaxed font-medium">
            {String(children).replace(/^Example:\s*/, '')}
          </p>
        </div>
      );
    }

    // Important Notes - Enhanced
    if (text.startsWith("Important:") || text.startsWith("Note:")) {
      return (
        <div className="border-l-4 border-red-500 bg-red-50/50 rounded-r-lg pl-6 pr-4 py-4 my-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="text-red-800 font-bold text-sm uppercase tracking-wide">Important</span>
          </div>
          <p className="text-gray-900 text-base leading-relaxed font-semibold">
            {String(children).replace(/^(Important:|Note:)\s*/, '')}
          </p>
        </div>
      );
    }

    // Summary/Conclusion - Enhanced
    if (text.startsWith("Summary:") || text.startsWith("Conclusion:")) {
      return (
        <div className="border-l-4 border-indigo-500 bg-indigo-50/50 rounded-r-lg pl-6 pr-4 py-4 my-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
            <span className="text-indigo-800 font-bold text-sm uppercase tracking-wide">Summary</span>
          </div>
          <p className="text-gray-900 text-base leading-relaxed font-medium">
            {String(children).replace(/^(Summary:|Conclusion:)\s*/, '')}
          </p>
        </div>
      );
    }

    // Default paragraph
    return (
      <p className="mb-4 leading-relaxed text-gray-900 text-base">{children}</p>
    );
  },

  // Clean Headers for educational content
  h1: ({ children }: { children?: React.ReactNode }) => (
    <h1 className="text-xl font-bold text-gray-900 mt-6 mb-4 pb-2 border-b border-gray-400">
      {children}
    </h1>
  ),
  h2: ({ children }: { children?: React.ReactNode }) => (
    <h2 className="text-lg font-semibold text-gray-800 mt-5 mb-3 pb-1 border-b border-gray-300">
      {children}
    </h2>
  ),
  h3: ({ children }: { children?: React.ReactNode }) => (
    <h3 className="text-base font-semibold text-gray-700 mt-4 mb-2">
      {children}
    </h3>
  ),
  h4: ({ children }: { children?: React.ReactNode }) => (
    <h4 className="text-base font-medium text-gray-700 mt-3 mb-2">
      {children}
    </h4>
  ),

  // Enhanced Lists for educational content
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className="list-none pl-6 my-6 space-y-3 text-gray-900">{children}</ul>
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol className="list-none pl-6 my-6 space-y-3 text-gray-900 counter-reset-[list-counter]">
      {children}
    </ol>
  ),
  li: ({ children }: { children?: React.ReactNode }) => (
    <li className="relative text-gray-900 leading-relaxed text-base py-2 pl-8 before:content-['•'] before:absolute before:left-0 before:top-2 before:text-primary before:text-lg before:font-bold">
      {children}
    </li>
  ),

  // Enhanced Educational Tables
  table: ({ children }: { children?: React.ReactNode }) => (
    <div className="overflow-x-auto my-8 border border-gray-200 rounded-xl shadow-sm bg-white">
      <table className="min-w-full divide-y divide-gray-200">{children}</table>
    </div>
  ),
  thead: ({ children }: { children?: React.ReactNode }) => (
    <thead className="bg-gradient-to-r from-primary/5 to-primary/10">
      {children}
    </thead>
  ),
  tbody: ({ children }: { children?: React.ReactNode }) => (
    <tbody className="bg-white divide-y divide-gray-100">{children}</tbody>
  ),
  th: ({ children }: { children?: React.ReactNode }) => (
    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 tracking-wide border-b-2 border-primary/20">
      {children}
    </th>
  ),
  td: ({ children }: { children?: React.ReactNode }) => (
    <td className="px-6 py-5 text-sm text-gray-800 leading-relaxed border-b border-gray-50 hover:bg-gray-25 transition-colors">
      {children}
    </td>
  ),
  tr: ({ children }: { children?: React.ReactNode }) => (
    <tr className="hover:bg-gray-50/50 transition-colors duration-150">
      {children}
    </tr>
  ),

  // Other elements
  blockquote: ({ children }: { children?: React.ReactNode }) => (
    <blockquote className="border-l-4 border-gray-300 pl-4 my-4 italic text-gray-600">
      {children}
    </blockquote>
  ),

  // Links
  a: (props: { href?: string; children?: React.ReactNode }) => (
    <a
      href={props.href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 hover:text-blue-800 underline"
    >
      {props.children}
    </a>
  ),

  // Strong and emphasis
  strong: ({ children }: { children?: React.ReactNode }) => (
    <strong className="font-medium text-gray-800">{children}</strong>
  ),
  em: ({ children }: { children?: React.ReactNode }) => (
    <em className="italic text-gray-600">{children}</em>
  ),
};
