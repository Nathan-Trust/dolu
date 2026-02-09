"use client";

import { useMobile } from "@/hooks/use-mobile";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Sheet, SheetContent } from "@/components/ui/sheet";

interface ResponsiveOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  drawerHeight?: string; // e.g. "80vh"
  sheetWidth?: string; // e.g. "sm:max-w-md"
  side?: "left" | "right" | "top" | "bottom";
}

export function ResponsiveOverlay({
  isOpen,
  onClose,
  children,
  drawerHeight = "80vh",
  sheetWidth = "sm:max-w-md",
  side = "right",
}: Readonly<ResponsiveOverlayProps>) {
  const isMobile = useMobile();

  if (isMobile) {
    return (
      <Drawer
        open={isOpen}
        onOpenChange={(open) => {
          if (!open) onClose();
        }}
      >
        <DrawerContent forceMount className={`h-[${drawerHeight}]`}>
          {children}
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
        forceMount
        side={side}
        className={`w-full ${sheetWidth} p-0`}
      >
        {children}
      </SheetContent>
    </Sheet>
  );
}
