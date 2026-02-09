"use client";

import type React from "react";
import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CopyableTextProps {
  text: string;
  children: React.ReactNode;
  className?: string;
  showIcon?: boolean;
  iconPosition?: "before" | "after"; // <-- New prop
}

export function CopyableText({
  text,
  children,
  className,
  showIcon = true,
  iconPosition = "after", // <-- Default to "after"
}: Readonly<CopyableTextProps>) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const iconButton = showIcon && (
    <Button
      variant="ghost"
      size="sm"
      onClick={copyToClipboard}
      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
    >
      {copied ? (
        <Check className="h-3 w-3 text-green-600" />
      ) : (
        <Copy className="h-3 w-3 text-muted-foreground hover:text-foreground" />
      )}
    </Button>
  );

  return (
    <div className={cn("group relative inline-flex items-center gap-2", className)}>
      {iconPosition === "before" && iconButton}
      {children}
      {iconPosition === "after" && iconButton}
    </div>
  );
}
