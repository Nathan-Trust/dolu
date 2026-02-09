"use client";

import type React from "react";
import { useState } from "react";
import { format, addDays, startOfWeek, isSameDay } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DateRangeSelectorProps {
  onDateRangeSelect: (startDate: string, endDate: string) => void;
  triggerComponent?: React.ReactNode;
}

const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({
  onDateRangeSelect,
  triggerComponent,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDays, setSelectedDays] = useState<Date[]>([]);

  // Get current week starting from Monday
  const today = new Date();
  const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 }); // Monday = 1
  const weekDays = Array.from({ length: 7 }, (_, i) =>
    addDays(startOfCurrentWeek, i),
  );

  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const handleDayToggle = (day: Date) => {
    setSelectedDays((prev) => {
      const isSelected = prev.some((selectedDay) =>
        isSameDay(selectedDay, day),
      );
      if (isSelected) {
        return prev.filter((selectedDay) => !isSameDay(selectedDay, day));
      } else {
        return [...prev, day].sort((a, b) => a.getTime() - b.getTime());
      }
    });
  };

  const handleApply = () => {
    if (selectedDays.length > 0) {
      const sortedDays = selectedDays.sort((a, b) => a.getTime() - b.getTime());
      const startDate = format(sortedDays[0], "yyyy-MM-dd");
      const endDate = format(sortedDays[sortedDays.length - 1], "yyyy-MM-dd");
      onDateRangeSelect(startDate, endDate);
    }
    setIsOpen(false);
  };

  const handleClear = () => {
    setSelectedDays([]);
  };

  const DefaultTrigger = (
    <Button variant="link" className="p-0 h-auto text-blue-600 text-sm">
      Select
    </Button>
  );

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        {triggerComponent || DefaultTrigger}
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <div className="flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-lg font-medium">Select Days</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="p-1 h-auto"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Selected Count and Clear */}
          <div className="flex items-center justify-between p-4 bg-gray-50 border-b">
            <div className="text-sm text-gray-600">
              <span className="font-medium">
                {selectedDays.length} days selected
              </span>
            </div>
            {selectedDays.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClear}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              >
                Clear
              </Button>
            )}
          </div>

          {/* Week Views */}
          <div className="p-4 max-h-[400px] overflow-y-auto">
            {/* This Week */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                This Week
              </h4>
              <div className="grid grid-cols-7 gap-2">
                {weekDays.map((day, index) => {
                  const isSelected = selectedDays.some((selectedDay) =>
                    isSameDay(selectedDay, day),
                  );
                  const isToday = isSameDay(day, today);

                  return (
                    <button
                      key={day.toISOString()}
                      type="button"
                      onClick={() => handleDayToggle(day)}
                      className={cn(
                        "flex flex-col items-center p-2 rounded-lg border-2 transition-all text-center",
                        isSelected
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50",
                        isToday && !isSelected && "border-blue-200 bg-blue-25",
                      )}
                    >
                      <span className="text-xs font-medium text-gray-500 mb-1">
                        {dayNames[index]}
                      </span>
                      <span
                        className={cn(
                          "text-sm font-semibold",
                          isSelected ? "text-blue-700" : "text-gray-900",
                        )}
                      >
                        {format(day, "d")}
                      </span>
                      <span className="text-xs text-gray-500">
                        {format(day, "MMM")}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Next Week */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                Next Week
              </h4>
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 7 }, (_, i) =>
                  addDays(startOfCurrentWeek, i + 7),
                ).map((day, index) => {
                  const isSelected = selectedDays.some((selectedDay) =>
                    isSameDay(selectedDay, day),
                  );

                  return (
                    <button
                      key={day.toISOString()}
                      type="button"
                      onClick={() => handleDayToggle(day)}
                      className={cn(
                        "flex flex-col items-center p-2 rounded-lg border-2 transition-all text-center",
                        isSelected
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50",
                      )}
                    >
                      <span className="text-xs font-medium text-gray-500 mb-1">
                        {dayNames[index]}
                      </span>
                      <span
                        className={cn(
                          "text-sm font-semibold",
                          isSelected ? "text-blue-700" : "text-gray-900",
                        )}
                      >
                        {format(day, "d")}
                      </span>
                      <span className="text-xs text-gray-500">
                        {format(day, "MMM")}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Days Summary */}
            {selectedDays.length > 0 && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <h5 className="text-sm font-medium text-blue-900 mb-2">
                  Selected Days:
                </h5>
                <div className="flex flex-wrap gap-1">
                  {selectedDays.map((day) => (
                    <span
                      key={day.toISOString()}
                      className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {format(day, "EEE, MMM d")}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Apply Button */}
          <div className="p-4 border-t">
            <Button
              onClick={handleApply}
              className="w-full font-medium"
              disabled={selectedDays.length === 0}
            >
              Apply ({selectedDays.length} days)
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DateRangeSelector;
