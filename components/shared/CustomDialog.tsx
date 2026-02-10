import { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface CustomDialogProps {
  triggerComponent?: ReactNode | string;
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  open?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  disabled?: boolean; // Add disabled prop here
  showTrigger?: boolean;
}

const CustomDialog = ({
  triggerComponent = "Open",
  title,
  description,
  children,
  className = "",
  open,
  onOpenChange,
  contentClassName = "",
  disabled = false, // Default to false if not provided
  showTrigger = true,
}: CustomDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {showTrigger && (
        <DialogTrigger
          className={cn("px-0 outline-none", className)}
          disabled={disabled}
        >
          {typeof triggerComponent === "string" ? (
            <button disabled={disabled}>{triggerComponent}</button>
          ) : (
            triggerComponent
          )}
        </DialogTrigger>
      )}
      <DialogContent
        className={cn(
          "bg-colorAuthBgColor BgColor shadow-[1px_3px_18px_rgba(0,0,0,0.06)] w-[350px] md:w-full",
          contentClassName,
        )}
      >
        <DialogHeader>
          {title && <DialogTitle>{title}</DialogTitle>}
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default CustomDialog;
