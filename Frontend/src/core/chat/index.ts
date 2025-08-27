/**
 * Chat Module Exports
 * Core chat functionality including components, services, and stores
 */

// Components
export { ChatLayout } from "./components/chat-layout";
export { NewChatButton } from "./components/new-chat-button";
export { SidebarChatList } from "./components/sidebar-chat-list";

// Main chat components
export { ChatMessages } from "./chat-messages";
export { WelcomeScreen } from "./welcome-screen";
export { MessageInput } from "./message-input";
export { FeedbackModal } from "./feedback-modal";

// Enhanced Components
export { EnhancedChatMessage } from "./components/enhanced-chat-message";
export { EnhancedMessageInput } from "./components/enhanced-message-input";
export { EnhancedChatMessages } from "./components/enhanced-chat-messages";
export { EnhancedMarkdownRenderer } from "./components/enhanced-markdown-renderer";

// Progressive UI Components
export {
  MessageStateIndicator,
  MessageStatusBar,
  ConnectionStatus,
} from "./components/message-states";
export type { MessageState } from "./components/message-states";
export {
  InteractiveButton,
  CopyButton,
  RegenerateButton,
  EditButton,
  FeedbackButtons,
  MessageActions,
  QuickActions,
} from "./components/interactive-elements";
export {
  MessageContainer,
  MessageBubble,
  MessageHeader,
  MessageAvatar,
} from "./components/visual-hierarchy";
export type {
  MessageType,
  MessagePriority,
} from "./components/visual-hierarchy";

// Hooks
export { useEnhancedChat } from "./hooks/use-enhanced-chat";

// Services
export { api } from "./services/api";
export { streamingService } from "./services/streaming.service";

// Store
export { useChatStore } from "./ChatStore";
