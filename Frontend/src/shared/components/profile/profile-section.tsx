import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Button } from "@/shared/components/ui/button";

interface ProfileField {
  id: string;
  label: string;
  value: string;
  type?: "text" | "email" | "select";
  options?: string[];
  placeholder?: string;
}

interface ProfileSectionProps {
  title: string;
  icon?: React.ReactNode;
  fields: ProfileField[];
  isEditing?: boolean;
  onFieldChange?: (id: string, value: string) => void;
  onSave?: () => void;
  onCancel?: () => void;
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({
  title,
  icon,
  fields,
  isEditing = false,
  onFieldChange,
  onSave,
  onCancel,
}) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          {icon}
          <span>{title}</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {fields.map(field => (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>{field.label}</Label>
            {isEditing ? (
              field.type === "select" ? (
                <select
                  id={field.id}
                  value={field.value}
                  onChange={e => onFieldChange?.(field.id, e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 bg-background"
                >
                  {field.options?.map(option => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <Input
                  id={field.id}
                  type={field.type || "text"}
                  value={field.value}
                  onChange={e => onFieldChange?.(field.id, e.target.value)}
                  placeholder={field.placeholder}
                />
              )
            ) : (
              <p className="text-foreground bg-muted/30 px-3 py-2 rounded-md">
                {field.value || "Not specified"}
              </p>
            )}
          </div>
        ))}

        {isEditing && (
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={onSave} className="bg-teal-600 hover:bg-teal-700">
              Save Changes
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
