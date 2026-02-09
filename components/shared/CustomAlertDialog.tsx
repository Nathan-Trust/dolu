import { ReactNode } from "react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

interface CustomAlertDialogProps {
  triggerComponent?: ReactNode | string;
  title?: string;
  description?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  className?: string;
  open?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  disabled?: boolean;
}

const CustomAlertDialog = ({
  triggerComponent = "Open",
  title = "Are you sure?",
  description = "This action cannot be undone.",
  onConfirm,
  onCancel,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  className = "",
  open,
  onOpenChange,
  disabled = false,
}: CustomAlertDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogTrigger className={cn("px-0", className)} disabled={disabled}>
        {typeof triggerComponent === "string" ? (
          <button disabled={disabled}>{triggerComponent}</button>
        ) : (
          triggerComponent
        )}
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-[400px] lg:max-w-lg">
        <AlertDialogHeader>
          {title && <AlertDialogTitle>{title}</AlertDialogTitle>}
          {description && (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            className="h-[45px] bg-accent  border-none outline-none"
            onClick={onCancel}
          >
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className=" h-[45px] bg-blood-3 text-blood-9 border-none outline-none"
          >
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CustomAlertDialog;
