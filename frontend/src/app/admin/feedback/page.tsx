'use client';

import { FeedbackStats } from '@/components/admin/FeedbackStats';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, TrendingUp, Users } from 'lucide-react';

export default function FeedbackAdminPage() {
  return (
    <div className='min-h-screen bg-background p-6'>
      <div className='max-w-6xl mx-auto space-y-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold text-foreground'>
              Feedback Dashboard
            </h1>
            <p className='text-muted-foreground mt-2'>
              Monitor user feedback on AI responses to improve quality
            </p>
          </div>
          <Badge variant='outline' className='text-sm'>
            Admin Panel
          </Badge>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {/* Overall Stats */}
          <FeedbackStats />

          {/* Quick Stats Cards */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Users className='w-5 h-5' />
                User Engagement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-2'>
                <div className='flex justify-between'>
                  <span className='text-sm text-muted-foreground'>
                    Active Users
                  </span>
                  <span className='font-medium'>-</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-sm text-muted-foreground'>
                    Total Chats
                  </span>
                  <span className='font-medium'>-</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-sm text-muted-foreground'>
                    Messages Today
                  </span>
                  <span className='font-medium'>-</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <TrendingUp className='w-5 h-5' />
                Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-2'>
                <div className='flex justify-between'>
                  <span className='text-sm text-muted-foreground'>
                    Avg Response Time
                  </span>
                  <span className='font-medium'>-</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-sm text-muted-foreground'>
                    Success Rate
                  </span>
                  <span className='font-medium'>-</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-sm text-muted-foreground'>
                    User Satisfaction
                  </span>
                  <span className='font-medium'>-</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <MessageSquare className='w-5 h-5' />
              How to Use This Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <h4 className='font-medium text-foreground mb-2'>
                  Feedback Collection
                </h4>
                <ul className='text-sm text-muted-foreground space-y-1'>
                  <li>• Users can rate responses with thumbs up/down</li>
                  <li>• Feedback is automatically stored in the database</li>
                  <li>• Real-time statistics are displayed above</li>
                </ul>
              </div>
              <div>
                <h4 className='font-medium text-foreground mb-2'>
                  Database Structure
                </h4>
                <ul className='text-sm text-muted-foreground space-y-1'>
                  <li>
                    • Collection:{' '}
                    <code className='bg-muted px-1 rounded'>feedback</code>
                  </li>
                  <li>• Fields: messageId, chatId, feedback, createdAt</li>
                  <li>• Access via Firebase Admin SDK</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
