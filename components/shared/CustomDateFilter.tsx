"use client";

import * as React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar"; // Import shadcn Calendar
import { format } from "date-fns"; // Import format from date-fns

interface CustomDateFilterProps {
  title: string;
  selectedValue?: string | null; // YYYY-MM-DD string
  onApplyFilter: (value: string | null) => void;
  className?: string;
}

export default function CustomDateFilter({
  title,
  selectedValue,
  onApplyFilter,
  className,
}: Readonly<CustomDateFilterProps>) {
  const [date, setDate] = React.useState<Date | undefined>(
    selectedValue ? new Date(selectedValue) : undefined,
  );
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    setDate(selectedValue ? new Date(selectedValue) : undefined);
  }, [selectedValue]);

  const handleApply = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    onApplyFilter(selectedDate ? format(selectedDate, "yyyy-MM-dd") : null);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full md:w-[180px] justify-between text-left font-normal bg-transparent",
            !selectedValue && "text-muted-foreground",
            className,
          )}
        >
          {selectedValue ? format(new Date(selectedValue), "PPP") : title}
          <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleApply}
          className="rounded-md border shadow-sm"
          captionLayout="dropdown"
        />
      </PopoverContent>
    </Popover>
  );
}
