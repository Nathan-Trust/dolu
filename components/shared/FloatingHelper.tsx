"use client";

import React, { useState } from "react";
import { HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface HelperAction {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: "default" | "outline";
}

interface FloatingHelperProps {
  actions: HelperAction[];
  helperIcon?: React.ReactNode;
  helperText?: string;
}

export function FloatingHelperPopover({
  actions,
  helperIcon,
  helperText = "Need help?",
}: Readonly<FloatingHelperProps>) {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <motion.button
            onClick={() => setOpen(!open)}
            className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Helper button"
          >
            {helperIcon || <HelpCircle className="w-5 h-5" />}
          </motion.button>
        </PopoverTrigger>

        <PopoverContent
          align="end"
          side="top"
          className="w-[260px] backdrop-blur-md shadow-2xl rounded-sm border p-4 space-y-3"
        >
          <div className="font-semibold text-gray-10 flex items-center gap-2">
            {helperIcon || <HelpCircle className="w-4 h-4 text-blue-600" />}
            {helperText}
          </div>

          <AnimatePresence>
            {actions.map((action, index) => (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ delay: index * 0.05 }}
              >
                <Button
                  variant={action.variant || "outline"}
                  className="w-full justify-start gap-2"
                  onClick={() => {
                    action.onClick();
                    setOpen(false);
                  }}
                >
                  {action.icon && (
                    <span className="text-lg">{action.icon}</span>
                  )}
                  <span>{action.label}</span>
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>
        </PopoverContent>
      </Popover>
    </div>
  );
}
    