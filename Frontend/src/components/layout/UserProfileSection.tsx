import React from "react";
import { ChevronRight } from "lucide-react";
import { User } from "@/types";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface UserProfileSectionProps {
  user: User | null;
  currentUser: Partial<User>;
  onProfileClick: () => void;
}

export const UserProfileSection: React.FC<UserProfileSectionProps> = ({
  user,
  currentUser,
  onProfileClick,
}) => {
  const getUserDisplayName = () => {
    return user?.firstName || "Guest User";
  };

  const getUserPlan = () => {
    if (!user) return "Login Required";
    return currentUser?.plan ? `${currentUser.plan} Plan` : "Free Plan";
  };

  const getUserInitial = () => {
    return user?.firstName?.[0]?.toUpperCase() || "G";
  };

  const getPlanVariant = () => {
    if (!user) return "outline";
    const plan = currentUser?.plan?.toLowerCase();
    if (plan === "pro" || plan === "premium") return "default";
    return "secondary";
  };

  return (
    <div className="p-4 border-t">
      <Button
        onClick={onProfileClick}
        variant="ghost"
        className="w-full justify-between h-auto p-3 hover:bg-muted/50"
        aria-label="Open user profile"
      >
        <div className="flex items-center gap-3 min-w-0">
          <Avatar className="h-9 w-9">
            {user && currentUser?.avatar ? (
              <AvatarImage src={currentUser.avatar} alt="User Avatar" />
            ) : (
              <AvatarFallback className="bg-owl-primary text-white font-medium">
                {getUserInitial()}
              </AvatarFallback>
            )}
          </Avatar>

          <div className="text-left min-w-0 flex-1">
            <div className="text-sm font-medium truncate">
              {getUserDisplayName()}
            </div>
            <Badge
              variant={getPlanVariant()}
              className="text-xs mt-1 h-auto py-0.5 px-2"
            >
              {getUserPlan()}
            </Badge>
          </div>
        </div>

        <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
      </Button>
    </div>
  );
};
