"use client";

import CustomDialog from "@/components/shared/CustomDialog";
import { Badge } from "@/components/ui/badge";
import { type SalesStage } from "./ClientStatusBadge";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface ClientDetail {
  id: string;
  clientName: string;
  clientCode: string;
  email: string;
  phone: string;
  assignedStaff: {
    name: string;
    initials: string;
    avatarColor: string;
    role: "Staff" | "Realtor";
  };
  currentStage: SalesStage;
  dealValue: string;
  property: {
    type: string;
    description: string;
    title: string;
  };
  followUps: {
    nextFollowUpDate: string;
    expectedOutcome: string;
  };
  paymentSummary: {
    totalDealValue: string;
    amountPaid: string;
    outstandingBalance: string;
  };
}

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

export const mockClientDetails: Record<string, ClientDetail> = {
  c1: {
    id: "c1",
    clientName: "Peter Abbey",
    clientCode: "01014",
    email: "peterabbey@email.com",
    phone: "08012341234",
    assignedStaff: {
      name: "John Ibekwe",
      initials: "JI",
      avatarColor: "#8a38f5",
      role: "Staff",
    },
    currentStage: "Closed",
    dealValue: "₦15,000,000",
    property: {
      type: "Land",
      description: "2 Plots of land situate at Ajah, Lagos.",
      title: "C of O, Governor's Consent, Title Deed",
    },
    followUps: {
      nextFollowUpDate: "Jan 2, 2026",
      expectedOutcome: "Payment Completion",
    },
    paymentSummary: {
      totalDealValue: "₦15,000,000",
      amountPaid: "₦15,000,000",
      outstandingBalance: "₦0",
    },
  },
  c2: {
    id: "c2",
    clientName: "Peter Abbey",
    clientCode: "01014",
    email: "peterabbey@email.com",
    phone: "08012341234",
    assignedStaff: {
      name: "John Ibekwe",
      initials: "JI",
      avatarColor: "#8a38f5",
      role: "Staff",
    },
    currentStage: "Payment",
    dealValue: "₦15,000,000",
    property: {
      type: "Land",
      description: "2 Plots of land situate at Ajah, Lagos.",
      title: "C of O, Governor's Consent, Title Deed",
    },
    followUps: {
      nextFollowUpDate: "Jan 2, 2026",
      expectedOutcome: "Payment Completion",
    },
    paymentSummary: {
      totalDealValue: "₦15,000,000",
      amountPaid: "₦10,000,000",
      outstandingBalance: "₦5,000,000",
    },
  },
  c3: {
    id: "c3",
    clientName: "Peter Abbey",
    clientCode: "01014",
    email: "peterabbey@email.com",
    phone: "08012341234",
    assignedStaff: {
      name: "John Ibekwe",
      initials: "JI",
      avatarColor: "#8a38f5",
      role: "Staff",
    },
    currentStage: "Negotiation",
    dealValue: "Undefined",
    property: {
      type: "Flat",
      description: "3 Bedroom flat at Victoria Island, Lagos.",
      title: "Deed of Assignment",
    },
    followUps: {
      nextFollowUpDate: "Feb 15, 2026",
      expectedOutcome: "Price Agreement",
    },
    paymentSummary: {
      totalDealValue: "Undefined",
      amountPaid: "₦0",
      outstandingBalance: "Undefined",
    },
  },
  c4: {
    id: "c4",
    clientName: "Peter Abbey",
    clientCode: "01014",
    email: "peterabbey@email.com",
    phone: "08012341234",
    assignedStaff: {
      name: "John Ibekwe",
      initials: "JI",
      avatarColor: "#8a38f5",
      role: "Staff",
    },
    currentStage: "Inspection",
    dealValue: "₦5,250,000",
    property: {
      type: "Land",
      description: "1 Plot of land at Ibeju-Lekki, Lagos.",
      title: "Excision, Survey Plan",
    },
    followUps: {
      nextFollowUpDate: "Jan 10, 2026",
      expectedOutcome: "Site Inspection",
    },
    paymentSummary: {
      totalDealValue: "₦5,250,000",
      amountPaid: "₦0",
      outstandingBalance: "₦5,250,000",
    },
  },
  c5: {
    id: "c5",
    clientName: "Peter Abbey",
    clientCode: "01014",
    email: "peterabbey@email.com",
    phone: "08012341234",
    assignedStaff: {
      name: "John Ibekwe",
      initials: "JI",
      avatarColor: "#8a38f5",
      role: "Staff",
    },
    currentStage: "Interested",
    dealValue: "Undefined",
    property: {
      type: "House",
      description: "4 Bedroom duplex at Lekki Phase 1, Lagos.",
      title: "C of O",
    },
    followUps: {
      nextFollowUpDate: "Jan 5, 2026",
      expectedOutcome: "Initial Meeting",
    },
    paymentSummary: {
      totalDealValue: "Undefined",
      amountPaid: "₦0",
      outstandingBalance: "Undefined",
    },
  },
};

/* ------------------------------------------------------------------ */
/*  Sales Stage Pipeline                                               */
/* ------------------------------------------------------------------ */

const FULL_PIPELINE = [
  "Lead",
  "Contacted",
  "Interested",
  "Inspection",
  "Negotiation",
  "Payment",
  "Closed",
] as const;

type PipelineStage = (typeof FULL_PIPELINE)[number];

function SalesStagePipeline({ currentStage }: { currentStage: SalesStage }) {
  const activeIdx = FULL_PIPELINE.indexOf(currentStage as PipelineStage);

  return (
    <div className="flex w-full items-center">
      {FULL_PIPELINE.map((stage, idx) => {
        const isActive = idx === activeIdx;
        const isPast = idx < activeIdx;
        const isFuture = idx > activeIdx;

        return (
          <div key={stage} className="flex flex-1 flex-col items-center gap-1">
            {/* Connector + dot row */}
            <div className="flex w-full items-center">
              {/* Left connector line */}
              {idx > 0 && (
                <div
                  className="h-0.5 flex-1"
                  style={{
                    backgroundColor: isPast || isActive ? "#c8c8c8" : "#e8e8e8",
                  }}
                />
              )}
              {idx === 0 && <div className="flex-1" />}

              {/* Dot */}
              {isActive ? (
                <div className="flex size-4 items-center justify-center rounded-full bg-[#ddf6e2]">
                  <div className="size-2 rounded-full bg-[#34c759]" />
                </div>
              ) : (
                <div
                  className="size-2 rounded-full"
                  style={{
                    backgroundColor: isPast ? "#c8c8c8" : "#e8e8e8",
                  }}
                />
              )}

              {/* Right connector line */}
              {idx < FULL_PIPELINE.length - 1 && (
                <div
                  className="h-0.5 flex-1"
                  style={{
                    backgroundColor: isPast ? "#c8c8c8" : "#e8e8e8",
                  }}
                />
              )}
              {idx === FULL_PIPELINE.length - 1 && <div className="flex-1" />}
            </div>

            {/* Label */}
            <span
              className={`font-montserrat text-[10px] ${
                isActive
                  ? "font-semibold text-[#34c759]"
                  : isFuture
                    ? "font-normal text-[#c8c8c8]"
                    : "font-normal text-[#6f6d6d]"
              }`}
            >
              {stage}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function Divider() {
  return <div className="h-px w-full bg-[#e0e0e0]" />;
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex w-full items-center justify-between">
      <p className="font-montserrat text-sm font-normal text-[#0f0f0f]">
        {label}
      </p>
      <div className="font-montserrat text-sm font-bold text-[#0f0f0f]">
        {value}
      </div>
    </div>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <p className="font-montserrat text-[9px] font-normal uppercase text-[#6f6d6d]">
      {title}
    </p>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

interface ClientDetailDialogProps {
  client: ClientDetail | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ClientDetailDialog({
  client,
  open,
  onOpenChange,
}: ClientDetailDialogProps) {
  if (!client) return null;

  return (
    <CustomDialog
      open={open}
      onOpenChange={onOpenChange}
      showTrigger={false}
      contentClassName="!w-full !max-w-[759px] !p-0 !gap-0 !border-0 !bg-transparent !shadow-none"
    >
      <div className="flex max-h-[80vh] flex-col gap-4 overflow-y-auto rounded-lg bg-[#f8f8f8] p-6">
        {/* ── Header: Client name + code ── */}
        <div className="flex items-baseline gap-2">
          <h2 className="font-montserrat text-xl font-bold text-[#0f0f0f]">
            {client.clientName}
          </h2>
          <span className="font-montserrat text-sm font-normal text-[#6f6d6d]">
            #{client.clientCode}
          </span>
        </div>

        {/* ── Contact & assignment info ── */}
        <div className="flex flex-col gap-2 w-full">
          <InfoRow label="Email Address" value={client.email} />
          <Divider />
          <InfoRow label="Phone Number" value={client.phone} />
          <Divider />
          <InfoRow
            label="Assigned staff"
            value={
              <div className="flex items-center gap-2">
                <div
                  className="flex size-6 shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white"
                  style={{
                    backgroundColor: client.assignedStaff.avatarColor,
                  }}
                >
                  {client.assignedStaff.initials}
                </div>
                <span className="font-montserrat text-sm font-bold text-[#0f0f0f]">
                  {client.assignedStaff.name}
                </span>
                <Badge className="rounded-lg border-0 bg-[#ddf6e2] px-1.5 py-0.5 font-montserrat text-[9px] font-semibold text-[#34c759]">
                  {client.assignedStaff.role}
                </Badge>
              </div>
            }
          />
          <Divider />
          <InfoRow label="Current Stage" value={client.currentStage} />
          <Divider />
          <InfoRow label="Deal Value" value={client.dealValue} />
        </div>

        {/* ── Property Details ── */}
        <div className="flex flex-col gap-1 w-full">
          <SectionHeader title="Property Details" />
          <div className="flex flex-col gap-2 w-full">
            <InfoRow label="Type" value={client.property.type} />
            <Divider />
            <InfoRow
              label="Description"
              value={
                <span className="max-w-100 text-right">
                  {client.property.description}
                </span>
              }
            />
            <Divider />
            <InfoRow
              label="Title"
              value={
                <span className="max-w-100 text-right">
                  {client.property.title}
                </span>
              }
            />
          </div>
        </div>

        {/* ── Current Sales Stage Pipeline ── */}
        <div className="flex flex-col gap-2 w-full">
          <SectionHeader title="Current Sales Stage" />
          <SalesStagePipeline currentStage={client.currentStage} />
        </div>

        {/* ── Follow-Ups ── */}
        <div className="flex flex-col gap-1 w-full">
          <SectionHeader title="Follow-Ups" />
          <div className="flex flex-col gap-2 w-full">
            <InfoRow
              label="Next Follow-Up Date"
              value={client.followUps.nextFollowUpDate}
            />
            <Divider />
            <InfoRow
              label="Expected Outcome"
              value={client.followUps.expectedOutcome}
            />
          </div>
        </div>

        {/* ── Payment Summary ── */}
        <div className="flex flex-col gap-1 w-full">
          <SectionHeader title="Payment Summary" />
          <div className="flex flex-col gap-2 w-full">
            <InfoRow
              label="Total Deal Value"
              value={client.paymentSummary.totalDealValue}
            />
            <Divider />
            <InfoRow
              label="Amount Paid"
              value={client.paymentSummary.amountPaid}
            />
            <Divider />
            <InfoRow
              label="Outstanding Balance"
              value={client.paymentSummary.outstandingBalance}
            />
          </div>
        </div>
      </div>
    </CustomDialog>
  );
}
