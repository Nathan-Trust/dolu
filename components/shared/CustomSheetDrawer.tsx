import React, { ReactNode, useState } from "react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface CustomSheetProps {
  triggerComponent?: ReactNode | string;
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  active?: boolean;
  setActive?: (newState: boolean) => void;
  showTrigger?: boolean;
}

const CustomSheet: React.FC<CustomSheetProps> = ({
  triggerComponent = "Open",
  title,
  description,
  children,
  className = "",
  active = false,
  setActive,
  showTrigger = true,
}) => {
  // If `setActive` is not passed, use local state
  const [localActive, setLocalActive] = useState(active);

  // Use the passed `setActive` if available, otherwise use the local state
  const handleOpenChange = (newState: boolean) => {
    if (setActive) {
      setActive(newState);
    } else {
      setLocalActive(newState);
    }
  };

  return (
    <Sheet
      open={setActive !== undefined ? active : localActive}
      onOpenChange={handleOpenChange}
    >
      {showTrigger && (
        <SheetTrigger asChild>
          {typeof triggerComponent === "string" ? (
            <button onClick={() => handleOpenChange(!active)}>
              {triggerComponent}
            </button>
          ) : (
            triggerComponent
          )}
        </SheetTrigger>
      )}
      <SheetContent
        forceMount
        onOpenAutoFocus={(e) => e.preventDefault()}
        onCloseAutoFocus={(e) => e.preventDefault()}
        className={cn(
          ` px-2 md:px-5 min-w-0 sm:min-w-87.5  border-none outline-none ring-0 h-full bg-[#FCFCFC]`,
          className,
        )}
      >
        <SheetHeader>
          {title && <SheetTitle className="text-start">{title}</SheetTitle>}
          {description && (
            <SheetDescription className="text-start">
              {description}
            </SheetDescription>
          )}
        </SheetHeader>
        <div className="overflow-y-auto">{children}</div>
      </SheetContent>
    </Sheet>
  );
};

export default CustomSheet;
