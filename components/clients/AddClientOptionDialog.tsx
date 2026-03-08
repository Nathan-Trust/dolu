"use client";

import CustomDialog from "@/components/shared/CustomDialog";
import { Button } from "@/components/ui/button";

interface AddClientOptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddManually: () => void;
  onSendSubscription: () => void;
}

export default function AddClientOptionDialog({
  open,
  onOpenChange,
  onAddManually,
  onSendSubscription,
}: AddClientOptionDialogProps) {
  return (
    <CustomDialog
      open={open}
      onOpenChange={onOpenChange}
      showTrigger={false}
      contentClassName="!w-[759px] !max-w-[759px] !p-0 !gap-0 !border-0 !bg-transparent !shadow-none"
    >
      <div className="flex flex-col items-center gap-6 rounded-lg bg-[#f8f8f8] px-6 py-8">
        <div className="flex flex-col items-center gap-2">
          <h2 className="font-montserrat text-lg font-bold text-[#0f0f0f]">
            Add New Client
          </h2>
          <p className="font-montserrat text-sm font-normal text-[#6f6d6d]">
            How do you want to onboard this client?
          </p>
        </div>

        <div className="flex w-full gap-4">
          <Button
            onClick={() => {
              onOpenChange(false);
              onSendSubscription();
            }}
            className="flex h-12 flex-1 items-center justify-center rounded-lg bg-[#8a38f5] font-montserrat text-sm font-bold text-[#f8f8f8] hover:bg-[#7a2de0]"
          >
            Send Form to Client
          </Button>

          <Button
            onClick={() => {
              onOpenChange(false);
              onAddManually();
            }}
            className="flex h-12 flex-1 items-center justify-center rounded-lg bg-[#8a38f5] font-montserrat text-sm font-bold text-[#f8f8f8] hover:bg-[#7a2de0]"
          >
            Manually Onboard
          </Button>
        </div>
      </div>
    </CustomDialog>
  );
}
