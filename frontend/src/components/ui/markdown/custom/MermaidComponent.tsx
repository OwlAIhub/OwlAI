'use client';

import mermaid from 'mermaid';
import { useEffect, useState } from 'react';

// Initialize Mermaid
mermaid.initialize({
  startOnLoad: true,
  theme: 'default',
  securityLevel: 'loose',
});

interface MermaidComponentProps {
  chart: string;
}

export function MermaidComponent({ chart }: MermaidComponentProps) {
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const renderChart = async () => {
      try {
        const { svg } = await mermaid.render('mermaid-chart', chart);
        setSvg(svg);
        setError('');
      } catch (err) {
        setError('Failed to render chart');
        console.error('Mermaid rendering error:', err);
      }
    };

    renderChart();
  }, [chart]);

  if (error) {
    return (
      <div className='border border-gray-300 p-4 my-4'>
        <p className='text-gray-600'>Chart rendering failed</p>
      </div>
    );
  }

  return (
    <div className='my-6 p-4 border border-gray-300 text-center'>
      <div dangerouslySetInnerHTML={{ __html: svg }} />
    </div>
  );
}