import React from "react";
import { MainContentProps } from "@/types";
import { ChatContainer } from "./ChatContainer";

/**
 * Main content component
 * Wrapper for the chat container
 */
export const MainContent: React.FC<MainContentProps> = (props) => {
  return <ChatContainer {...props} />;
};
