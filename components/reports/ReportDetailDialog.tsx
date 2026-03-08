"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

/* ------------------------------------------------------------------ */
/*  Sales Pipeline Stages                                              */
/* ------------------------------------------------------------------ */

const STAGES = [
  "Lead",
  "Contacted",
  "Interested",
  "Inspection",
  "Negotiation",
  "Payment",
  "Closed",
] as const;

function SalesPipeline({ currentStage }: { currentStage: string }) {
  const activeIndex = STAGES.indexOf(currentStage as (typeof STAGES)[number]);

  return (
    <div className="flex flex-wrap items-center gap-1">
      {STAGES.map((stage, index) => {
        const isActive = index === activeIndex;
        const isPast = index < activeIndex;
        const isFuture = index > activeIndex;

        let bg = "#f3f3f3";
        let text = "#c8c8c8";
        let border = "transparent";

        if (isActive) {
          bg = "#ddf6e2";
          text = "#34c759";
          border = "#34c759";
        } else if (isPast) {
          bg = "#f3f3f3";
          text = "#0f0f0f";
        } else if (isFuture) {
          bg = "#f3f3f3";
          text = "#c8c8c8";
        }

        return (
          <div
            key={stage}
            className="flex items-center gap-1 rounded-lg px-2.5 py-1 font-montserrat text-xs font-normal"
            style={{
              backgroundColor: bg,
              color: text,
              borderColor: border,
              borderWidth: isActive ? 1 : 0,
              borderStyle: "solid",
            }}
          >
            {isActive && (
              <span
                className="size-2 rounded-full"
                style={{ backgroundColor: "#34c759" }}
              />
            )}
            {stage}
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

interface ReportDetailDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function ReportDetailDialog({
  open,
  onClose,
}: ReportDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto rounded-2xl p-6">
        <div className="flex flex-col gap-5">
          {/* Client Header */}
          <div className="flex items-baseline gap-2">
            <p className="font-montserrat text-lg font-bold text-[#0f0f0f]">
              Peter Abbey
            </p>
            <span className="font-montserrat text-sm font-normal text-[#6f6d6d]">
              #1014
            </span>
          </div>

          {/* Client Info */}
          <div className="flex flex-col gap-2">
            <InfoRow label="Email Address" value="peterabbey@email.com" />
            <InfoRow label="Phone Number" value="08012341234" />
            <InfoRow
              label="Assigned staff"
              value={
                <span className="flex items-center gap-1.5">
                  <span
                    className="flex size-5 items-center justify-center rounded-full text-[8px] font-bold text-white"
                    style={{ backgroundColor: "#34c759" }}
                  >
                    JI
                  </span>
                  John Ibekwe
                  <Badge
                    className="rounded-lg border-0 px-1 py-0 font-montserrat text-[8px] font-semibold"
                    style={{
                      backgroundColor: "#DDF6E2",
                      color: "#34C759",
                    }}
                  >
                    Staff
                  </Badge>
                </span>
              }
            />
            <InfoRow label="Current Stage" value="Payment" />
            <InfoRow label="Deal Value" value="₦15,000,000" />
          </div>

          {/* Property Details */}
          <div className="flex flex-col gap-2">
            <p className="font-montserrat text-xs font-bold uppercase tracking-wider text-[#6f6d6d]">
              Property Details
            </p>
            <InfoRow label="Type" value="Land" />
            <InfoRow
              label="Description"
              value="2 Plots of land situate at Ajah, Lagos."
            />
            <InfoRow
              label="Title"
              value="C of O, Governor's Consent, Title Deed"
            />
          </div>

          {/* Current Sales Stage */}
          <div className="flex flex-col gap-2">
            <p className="font-montserrat text-xs font-bold uppercase tracking-wider text-[#6f6d6d]">
              Current Sales Stage
            </p>
            <SalesPipeline currentStage="Payment" />
          </div>

          {/* Follow-Ups */}
          <div className="flex flex-col gap-2">
            <p className="font-montserrat text-xs font-bold uppercase tracking-wider text-[#6f6d6d]">
              Follow-Ups
            </p>
            <InfoRow label="Next Follow-Up Date" value="Jan 2, 2026" />
            <InfoRow label="Expected Outcome" value="Payment Completion" />
          </div>

          {/* Payment Summary */}
          <div className="flex flex-col gap-2">
            <p className="font-montserrat text-xs font-bold uppercase tracking-wider text-[#6f6d6d]">
              Payment Summary
            </p>
            <InfoRow label="Total Deal Value" value="₦15,000,000" />
            <InfoRow label="Amount Paid" value="₦10,000,000" />
            <InfoRow label="Outstanding Balance" value="₦5,000,000" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between">
      <span className="font-montserrat text-sm font-normal text-[#0f0f0f]">
        {label}
      </span>
      <span className="text-right font-montserrat text-sm font-bold text-[#0f0f0f]">
        {value}
      </span>
    </div>
  );
}
