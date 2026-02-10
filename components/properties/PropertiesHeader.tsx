"use client";

import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PropertiesHeaderProps {
  showAddEstate?: boolean;
  onAddEstate?: () => void;
}

export function PropertiesHeader({
  showAddEstate = false,
  onAddEstate,
}: PropertiesHeaderProps) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="font-montserrat text-lg font-bold text-[#0f0f0f]">
          Properties
        </h1>
        <p className="font-montserrat text-xs text-[#6f6d6d]">
          Session <span className="font-bold">Jul 10, 2026</span>
        </p>
      </div>
      {showAddEstate && (
        <div>
          <Button
            onClick={onAddEstate}
            className="gap-1 rounded-lg bg-[#8a38f5] px-1 py-1 font-montserrat text-sm font-bold text-[#f8f8f8] hover:bg-[#7a2de0]"
          >
            Add Estate
            <Home className="size-5" />
          </Button>
        </div>
      )}
    </div>
  );
}
