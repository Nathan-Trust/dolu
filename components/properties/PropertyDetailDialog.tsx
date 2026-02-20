"use client";

import { Building2, ArrowRight, MapPin } from "lucide-react";
import Image from "next/image";
import CustomDialog from "@/components/shared/CustomDialog";
import {
  PropertyStatusBadge,
  type PropertyStatus,
} from "./PropertyStatusBadge";
import { Button } from "@/components/ui/button";
import { useEstate } from "@/hooks/useEstate";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface PropertyDetail {
  id: string;
  estateName: string;
  estateCode: string;
  location: string;
  status: PropertyStatus;
  totalUnits: number;
  availableUnits: number;
  sold: number;
  description: string;
  salesVelocity: PropertyStatus;
  heroImage: string;
  mapImage: string;
}

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

export const mockPropertyDetails: Record<string, PropertyDetail> = {
  e1: {
    id: "e1",
    estateName: "Joy Valley Hills",
    estateCode: "01014",
    location: "Ibeju Lekki",
    status: "Available",
    totalUnits: 24,
    availableUnits: 4,
    sold: 20,
    description:
      "Lorem ipsum dolor sit amet consectetur. Sodales proin ante adipiscing odio scelerisque mattis mattis facilisis. Arcu blandit ac potenti molestie elit. Ultrices viverra cras placerat feugiat ut. Netus pharetra massa feugiat mauris tincidunt. Sit risus quis in non lacus lacus leo eros viverra. Arcu scelerisque in et non cras volutpat magna dui fames. Tortor posuere velit amet proin mauris.\nEt tristique habitasse id pellentesque viverra vel netus. Risus diam ut augue amet vulputate semper.",
    salesVelocity: "Selling Fast",
    heroImage: "/5a872bc446ad776970f5d1c25973220607070e44.png",
    mapImage: "/cf12a255d3dbcf184c44c0f9f40603bf0e4b97a4.png",
  },
  e2: {
    id: "e2",
    estateName: "Joy Valley Hills",
    estateCode: "01014",
    location: "Ibeju Lekki",
    status: "Selling Fast",
    totalUnits: 24,
    availableUnits: 4,
    sold: 20,
    description:
      "Lorem ipsum dolor sit amet consectetur. Sodales proin ante adipiscing odio scelerisque mattis mattis facilisis. Arcu blandit ac potenti molestie elit. Ultrices viverra cras placerat feugiat ut. Netus pharetra massa feugiat mauris tincidunt. Sit risus quis in non lacus lacus leo eros viverra. Arcu scelerisque in et non cras volutpat magna dui fames. Tortor posuere velit amet proin mauris.\nEt tristique habitasse id pellentesque viverra vel netus. Risus diam ut augue amet vulputate semper.",
    salesVelocity: "Selling Fast",
    heroImage: "/5a872bc446ad776970f5d1c25973220607070e44.png",
    mapImage: "/cf12a255d3dbcf184c44c0f9f40603bf0e4b97a4.png",
  },
  e3: {
    id: "e3",
    estateName: "Joy Valley Hills",
    estateCode: "01014",
    location: "Ibeju Lekki",
    status: "Available",
    totalUnits: 24,
    availableUnits: 4,
    sold: 20,
    description:
      "Lorem ipsum dolor sit amet consectetur. Sodales proin ante adipiscing odio scelerisque mattis mattis facilisis. Arcu blandit ac potenti molestie elit. Ultrices viverra cras placerat feugiat ut. Netus pharetra massa feugiat mauris tincidunt. Sit risus quis in non lacus lacus leo eros viverra. Arcu scelerisque in et non cras volutpat magna dui fames. Tortor posuere velit amet proin mauris.\nEt tristique habitasse id pellentesque viverra vel netus. Risus diam ut augue amet vulputate semper.",
    salesVelocity: "Available",
    heroImage: "/5a872bc446ad776970f5d1c25973220607070e44.png",
    mapImage: "/cf12a255d3dbcf184c44c0f9f40603bf0e4b97a4.png",
  },
  e4: {
    id: "e4",
    estateName: "Joy Valley Hills",
    estateCode: "01014",
    location: "Ibeju Lekki",
    status: "Sold Out",
    totalUnits: 24,
    availableUnits: 0,
    sold: 24,
    description:
      "Lorem ipsum dolor sit amet consectetur. Sodales proin ante adipiscing odio scelerisque mattis mattis facilisis. Arcu blandit ac potenti molestie elit. Ultrices viverra cras placerat feugiat ut. Netus pharetra massa feugiat mauris tincidunt. Sit risus quis in non lacus lacus leo eros viverra. Arcu scelerisque in et non cras volutpat magna dui fames. Tortor posuere velit amet proin mauris.\nEt tristique habitasse id pellentesque viverra vel netus. Risus diam ut augue amet vulputate semper.",
    salesVelocity: "Sold Out",
    heroImage: "/5a872bc446ad776970f5d1c25973220607070e44.png",
    mapImage: "/cf12a255d3dbcf184c44c0f9f40603bf0e4b97a4.png",
  },
  e5: {
    id: "e5",
    estateName: "Joy Valley Hills",
    estateCode: "01014",
    location: "Ibeju Lekki",
    status: "Available",
    totalUnits: 24,
    availableUnits: 4,
    sold: 20,
    description:
      "Lorem ipsum dolor sit amet consectetur. Sodales proin ante adipiscing odio scelerisque mattis mattis facilisis. Arcu blandit ac potenti molestie elit. Ultrices viverra cras placerat feugiat ut. Netus pharetra massa feugiat mauris tincidunt. Sit risus quis in non lacus lacus leo eros viverra. Arcu scelerisque in et non cras volutpat magna dui fames. Tortor posuere velit amet proin mauris.\nEt tristique habitasse id pellentesque viverra vel netus. Risus diam ut augue amet vulputate semper.",
    salesVelocity: "Selling Fast",
    heroImage: "/5a872bc446ad776970f5d1c25973220607070e44.png",
    mapImage: "/cf12a255d3dbcf184c44c0f9f40603bf0e4b97a4.png",
  },
};

/* ------------------------------------------------------------------ */
/*  Sales Velocity Bar                                                 */
/* ------------------------------------------------------------------ */

const velocityConfig: Record<
  PropertyStatus,
  { gradient: string; label: string }
> = {
  Available: {
    gradient: "linear-gradient(90deg, #34c759 0%, #34c759 100%)",
    label: "Available",
  },
  "Selling Fast": {
    gradient: "linear-gradient(90deg, #ff8d28 0%, #8a38f5 100%)",
    label: "Selling Fast 🔥",
  },
  "Sold Out": {
    gradient: "linear-gradient(90deg, #ff383c 0%, #ff383c 100%)",
    label: "Sold Out",
  },
};

function SalesVelocityBar({ velocity }: { velocity: PropertyStatus }) {
  const config = velocityConfig[velocity];
  return (
    <div className="flex w-full flex-col gap-2 rounded-2xl bg-[#f8f8f8] p-2">
      {/* Label row */}
      <div className="flex items-center gap-1 text-sm leading-none">
        <span className="font-montserrat font-normal text-[#0f0f0f]">
          Sales Velocity
        </span>
        <span className="font-montserrat font-bold text-[#6f6d6d]">
          {config.label}
        </span>
      </div>
      {/* Bar */}
      <div
        className="h-2.5 w-full rounded-full"
        style={{ background: config.gradient }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Stat Item                                                          */
/* ------------------------------------------------------------------ */

function StatItem({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-1">
      <Building2 className="size-4 text-[#6f6d6d]" />
      <span className="font-montserrat text-sm font-normal text-[#6f6d6d]">
        {label}
      </span>
      <span className="font-montserrat text-sm font-bold text-[#6f6d6d]">
        {value}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

interface PropertyDetailDialogProps {
  property: PropertyDetail | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function PropertyDetailDialog({
  property,
  open,
  onOpenChange,
}: PropertyDetailDialogProps) {
  if (!property) return null;

  return (
    <CustomDialog
      open={open}
      onOpenChange={onOpenChange}
      showTrigger={false}
      contentClassName="!w-full !max-w-[759px] !p-0 !gap-0 !border-0 !bg-transparent !shadow-none"
    >
      <div className="flex max-h-[85vh] flex-col gap-4 overflow-y-auto rounded-lg bg-[#f8f8f8] p-4 md:max-h-[80vh]">
        {/* ── Hero banner ── */}
        <div className="relative h-40 w-full overflow-hidden rounded-lg md:h-48">
          {/* Background image */}
          <Image
            src={property.heroImage}
            alt={property.estateName}
            fill
            className="object-cover"
            priority
          />
          {/* Purple gradient overlay */}
          <div className="absolute inset-0 bg-linear-to-r from-[#8a38f5] to-[rgba(138,56,245,0)]" />
          {/* Text content */}
          <div className="absolute left-4 top-1/2 flex -translate-y-1/2 flex-col gap-1">
            <h2 className="font-montserrat text-2xl font-bold leading-none text-white md:text-[34px]">
              {property.estateName}
            </h2>
            <div className="flex items-center gap-1">
              <span className="font-montserrat text-sm font-bold text-white md:text-base">
                {property.location}
              </span>
              <PropertyStatusBadge status={property.status} />
            </div>
          </div>
        </div>

        {/* ── Stats row ── */}
        <div className="flex flex-wrap items-start justify-between gap-2">
          <StatItem label="Total Units" value={property.totalUnits} />
          <StatItem label="Available Units" value={property.availableUnits} />
          <StatItem label="Sold" value={property.sold} />
        </div>

        {/* ── Description ── */}
        <p className="font-montserrat text-sm font-normal leading-normal text-black">
          {property.description}
        </p>

        {/* ── Sales Velocity ── */}
        <SalesVelocityBar velocity={property.salesVelocity} />

        {/* ── Map section ── */}
        <div className="relative h-37.5 w-full overflow-hidden rounded-lg bg-white">
          <Image
            src={property.mapImage}
            alt={`Map of ${property.location}`}
            fill
            className="object-cover"
          />
          {/* View in Maps button */}
          <div className="absolute bottom-3 right-3 flex flex-col items-center gap-1">
            <div className="flex size-12 items-center justify-center rounded-full bg-[#8a38f5]">
              <MapPin className="size-6 text-white" />
            </div>
            <div className="rounded bg-[#f8f8f8] px-2 py-0.5 shadow-md">
              <span className="font-montserrat text-[9px] font-semibold text-[#0f0f0f]">
                View in Maps
              </span>
            </div>
          </div>
        </div>

        {/* ── See Inventory button ── */}
        <div className="flex justify-end">
          <Button className="gap-1 rounded-lg bg-[#8a38f5] px-4 py-2 font-montserrat text-sm font-bold text-[#f8f8f8] hover:bg-[#7a2de0]">
            See Inventory
            <ArrowRight className="size-5" />
          </Button>
        </div>
      </div>
    </CustomDialog>
  );
}

/* ── Wrapper component that uses the useEstate hook ── */
interface PropertyDetailDialogWrapperProps {
  selectedPropertyId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PropertyDetailDialogWrapper({
  selectedPropertyId,
  open,
  onOpenChange,
}: PropertyDetailDialogWrapperProps) {
  const { data: estateData } = useEstate(selectedPropertyId || undefined);

  /* Map API estate to component PropertyDetail */
  const property: PropertyDetail | null = estateData
    ? {
        id: String(estateData.id),
        estateName: estateData.title,
        estateCode: String(estateData.id),
        location: estateData.location || estateData.city || "",
        status: "Available" as PropertyStatus,
        totalUnits: estateData.properties?.length || 0,
        availableUnits:
          estateData.properties?.filter((p) => p.status === "available")
            .length || 0,
        sold:
          estateData.properties?.filter((p) => p.status === "sold").length || 0,
        description: estateData.description || "",
        salesVelocity: "Available" as PropertyStatus,
        heroImage:
          (estateData.images?.[0] as any)?.fileUrl ||
          "/5a872bc446ad776970f5d1c25973220607070e44.png",
        mapImage: "/cf12a255d3dbcf184c44c0f9f40603bf0e4b97a4.png",
      }
    : selectedPropertyId
      ? (mockPropertyDetails[selectedPropertyId] ?? null)
      : null;

  return (
    <PropertyDetailDialog
      property={property}
      open={open}
      onOpenChange={onOpenChange}
    />
  );
}
