"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { X } from "lucide-react";

interface ConfirmUpdateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export default function ConfirmUpdateDialog({
  open,
  onOpenChange,
  onConfirm,
}: ConfirmUpdateDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-sm rounded-2xl p-6">
        {/* Close button */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 rounded-full p-0.5 text-[#6f6d6d] hover:text-[#0f0f0f]"
        >
          <X className="h-5 w-5" />
        </button>

        <AlertDialogHeader className="items-center text-center">
          <AlertDialogTitle className="font-montserrat text-base font-bold text-[#0f0f0f]">
            Are you Sure you Want to Update this Access Level?
          </AlertDialogTitle>
          <AlertDialogDescription className="font-montserrat text-sm text-[#6f6d6d]">
            This feature will be available to all users on this level
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4 flex-row justify-center gap-3 sm:justify-center">
          <button
            onClick={onConfirm}
            className="rounded-lg bg-[#8a38f5] px-8 py-2.5 font-montserrat text-sm font-semibold text-white transition-colors hover:bg-[#7a2de0]"
          >
            Confirm
          </button>
          <button
            onClick={() => onOpenChange(false)}
            className="rounded-lg bg-[#f2d5ff] px-8 py-2.5 font-montserrat text-sm font-semibold text-[#8a38f5] transition-colors hover:bg-[#e8c0ff]"
          >
            Cancel
          </button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
