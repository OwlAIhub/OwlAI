'use client';

import { ChatSidebar } from '@/components/chat/ChatSidebar';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { useAuth } from '@/lib/contexts/AuthContext';
import { Menu } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ChatPage() {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);



  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <SidebarProvider>
      <ChatSidebar />
      <SidebarInset>
        {/* Main Content */}
        <div className='flex-1 bg-white relative flex flex-col'>
          {/* Floating Sidebar Toggle */}
          <div className='absolute top-4 left-4 z-20'>
            <SidebarTrigger className='h-10 w-10 p-0 bg-white border border-gray-200 shadow-sm hover:bg-gray-50 hover:shadow-md transition-all duration-200 rounded-md flex items-center justify-center'>
              <Menu className='h-4 w-4 text-gray-600' />
            </SidebarTrigger>
          </div>

          {/* Main Content Area */}
           <div className='flex-1 flex flex-col justify-center max-w-3xl mx-auto w-full px-6'>
             {/* Title and Description */}
             <div className='text-center mb-10'>
               <h1 className='text-4xl font-bold text-gray-900 mb-3'>Welcome to OwlAI</h1>
               <p className='text-lg text-gray-600 mb-6'>Your personalized AI learning assistant</p>
               <div className='max-w-2xl mx-auto'>
                 <p className='text-base text-gray-700 leading-relaxed'>
                   OwlAI is your dedicated learning companion designed to help you master any subject efficiently.
                   Whether you&apos;re preparing for exams, learning new skills, or seeking in-depth knowledge,
                   I provide tailored study plans, interactive lessons, and expert guidance to enhance your learning experience.
                   Let&apos;s achieve your academic goals together!
                 </p>
               </div>
             </div>

            {/* Search Bar */}
             <div className='mb-6'>
               <div className='max-w-xl mx-auto'>
                 <div className='relative'>
                   <input
                     type='text'
                     placeholder='Ask me anything about your studies...'
                     className='w-full px-4 py-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors'
                   />
                   <button className='absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-primary transition-colors'>
                     <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                       <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 19l9 2-9-18-9 18 9-2zm0 0v-8' />
                     </svg>
                   </button>
                 </div>
               </div>
             </div>

             {/* Starter Prompts */}
              <div className='max-w-2xl mx-auto w-full'>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                  <button className='text-left p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors'>
                    <p className='text-sm text-gray-700'>Research methodology for UGC NET</p>
                  </button>
                  <button className='text-left p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors'>
                    <p className='text-sm text-gray-700'>UGC NET Paper 1 strategies</p>
                  </button>
                  <button className='text-left p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors'>
                    <p className='text-sm text-gray-700'>30-day study plan for Economics</p>
                  </button>
                  <button className='text-left p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors'>
                    <p className='text-sm text-gray-700'>Teaching aptitude section tips</p>
                  </button>
                </div>
              </div>


          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
