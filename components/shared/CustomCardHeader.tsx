import { cn } from "@/lib/utils";
import { FC, JSX } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface CustomAuthCardHeaderProps {
  className?: string;
  title: string;
  content: string;
}

export const CustomAuthCardHeader: FC<CustomAuthCardHeaderProps> = ({
  className,
  title,
  content,
}) => {
  return (
    <div
      className={cn(
        "text-lightGray-three font-montserrat font-medium",
        className,
      )}
    >
      <h3 className="font-semibold text-xl">{title}</h3>
      <p className="text-md mt-1">{content}</p>
    </div>
  );
};

interface CustomCardContentProps {
  title?: string | JSX.Element;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export const CustomCardContent = ({
  title,
  description,
  children,
  className,
}: CustomCardContentProps) => {
  return (
    <Card className={cn("w-full h-[95%] border-none outline-none", className)}>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription className="leading-3">{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};
