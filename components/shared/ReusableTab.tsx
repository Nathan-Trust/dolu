"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import React from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface Props {
  /** The text label to display. */
  label: string;
  /** Optional URL for navigation. If provided, the tab acts as a link. */
  href?: string;
  /** Whether the tab is active, controlling the active styling. */
  isActive?: boolean;
  /** Whether to render a Select dropdown instead of a tab. */
  isSelect?: boolean;
  /** Options for the Select dropdown when isSelect is true. */
  selectOptions?: string[];
  /** Optional click handler used when `href` is not provided. */
  onClick?: () => void;
  className?: string;
  tabItemClassName?: string;
  textClassName?: string;
}

export const ReusableTab = ({
  label,
  href,
  isActive,
  isSelect,
  selectOptions,
  className,
  tabItemClassName,
  textClassName,
  onClick,
}: Props) => {
  if (isSelect && selectOptions?.length) {
    return (
      <Select>
        <SelectTrigger className={cn("w-[180px", className)}>
          <SelectValue placeholder={label} />
        </SelectTrigger>
        <SelectContent>
          {selectOptions.map((option) => (
            <SelectItem key={option} value={option.toLowerCase()}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  const content = (
    <>
      <h3
        className={cn(
          "text-gray-12 text-lg leading-0 font-medium font-inter capitalize  duration-150 transition-all ease-linear pb-0 px-1",
          isActive ? "text-gray-12" : "text-gray-12 font-normal",
          tabItemClassName,
        )}
      >
        {label}
      </h3>

      {isActive && (
        <motion.div
          layoutId={href ? "underline-tabs" : "underline-options"}
          className="absolute h-0.5 bottom-1 bg-[#5472e4] dark:bg-[#D961AB] w-full"
        />
      )}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="relative self-stretch bg-transparent justify-start items-center flex overflow-hidden gap-2"
      >
        {content}
      </Link>
    );
  } else {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "relative self-stretch bg-transparent justify-start items-center flex overflow-hidden gap-2  my-[20px]",
          textClassName,
        )}
      >
        {content}
      </button>
    );
  }
};
