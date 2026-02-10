"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

/* ------------------------------------------------------------------ */
/*  Types & data                                                       */
/* ------------------------------------------------------------------ */

interface SalesSummaryData {
  label: string;
  value: number;
  color: string;
}

const defaultData: SalesSummaryData[] = [
  { label: "Active Deals", value: 45, color: "#8a38f5" },
  { label: "Closed", value: 35, color: "#a66bf7" },
  { label: "Lost", value: 15, color: "#d4bffa" },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

interface SalesSummaryChartProps {
  data?: SalesSummaryData[];
  month?: string;
}

export function SalesSummaryChart({
  data = defaultData,
  month = "Jan",
}: SalesSummaryChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="flex flex-col gap-12 rounded-lg bg-[#f8f8f8] p-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="font-montserrat text-sm font-bold text-[#0f0f0f]">
          Sales Summary
        </p>
        <div className="flex items-center justify-center rounded-lg bg-[#e0e0e0] px-2 py-1">
          <span className="font-montserrat text-xs font-normal text-[#0f0f0f]">
            {month}
          </span>
        </div>
      </div>

      {/* Chart + legend */}
      <div className="flex items-center gap-16">
        {/* Donut chart */}
        <div className="relative size-40">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={75}
                startAngle={90}
                endAngle={-270}
                strokeWidth={0}
              >
                {data.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          {/* Center label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-montserrat text-xs font-normal text-[#0f0f0f]">
              Total Sales
            </span>
            <span className="font-montserrat text-xs font-bold text-[#0f0f0f]">
              {total}
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-2.5">
          {data.map((entry) => (
            <div key={entry.label} className="flex items-center gap-1.5">
              <div
                className="size-4 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="font-montserrat text-xs font-normal text-[#0f0f0f]">
                {entry.label}
              </span>
              <span className="font-montserrat text-xs font-bold text-[#0f0f0f]">
                {entry.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
