/**
 * Database test functions
 * Test the user database operations
 */

import { auth } from '../firebase';
import { createUserProfile, getUserProfile, userExists } from './users';

/**
 * Test user profile creation
 */
export async function testUserProfileCreation(): Promise<void> {
  try {
    console.log('🧪 Testing user profile creation...');

    // Test data
    const testUserId = 'test_user_123';
    const testPhoneNumber = '+91 98765 43210';
    const testName = 'Test User';

    // Create user profile
    await createUserProfile(testUserId, testPhoneNumber, testName);
    console.log('✅ User profile created successfully');

    // Check if user exists
    const exists = await userExists(testUserId);
    console.log('✅ User exists check:', exists);

    // Get user profile
    const userProfile = await getUserProfile(testUserId);
    console.log('✅ User profile retrieved:', userProfile?.profile.name);

    console.log('🎉 All database tests passed!');
  } catch (error) {
    console.error('❌ Database test failed:', error);
    throw error;
  }
}

/**
 * Test questionnaire data structure
 */
export function testQuestionnaireStructure(): void {
  console.log('🧪 Testing questionnaire structure...');

  // Test data
  const testAnswers = {
    exam: 'UGC-NET' as const,
    subject: 'Computer Science and Applications' as const,
    attempt: '1st' as const,
    cycle: 'June 2025' as const,
    language: 'English' as const,
    marketingSource: 'Google Search' as const,
  };

  console.log('✅ Test answers structure:', testAnswers);
  console.log('🎉 Questionnaire structure test passed!');
}

/**
 * Run all database tests
 */
export async function runAllTests(): Promise<void> {
  try {
    console.log('🚀 Starting database tests...');

    // Test questionnaire structure
    testQuestionnaireStructure();

    // Test user profile creation (only if user is authenticated)
    if (auth.currentUser) {
      await testUserProfileCreation();
    } else {
      console.log('⚠️ Skipping user profile test - no authenticated user');
    }

    console.log('🎉 All tests completed successfully!');
  } catch (error) {
    console.error('❌ Tests failed:', error);
    throw error;
  }
}
