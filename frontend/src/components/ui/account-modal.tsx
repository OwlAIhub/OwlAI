'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { deleteAllChatsForGuest } from '@/lib/chats';
import { getGuestId } from '@/lib/guest';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertTriangle,
  CheckCircle,
  Lock,
  Mail,
  Settings,
  Shield,
  Trash2,
  User,
  X,
} from 'lucide-react';
import { useState } from 'react';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
}

function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  isDestructive = false,
  isLoading = false,
}: ConfirmationModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className='fixed inset-0 z-[60] flex items-center justify-center p-4'
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className='fixed inset-0 bg-black/50 backdrop-blur-sm'
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className='relative w-full max-w-md bg-background rounded-2xl shadow-2xl border border-border/50 p-6'
          >
            <div className='flex items-center gap-3 mb-4'>
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isDestructive
                    ? 'bg-red-100 text-red-600'
                    : 'bg-blue-100 text-blue-600'
                }`}
              >
                {isDestructive ? (
                  <AlertTriangle className='w-5 h-5' />
                ) : (
                  <Shield className='w-5 h-5' />
                )}
              </div>
              <div>
                <h3 className='text-lg font-semibold text-foreground'>
                  {title}
                </h3>
                <p className='text-sm text-muted-foreground'>{message}</p>
              </div>
            </div>

            <div className='flex gap-3 justify-end'>
              <Button
                variant='outline'
                onClick={onClose}
                className='px-6'
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                variant={isDestructive ? 'destructive' : 'default'}
                onClick={onConfirm}
                className='px-6'
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className='flex items-center gap-2'>
                    <div className='w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin' />
                    {confirmText}
                  </div>
                ) : (
                  confirmText
                )}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function AccountModal({ isOpen, onClose, user }: AccountModalProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  const handleDeleteAllConversations = async () => {
    setIsDeleting(true);
    try {
      const guestId = getGuestId();
      if (!guestId) {
        throw new Error('Guest ID not found');
      }

      // Delete all chats for the guest
      await deleteAllChatsForGuest(guestId);

      // Clear all conversations from localStorage and state
      if (typeof window !== 'undefined') {
        localStorage.removeItem('currentChatId');
        // Dispatch event to clear chat interface
        document.dispatchEvent(new CustomEvent('chat:reset'));
      }

      setDeleteSuccess(true);
      setTimeout(() => {
        setDeleteSuccess(false);
        setShowDeleteConfirm(false);
        onClose();
      }, 2000);
    } catch {
      // Failed to delete conversations
      setIsDeleting(false);
      // You could add error handling UI here
    }
  };

  const accountOptions = [
    {
      icon: User,
      title: 'Profile',
      onClick: () => {
        /* Profile settings clicked */
      },
    },
    {
      icon: Mail,
      title: 'Notifications',
      onClick: () => {
        /* Email preferences clicked */
      },
    },
    {
      icon: Lock,
      title: 'Privacy',
      onClick: () => {
        /* Privacy settings clicked */
      },
    },
    {
      icon: Settings,
      title: 'Settings',
      onClick: () => {
        /* App settings clicked */
      },
    },
  ];

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 z-50 flex items-center justify-center p-4'
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className='fixed inset-0 bg-black/60 backdrop-blur-md'
              onClick={onClose}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className='relative w-full max-w-sm bg-background/95 backdrop-blur-xl rounded-2xl shadow-xl border border-border/50 overflow-hidden'
            >
              {/* Header */}
              <div className='p-4 border-b border-border/50'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <Avatar className='h-10 w-10 rounded-lg'>
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className='rounded-lg bg-primary text-primary-foreground text-sm font-medium'>
                        GU
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className='text-sm font-medium text-foreground'>
                        {user.name}
                      </h2>
                      <p className='text-xs text-muted-foreground'>
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className='w-6 h-6 rounded-md hover:bg-muted flex items-center justify-center transition-colors duration-200'
                  >
                    <X className='w-4 h-4 text-muted-foreground' />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className='p-2'>
                <div className='space-y-1 mb-3'>
                  {accountOptions.map((option, index) => (
                    <motion.button
                      key={option.title}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={option.onClick}
                      className='w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors duration-200 text-left group'
                    >
                      <div className='w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors'>
                        <option.icon className='w-4 h-4 text-primary' />
                      </div>
                      <div className='flex-1'>
                        <h3 className='text-sm font-medium text-foreground'>
                          {option.title}
                        </h3>
                      </div>
                    </motion.button>
                  ))}
                </div>

                {/* Delete All Conversations */}
                <motion.button
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  onClick={() => setShowDeleteConfirm(true)}
                  className='w-full flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 border border-red-200/50 hover:border-red-300 transition-all duration-200 text-left group'
                >
                  <div className='w-8 h-8 rounded-md bg-red-100 flex items-center justify-center group-hover:bg-red-200 transition-colors'>
                    <Trash2 className='w-4 h-4 text-red-600' />
                  </div>
                  <div className='flex-1'>
                    <h3 className='text-sm font-medium text-red-900'>
                      Delete All Conversations
                    </h3>
                  </div>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteAllConversations}
        title='Delete All Conversations'
        message='This will permanently delete all your chat history. This action cannot be undone.'
        confirmText='Delete All'
        isDestructive={true}
        isLoading={isDeleting}
      />

      {/* Success Modal */}
      <AnimatePresence>
        {deleteSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 z-[70] flex items-center justify-center p-4'
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className='fixed inset-0 bg-black/50 backdrop-blur-sm'
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className='relative w-full max-w-sm bg-background rounded-2xl shadow-2xl border border-border/50 p-6 text-center'
            >
              <div className='w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4'>
                <CheckCircle className='w-8 h-8 text-green-600' />
              </div>
              <h3 className='text-lg font-semibold text-foreground mb-2'>
                All Conversations Deleted
              </h3>
              <p className='text-sm text-muted-foreground'>
                Your chat history has been successfully removed.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
