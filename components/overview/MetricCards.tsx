import React from "react";

interface MetricCardData {
  label: string;
  value: string;
  icon: React.ElementType;
}

interface MetricCardsProps {
  cards: MetricCardData[];
}

export type { MetricCardData };

export function MetricCards({ cards }: MetricCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 md:gap-6">
      {cards.map((card) => (
        <div
          key={card.label}
          className="flex items-center justify-between rounded-lg bg-[#f8f8f8] p-4"
        >
          <div className="flex flex-col gap-2">
            <p className="font-montserrat text-base font-normal text-[#6f6d6d]">
              {card.label}
            </p>
            <p className="font-montserrat text-lg font-bold text-[#0f0f0f]">
              {card.value}
            </p>
          </div>
          <card.icon className="size-6 text-[#8a38f5]" />
        </div>
      ))}
    </div>
  );
}
