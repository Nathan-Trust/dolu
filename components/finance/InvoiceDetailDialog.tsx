"use client";

import CustomDialog from "@/components/shared/CustomDialog";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface InvoiceDetailData {
  invoiceNumber: string;
  client: string;
  amount: string;
  dueDate: string;
  status: string;
}

interface InvoiceDetailDialogProps {
  invoice: InvoiceDetailData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/* ------------------------------------------------------------------ */
/*  Status badge (reused inline to keep the dialog self-contained)     */
/* ------------------------------------------------------------------ */

const statusStyles: Record<string, { bg: string; text: string }> = {
  Paid: { bg: "bg-[#ddf6e2]", text: "text-[#34c759]" },
  Pending: { bg: "bg-[#f2d5ff]", text: "text-[#8a38f5]" },
  Overdue: { bg: "bg-[#ffe5e5]", text: "text-[#ff383c]" },
};

function StatusBadge({ status }: { status: string }) {
  const style = statusStyles[status] ?? {
    bg: "bg-[#f3f3f3]",
    text: "text-[#6f6d6d]",
  };
  return (
    <span
      className={`inline-flex items-center justify-center rounded-lg px-1.5 py-0.5 font-montserrat text-[9px] font-semibold ${style.bg} ${style.text}`}
    >
      {status}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Detail row                                                         */
/* ------------------------------------------------------------------ */

function DetailRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="font-montserrat text-sm font-normal text-[#6f6d6d]">
        {label}
      </span>
      <span className="font-montserrat text-sm font-bold text-[#0f0f0f]">
        {children}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function InvoiceDetailDialog({
  invoice,
  open,
  onOpenChange,
}: InvoiceDetailDialogProps) {
  if (!invoice) return null;

  return (
    <CustomDialog
      open={open}
      onOpenChange={onOpenChange}
      triggerComponent={<span className="hidden" />}
      contentClassName="max-w-[420px] rounded-2xl bg-white p-6"
    >
      <div className="flex flex-col gap-4">
        {/* Title */}
        <h2 className="font-montserrat text-base font-bold text-[#0f0f0f]">
          Invoice #{invoice.invoiceNumber}
        </h2>

        {/* Detail rows */}
        <div className="flex flex-col divide-y divide-[#f3f3f3]">
          <DetailRow label="Client">{invoice.client}</DetailRow>
          <DetailRow label="Amount">{invoice.amount}</DetailRow>
          <DetailRow label="Due Date">{invoice.dueDate}</DetailRow>
          <DetailRow label="Status">
            <StatusBadge status={invoice.status} />
          </DetailRow>
        </div>
      </div>
    </CustomDialog>
  );
}
