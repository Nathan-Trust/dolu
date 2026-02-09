import { ReactNode } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"; // Assuming Popover components are available in your Shadcn UI library
import { cn } from "@/lib/utils";

interface CustomPopoverProps {
  triggerComponent?: ReactNode | string;
  children: ReactNode;
  className?: string;
  popoverClassName?: string;
  disabled?: boolean;
  open?: boolean;
  onOpenChange?: () => void;
}

const CustomPopover = ({
  triggerComponent = "Open",
  children,
  className = "",
  popoverClassName = "",
  disabled = false,
  open,
  onOpenChange,
}: CustomPopoverProps) => {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger className={cn("px-0", className)} disabled={disabled}>
        {typeof triggerComponent === "string" ? (
          <button disabled={disabled}>{triggerComponent}</button>
        ) : (
          triggerComponent
        )}
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className={cn("w-[350px] md:w-full", popoverClassName)}
      >
        {children}
      </PopoverContent>
    </Popover>
  );
};

export default CustomPopover;
