"use client";

import { MapPin } from "lucide-react";
import Image from "next/image";
import CustomDialog from "@/components/shared/CustomDialog";
import { UnitStatusBadge, type UnitStatus } from "./UnitStatusBadge";
import { RoleBadge } from "@/components/shared/RoleBadge";
import { type UserRole } from "@/util/status";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface UnitDetail {
  id: string;
  unitId: string;
  unitType: string;
  status: UnitStatus;
  currentStage: string;
  minimumPrice: string;
  maximumPrice: string;
  agent: {
    name: string;
    role: UserRole;
    avatar?: string;
  };
  /* property details */
  propertyType: string;
  description: string;
  title: string;
  location: string;
  estate: string;
  /* estate hero */
  heroImage: string;
  mapImage: string;
  galleryImages: string[];
  aboutText: string;
}

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

const heroImg = "/5a872bc446ad776970f5d1c25973220607070e44.png";
const mapImg = "/cf12a255d3dbcf184c44c0f9f40603bf0e4b97a4.png";
const gallery1 = "/8e0fdb3ac91f86d544bba75f9f07f514af868474.png";
const gallery2 = "/05fd06985f166cddcbb77d898788af4d97c87533.png";
const gallery3 = "/a835890864853b52b7ece0a40c0c932b97d8cb55.png";

export const mockUnitDetails: Record<string, UnitDetail> = {
  u1: {
    id: "u1",
    unitId: "001",
    unitType: "2 Bedroom Flat Duplex",
    status: "Available",
    currentStage: "Payment",
    minimumPrice: "₦15,000,000",
    maximumPrice: "₦20,000,000",
    agent: { name: "John Ibekwe", role: "staff" },
    propertyType: "Property",
    description: "2 Bedroom Duplex",
    title: "C of O, Governor's Consent, Title Deed",
    location: "Ibeju Lekki, Lagos",
    estate: "Joy Valley Hills",
    heroImage: heroImg,
    mapImage: mapImg,
    galleryImages: [gallery1, gallery2, gallery3],
    aboutText:
      "Lorem ipsum dolor sit amet consectetur. Sodales proin ante adipiscing odio scelerisque mattis mattis facilisis. Arcu blandit ac potenti molestie elit. Ultrices viverra cras placerat feugiat ut. Netus pharetra massa feugiat mauris tincidunt. Sit risus quis in non lacus lacus leo eros viverra. Arcu scelerisque in et non cras volutpat magna dui fames. Tortor posuere velit amet proin mauris.\nEt tristique habitasse id pellentesque viverra vel netus. Risus diam ut augue amet vulputate semper.",
  },
  u2: {
    id: "u2",
    unitId: "001",
    unitType: "2 Bedroom Flat Duplex",
    status: "Reserved",
    currentStage: "Payment",
    minimumPrice: "₦15,000,000",
    maximumPrice: "₦20,000,000",
    agent: { name: "John Ibekwe", role: "staff" },
    propertyType: "Property",
    description: "2 Bedroom Duplex",
    title: "C of O, Governor's Consent, Title Deed",
    location: "Ibeju Lekki, Lagos",
    estate: "Joy Valley Hills",
    heroImage: heroImg,
    mapImage: mapImg,
    galleryImages: [gallery1, gallery2, gallery3],
    aboutText:
      "Lorem ipsum dolor sit amet consectetur. Sodales proin ante adipiscing odio scelerisque mattis mattis facilisis. Arcu blandit ac potenti molestie elit. Ultrices viverra cras placerat feugiat ut. Netus pharetra massa feugiat mauris tincidunt. Sit risus quis in non lacus lacus leo eros viverra. Arcu scelerisque in et non cras volutpat magna dui fames. Tortor posuere velit amet proin mauris.\nEt tristique habitasse id pellentesque viverra vel netus. Risus diam ut augue amet vulputate semper.",
  },
  u3: {
    id: "u3",
    unitId: "001",
    unitType: "2 Bedroom Flat Duplex",
    status: "Sold",
    currentStage: "Completed",
    minimumPrice: "₦15,000,000",
    maximumPrice: "₦20,000,000",
    agent: { name: "John Ibekwe", role: "realtor" },
    propertyType: "Property",
    description: "2 Bedroom Duplex",
    title: "C of O, Governor's Consent, Title Deed",
    location: "Ibeju Lekki, Lagos",
    estate: "Joy Valley Hills",
    heroImage: heroImg,
    mapImage: mapImg,
    galleryImages: [gallery1, gallery2, gallery3],
    aboutText:
      "Lorem ipsum dolor sit amet consectetur. Sodales proin ante adipiscing odio scelerisque mattis mattis facilisis. Arcu blandit ac potenti molestie elit. Ultrices viverra cras placerat feugiat ut. Netus pharetra massa feugiat mauris tincidunt. Sit risus quis in non lacus lacus leo eros viverra. Arcu scelerisque in et non cras volutpat magna dui fames. Tortor posuere velit amet proin mauris.\nEt tristique habitasse id pellentesque viverra vel netus. Risus diam ut augue amet vulputate semper.",
  },
  u4: {
    id: "u4",
    unitId: "001",
    unitType: "2 Bedroom Flat Duplex",
    status: "Available",
    currentStage: "Payment",
    minimumPrice: "₦15,000,000",
    maximumPrice: "₦20,000,000",
    agent: { name: "John Ibekwe", role: "staff" },
    propertyType: "Property",
    description: "2 Bedroom Duplex",
    title: "C of O, Governor's Consent, Title Deed",
    location: "Ibeju Lekki, Lagos",
    estate: "Joy Valley Hills",
    heroImage: heroImg,
    mapImage: mapImg,
    galleryImages: [gallery1, gallery2, gallery3],
    aboutText:
      "Lorem ipsum dolor sit amet consectetur. Sodales proin ante adipiscing odio scelerisque mattis mattis facilisis. Arcu blandit ac potenti molestie elit. Ultrices viverra cras placerat feugiat ut. Netus pharetra massa feugiat mauris tincidunt. Sit risus quis in non lacus lacus leo eros viverra. Arcu scelerisque in et non cras volutpat magna dui fames. Tortor posuere velit amet proin mauris.\nEt tristique habitasse id pellentesque viverra vel netus. Risus diam ut augue amet vulputate semper.",
  },
  u5: {
    id: "u5",
    unitId: "001",
    unitType: "2 Bedroom Flat Duplex",
    status: "Available",
    currentStage: "Payment",
    minimumPrice: "₦15,000,000",
    maximumPrice: "₦20,000,000",
    agent: { name: "John Ibekwe", role: "staff" },
    propertyType: "Property",
    description: "2 Bedroom Duplex",
    title: "C of O, Governor's Consent, Title Deed",
    location: "Ibeju Lekki, Lagos",
    estate: "Joy Valley Hills",
    heroImage: heroImg,
    mapImage: mapImg,
    galleryImages: [gallery1, gallery2, gallery3],
    aboutText:
      "Lorem ipsum dolor sit amet consectetur. Sodales proin ante adipiscing odio scelerisque mattis mattis facilisis. Arcu blandit ac potenti molestie elit. Ultrices viverra cras placerat feugiat ut. Netus pharetra massa feugiat mauris tincidunt. Sit risus quis in non lacus lacus leo eros viverra. Arcu scelerisque in et non cras volutpat magna dui fames. Tortor posuere velit amet proin mauris.\nEt tristique habitasse id pellentesque viverra vel netus. Risus diam ut augue amet vulputate semper.",
  },
};

/* ------------------------------------------------------------------ */
/*  Detail Row helper                                                  */
/* ------------------------------------------------------------------ */

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between font-montserrat text-sm">
      <span className="text-[#0f0f0f]">{label}</span>
      <span className="font-bold text-[#0f0f0f]">{value}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

interface UnitDetailDialogProps {
  unit: UnitDetail | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function UnitDetailDialog({
  unit,
  open,
  onOpenChange,
}: UnitDetailDialogProps) {
  if (!unit) return null;

  return (
    <CustomDialog
      open={open}
      onOpenChange={onOpenChange}
      triggerComponent={<span />}
      contentClassName="!w-[759px] !max-w-[759px] !p-0 !gap-0 !border-0 !bg-transparent !shadow-none"
    >
      <div className="flex max-h-[85vh] flex-col gap-4 overflow-y-auto rounded-lg bg-[#f8f8f8] p-4 md:max-h-[80vh]">
        {/* ── Hero banner ── */}
        <div className="relative h-25 w-full overflow-hidden rounded-lg">
          <Image
            src={unit.heroImage}
            alt={unit.estate}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-r from-[#8a38f5] to-[rgba(138,56,245,0)]" />
          <div className="absolute left-4 top-1/2 flex -translate-y-1/2 flex-col gap-1">
            <h2 className="font-montserrat text-2xl font-bold leading-none text-white md:text-[34px]">
              {unit.estate}
            </h2>
            <div className="flex items-center gap-1">
              <span className="font-montserrat text-sm font-bold text-white md:text-base">
                {unit.location.split(",")[0]}
              </span>
              <UnitStatusBadge status={unit.status} />
            </div>
          </div>
        </div>

        {/* ── Image gallery ── */}
        <div className="flex gap-4 overflow-x-auto">
          {unit.galleryImages.map((img, i) => (
            <div
              key={i}
              className="relative h-40 w-60 shrink-0 overflow-hidden rounded-lg"
            >
              <Image
                src={img}
                alt={`Gallery ${i + 1}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>

        {/* ── About / description text ── */}
        <p className="font-montserrat text-sm leading-normal text-black">
          {unit.aboutText}
        </p>

        {/* ── Unit info rows ── */}
        <div className="flex flex-col gap-2">
          <DetailRow label="Unit Type" value={unit.unitType} />
          <DetailRow label="Unit ID" value={unit.unitId} />
          <DetailRow label="Current Stage" value={unit.currentStage} />
          <DetailRow label="Minimum Price" value={unit.minimumPrice} />
          <DetailRow label="Maximum Price" value={unit.maximumPrice} />

          {/* Agent row */}
          <div className="flex items-center justify-between font-montserrat text-sm">
            <span className="text-[#0f0f0f]">Agent</span>
            <div className="flex items-center gap-1">
              {/* avatar */}
              <div className="flex size-4 items-center justify-center rounded-full bg-[#c8c8c8]">
                <span className="text-[6px] font-bold text-white">
                  {unit.agent.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
              </div>
              <span className="font-bold text-[#0f0f0f]">
                {unit.agent.name}
              </span>
              <RoleBadge role={unit.agent.role} />
            </div>
          </div>
        </div>

        {/* ── Property Details section ── */}
        <div className="flex flex-col gap-1">
          <span className="font-montserrat text-[9px] uppercase text-[#6f6d6d]">
            Property Details
          </span>
          <div className="flex flex-col gap-2">
            <DetailRow label="Type" value={unit.propertyType} />
            <DetailRow label="Description" value={unit.description} />
            <DetailRow label="Title" value={unit.title} />
            <DetailRow label="Location" value={unit.location} />
            <DetailRow label="Estate" value={unit.estate} />
          </div>
        </div>

        {/* ── Map section ── */}
        <div className="relative h-37.5 w-full overflow-hidden rounded-lg bg-white">
          <Image
            src={unit.mapImage}
            alt={`Map of ${unit.location}`}
            fill
            className="object-cover"
          />
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
      </div>
    </CustomDialog>
  );
}
