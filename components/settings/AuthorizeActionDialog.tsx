"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { X } from "lucide-react";

interface AuthorizeActionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (password: string) => void;
}

export default function AuthorizeActionDialog({
  open,
  onOpenChange,
  onConfirm,
}: AuthorizeActionDialogProps) {
  const [password, setPassword] = useState("");

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
            Authorize Action
          </AlertDialogTitle>
          <AlertDialogDescription className="sr-only">
            Enter your password to authorize the access level update
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="mt-2 flex flex-col gap-1.5">
          <label className="font-montserrat text-sm text-[#0f0f0f]">
            Enter Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
            className="h-10 rounded-lg border border-[#e0e0e0] bg-[#f3f3f3] px-3 font-montserrat text-sm text-[#0f0f0f] outline-none focus:border-[#8a38f5]"
          />
        </div>

        <AlertDialogFooter className="mt-5 flex-row justify-center gap-3 sm:justify-center">
          <button
            onClick={() => {
              onConfirm(password);
              setPassword("");
            }}
            disabled={!password.trim()}
            className="rounded-lg bg-[#8a38f5] px-8 py-2.5 font-montserrat text-sm font-semibold text-white transition-colors hover:bg-[#7a2de0] disabled:opacity-50"
          >
            Confirm
          </button>
          <button
            onClick={() => {
              onOpenChange(false);
              setPassword("");
            }}
            className="rounded-lg bg-[#f2d5ff] px-8 py-2.5 font-montserrat text-sm font-semibold text-[#8a38f5] transition-colors hover:bg-[#e8c0ff]"
          >
            Cancel
          </button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
