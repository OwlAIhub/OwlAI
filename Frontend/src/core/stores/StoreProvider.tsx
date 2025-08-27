import React from "react";
import { UserProvider } from "../auth/UserStore";
import { ChatProvider } from "../chat/ChatStore";

interface StoreProviderProps {
  children: React.ReactNode;
}

/**
 * Root store provider that combines all store providers
 */
export const StoreProvider: React.FC<StoreProviderProps> = ({ children }) => {
  return (
    <UserProvider>
      <ChatProvider>{children}</ChatProvider>
    </UserProvider>
  );
};
