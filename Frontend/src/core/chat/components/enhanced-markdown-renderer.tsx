import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  tomorrow,
  oneDark,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check, ExternalLink, Download } from "lucide-react";

// Import KaTeX CSS for math rendering
import "katex/dist/katex.min.css";

interface EnhancedMarkdownRendererProps {
  content: string;
  darkMode?: boolean;
  className?: string;
  onCopy?: (text: string) => void;
}

export const EnhancedMarkdownRenderer: React.FC<
  EnhancedMarkdownRendererProps
> = ({ content, darkMode = false, className = "", onCopy }) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = async (code: string, language: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(`${language}-${Date.now()}`);
      onCopy?.(code);

      // Reset copied state after 2 seconds
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (error) {
      console.error("Failed to copy code:", error);
    }
  };

  const getSyntaxHighlighterStyle = () => {
    return darkMode ? oneDark : tomorrow;
  };

  const getLanguageFromClassName = (className: string): string => {
    const match = /language-(\w+)/.exec(className);
    return match ? match[1] : "text";
  };

  const getLanguageDisplayName = (language: string): string => {
    const languageMap: Record<string, string> = {
      js: "JavaScript",
      jsx: "React JSX",
      ts: "TypeScript",
      tsx: "React TSX",
      py: "Python",
      java: "Java",
      cpp: "C++",
      c: "C",
      cs: "C#",
      php: "PHP",
      rb: "Ruby",
      go: "Go",
      rs: "Rust",
      swift: "Swift",
      kt: "Kotlin",
      scala: "Scala",
      sql: "SQL",
      html: "HTML",
      css: "CSS",
      scss: "SCSS",
      sass: "Sass",
      json: "JSON",
      yaml: "YAML",
      yml: "YAML",
      xml: "XML",
      md: "Markdown",
      bash: "Bash",
      sh: "Shell",
      ps: "PowerShell",
      dockerfile: "Dockerfile",
      gitignore: "Git Ignore",
    };

    return languageMap[language.toLowerCase()] || language;
  };

  return (
    <div className={`prose max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          // Enhanced headings with your green theme
          h1: ({ children, ...props }) => (
            <h1
              className="text-3xl font-bold mb-6 mt-8 border-b-2 border-[#52B788] pb-4 flex items-center gap-3 text-gray-900 dark:text-white"
              {...props}
            >
              <span className="text-[#52B788] text-4xl">📋</span>
              {children}
            </h1>
          ),
          h2: ({ children, ...props }) => (
            <h2
              className="text-2xl font-bold mb-5 mt-7 border-l-4 border-[#52B788] pl-4 flex items-center gap-3 text-gray-900 dark:text-white"
              {...props}
            >
              <span className="text-[#52B788] text-2xl">🔹</span>
              {children}
            </h2>
          ),
          h3: ({ children, ...props }) => (
            <h3
              className="text-xl font-semibold mb-4 mt-6 flex items-center gap-2 text-gray-900 dark:text-white"
              {...props}
            >
              <span className="text-[#52B788] text-xl">•</span>
              {children}
            </h3>
          ),
          h4: ({ children, ...props }) => (
            <h4
              className="text-lg font-semibold mb-3 mt-5 text-gray-900 dark:text-white"
              {...props}
            >
              {children}
            </h4>
          ),
          h5: ({ children, ...props }) => (
            <h5
              className="text-base font-semibold mb-2 mt-4 text-gray-900 dark:text-white"
              {...props}
            >
              {children}
            </h5>
          ),
          h6: ({ children, ...props }) => (
            <h6
              className="text-sm font-semibold mb-2 mt-3 text-gray-900 dark:text-white"
              {...props}
            >
              {children}
            </h6>
          ),

          // Enhanced paragraphs
          p: ({ children, ...props }) => (
            <p
              className="text-gray-700 dark:text-gray-300 mb-4 leading-7 text-base"
              {...props}
            >
              {children}
            </p>
          ),

          // Enhanced lists
          ul: ({ ...props }) => (
            <ul className="list-none space-y-3 mb-6" {...props} />
          ),
          ol: ({ ...props }) => (
            <ol
              className="list-decimal list-inside space-y-3 mb-6 ml-4"
              {...props}
            />
          ),
          li: ({ children, ...props }) => (
            <li
              className="text-gray-700 dark:text-gray-300 leading-7 flex items-start gap-3"
              {...props}
            >
              <span className="mt-2.5 w-2 h-2 bg-[#52B788] rounded-full flex-shrink-0"></span>
              <span className="flex-1">{children}</span>
            </li>
          ),

          // Enhanced text formatting
          strong: ({ children, ...props }) => (
            <strong
              className="font-bold text-gray-900 dark:text-white"
              {...props}
            >
              {children}
            </strong>
          ),
          em: ({ children, ...props }) => (
            <em className="italic text-gray-600 dark:text-gray-400" {...props}>
              {children}
            </em>
          ),
          del: ({ children, ...props }) => (
            <del
              className="line-through text-gray-500 dark:text-gray-500"
              {...props}
            >
              {children}
            </del>
          ),

          // Enhanced code blocks with syntax highlighting
          code: ({ inline, children, className, ...props }: any) => {
            const language = getLanguageFromClassName(className || "");
            const codeString = String(children).replace(/\n$/, "");
            const isCopied = copiedCode === `${language}-${Date.now()}`;

            if (inline) {
              return (
                <code
                  className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm font-mono text-gray-800 dark:text-gray-200 border"
                  {...props}
                >
                  {children}
                </code>
              );
            }

            return (
              <div className="relative my-6 group">
                {/* Language label */}
                <div className="absolute top-0 left-0 bg-[#52B788] text-white px-3 py-1 rounded-t-lg text-xs font-medium z-10">
                  {getLanguageDisplayName(language)}
                </div>

                {/* Code block */}
                <div className="pt-8">
                  <SyntaxHighlighter
                    style={getSyntaxHighlighterStyle()}
                    language={language}
                    PreTag="div"
                    className="rounded-lg !mt-0"
                    customStyle={{
                      margin: 0,
                      borderRadius: "8px",
                      fontSize: "14px",
                      lineHeight: "1.5",
                    }}
                    showLineNumbers={codeString.split("\n").length > 5}
                    wrapLines={true}
                    lineNumberStyle={{
                      color: darkMode ? "#6B7280" : "#9CA3AF",
                      fontSize: "12px",
                    }}
                  >
                    {codeString}
                  </SyntaxHighlighter>
                </div>

                {/* Copy button */}
                <button
                  onClick={() => handleCopyCode(codeString, language)}
                  className="absolute top-2 right-2 p-2 bg-gray-800 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-700"
                  title="Copy code"
                >
                  {isCopied ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>

                {/* Download button for longer code blocks */}
                {codeString.length > 500 && (
                  <button
                    onClick={() => {
                      const blob = new Blob([codeString], {
                        type: "text/plain",
                      });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `code.${language}`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="absolute top-2 right-12 p-2 bg-gray-800 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-700"
                    title="Download code"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                )}
              </div>
            );
          },

          // Enhanced blockquotes
          blockquote: ({ children, ...props }) => (
            <blockquote
              className="border-l-4 border-[#52B788] pl-6 py-4 my-6 bg-blue-50 dark:bg-blue-900/20 rounded-r-lg italic"
              {...props}
            >
              <div className="text-gray-700 dark:text-gray-300">{children}</div>
            </blockquote>
          ),

          // Enhanced tables
          table: ({ ...props }) => (
            <div className="overflow-x-auto my-6">
              <table
                className="min-w-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm"
                {...props}
              />
            </div>
          ),
          thead: ({ ...props }) => (
            <thead className="bg-gray-50 dark:bg-gray-700" {...props} />
          ),
          tbody: ({ ...props }) => (
            <tbody className="bg-white dark:bg-gray-800" {...props} />
          ),
          tr: ({ ...props }) => (
            <tr
              className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              {...props}
            />
          ),
          th: ({ children, ...props }) => (
            <th
              className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-700"
              {...props}
            >
              {children}
            </th>
          ),
          td: ({ children, ...props }) => (
            <td
              className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200 border-r border-gray-200 dark:border-gray-700"
              {...props}
            >
              {children}
            </td>
          ),

          // Enhanced links
          a: ({ href, children, ...props }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#52B788] hover:text-[#40916C] underline decoration-2 underline-offset-2 transition-colors inline-flex items-center gap-1"
              {...props}
            >
              {children}
              <ExternalLink className="w-3 h-3" />
            </a>
          ),

          // Enhanced horizontal rules
          hr: ({ ...props }) => (
            <hr className="my-8 border-t-2 border-[#52B788]/20" {...props} />
          ),

          // Enhanced images
          img: ({ src, alt, ...props }) => (
            <div className="my-6">
              <img
                src={src}
                alt={alt}
                className="max-w-full h-auto rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
                loading="lazy"
                {...props}
              />
              {alt && (
                <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
                  {alt}
                </p>
              )}
            </div>
          ),

          // Enhanced checkboxes for task lists
          input: ({ type, checked, ...props }) => {
            if (type === "checkbox") {
              return (
                <input
                  type="checkbox"
                  checked={checked}
                  className="w-4 h-4 text-[#52B788] bg-gray-100 border-gray-300 rounded focus:ring-[#52B788] focus:ring-2"
                  readOnly
                  {...props}
                />
              );
            }
            return <input type={type} {...props} />;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
