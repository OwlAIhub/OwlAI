import React from "react";
import { Card, CardContent } from "@/shared/components/ui/card";

interface Stat {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: string;
}

interface ProfileStatsProps {
  stats: Stat[];
}

export const ProfileStats: React.FC<ProfileStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {stats.map((stat, index) => (
        <Card
          key={index}
          className="hover:shadow-md transition-shadow duration-300"
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </p>
                <p
                  className={`text-2xl font-bold ${
                    stat.color || "text-foreground"
                  }`}
                >
                  {stat.value}
                </p>
              </div>
              {stat.icon && (
                <div
                  className={`p-2 rounded-full ${
                    stat.color ? "bg-opacity-10" : "bg-muted"
                  }`}
                >
                  {stat.icon}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
