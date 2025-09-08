'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/buttons/button';
import { getAuthUser, getUserAvatar, getUserDisplayName } from '@/lib/auth';
import {
  getUserProfile,
  updateUserProfile,
  updateUserSettings,
} from '@/lib/database/users';
import { UserDocument, UserSettings } from '@/lib/types/user';
import {
  BarChart3,
  BookOpen,
  Calendar,
  Edit3,
  Loader2,
  Phone,
  Save,
  Settings,
  Target,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface UserProfilePageProps {
  className?: string;
}

export function UserProfilePage({ className }: UserProfilePageProps) {
  const [user] = useState(getAuthUser());
  const [userProfile, setUserProfile] = useState<UserDocument | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
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

      setIsEditing(false);
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
    if (completeness >= 80) return 'text-green-600 bg-green-50';
    if (completeness >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <Loader2 className='h-8 w-8 animate-spin text-teal-600' />
      </div>
    );
  }

  if (!user || !userProfile) {
    return (
      <div className='text-center py-12'>
        <p className='text-gray-500'>Please sign in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className={`max-w-4xl mx-auto p-6 space-y-8 ${className}`}>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <h1 className='text-3xl font-bold text-gray-900'>Profile</h1>
        <Button
          variant={isEditing ? 'default' : 'outline'}
          onClick={isEditing ? handleSaveProfile : () => setIsEditing(true)}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className='h-4 w-4 animate-spin mr-2' />
          ) : isEditing ? (
            <Save className='h-4 w-4 mr-2' />
          ) : (
            <Edit3 className='h-4 w-4 mr-2' />
          )}
          {isEditing ? 'Save Changes' : 'Edit Profile'}
        </Button>
      </div>

      {/* Profile Overview */}
      <div className='bg-white rounded-lg border shadow-sm p-6'>
        <div className='flex items-start space-x-6'>
          <Avatar className='h-24 w-24'>
            <AvatarImage
              src={getUserAvatar() || ''}
              alt={getUserDisplayName()}
            />
            <AvatarFallback className='bg-teal-600 text-white text-2xl font-semibold'>
              {getUserDisplayName().substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className='flex-1 space-y-4'>
            <div>
              {isEditing ? (
                <input
                  type='text'
                  value={editForm.name}
                  onChange={e =>
                    setEditForm(prev => ({ ...prev, name: e.target.value }))
                  }
                  className='text-2xl font-bold text-gray-900 border-b-2 border-teal-500 bg-transparent focus:outline-none'
                />
              ) : (
                <h2 className='text-2xl font-bold text-gray-900'>
                  {userProfile.profile.name}
                </h2>
              )}

              <div className='flex items-center space-x-4 mt-2'>
                <div className='flex items-center text-gray-500'>
                  <Phone className='h-4 w-4 mr-1' />
                  <span className='text-sm'>
                    {userProfile.profile.phoneNumber}
                  </span>
                </div>
                <div className='flex items-center text-gray-500'>
                  <Calendar className='h-4 w-4 mr-1' />
                  <span className='text-sm'>
                    Joined {userProfile.profile.createdAt.toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Profile Completeness */}
            <div
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getProfileCompletenessColor(getProfileCompleteness())}`}
            >
              <Target className='h-4 w-4 mr-1' />
              Profile {getProfileCompleteness()}% Complete
            </div>
          </div>
        </div>

        {/* Bio Section */}
        <div className='mt-6'>
          <h3 className='text-lg font-semibold text-gray-900 mb-2'>About</h3>
          {isEditing ? (
            <textarea
              value={editForm.bio}
              onChange={e =>
                setEditForm(prev => ({ ...prev, bio: e.target.value }))
              }
              placeholder='Tell us about yourself...'
              rows={3}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none'
            />
          ) : (
            <p className='text-gray-600'>
              {userProfile.profile.bio || 'No bio provided yet.'}
            </p>
          )}
        </div>
      </div>

      {/* Exam Information */}
      <div className='bg-white rounded-lg border shadow-sm p-6'>
        <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center'>
          <BookOpen className='h-5 w-5 mr-2 text-teal-600' />
          Exam Information
        </h3>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='space-y-2'>
            <label className='text-sm font-medium text-gray-500'>
              Exam Type
            </label>
            <p className='text-gray-900'>{userProfile.profile.exam.type}</p>
          </div>
          <div className='space-y-2'>
            <label className='text-sm font-medium text-gray-500'>Subject</label>
            <p className='text-gray-900'>{userProfile.profile.exam.subject}</p>
          </div>
          <div className='space-y-2'>
            <label className='text-sm font-medium text-gray-500'>Attempt</label>
            <p className='text-gray-900'>{userProfile.profile.exam.attempt}</p>
          </div>
          <div className='space-y-2'>
            <label className='text-sm font-medium text-gray-500'>
              Language
            </label>
            <p className='text-gray-900'>{userProfile.profile.exam.language}</p>
          </div>
        </div>
      </div>

      {/* Analytics */}
      <div className='bg-white rounded-lg border shadow-sm p-6'>
        <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center'>
          <BarChart3 className='h-5 w-5 mr-2 text-teal-600' />
          Usage Analytics
        </h3>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <div className='text-center'>
            <div className='text-2xl font-bold text-teal-600'>
              {userProfile.analytics.totalLogins}
            </div>
            <div className='text-sm text-gray-500'>Total Logins</div>
          </div>
          <div className='text-center'>
            <div className='text-2xl font-bold text-teal-600'>
              {userProfile.analytics.totalMessages}
            </div>
            <div className='text-sm text-gray-500'>Messages Sent</div>
          </div>
          <div className='text-center'>
            <div className='text-2xl font-bold text-teal-600'>
              {userProfile.analytics.sessionDuration}
            </div>
            <div className='text-sm text-gray-500'>Session Duration</div>
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className='bg-white rounded-lg border shadow-sm p-6'>
        <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center'>
          <Settings className='h-5 w-5 mr-2 text-teal-600' />
          Settings
        </h3>

        {settingsForm && (
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <div>
                <label className='text-sm font-medium text-gray-900'>
                  Notifications
                </label>
                <p className='text-sm text-gray-500'>
                  Receive notifications about updates
                </p>
              </div>
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
                className='h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded'
              />
            </div>

            <div className='flex items-center justify-between'>
              <div>
                <label className='text-sm font-medium text-gray-900'>
                  Chat Messages
                </label>
                <p className='text-sm text-gray-500'>
                  Get notified about new chat messages
                </p>
              </div>
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
                className='h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded'
              />
            </div>

            <div className='flex items-center justify-between'>
              <div>
                <label className='text-sm font-medium text-gray-900'>
                  System Updates
                </label>
                <p className='text-sm text-gray-500'>
                  Receive system and feature updates
                </p>
              </div>
              <input
                type='checkbox'
                checked={settingsForm.notifications.systemUpdates}
                onChange={e =>
                  setSettingsForm(prev =>
                    prev
                      ? {
                          ...prev,
                          notifications: {
                            ...prev.notifications,
                            systemUpdates: e.target.checked,
                          },
                        }
                      : null
                  )
                }
                className='h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded'
              />
            </div>

            <div className='pt-4'>
              <Button
                onClick={handleSaveSettings}
                disabled={isLoading}
                className='w-full'
              >
                {isLoading ? (
                  <Loader2 className='h-4 w-4 animate-spin mr-2' />
                ) : (
                  <Save className='h-4 w-4 mr-2' />
                )}
                Save Settings
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
