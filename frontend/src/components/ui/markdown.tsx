'use client';

import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, LineElement, PointElement } from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import mermaid from 'mermaid';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Check, X, ChevronDown, ChevronUp } from 'lucide-react';
import 'katex/dist/katex.min.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement
);

// Initialize Mermaid
mermaid.initialize({
  startOnLoad: true,
  theme: 'default',
  securityLevel: 'loose',
});

interface MarkdownProps {
  content: string;
  className?: string;
}

// MCQ Component
interface MCQProps {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

function MCQComponent({ question, options, correctAnswer, explanation }: MCQProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleSubmit = () => {
    if (selectedAnswer !== null) {
      setShowResult(true);
    }
  };

  const isCorrect = selectedAnswer === correctAnswer;

  return (
    <div className='bg-blue-50 border border-blue-200 rounded-xl p-6 my-6'>
      <h4 className='font-bold text-gray-900 mb-4 text-lg'>{question}</h4>
      <div className='space-y-3 mb-4'>
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => !showResult && setSelectedAnswer(index)}
            disabled={showResult}
            className={cn(
              'w-full text-left p-4 rounded-lg border-2 transition-all duration-200',
              selectedAnswer === index
                ? showResult
                  ? index === correctAnswer
                    ? 'border-green-500 bg-green-50 text-green-800'
                    : 'border-red-500 bg-red-50 text-red-800'
                  : 'border-blue-500 bg-blue-100 text-blue-800'
                : showResult && index === correctAnswer
                ? 'border-green-500 bg-green-50 text-green-800'
                : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
            )}
          >
            <div className='flex items-center gap-3'>
              <div className={cn(
                'w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-bold',
                selectedAnswer === index
                  ? showResult
                    ? index === correctAnswer
                      ? 'border-green-500 bg-green-500 text-white'
                      : 'border-red-500 bg-red-500 text-white'
                    : 'border-blue-500 bg-blue-500 text-white'
                  : showResult && index === correctAnswer
                  ? 'border-green-500 bg-green-500 text-white'
                  : 'border-gray-300'
              )}>
                {showResult && selectedAnswer === index && index !== correctAnswer ? (
                  <X className='w-3 h-3' />
                ) : showResult && index === correctAnswer ? (
                  <Check className='w-3 h-3' />
                ) : (
                  String.fromCharCode(65 + index)
                )}
              </div>
              <span className='flex-1'>{option}</span>
            </div>
          </button>
        ))}
      </div>
      
      {!showResult && (
        <Button
          onClick={handleSubmit}
          disabled={selectedAnswer === null}
          className='w-full bg-blue-600 hover:bg-blue-700 text-white'
        >
          Submit Answer
        </Button>
      )}
      
      {showResult && (
        <div className='mt-4'>
          <div className={cn(
            'p-4 rounded-lg mb-4',
            isCorrect ? 'bg-green-100 border border-green-200' : 'bg-red-100 border border-red-200'
          )}>
            <div className='flex items-center gap-2 mb-2'>
              {isCorrect ? (
                <Check className='w-5 h-5 text-green-600' />
              ) : (
                <X className='w-5 h-5 text-red-600' />
              )}
              <span className={cn(
                'font-semibold',
                isCorrect ? 'text-green-800' : 'text-red-800'
              )}>
                {isCorrect ? 'Correct!' : 'Incorrect'}
              </span>
            </div>
            {!isCorrect && (
              <p className='text-red-700'>
                The correct answer is: <strong>{String.fromCharCode(65 + correctAnswer)}) {options[correctAnswer]}</strong>
              </p>
            )}
          </div>
          
          {explanation && (
            <div>
              <Button
                variant='outline'
                onClick={() => setShowExplanation(!showExplanation)}
                className='mb-3 text-blue-600 border-blue-200 hover:bg-blue-50'
              >
                {showExplanation ? <ChevronUp className='w-4 h-4 mr-2' /> : <ChevronDown className='w-4 h-4 mr-2' />}
                {showExplanation ? 'Hide' : 'Show'} Explanation
              </Button>
              {showExplanation && (
                <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
                  <p className='text-blue-800'>{explanation}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Chart Component
interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }[];
  title?: string;
}

function ChartComponent({ type, data, options }: { type: string; data: ChartData; options?: Record<string, unknown> }) {
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: data.title || 'Chart',
      },
    },
  };

  const chartOptions = { ...defaultOptions, ...options };

  return (
    <div className='bg-white border border-gray-200 rounded-xl p-6 my-6'>
      <div style={{ height: '400px' }}>
        {type === 'bar' && <Bar data={data} options={chartOptions} />}
        {type === 'pie' && <Pie data={data} options={chartOptions} />}
        {type === 'line' && <Line data={data} options={chartOptions} />}
      </div>
    </div>
  );
}

// Mermaid Component
function MermaidComponent({ chart }: { chart: string }) {
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const renderChart = async () => {
      try {
        const { svg } = await mermaid.render('mermaid-' + Math.random(), chart);
        setSvg(svg);
        setError('');
      } catch (err) {
        setError('Failed to render diagram');
        console.error('Mermaid error:', err);
      }
    };

    renderChart();
  }, [chart]);

  if (error) {
    return (
      <div className='bg-red-50 border border-red-200 rounded-xl p-6 my-6'>
        <p className='text-red-800'>Error rendering diagram: {error}</p>
      </div>
    );
  }

  return (
    <div className='bg-white border border-gray-200 rounded-xl p-6 my-6 text-center'>
      <div dangerouslySetInnerHTML={{ __html: svg }} />
    </div>
  );
}

// Parse special content blocks
function parseSpecialBlocks(content: string) {
  // Parse MCQ blocks
  const mcqRegex = /```mcq\n([\s\S]*?)```/g;
  const chartRegex = /```chart:(\w+)\n([\s\S]*?)```/g;
  const mermaidRegex = /```mermaid\n([\s\S]*?)```/g;

  let processedContent = content;
  const components: { [key: string]: React.ReactNode } = {};
  let componentIndex = 0;

  // Replace MCQ blocks
  processedContent = processedContent.replace(mcqRegex, (match, mcqContent) => {
    const lines = mcqContent.trim().split('\n');
    const question = lines[0];
    const options: string[] = [];
    let correctAnswer = 0;
    let explanation = '';
    
    let i = 1;
    while (i < lines.length && lines[i].match(/^[A-D]\)/)) {
      const option = lines[i].replace(/^[A-D]\)\s*/, '');
      if (lines[i].includes('*')) {
        correctAnswer = options.length;
        options.push(option.replace('*', '').trim());
      } else {
        options.push(option);
      }
      i++;
    }
    
    if (i < lines.length && lines[i].startsWith('Explanation:')) {
      explanation = lines[i].replace('Explanation:', '').trim();
    }
    
    const componentKey = `mcq-${componentIndex++}`;
    components[componentKey] = (
      <MCQComponent
        key={componentKey}
        question={question}
        options={options}
        correctAnswer={correctAnswer}
        explanation={explanation}
      />
    );
    
    return `__COMPONENT_${componentKey}__`;
  });

  // Replace Chart blocks
  processedContent = processedContent.replace(chartRegex, (match, type, chartData) => {
    try {
      const data = JSON.parse(chartData);
      const componentKey = `chart-${componentIndex++}`;
      components[componentKey] = (
        <ChartComponent key={componentKey} type={type} data={data} />
      );
      return `__COMPONENT_${componentKey}__`;
    } catch (err) {
      return `\`\`\`\nError parsing chart data\n\`\`\``;
    }
  });

  // Replace Mermaid blocks
  processedContent = processedContent.replace(mermaidRegex, (match, mermaidContent) => {
    const componentKey = `mermaid-${componentIndex++}`;
    components[componentKey] = (
      <MermaidComponent key={componentKey} chart={mermaidContent.trim()} />
    );
    return `__COMPONENT_${componentKey}__`;
  });

  return { processedContent, components };
}

export function Markdown({ content, className }: MarkdownProps) {
  const { processedContent, components } = parseSpecialBlocks(content);

  return (
    <div className={cn('prose prose-lg max-w-none', className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          // Custom component renderer
           p: ({ children }) => {
             const text = children?.toString() || '';
             if (text.startsWith('__COMPONENT_') && text.endsWith('__')) {
               const componentKey = text.slice(12, -2);
               return components[componentKey] || <p>{children}</p>;
             }
             
             // Educational content styling with unique fonts and colors
             if (text.startsWith('Definition:')) {
               return (
                 <div className='bg-blue-50 border-l-4 border-blue-500 p-4 my-4 rounded-r-lg'>
                   <p className='text-blue-900 text-base leading-7 font-serif italic'>
                     {children}
                   </p>
                 </div>
               );
             }
             
             if (text.startsWith('Key Points:')) {
               return (
                 <div className='bg-green-50 border-l-4 border-green-500 p-4 my-4 rounded-r-lg'>
                   <p className='text-green-900 text-base leading-7 font-semibold tracking-wide'>
                     {children}
                   </p>
                 </div>
               );
             }
             
             if (text.startsWith('Example:')) {
               return (
                 <div className='bg-yellow-50 border-l-4 border-yellow-500 p-4 my-4 rounded-r-lg'>
                   <p className='text-yellow-900 text-base leading-7 font-mono text-sm'>
                     {children}
                   </p>
                 </div>
               );
             }
             
             if (text.startsWith('Important:') || text.startsWith('Note:')) {
               return (
                 <div className='bg-red-50 border-l-4 border-red-500 p-4 my-4 rounded-r-lg'>
                   <p className='text-red-900 text-base leading-7 font-bold'>
                     {children}
                   </p>
                 </div>
               );
             }
             
             if (text.startsWith('Summary:') || text.startsWith('Conclusion:')) {
               return (
                 <div className='bg-purple-50 border-l-4 border-purple-500 p-4 my-4 rounded-r-lg'>
                   <p className='text-purple-900 text-base leading-7 font-semibold'>
                     {children}
                   </p>
                 </div>
               );
             }
             
             if (text.startsWith('Topic:')) {
               return (
                 <div className='bg-indigo-50 border-l-4 border-indigo-500 p-4 my-4 rounded-r-lg'>
                   <p className='text-indigo-900 text-lg leading-8 font-bold tracking-wide'>
                     {children}
                   </p>
                 </div>
               );
             }
             
             // Enhanced paragraph with numerical data detection
             if (text.match(/\d+[%]|\d+\.\d+|\d+,\d+|\d+\s*(years?|months?|days?|hours?|minutes?|seconds?)/i)) {
               return (
                 <div className='bg-slate-50 border border-slate-200 p-4 my-4 rounded-lg'>
                   <p className='text-slate-900 text-base leading-7 font-medium'>
                     📊 {children}
                   </p>
                 </div>
               );
             }
             
             // Enhanced paragraph with question detection
             if (text.match(/^(what|how|why|when|where|which|who)\s/i) || text.endsWith('?')) {
               return (
                 <div className='bg-cyan-50 border-l-4 border-cyan-400 p-4 my-4 rounded-r-lg'>
                   <p className='text-cyan-900 text-base leading-7 font-medium'>
                     ❓ {children}
                   </p>
                 </div>
               );
             }
             
             // Enhanced paragraph with step detection
             if (text.match(/^(step|stage|phase|level)\s*\d+/i) || text.match(/^\d+[.)]/)) {
               return (
                 <div className='bg-teal-50 border-l-4 border-teal-400 p-4 my-4 rounded-r-lg'>
                   <p className='text-teal-900 text-base leading-7 font-semibold'>
                     🔢 {children}
                   </p>
                 </div>
               );
             }
             
             return <p className='text-gray-900 text-base leading-7 mb-5 last:mb-0'>{children}</p>;
           },
          
          // Headers with educational styling
           h1: ({ children }) => (
             <div className='bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-lg my-6 shadow-lg'>
               <h1 className='text-2xl font-bold tracking-tight text-center'>
                 📚 {children}
               </h1>
             </div>
           ),
           h2: ({ children }) => (
             <div className='bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-3 rounded-lg my-5 shadow-md'>
               <h2 className='text-xl font-semibold tracking-tight'>
                 📖 {children}
               </h2>
             </div>
           ),
           h3: ({ children }) => (
             <div className='bg-gradient-to-r from-green-500 to-emerald-500 text-white p-3 rounded-lg my-4 shadow-md'>
               <h3 className='text-lg font-semibold tracking-tight'>
                 📝 {children}
               </h3>
             </div>
           ),
           h4: ({ children }) => (
             <div className='bg-gradient-to-r from-orange-500 to-yellow-500 text-white p-2 rounded-lg my-3 shadow-sm'>
               <h4 className='text-base font-semibold tracking-tight'>
                 💡 {children}
               </h4>
             </div>
           ),
          
          // Lists with educational styling
           ul: ({ children }) => (
             <div className='bg-gray-50 p-4 rounded-lg my-4 border-l-4 border-blue-400'>
               <ul className='space-y-2 text-gray-800'>
                 {children}
               </ul>
             </div>
           ),
           ol: ({ children }) => (
             <div className='bg-gray-50 p-4 rounded-lg my-4 border-l-4 border-green-400'>
               <ol className='space-y-2 text-gray-800'>
                 {children}
               </ol>
             </div>
           ),
           li: ({ children }) => (
             <li className='text-base leading-7 flex items-start gap-3 py-1'>
               <span className='text-primary font-bold text-lg'>•</span>
               <span className='flex-1'>{children}</span>
             </li>
           ),
          
          // Enhanced Code blocks
           code: (props) => {
             const { children, className } = props;
             const match = /language-(\w+)/.exec(className || '');
             const language = match ? match[1] : '';
             const isInline = !match;
             
             if (isInline) {
               return (
                 <code className='bg-gradient-to-r from-purple-100 to-pink-100 text-purple-900 px-3 py-1 rounded-md text-sm font-mono border border-purple-200 shadow-sm'>
                   💻 {children}
                 </code>
               );
             }
             
             return (
               <div className='my-6 border-2 border-gray-300 rounded-xl shadow-lg overflow-hidden'>
                 <div className='bg-gradient-to-r from-gray-800 to-gray-900 text-white p-3 flex items-center justify-between'>
                   <span className='font-semibold text-sm'>🖥️ Code Example</span>
                   {language && (
                     <span className='bg-blue-600 px-2 py-1 rounded text-xs font-mono uppercase'>
                       {language}
                     </span>
                   )}
                 </div>
                 <pre className='bg-gray-900 text-gray-100 p-6 overflow-x-auto text-sm leading-relaxed'>
                   <code className='font-mono'>
                     {children}
                   </code>
                 </pre>
               </div>
             );
           },
          
          // Enhanced Tables for educational data
           table: ({ children }) => (
             <div className='overflow-x-auto my-6 border-2 border-indigo-200 rounded-xl shadow-lg bg-white'>
               <div className='bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-3 rounded-t-xl'>
                 <h4 className='font-semibold text-center'>📋 Data Table</h4>
               </div>
               <table className='min-w-full divide-y divide-indigo-200'>
                 {children}
               </table>
             </div>
           ),
           thead: ({ children }) => (
             <thead className='bg-indigo-50'>{children}</thead>
           ),
           th: ({ children }) => (
             <th className='px-6 py-4 text-left text-sm font-bold text-indigo-900 uppercase tracking-wider border-b-2 border-indigo-300'>
               📌 {children}
             </th>
           ),
           td: ({ children }) => {
             const text = children?.toString() || '';
             const hasNumbers = text.match(/\d+[%]|\d+\.\d+|\d+,\d+/);
             
             return (
               <td className={`px-6 py-4 text-sm border-b border-indigo-100 ${
                 hasNumbers 
                   ? 'text-indigo-900 font-semibold bg-indigo-25' 
                   : 'text-gray-900'
               }`}>
                 {hasNumbers ? `📊 ${children}` : children}
               </td>
             );
           },
          
          // Blockquotes with educational styling
           blockquote: ({ children }) => (
             <div className='relative bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500 p-6 my-6 rounded-r-lg shadow-md'>
               <div className='absolute top-2 left-2 text-amber-500 text-3xl font-serif'>&ldquo;</div>
               <div className='text-amber-900 italic font-serif text-lg leading-8 pl-8'>
                 💭 {children}
               </div>
               <div className='absolute bottom-2 right-2 text-amber-500 text-3xl font-serif transform rotate-180'>&rdquo;</div>
             </div>
           ),
          
          // Links
          a: ({ children, href }) => (
            <a
              href={href}
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-600 hover:text-blue-800 underline decoration-blue-300 hover:decoration-blue-500 transition-colors duration-200'
            >
              {children}
            </a>
          ),
          
          // Strong and emphasis
           strong: ({ children }) => {
             const text = children?.toString() || '';
             const educationalKeywords = ['Topic:', 'Definition:', 'Detailed Explanation:', 'Key Points:', 'Summary:', 'Conclusion:', 'Example:', 'Note:', 'Important:', 'Remember:', 'Tip:'];
             const isEducationalKeyword = educationalKeywords.some(keyword => text.includes(keyword));
             
             if (isEducationalKeyword) {
               return (
                 <strong className='font-bold text-primary'>
                   {children}
                 </strong>
               );
             }
             
             return <strong className='font-bold text-gray-900'>{children}</strong>;
           },
           em: ({ children }) => (
             <em className='italic text-gray-700'>{children}</em>
           ),
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
}
