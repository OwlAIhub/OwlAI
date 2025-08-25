import React from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onClearSearch: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
  onClearSearch,
}) => {
  return (
    <div className="p-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
          className={cn(
            "pl-9 pr-9 bg-muted/50 border-none focus-visible:ring-2 focus-visible:ring-owl-primary",
            "placeholder:text-muted-foreground"
          )}
          placeholder="Search chats..."
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSearch}
            className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 p-0 hover:bg-muted"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};
