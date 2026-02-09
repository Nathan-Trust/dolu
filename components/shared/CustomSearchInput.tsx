"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
  inputClassName
}) => {
  return (
    <div className={cn("relative w-full sm:w-fit text-11 text-xs", className)}>
      <Search
        size={15}
        className="absolute left-3 top-1/2 transform text-foundationBlue -translate-y-1/2"
      />
      <Input
        className={cn(
          "pl-8 border-gray-3 focus-visible:ring-0 focus-visible:ring-offset-0 outline-none border-0 border-b rounded-none py-1 text-sm sm:w-[263px]",
          inputClassName
        )}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default SearchInput;
