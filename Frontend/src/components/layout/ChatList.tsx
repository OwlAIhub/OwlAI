import React from "react";
import { MessageSquare, Star, Clock, Edit2, Trash2 } from "lucide-react";
import { ChatSession } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface ChatListProps {
  chats: ChatSession[];
  activeChatId?: string | null;
  searchQuery: string;
  editingChatId: string | null;
  editedTitle: string;
  onChatClick: (chat: ChatSession) => void;
  onStarToggle: (chatId: string, e: React.MouseEvent) => void;
  onEditStart: (
    chatId: string,
    currentTitle: string,
    e: React.MouseEvent
  ) => void;
  onEditChange: (value: string) => void;
  onEditSubmit: (chatId: string) => void;
  onEditCancel: () => void;
  onDelete: (chatId: string) => void;
}

export const ChatList: React.FC<ChatListProps> = ({
  chats,
  activeChatId,
  searchQuery,
  editingChatId,
  editedTitle,
  onChatClick,
  onStarToggle,
  onEditStart,
  onEditChange,
  onEditSubmit,
  onEditCancel,
  onDelete,
}) => {
  const filteredChats = chats.filter((chat) =>
    chat?.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const starredChats = filteredChats.filter((chat) => chat?.starred);
  const regularChats = filteredChats.filter((chat) => !chat?.starred);

  const handleKeyPress = (e: React.KeyboardEvent, chatId: string) => {
    if (e.key === "Enter") {
      onEditSubmit(chatId);
    } else if (e.key === "Escape") {
      onEditCancel();
    }
  };

  const ChatItem: React.FC<{ chat: ChatSession }> = ({ chat }) => (
    <div
      onClick={() => onChatClick(chat)}
      className={cn(
        "group flex items-center justify-between rounded-lg px-3 py-2.5 cursor-pointer transition-colors",
        "hover:bg-muted/50",
        activeChatId === chat.id && "bg-muted"
      )}
      aria-label={`Open chat: ${chat.title}`}
    >
      <div className="flex items-center min-w-0 flex-1 gap-2">
        <MessageSquare className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        {editingChatId === chat.id ? (
          <Input
            type="text"
            value={editedTitle}
            onChange={(e) => onEditChange(e.target.value)}
            onBlur={() => onEditSubmit(chat.id)}
            onKeyDown={(e) => handleKeyPress(e, chat.id)}
            autoFocus
            className="h-auto p-0 border-none bg-transparent focus-visible:ring-0 text-sm"
          />
        ) : (
          <span className="text-sm truncate text-foreground">{chat.title}</span>
        )}
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {/* Star button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => onStarToggle(chat.id, e)}
          className="h-7 w-7 p-0"
          aria-label={chat.starred ? "Unstar chat" : "Star chat"}
        >
          <Star
            className={cn(
              "h-3.5 w-3.5",
              chat.starred
                ? "text-yellow-500 fill-yellow-500"
                : "text-muted-foreground"
            )}
          />
        </Button>

        {/* Edit button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => onEditStart(chat.id, chat.title, e)}
          className="h-7 w-7 p-0"
          aria-label="Edit chat title"
        >
          <Edit2 className="h-3.5 w-3.5 text-muted-foreground" />
        </Button>

        {/* Delete button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            if (window.confirm("Are you sure you want to delete this chat?")) {
              onDelete(chat.id);
            }
          }}
          className="h-7 w-7 p-0 hover:text-destructive"
          aria-label="Delete chat"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );

  const SectionHeader: React.FC<{
    icon: React.ReactNode;
    title: string;
    accent?: boolean;
  }> = ({ icon, title, accent = false }) => (
    <div
      className={cn(
        "flex items-center gap-2 px-3 py-2 text-xs font-medium uppercase tracking-wider",
        accent ? "text-owl-accent" : "text-muted-foreground"
      )}
    >
      {icon}
      {title}
    </div>
  );

  return (
    <ScrollArea className="flex-1 px-2">
      <div className="space-y-1">
        {/* Starred Chats Section */}
        {starredChats.length > 0 && (
          <div className="space-y-1">
            <SectionHeader
              icon={<Star className="h-3 w-3" />}
              title="Starred"
              accent
            />
            <div className="space-y-0.5">
              {starredChats.map((chat) => (
                <ChatItem key={chat.id} chat={chat} />
              ))}
            </div>
            {regularChats.length > 0 && <Separator className="my-3" />}
          </div>
        )}

        {/* Recent Chats Section */}
        <div className="space-y-1">
          <SectionHeader icon={<Clock className="h-3 w-3" />} title="Recent" />
          {regularChats.length > 0 ? (
            <div className="space-y-0.5">
              {regularChats.map((chat) => (
                <ChatItem key={chat.id} chat={chat} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-sm text-muted-foreground">
              {searchQuery ? "No matching chats" : "No recent chats"}
            </div>
          )}
        </div>
      </div>
    </ScrollArea>
  );
};
