"use client";

import CustomDialog from "@/components/shared/CustomDialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Star celebration icon (matching Figma star-rainbow-bold-duotone)   */
/* ------------------------------------------------------------------ */

function StarCelebrationIcon() {
  return (
    <svg
      width="96"
      height="96"
      viewBox="0 0 96 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Star body */}
      <path d="M52 12L58.5 32H48L52 12Z" fill="#8a38f5" />
      <path d="M52 12L42 28L48 32L52 12Z" fill="#a66bf7" />
      <path d="M58.5 32L72 26L62 36L58.5 32Z" fill="#8a38f5" />
      <path d="M62 36L58.5 32L52 38L62 36Z" fill="#a66bf7" />
      <path d="M52 38L48 32L42 36L52 38Z" fill="#c4a0f9" />
      {/* Trailing lines */}
      <path
        d="M38 52L18 72"
        stroke="#c4a0f9"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M44 58L28 78"
        stroke="#d4bffa"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M50 56L42 84"
        stroke="#e4d8fb"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

interface SuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** e.g. "New Client Added" or "New Estate Added" */
  title: string;
  /** e.g. "You have successfully added Client **Peter Abbey #01014**" */
  description: React.ReactNode;
  /** Label for the action button, e.g. "View Client" or "View Estate" */
  actionLabel: string;
  onAction?: () => void;
}

export default function SuccessDialog({
  open,
  onOpenChange,
  title,
  description,
  actionLabel,
  onAction,
}: SuccessDialogProps) {
  return (
    <CustomDialog
      open={open}
      onOpenChange={onOpenChange}
      triggerComponent={<span />}
      contentClassName="!w-[420px] !max-w-[420px] !p-0 !gap-0 !border-0 !bg-transparent !shadow-none"
    >
      <div className="relative flex flex-col items-center rounded-lg bg-[#f8f8f8] px-4 pt-4 pb-6">
        {/* Close button */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-4 text-[#6f6d6d] hover:text-[#0f0f0f]"
        >
          <X className="size-6" />
        </button>

        {/* Star icon */}
        <div className="mb-2">
          <StarCelebrationIcon />
        </div>

        {/* Text content */}
        <div className="flex flex-col items-center gap-1">
          <p className="font-montserrat text-sm font-bold text-[#0f0f0f]">
            Success! {title}
          </p>
          <p className="text-center font-montserrat text-sm font-normal text-[#6f6d6d]">
            {description}
          </p>
        </div>

        {/* Action button */}
        <Button
          onClick={() => {
            onAction?.();
            onOpenChange(false);
          }}
          className="mt-4 w-31 rounded-lg bg-[#8a38f5] px-1 py-2 font-montserrat text-sm font-bold text-[#f8f8f8] hover:bg-[#7a2de0]"
        >
          {actionLabel}
        </Button>
      </div>
    </CustomDialog>
  );
}
