/**
 * Components Index
 * Centralized exports for all components
 */

// Re-export components from their actual locations
export { PhoneAuthForm } from './auth/forms/PhoneAuthForm';
export { AuthProvider } from './auth/providers/AuthProvider';
export { AppSidebar } from './layout/sidebar/app-sidebar';

// Chat Components
export { MarkdownRenderer } from './chat/MarkdownRenderer';

// ChatGPT-style Components (Carbon Copy)
export { ChatGPTContainer } from './chat/ChatGPTContainer';
export { ChatGPTMessage } from './chat/ChatGPTMessage';
export { ChatGPTRenderer } from './chat/ChatGPTRenderer';

// User Components (Production Ready)
export { UserAccountMenu } from './user/UserAccountMenu';
export { UserProfilePage } from './user/UserProfilePage';

// UI Components - use actual paths that exist
export * from './ui/features-section-demo-2';
export * from './ui/separator';

// Note: Other components will be exported individually as needed
