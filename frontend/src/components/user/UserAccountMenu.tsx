'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/buttons/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  clearAuthUserWithNotification,
  getAuthUser,
  getUserAvatar,
  getUserDisplayName,
} from '@/lib/auth';
import {
  getUserProfile,
  updateUserProfile,
  updateUserSettings,
} from '@/lib/database/users';
import { UserDocument, UserSettings } from '@/lib/types/user';
import {
  BarChart3,
  Check,
  Edit3,
  Loader2,
  LogOut,
  Settings,
  User,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface UserAccountMenuProps {
  className?: string;
}

export function UserAccountMenu({ className }: UserAccountMenuProps) {
  const [user, setUser] = useState(getAuthUser());
  const [userProfile, setUserProfile] = useState<UserDocument | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingSettings, setIsEditingSettings] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    bio: '',
  });
  const [settingsForm, setSettingsForm] = useState<UserSettings | null>(null);

  // Load user profile on mount
  useEffect(() => {
    const loadUserProfile = async () => {
      if (user?.id) {
        try {
          setIsLoading(true);
          const profile = await getUserProfile(user.id);
          setUserProfile(profile);
          if (profile) {
            setEditForm({
              name: profile.profile.name,
              bio: profile.profile.bio || '',
            });
            setSettingsForm(profile.settings);
          }
        } catch (error) {
          console.error('Failed to load user profile:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadUserProfile();
  }, [user?.id]);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      // Clear auth state
      clearAuthUserWithNotification();
      setUser(null);
      setUserProfile(null);

      // Redirect to home page
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user?.id || !userProfile) return;

    try {
      setIsLoading(true);
      await updateUserProfile(user.id, {
        name: editForm.name,
        bio: editForm.bio,
      });

      // Update local state
      setUserProfile(prev =>
        prev
          ? {
              ...prev,
              profile: {
                ...prev.profile,
                name: editForm.name,
                bio: editForm.bio,
              },
            }
          : null
      );

      setIsEditingProfile(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    if (!user?.id || !settingsForm) return;

    try {
      setIsLoading(true);
      await updateUserSettings(user.id, settingsForm);
      setIsEditingSettings(false);
    } catch (error) {
      console.error('Failed to update settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getProfileCompleteness = () => {
    if (!userProfile) return 0;
    return userProfile.profile.profileCompleteness;
  };

  const getProfileCompletenessColor = (completeness: number) => {
    if (completeness >= 80) return 'text-green-600';
    if (completeness >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (!user) {
    return (
      <Button variant='outline' size='sm'>
        Sign In
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className={`relative h-10 w-10 rounded-full ${className}`}
        >
          <Avatar className='h-8 w-8'>
            <AvatarImage
              src={getUserAvatar() || ''}
              alt={getUserDisplayName()}
            />
            <AvatarFallback className='bg-teal-600 text-white text-sm font-semibold'>
              {getUserDisplayName().substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className='w-80' align='end' forceMount>
        {/* User Info Header */}
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col space-y-2'>
            <div className='flex items-center space-x-2'>
              <Avatar className='h-10 w-10'>
                <AvatarImage
                  src={getUserAvatar() || ''}
                  alt={getUserDisplayName()}
                />
                <AvatarFallback className='bg-teal-600 text-white'>
                  {getUserDisplayName().substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className='flex flex-col'>
                <p className='text-sm font-medium leading-none'>
                  {userProfile?.profile.name || getUserDisplayName()}
                </p>
                <p className='text-xs text-muted-foreground mt-1'>
                  {userProfile?.profile.phoneNumber || user.phoneNumber}
                </p>
              </div>
            </div>

            {/* Profile Completeness */}
            {userProfile && (
              <div className='space-y-1'>
                <div className='flex justify-between text-xs'>
                  <span>Profile Complete</span>
                  <span
                    className={getProfileCompletenessColor(
                      getProfileCompleteness()
                    )}
                  >
                    {getProfileCompleteness()}%
                  </span>
                </div>
                <div className='w-full bg-gray-200 rounded-full h-1.5'>
                  <div
                    className='bg-teal-600 h-1.5 rounded-full transition-all duration-300'
                    style={{ width: `${getProfileCompleteness()}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {/* Profile Section */}
        <div className='px-2 py-1.5'>
          <div className='flex items-center justify-between'>
            <span className='text-sm font-medium text-gray-700'>Profile</span>
            {!isEditingProfile ? (
              <Button
                variant='ghost'
                size='sm'
                onClick={() => setIsEditingProfile(true)}
                className='h-6 px-2 text-xs'
              >
                <Edit3 className='h-3 w-3 mr-1' />
                Edit
              </Button>
            ) : (
              <div className='flex gap-1'>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={handleSaveProfile}
                  disabled={isLoading}
                  className='h-6 px-2 text-xs'
                >
                  {isLoading ? (
                    <Loader2 className='h-3 w-3 animate-spin' />
                  ) : (
                    <Check className='h-3 w-3' />
                  )}
                </Button>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => setIsEditingProfile(false)}
                  className='h-6 px-2 text-xs'
                >
                  <X className='h-3 w-3' />
                </Button>
              </div>
            )}
          </div>

          {isEditingProfile ? (
            <div className='mt-2 space-y-2'>
              <input
                type='text'
                value={editForm.name}
                onChange={e =>
                  setEditForm(prev => ({ ...prev, name: e.target.value }))
                }
                placeholder='Full name'
                className='w-full px-2 py-1 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-teal-500'
              />
              <textarea
                value={editForm.bio}
                onChange={e =>
                  setEditForm(prev => ({ ...prev, bio: e.target.value }))
                }
                placeholder='Bio (optional)'
                rows={2}
                className='w-full px-2 py-1 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-teal-500 resize-none'
              />
            </div>
          ) : (
            <div className='mt-1'>
              {userProfile?.profile.bio && (
                <p className='text-xs text-gray-600 mt-1'>
                  {userProfile.profile.bio}
                </p>
              )}
              {userProfile?.profile.exam && (
                <div className='mt-2 space-y-1'>
                  <p className='text-xs text-gray-500'>
                    <span className='font-medium'>Exam:</span>{' '}
                    {userProfile.profile.exam.type}
                  </p>
                  <p className='text-xs text-gray-500'>
                    <span className='font-medium'>Subject:</span>{' '}
                    {userProfile.profile.exam.subject}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <DropdownMenuSeparator />

        {/* Quick Actions */}
        <DropdownMenuItem className='cursor-pointer'>
          <User className='mr-2 h-4 w-4' />
          <span>View Profile</span>
        </DropdownMenuItem>

        <DropdownMenuItem className='cursor-pointer'>
          <BarChart3 className='mr-2 h-4 w-4' />
          <span>Analytics</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Settings Section */}
        <div className='px-2 py-1.5'>
          <div className='flex items-center justify-between'>
            <span className='text-sm font-medium text-gray-700'>Settings</span>
            {!isEditingSettings ? (
              <Button
                variant='ghost'
                size='sm'
                onClick={() => setIsEditingSettings(true)}
                className='h-6 px-2 text-xs'
              >
                <Settings className='h-3 w-3 mr-1' />
                Edit
              </Button>
            ) : (
              <div className='flex gap-1'>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={handleSaveSettings}
                  disabled={isLoading}
                  className='h-6 px-2 text-xs'
                >
                  {isLoading ? (
                    <Loader2 className='h-3 w-3 animate-spin' />
                  ) : (
                    <Check className='h-3 w-3' />
                  )}
                </Button>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => setIsEditingSettings(false)}
                  className='h-6 px-2 text-xs'
                >
                  <X className='h-3 w-3' />
                </Button>
              </div>
            )}
          </div>

          {isEditingSettings && settingsForm && (
            <div className='mt-2 space-y-2'>
              <div className='flex items-center justify-between'>
                <span className='text-xs text-gray-600'>Notifications</span>
                <input
                  type='checkbox'
                  checked={settingsForm.notifications.enabled}
                  onChange={e =>
                    setSettingsForm(prev =>
                      prev
                        ? {
                            ...prev,
                            notifications: {
                              ...prev.notifications,
                              enabled: e.target.checked,
                            },
                          }
                        : null
                    )
                  }
                  className='rounded'
                />
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-xs text-gray-600'>Chat Messages</span>
                <input
                  type='checkbox'
                  checked={settingsForm.notifications.chatMessages}
                  onChange={e =>
                    setSettingsForm(prev =>
                      prev
                        ? {
                            ...prev,
                            notifications: {
                              ...prev.notifications,
                              chatMessages: e.target.checked,
                            },
                          }
                        : null
                    )
                  }
                  className='rounded'
                />
              </div>
            </div>
          )}
        </div>

        <DropdownMenuSeparator />

        {/* Logout */}
        <DropdownMenuItem
          className='cursor-pointer text-red-600 focus:text-red-600'
          onClick={handleLogout}
          disabled={isLoading}
        >
          <LogOut className='mr-2 h-4 w-4' />
          <span>{isLoading ? 'Signing out...' : 'Sign out'}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
