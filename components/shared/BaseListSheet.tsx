"use client";

import { useState, type ReactNode } from "react";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ChevronLeft, X } from "lucide-react";
import { useMobile } from "@/hooks/use-mobile";

export function BaseListSheet({
  isOpen,
  onClose,
  headerLines,
  children,
  headerExtra,
  footerAction, // 👈 new prop
}: Readonly<{
  isOpen: boolean;
  onClose: () => void;
  headerLines?: string[];
  children?: ReactNode;
  headerExtra?: ReactNode;
  footerAction?: ReactNode; // 👈 you can pass custom footer buttons here
}>) {
  const deviceIsMobile = useMobile();

  const header = (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center gap-3">
        <Button
          aria-label="Back"
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>
      <div className="text-center">
        {headerLines?.map((line, i) => (
          <div
            key={i}
            className={`leading-tight ${
              i === 0 ? "text-base" : "text-lg font-medium"
            }`}
          >
            {line}
          </div>
        ))}
      </div>
      <Button
        aria-label="Close"
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="h-8 w-8 text-destructive"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );

  const content = (
    <div className="flex flex-col h-full">
      {header}
      {headerExtra}
      <div className="flex-1 overflow-y-auto">{children}</div>
      <div className="p-4 border-t sticky bottom-0 bg-variable_effect-solid">
        {footerAction ? (
          footerAction
        ) : (
          <Button className="w-full" onClick={onClose}>
            Close
          </Button>
        )}
      </div>
    </div>
  );

  if (deviceIsMobile) {
    return (
      <Drawer
        open={isOpen}
        onOpenChange={(open) => {
          if (!open) onClose();
        }}
      >
        <DrawerContent
          className="h-[80vh] mt-0 p-0"
          forceMount
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          {content}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <SheetContent
        side="right"
        className="w-full sm:max-w-md p-0"
        forceMount
        onOpenAutoFocus={(e) => e.preventDefault()}
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        {content}
      </SheetContent>
    </Sheet>
  );
}
