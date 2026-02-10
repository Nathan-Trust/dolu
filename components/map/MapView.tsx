"use client";

import { useRef, useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Image from "next/image";
import CustomDialog from "@/components/shared/CustomDialog";
import { RoleBadge } from "@/components/shared/RoleBadge";
import { Button } from "@/components/ui/button";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type MarkerStatus = "Available" | "Partially Sold" | "Sold Out";

export interface EstateMarker {
  id: string;
  name: string;
  location: string;
  lat: number;
  lng: number;
  status: MarkerStatus | string;
  assignedTo: string;
}

interface MapViewProps {
  markers: EstateMarker[];
  canOpenDetail?: boolean;
}

/* ------------------------------------------------------------------ */
/*  Status → colour mapping                                            */
/* ------------------------------------------------------------------ */

const statusColor: Record<string, string> = {
  Available: "#34c759",
  "Partially Sold": "#f5a623",
  "Sold Out": "#ff383c",
};

const statusRing: Record<string, string> = {
  Available: "rgba(52,199,89,0.25)",
  "Partially Sold": "rgba(245,166,35,0.25)",
  "Sold Out": "rgba(255,56,60,0.25)",
};

/* ------------------------------------------------------------------ */
/*  Build SVG icon for a marker                                        */
/* ------------------------------------------------------------------ */

function buildMarkerIcon(status: string): L.DivIcon {
  const fill = statusColor[status] ?? "#6f6d6d";
  const ring = statusRing[status] ?? "rgba(111,109,109,0.25)";

  return L.divIcon({
    className: "",
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    html: `
      <svg width="36" height="36" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
        <circle cx="18" cy="18" r="17" fill="none" stroke="${ring}" stroke-width="2"/>
        <circle cx="18" cy="18" r="10" fill="${fill}"/>
      </svg>
    `,
  });
}

/* ------------------------------------------------------------------ */
/*  Legend                                                              */
/* ------------------------------------------------------------------ */

const legendItems: { label: string; color: string }[] = [
  { label: "Available", color: "#34c759" },
  { label: "Partially Sold", color: "#f5a623" },
  { label: "Sold Out", color: "#ff383c" },
];

/* ------------------------------------------------------------------ */
/*  Estate detail dialog (admin only)                                  */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/*  Estate detail dialog (admin only)                                  */
/* ------------------------------------------------------------------ */

/** Mock extended data keyed by estate id */
interface EstateDetail {
  description: string;
  galleryImages: string[];
  unitType: string;
  unitId: string;
  currentStage: string;
  minPrice: string;
  maxPrice: string;
  agentName: string;
  agentAvatar: string;
  agentRole: "staff" | "admin" | "chairman" | "realtor";
  propertyType: string;
  propertyDescription: string;
  title: string;
}

const estateDetails: Record<string, EstateDetail> = {
  e1: {
    description:
      "Lorem ipsum dolor sit amet consectetur. Sodales proin ante adipiscing odio scelerisque mattis mattis facilisis. Arcu blandit ac potenti molestie elit. Ultrices viverra cras placerat feugiat ut. Netus pharetra massa feugiat mauris tincidunt. Sit risus quis in non lacus lacus leo eros viverra. Arcu scelerisque in et non cras volutpat magna dui fames. Tortor posuere velit amet proin mauris.\nEt tristique habitasse id pellentesque viverra vel netus. Risus diam ut augue amet vulputate semper.",
    galleryImages: [
      "/5a872bc446ad776970f5d1c25973220607070e44.png",
      "/66594e132319e35e8ee226c24a2601c1e65aa70e.png",
      "/92078d288485de3726be39d9e67aa679ea0d8fe8.png",
    ],
    unitType: "2 Bedroom Flat Duplex",
    unitId: "001",
    currentStage: "Payment",
    minPrice: "₦15,000,000",
    maxPrice: "₦20,000,000",
    agentName: "John Ibekwe",
    agentAvatar: "/a835890864853b52b7ece0a40c0c932b97d8cb55.png",
    agentRole: "staff",
    propertyType: "Property",
    propertyDescription: "2 Bedroom Duplex",
    title: "C of O, Governor's Consent, Title Deed",
  },
};

const defaultDetail: EstateDetail = {
  description:
    "Lorem ipsum dolor sit amet consectetur. Sodales proin ante adipiscing odio scelerisque mattis mattis facilisis. Arcu blandit ac potenti molestie elit. Ultrices viverra cras placerat feugiat ut.",
  galleryImages: [
    "/5a872bc446ad776970f5d1c25973220607070e44.png",
    "/66594e132319e35e8ee226c24a2601c1e65aa70e.png",
    "/92078d288485de3726be39d9e67aa679ea0d8fe8.png",
  ],
  unitType: "2 Bedroom Flat Duplex",
  unitId: "001",
  currentStage: "Payment",
  minPrice: "₦15,000,000",
  maxPrice: "₦20,000,000",
  agentName: "John Ibekwe",
  agentAvatar: "/a835890864853b52b7ece0a40c0c932b97d8cb55.png",
  agentRole: "staff",
  propertyType: "Property",
  propertyDescription: "2 Bedroom Duplex",
  title: "C of O, Governor's Consent, Title Deed",
};

const estateStatusBadge: Record<string, { bg: string; text: string }> = {
  Available: { bg: "bg-[#ddf6e2]", text: "text-[#34c759]" },
  "Partially Sold": { bg: "bg-[#fff4cc]", text: "text-[#ac7f5e]" },
  "Sold Out": { bg: "bg-[#ffe5e5]", text: "text-[#ff383c]" },
};

function DetailRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="font-montserrat text-sm font-normal text-[#6f6d6d]">
        {label}
      </span>
      <span className="font-montserrat text-sm font-bold text-[#0f0f0f]">
        {children}
      </span>
    </div>
  );
}

function EstateDetailDialog({
  estate,
  open,
  onOpenChange,
}: {
  estate: EstateMarker | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  if (!estate) return null;

  const detail = estateDetails[estate.id] ?? defaultDetail;
  const badge = estateStatusBadge[estate.status] ?? {
    bg: "bg-[#f3f3f3]",
    text: "text-[#6f6d6d]",
  };

  return (
    <CustomDialog
      open={open}
      onOpenChange={onOpenChange}
      triggerComponent={<span className="hidden" />}
      contentClassName="max-w-[760px] overflow-y-auto max-h-[90vh] rounded-2xl p-0"
    >
      <div className="flex flex-col">
        {/* Purple gradient header */}
        <div className="relative flex flex-col justify-end gap-1 rounded-t-2xl bg-linear-to-r from-[#8a38f5] to-[#c084fc] px-6 py-5">
          <h2 className="font-montserrat text-xl font-bold text-white">
            {estate.name}
          </h2>
          <div className="flex items-center gap-2">
            <span className="font-montserrat text-sm text-white/80">
              {estate.location}
            </span>
            <span
              className={`inline-flex items-center justify-center rounded-lg px-1.5 py-0.5 font-montserrat text-[9px] font-semibold ${badge.bg} ${badge.text}`}
            >
              {estate.status}
            </span>
          </div>
        </div>

        {/* Gallery */}
        <div className="grid grid-cols-3 gap-2 px-6 pt-4">
          {detail.galleryImages.map((src, i) => (
            <div
              key={`gallery-${estate.id}-${i}`}
              className="relative aspect-4/3 overflow-hidden rounded-lg"
            >
              <Image
                src={src}
                alt={`${estate.name} photo ${i + 1}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>

        {/* Description */}
        <p className="whitespace-pre-line px-6 pt-4 font-montserrat text-sm leading-relaxed text-[#0f0f0f]">
          {detail.description}
        </p>

        {/* Unit details */}
        <div className="flex flex-col gap-0 px-6 pt-4">
          <DetailRow label="Unit Type">{detail.unitType}</DetailRow>
          <DetailRow label="Unit ID">{detail.unitId}</DetailRow>
          <DetailRow label="Current Stage">{detail.currentStage}</DetailRow>
          <DetailRow label="Minimum Price">{detail.minPrice}</DetailRow>
          <DetailRow label="Maximum Price">{detail.maxPrice}</DetailRow>
          <DetailRow label="Agent">
            <span className="flex items-center gap-1.5">
              <Image
                src={detail.agentAvatar}
                alt={detail.agentName}
                width={20}
                height={20}
                className="rounded-full"
              />
              <span>{detail.agentName}</span>
              <RoleBadge
                role={detail.agentRole}
                className="h-auto px-1 py-0 text-[9px]"
              />
            </span>
          </DetailRow>
        </div>

        {/* Property details section */}
        <div className="flex flex-col gap-0 px-6 pb-2 pt-4">
          <p className="pb-1 font-montserrat text-[10px] font-semibold uppercase tracking-wider text-[#6f6d6d]">
            Property Details
          </p>
          <DetailRow label="Type">{detail.propertyType}</DetailRow>
          <DetailRow label="Description">
            {detail.propertyDescription}
          </DetailRow>
          <DetailRow label="Title">{detail.title}</DetailRow>
          <DetailRow label="Location">{estate.location}</DetailRow>
          <DetailRow label="Estate">{estate.name}</DetailRow>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-center gap-4 px-6 pb-6 pt-4">
          <Button className="rounded-lg bg-[#8a38f5] px-6 py-2 font-montserrat text-sm font-bold text-white hover:bg-[#7828e0]">
            View Estate
          </Button>
          <Button
            variant="outline"
            className="rounded-lg border-[#8a38f5] px-6 py-2 font-montserrat text-sm font-bold text-[#8a38f5] hover:bg-[#f2d5ff]"
          >
            View Inventory
          </Button>
        </div>
      </div>
    </CustomDialog>
  );
}

/* ------------------------------------------------------------------ */
/*  MapView component                                                  */
/* ------------------------------------------------------------------ */

export default function MapView({
  markers,
  canOpenDetail = false,
}: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<L.Map | null>(null);
  const markerLayerRef = useRef<L.LayerGroup | null>(null);

  const [selectedEstate, setSelectedEstate] = useState<EstateMarker | null>(
    null,
  );
  const [dialogOpen, setDialogOpen] = useState(false);

  /* Initialise map once */
  useEffect(() => {
    if (!mapRef.current || leafletMap.current) return;

    const map = L.map(mapRef.current, {
      center: [6.5244, 3.3792],
      zoom: 12,
      zoomControl: true,
      attributionControl: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    markerLayerRef.current = L.layerGroup().addTo(map);
    leafletMap.current = map;

    return () => {
      map.remove();
      leafletMap.current = null;
    };
  }, []);

  /* Update markers when data/filters change */
  useEffect(() => {
    const layer = markerLayerRef.current;
    if (!layer) return;
    layer.clearLayers();

    markers.forEach((estate) => {
      const marker = L.marker([estate.lat, estate.lng], {
        icon: buildMarkerIcon(estate.status),
      });

      marker.bindTooltip(estate.name, {
        direction: "top",
        offset: [0, -12],
        className: "font-montserrat text-xs",
      });

      if (canOpenDetail) {
        marker.on("click", () => {
          setSelectedEstate(estate);
          setDialogOpen(true);
        });
      }

      marker.addTo(layer);
    });
  }, [markers, canOpenDetail]);

  return (
    <div className="flex flex-col gap-3">
      {/* Map container */}
      <div
        ref={mapRef}
        className="h-125 w-full overflow-hidden rounded-lg border border-[#e0e0e0]"
      />

      {/* Legend */}
      <div className="flex items-center gap-6">
        {legendItems.map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <span
              className="inline-block size-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="font-montserrat text-xs text-[#0f0f0f]">
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* Estate detail dialog (admin only) */}
      {canOpenDetail && (
        <EstateDetailDialog
          estate={selectedEstate}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        />
      )}
    </div>
  );
}
