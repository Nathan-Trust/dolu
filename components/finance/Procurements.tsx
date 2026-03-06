"use client";

import { useState, useMemo } from "react";
import CustomTable from "@/components/shared/CustomTable";
import SearchInput from "@/components/shared/CustomSearchInput";
import CustomMultiSelectFilter from "@/components/shared/CustomMultiSelectFilter";
import { Download, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface ProcurementRecord {
  [key: string]: React.ReactNode | string | number | null | object;
  id: number;
  date: string;
  category: string;
  description: string;
  amount: string;
}

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

const mockProcurementsData: ProcurementRecord[] = [
  {
    id: 1,
    date: "2 Jul, 2026",
    category: "Operations",
    description: "Office rent – January",
    amount: "₦2,500,000",
  },
  {
    id: 2,
    date: "2 Jul, 2026",
    category: "Marketing",
    description: "Property listing ads",
    amount: "₦850,000",
  },
  {
    id: 3,
    date: "2 Jul, 2026",
    category: "Logistics",
    description: "Site inspection transport",
    amount: "₦120,000",
  },
  {
    id: 4,
    date: "2 Jul, 2026",
    category: "Utilities",
    description: "Electricity & internet",
    amount: "₦95,000",
  },
  {
    id: 5,
    date: "2 Jul, 2026",
    category: "Legal",
    description: "Title verification fees",
    amount: "₦400,000",
  },
  {
    id: 6,
    date: "2 Jul, 2026",
    category: "Operations",
    description: "Office supplies",
    amount: "₦150,000",
  },
  {
    id: 7,
    date: "2 Jul, 2026",
    category: "Marketing",
    description: "Billboard advertising",
    amount: "₦1,200,000",
  },
  {
    id: 8,
    date: "2 Jul, 2026",
    category: "Logistics",
    description: "Vehicle maintenance",
    amount: "₦350,000",
  },
  {
    id: 9,
    date: "2 Jul, 2026",
    category: "Utilities",
    description: "Water & sanitation",
    amount: "₦75,000",
  },
  {
    id: 10,
    date: "2 Jul, 2026",
    category: "Legal",
    description: "Property survey fees",
    amount: "₦600,000",
  },
  {
    id: 11,
    date: "2 Jul, 2026",
    category: "Operations",
    description: "Staff training",
    amount: "₦250,000",
  },
  {
    id: 12,
    date: "2 Jul, 2026",
    category: "Marketing",
    description: "Social media campaigns",
    amount: "₦180,000",
  },
];

/* ------------------------------------------------------------------ */
/*  Summary stats                                                      */
/* ------------------------------------------------------------------ */

const summaryStats = {
  period: "1 Jan - 30 Jan",
  totalExpenses: "₦134,235,040",
};

/* ------------------------------------------------------------------ */
/*  Filter options                                                     */
/* ------------------------------------------------------------------ */

const categoryOptions = Array.from(
  new Set(mockProcurementsData.map((r) => r.category)),
).map((c) => ({ label: c, value: c }));

/* ------------------------------------------------------------------ */
/*  Table config                                                       */
/* ------------------------------------------------------------------ */

const headers = ["Date", "Category", "Description", "Amount"];

const headerKeyMap: Record<string, string> = {
  Date: "date",
  Category: "category",
  Description: "description",
  Amount: "amount",
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function Procurements() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<(string | number)[]>([]);

  const tableData = useMemo(() => {
    let rows = mockProcurementsData;

    /* Search across visible text columns */
    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter(
        (r) =>
          r.date.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.amount.toLowerCase().includes(q),
      );
    }

    /* Category filter */
    if (categoryFilter.length > 0) {
      rows = rows.filter((r) => categoryFilter.includes(r.category));
    }

    return rows;
  }, [search, categoryFilter]);

  return (
    <div className="flex flex-col gap-4">
      {/* Action buttons */}
      <div className="flex items-end gap-2">
        <Button className="gap-1 rounded-lg bg-[#f3f3f3] px-2 py-1 font-montserrat text-sm font-bold text-[#0f0f0f] hover:bg-[#e0e0e0]">
          <Plus size={18} />
          Add Expense
        </Button>
        <Button className="gap-1 rounded-lg bg-[#8a38f5] px-2 py-1 font-montserrat text-sm font-bold text-[#f8f8f8] hover:bg-[#7828e0]">
          Download Report
          <Download size={18} />
        </Button>
      </div>

      {/* Summary stats */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-4 font-montserrat text-sm text-[#0f0f0f]">
          <span className="font-normal">Period</span>
          <span className="font-bold">{summaryStats.period}</span>
        </div>
        <div className="flex items-center gap-4 font-montserrat text-sm text-[#0f0f0f]">
          <span className="font-normal">Total Expenses</span>
          <span className="font-bold">{summaryStats.totalExpenses}</span>
        </div>
      </div>

      {/* Table with always-visible toolbar */}
      <div className="w-full overflow-hidden rounded-lg bg-[#f8f8f8] p-4">
        <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-4 md:gap-8">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search"
            />
          </div>
          <CustomMultiSelectFilter
            title="Category"
            options={categoryOptions}
            selectedValues={categoryFilter}
            onApplyFilter={setCategoryFilter}
          />
        </div>

        <CustomTable
          headers={headers}
          data={tableData}
          headerKeyMap={headerKeyMap}
        />
      </div>
    </div>
  );
}
