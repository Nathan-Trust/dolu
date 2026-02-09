import React from "react";
import { Card, CardContent, CardDescription, CardHeader } from "../ui/card";
import Image from "next/image";

interface CustomMetricCardProps {
  title: string;
  value: string | number;
  imageSrc?: string;
  onClick?: () => void; // Optional click handler
  className?: string; // Optional additional classes
}

const CustomMetricCard: React.FC<CustomMetricCardProps> = ({
  title,
  value,
  imageSrc,
  onClick,
  className = "",
}) => {
  return (
    <Card className={`cursor-pointer ${className}`} onClick={onClick}>
      <CardHeader className="card-header">
        <CardDescription className="card-description">{title}</CardDescription>
      </CardHeader>
      <CardContent className="card-content flex justify-between items-center">
        <p>{title === "Revenue" ? `$ ${value}` : value}</p>
        {imageSrc && (
          <Image
            src={imageSrc}
            alt="graph"
            className="w-10"
            width={100}
            height={190}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default CustomMetricCard;
