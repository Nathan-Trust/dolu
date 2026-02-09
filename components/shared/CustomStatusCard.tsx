import React from "react";
import { Card, CardContent } from "../ui/card";
import { cn } from "@/lib/utils";

interface StatusCardProps {
  title: string;
  status: React.ReactNode; // Changed to React.ReactNode to accept both strings and components
  icon?: React.ReactNode;
  borderColor?: string;
  gradientColors?: [string, string];
  className?: string;
}

const StatusCard: React.FC<StatusCardProps> = ({
  title,
  status,
  icon,
  borderColor = "#548235", // Default border color
  gradientColors = ["#548235", "#121C0B"], // Default gradient colors
  className,
}) => {
  return (
    <Card
      className={cn(`border border-[${borderColor}]`, className)}
      style={{
        backgroundImage: `linear-gradient(161deg, ${gradientColors[0]} 12.61%, ${gradientColors[1]} 105.46%)`,
      }}
    >
      <CardContent className="flex gap-4 items-start text-white p-4">
        {icon && (
          <div className="text-[#548235] bg-white w-12 h-12 flex items-center rounded-md justify-center">
            {icon}
          </div>
        )}
        <div>
          <p>{title}</p>
          <p className="text-xl font-medium">{status}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatusCard;
