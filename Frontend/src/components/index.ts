/**
 * Component Barrel Exports
 * Provides clean imports for all components
 */

// UI Components (Shadcn)
export * from "./ui";

// Layout Components - Explicit re-exports to avoid naming conflicts
export {
  ChatList,
  SearchBar,
  NewChatButton,
  UserProfileSection,
  ChatLayout,
  // Re-export layout components with different names to avoid conflicts
  Sidebar as LayoutSidebar,
  SidebarHeader as LayoutSidebarHeader,
} from "./layout";

// Feature Components - Only export chat for now since others are empty
export {
  ChatMessages,
  WelcomeScreen,
  MessageInput,
  FeedbackModal,
} from "./features/chat";

// Common Components
export { ProtectedRoute, AppRoutes, ErrorBoundary } from "./common/index";
