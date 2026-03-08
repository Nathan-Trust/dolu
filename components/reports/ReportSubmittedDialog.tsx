"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { FileText, X } from "lucide-react";

interface ReportSubmittedDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmitAnother: () => void;
}

export default function ReportSubmittedDialog({
  open,
  onClose,
  onSubmitAnother,
}: ReportSubmittedDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="flex max-w-sm flex-col items-center gap-4 rounded-2xl p-8"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-[#6f6d6d] transition-colors hover:text-[#0f0f0f]"
        >
          <X className="size-5" />
        </button>

        <div className="flex size-16 items-center justify-center rounded-xl bg-[#8a38f5]">
          <FileText className="size-8 text-white" />
        </div>

        <p className="font-montserrat text-base font-bold text-[#0f0f0f]">
          Report Submitted
        </p>

        <div className="flex w-full items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg bg-[#8a38f5] py-2 font-montserrat text-sm font-bold text-white transition-colors hover:bg-[#7a2be0]"
          >
            Close
          </button>
          <button
            onClick={onSubmitAnother}
            className="flex-1 rounded-lg bg-[#8a38f5] py-2 font-montserrat text-sm font-bold text-white transition-colors hover:bg-[#7a2be0]"
          >
            Submit another report
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
