import React from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import { User, Edit } from "lucide-react";

interface ProfileHeaderProps {
  name: string;
  email: string;
  avatar?: string;
  onEdit?: () => void;
  isEditing?: boolean;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  name,
  email,
  avatar,
  onEdit,
  isEditing = false,
}) => {
  return (
    <div className="flex items-center justify-between p-6 border-b border-border/40">
      <div className="flex items-center space-x-4">
        <Avatar className="w-16 h-16 border-4 border-teal-500/20">
          {avatar ? (
            <AvatarImage src={avatar} alt={name} />
          ) : (
            <AvatarFallback className="bg-gradient-to-br from-teal-500 to-teal-600 text-white text-xl">
              <User className="w-8 h-8" />
            </AvatarFallback>
          )}
        </Avatar>

        <div>
          <h2 className="text-2xl font-bold text-foreground">
            {name || "User Profile"}
          </h2>
          <p className="text-muted-foreground">{email || "user@example.com"}</p>
        </div>
      </div>

      {onEdit && (
        <Button
          onClick={onEdit}
          variant={isEditing ? "secondary" : "outline"}
          className="flex items-center space-x-2"
        >
          <Edit className="w-4 h-4" />
          <span>{isEditing ? "Cancel" : "Edit Profile"}</span>
        </Button>
      )}
    </div>
  );
};
