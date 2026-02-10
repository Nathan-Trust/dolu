"use client";

import type React from "react";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ArrowLeft, X, Search, ListFilter, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMobile } from "@/hooks/use-mobile";

export interface MultiSelectOption {
  label: string;
  value: string | number;
}

interface CustomMultiSelectFilterProps {
  title: string;
  options: MultiSelectOption[];
  selectedValues: (string | number)[];
  onApplyFilter: (values: (string | number)[]) => void;
  triggerComponent?: React.ReactNode;
  className?: string;
  isLoading?: boolean;
  hideSelectedCount?: boolean;
  useSheet?: boolean;
  buttomText?: string;
}

const CustomMultiSelectFilter: React.FC<CustomMultiSelectFilterProps> = ({
  title,
  options,
  selectedValues,
  onApplyFilter,
  triggerComponent,
  className,
  isLoading = false,
  hideSelectedCount,
  useSheet = true,
  buttomText,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempSelectedValues, setTempSelectedValues] =
    useState<(string | number)[]>(selectedValues);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const isMobile = useMobile();

  useEffect(() => {
    setTempSelectedValues(selectedValues);
  }, [selectedValues]);

  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("");
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      if (useSheet) {
        const timer = setTimeout(() => {
          searchInputRef.current?.focus();
        }, 150);
        return () => clearTimeout(timer);
      } else {
        searchInputRef.current.focus();
      }
    }
  }, [isOpen, useSheet]);

  const filteredOptions = useMemo(() => {
    return options.filter((option) =>
      option.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [options, searchQuery]);

  const handleApplyFilter = useCallback(() => {
    onApplyFilter(tempSelectedValues);
    setIsOpen(false);
  }, [onApplyFilter, tempSelectedValues]);

  const handleClear = useCallback(() => {
    setTempSelectedValues([]);
  }, []);

  const handleSelectAll = useCallback(() => {
    const optionsToConsider = searchQuery ? filteredOptions : options;
    const allFilteredValues = optionsToConsider.map((option) => option.value);

    if (searchQuery) {
      const hasAllFilteredSelected = allFilteredValues.every((value) =>
        tempSelectedValues.includes(value)
      );
      if (hasAllFilteredSelected) {
        setTempSelectedValues((prev) =>
          prev.filter((value) => !allFilteredValues.includes(value))
        );
      } else {
        setTempSelectedValues((prev) => {
          const newValues = [...prev];
          allFilteredValues.forEach((value) => {
            if (!newValues.includes(value)) {
              newValues.push(value);
            }
          });
          return newValues;
        });
      }
    } else {
      if (tempSelectedValues.length === options.length) {
        setTempSelectedValues([]);
      } else {
        setTempSelectedValues(options.map((option) => option.value));
      }
    }
  }, [searchQuery, filteredOptions, options, tempSelectedValues]);

  const handleOptionToggle = useCallback((value: string | number) => {
    setTempSelectedValues((prev) => {
      if (prev.includes(value)) {
        return prev.filter((v) => v !== value);
      } else {
        return [...prev, value];
      }
    });
  }, []);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    },
    []
  );

  const getSelectedCount = useCallback(
    () => tempSelectedValues.length,
    [tempSelectedValues]
  );

  const getSelectAllState = useCallback(() => {
    const optionsToConsider = searchQuery ? filteredOptions : options;
    if (optionsToConsider.length === 0) return false;
    return optionsToConsider.every((option) =>
      tempSelectedValues.includes(option.value)
    );
  }, [searchQuery, filteredOptions, options, tempSelectedValues]);

  // Updated FilterContent with proper sticky button positioning
  const FilterContent = (
    <div className="flex flex-col h-full relative">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-3 bg-variable_effect-solid">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(false)}
          className="p-1 h-auto text-foundationBlue"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-lg font-medium">{title}</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(false)}
          className="p-1 h-auto text-blood-9"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Selected Count and Clear */}
      <div className="flex items-center justify-between p-4 bg-gray-alpha2">
        <div className="text-sm text-gray-11">
          <span className="font-medium">{getSelectedCount()} Selected</span>
          {searchQuery && (
            <span className="ml-2 text-gray-11">
              ({filteredOptions.length} shown)
            </span>
          )}
        </div>
        {getSelectedCount() > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="border border-gray-alpha4 text-gray-12 hover:text-gray-12 bg-variable_effect-translucent hover:bg-variable_effect-translucent"
          >
            Clear
          </Button>
        )}
      </div>

      {/* Search Input */}
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-foundationBlue pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder={`Search ${title
              .replace("Filter By ", "")
              .toLowerCase()}...`}
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 text-sm text-gray-12 hover:text-gray-12 border-b border-gray-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
          />
        </div>
      </div>

      {/* Filter Options - with bottom padding to account for sticky button */}
      <div className="flex-1 overflow-y-auto pb-20">
        <div className="p-4">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-2 rounded-lg"
                >
                  <div className="h-4 w-4 bg-gray-alpha2 rounded animate-pulse" />
                  <div className="h-4 bg-gray-alpha2 rounded animate-pulse flex-1" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Select All Option */}
              {filteredOptions.length > 0 && (
                <div className="flex items-center justify-between p-2 rounded-sm hover:bg-accent border py-3">
                  <Label
                    htmlFor="select-all"
                    className="text-sm font-medium cursor-pointer flex-1 text-tokens-text"
                  >
                    {searchQuery
                      ? `All filtered ${title.replace("Filter By ", "")}`
                      : `All ${title.replace("Filter By ", "")}`}
                  </Label>
                  <Checkbox
                    id="select-all"
                    checked={getSelectAllState()}
                    onCheckedChange={handleSelectAll}
                    className="border-gray-8"
                  />
                </div>
              )}

              {/* Individual Options */}
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <div
                    key={option.value}
                    className="flex items-center justify-between p-2 py-3 border border-gray-3 hover:bg-accent rounded-sm"
                  >
                    <div className="flex items-center gap-2">
                      {/* <div className="size-4 bg-gray-2" /> */}
                      <Label
                        htmlFor={`option-${option.value}`}
                        className="text-sm font-medium cursor-pointer flex-1 text-tokens-text"
                      >
                        {option.label}
                      </Label>
                    </div>
                    <Checkbox
                      id={`option-${option.value}`}
                      checked={tempSelectedValues.includes(option.value)}
                      onCheckedChange={() => handleOptionToggle(option.value)}
                      className="border-gray-8"
                    />
                  </div>
                ))
              ) : searchQuery ? (
                <div className="text-center py-8 text-gray-8">
                  <Search className="h-8 w-8 mx-auto mb-2 text-gray-11" />
                  <p className="text-sm">
                    No results found for &quot;{searchQuery}&quot;
                  </p>
                  <p className="text-xs text-gray-12 mt-1">
                    Try adjusting your search terms
                  </p>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>

      {/* Sticky Apply Button - positioned absolutely at bottom */}
      <div className="absolute bottom-0 left-0 bg-variable_effect-solid right-0 p-4 border-t shadow-lg">
        <Button
          onClick={handleApplyFilter}
          className="w-full font-medium py-3 text-base"
          disabled={isLoading}
        >
          {buttomText ?? "Apply Filter"}
        </Button>
      </div>
    </div>
  );

  const DefaultTrigger = (
    <Button
      variant="outline"
      size="sm"
      className={cn(
        "flex items-center border border-gray-4 gap-1 bg-variable_effect-translucent rounded-full text-gray-11 font-medium relative",
        className
      )}
    >
      <p className="flex items-center gap-">
        {/* <ListFilter className="mr-1" /> Filter:{" "} */}
        <span className="mx-1">{title}</span>
      </p>
      <div className="h-3 w-3 rounded-full ring-2 ring-gray-4 flex items-center justify-center">
        <div
          className={cn(
            " bg-transparent rounded-full h-2.5 w-2.5", // Adjusted size for inner dot
            getSelectedCount() > 0 && "bg-foundationBlue"
          )}
        />
      </div>
    </Button>
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger asChild>
          {triggerComponent || DefaultTrigger}
        </DrawerTrigger>
        <DrawerContent
          forceMount
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
          className="h-[80vh] max-h-[600px]"
        >
          {FilterContent}
        </DrawerContent>
      </Drawer>
    );
  }

  if (useSheet) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          {triggerComponent || DefaultTrigger}
        </SheetTrigger>
        <SheetContent
          forceMount
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
          side="right"
          className="w-[400px] sm:max-w-[400px] h-full"
          style={{ padding: 0 }}
        >
          {FilterContent}
        </SheetContent>
      </Sheet>
    );
  }

  // Popover version - also updated with sticky button
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        {triggerComponent || DefaultTrigger}
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[400px]" align="start" side="bottom">
        <div className="w-full max-h-[600px] bg-white border rounded-lg shadow-lg relative">
          {/* Same content structure but with max-height constraint for popover */}
          <div className="flex flex-col h-full max-h-[600px] relative">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-white">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="p-1 h-auto hover:bg-gray-100"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <h2 className="text-lg font-medium">{title}</h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="p-1 h-auto hover:bg-gray-100"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Search Input */}
            <div className="p-4 border-b bg-white">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder={`Search ${title
                    .replace("Filter By ", "")
                    .toLowerCase()}...`}
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                />
              </div>
            </div>

            {/* Selected Count and Clear */}
            <div className="flex items-center justify-between p-4 border-b bg-gray-50">
              <div className="text-sm text-gray-8">
                <span className="font-medium">
                  {getSelectedCount()} Selected
                </span>
                {searchQuery && (
                  <span className="ml-2 text-gray-500">
                    ({filteredOptions.length} shown)
                  </span>
                )}
              </div>
              {getSelectedCount() > 0 && (
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

            {/* Filter Options - with bottom padding for sticky button */}
            <div className="flex-1 overflow-y-auto pb-20 max-h-[300px]">
              <div className="p-4">
                {isLoading ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-3 p-2 rounded-lg"
                      >
                        <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
                        <div className="h-4 bg-gray-200 rounded animate-pulse flex-1" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Select All Option */}
                    {filteredOptions.length > 0 && (
                      <div className="flex items-center justify-between p-2 rounded-lg hover:bg-accent border-b pb-3">
                        <Label
                          htmlFor="select-all-popover"
                          className="text-sm font-medium cursor-pointer flex-1 text-gray-700"
                        >
                          {searchQuery
                            ? `All filtered ${title.replace("Filter By ", "")}`
                            : `All ${title.replace("Filter By ", "")}`}
                        </Label>
                        <Checkbox
                          id="select-all-popover"
                          checked={getSelectAllState()}
                          onCheckedChange={handleSelectAll}
                          className="border-gray-300 text-blue-600 focus:ring-blue-600"
                        />
                      </div>
                    )}

                    {/* Individual Options */}
                    {filteredOptions.length > 0 ? (
                      filteredOptions.map((option) => (
                        <div
                          key={option.value}
                          className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50"
                        >
                          <Checkbox
                            id={`option-popover-${option.value}`}
                            checked={tempSelectedValues.includes(option.value)}
                            onCheckedChange={() =>
                              handleOptionToggle(option.value)
                            }
                            className="border-gray-300 text-blue-600 focus:ring-foundationBlue"
                          />
                          <Label
                            htmlFor={`option-popover-${option.value}`}
                            className="text-sm font-medium cursor-pointer flex-1 text-gray-12"
                          >
                            {option.label}
                          </Label>
                        </div>
                      ))
                    ) : searchQuery ? (
                      <div className="text-center py-8 text-gray-500">
                        <Search className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                        <p className="text-sm">
                          No results found for &quot;{searchQuery}&quot;
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Try adjusting your search terms
                        </p>
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            </div>

            {/* Sticky Apply Button */}
            <div className="absolute bottom-0 left-0 right-0 p-4  border-t shadow-lg rounded-b-lg">
              <Button
                onClick={handleApplyFilter}
                className="w-full  font-medium py-3 text-base"
                disabled={isLoading}
              >
                Apply Filter
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default CustomMultiSelectFilter;
