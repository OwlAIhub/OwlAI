'use client';

import { RouteProtection } from '@/components/auth/RouteProtection';
import { useAuth } from '@/components/providers/AuthProvider';
import { Button } from '@/components/ui/button';
import { ResponsiveContainer } from '@/components/ui/responsive-container';
import { motion } from 'framer-motion';
import { ArrowLeft, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ChatPage() {
  const router = useRouter();
  const { user, logout, isLoading } = useAuth();

  const handleBackToHome = () => {
    router.push('/');
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600'></div>
      </div>
    );
  }

  return (
    <RouteProtection requireAuth={true} requireQuestionnaire={true}>
      <div className='min-h-screen bg-gradient-to-br from-background via-background to-primary/5'>
        {/* Background Pattern */}
        <div className='absolute inset-0 opacity-5'>
          <div className='absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.1),transparent_50%)]' />
        </div>

        {/* Header */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className='relative z-10 p-4'
        >
          <ResponsiveContainer maxWidth='6xl' padding='none'>
            <div className='flex items-center justify-between'>
              {/* Back Button */}
              <Button
                variant='ghost'
                size='sm'
                onClick={handleBackToHome}
                className='text-muted-foreground hover:text-foreground'
              >
                <ArrowLeft className='w-4 h-4 mr-2' />
                Back to Home
              </Button>

              {/* User Info & Logout */}
              <div className='flex items-center gap-4'>
                {user?.questionnaireData?.fullName && (
                  <span className='text-sm text-muted-foreground'>
                    Welcome, {user.questionnaireData.fullName}
                  </span>
                )}
                <Button
                  variant='outline'
                  size='sm'
                  onClick={handleLogout}
                  className='text-muted-foreground hover:text-foreground'
                >
                  <LogOut className='w-4 h-4 mr-2' />
                  Logout
                </Button>
              </div>
            </div>
          </ResponsiveContainer>
        </motion.header>

        {/* Main Content */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className='relative z-10 flex-1 flex items-center justify-center p-4'
        >
          <ResponsiveContainer maxWidth='4xl'>
            <div className='text-center'>
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className='mb-8'
              >
                <h1 className='text-4xl font-bold text-foreground mb-4'>
                  Welcome to Owl AI Chat
                </h1>
                <p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
                  Your AI study partner is ready to help you learn and excel in
                  your exams.
                </p>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className='bg-card/50 backdrop-blur-sm border rounded-lg p-8 max-w-2xl mx-auto'
              >
                <h2 className='text-2xl font-semibold mb-4'>
                  Chat Interface Coming Soon
                </h2>
                <p className='text-muted-foreground mb-6'>
                  The chat interface is being developed. You&apos;re
                  successfully authenticated and ready to use Owl AI!
                </p>

                {user?.questionnaireData && (
                  <div className='text-left bg-muted/50 rounded-lg p-4 mb-6'>
                    <h3 className='font-semibold mb-2'>Your Profile:</h3>
                    <p>
                      <strong>Name:</strong> {user.questionnaireData.fullName}
                    </p>
                    <p>
                      <strong>Phone:</strong> {user.phoneNumber}
                    </p>
                    <p>
                      <strong>Exam:</strong> {user.questionnaireData.exam}
                    </p>
                    <p>
                      <strong>Subject:</strong> {user.questionnaireData.subject}
                    </p>
                  </div>
                )}

                <Button
                  onClick={handleBackToHome}
                  className='bg-primary hover:bg-primary/90'
                >
                  Back to Home
                </Button>
              </motion.div>
            </div>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </RouteProtection>
  );
}
