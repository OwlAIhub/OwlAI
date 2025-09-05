'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getFeedbackStats } from '@/lib/feedback';
import { MessageSquare, ThumbsDown, ThumbsUp, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';

interface FeedbackStatsProps {
  chatId?: string;
}

export function FeedbackStats({ chatId }: FeedbackStatsProps) {
  const [stats, setStats] = useState({
    total: 0,
    positive: 0,
    negative: 0,
    positiveRate: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      try {
        const data = await getFeedbackStats(chatId);
        setStats(data);
      } catch (error) {
        console.error('Failed to load feedback stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [chatId]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <MessageSquare className='w-5 h-5' />
            Feedback Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex items-center justify-center py-4'>
            <div className='w-4 h-4 bg-primary rounded-full animate-pulse'></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <MessageSquare className='w-5 h-5' />
          Feedback Statistics
          {chatId && <Badge variant='secondary'>Chat Specific</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='grid grid-cols-2 gap-4'>
          <div className='text-center'>
            <div className='text-2xl font-bold text-green-600'>
              {stats.positive}
            </div>
            <div className='text-sm text-muted-foreground flex items-center justify-center gap-1'>
              <ThumbsUp className='w-4 h-4' />
              Positive
            </div>
          </div>
          <div className='text-center'>
            <div className='text-2xl font-bold text-red-600'>
              {stats.negative}
            </div>
            <div className='text-sm text-muted-foreground flex items-center justify-center gap-1'>
              <ThumbsDown className='w-4 h-4' />
              Negative
            </div>
          </div>
        </div>

        <div className='border-t pt-4'>
          <div className='flex items-center justify-between'>
            <span className='text-sm font-medium'>Total Feedback</span>
            <Badge variant='outline'>{stats.total}</Badge>
          </div>
          <div className='flex items-center justify-between mt-2'>
            <span className='text-sm font-medium flex items-center gap-1'>
              <TrendingUp className='w-4 h-4' />
              Positive Rate
            </span>
            <Badge
              variant={
                stats.positiveRate >= 70
                  ? 'default'
                  : stats.positiveRate >= 50
                    ? 'secondary'
                    : 'destructive'
              }
            >
              {stats.positiveRate}%
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
