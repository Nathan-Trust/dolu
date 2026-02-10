"use client";

import { Building2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface NewlyAddedEstate {
  id: string;
  name: string;
  location: string;
  totalUnits: number;
  availableUnits: number;
  sold: number;
  timeAgo: string;
}

interface NewlyAddedEstateCardProps {
  estate: NewlyAddedEstate;
  onExplore?: (id: string) => void;
}

export function NewlyAddedEstateCard({
  estate,
  onExplore,
}: NewlyAddedEstateCardProps) {
  return (
    <div className="flex w-77.5 shrink-0 flex-col gap-4 rounded-lg bg-[#f8f8f8] p-2 shadow-sm">
      {/* Info section */}
      <div className="flex flex-col gap-2.5">
        {/* Name & location */}
        <div className="flex flex-col font-montserrat text-sm">
          <span className="font-bold text-[#0f0f0f]">{estate.name}</span>
          <span className="text-[#6f6d6d]">{estate.location}</span>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          <div className="flex items-center gap-1">
            <Building2 className="size-4 text-[#6f6d6d]" />
            <span className="font-montserrat text-sm text-[#6f6d6d]">
              Total Units
            </span>
            <span className="font-montserrat text-sm font-bold text-[#6f6d6d]">
              {estate.totalUnits}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Building2 className="size-4 text-[#6f6d6d]" />
            <span className="font-montserrat text-sm text-[#6f6d6d]">
              Available Units
            </span>
            <span className="font-montserrat text-sm font-bold text-[#6f6d6d]">
              {estate.availableUnits}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Building2 className="size-4 text-[#6f6d6d]" />
            <span className="font-montserrat text-sm text-[#6f6d6d]">Sold</span>
            <span className="font-montserrat text-sm font-bold text-[#6f6d6d]">
              {estate.sold}
            </span>
          </div>
        </div>
      </div>

      {/* Timestamp */}
      <span className="font-montserrat text-[9px] font-semibold text-[#6f6d6d]">
        {estate.timeAgo}
      </span>

      {/* Explore button */}
      <Button
        className="w-full gap-1 rounded-lg bg-[#8a38f5] p-2 font-montserrat text-[9px] font-semibold text-[#f8f8f8] hover:bg-[#7a2de0]"
        onClick={() => onExplore?.(estate.id)}
      >
        Explore
        <ArrowRight className="size-4" />
      </Button>
    </div>
  );
}
