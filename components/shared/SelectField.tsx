"use client";

import type { UseFormReturn } from "react-hook-form";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Option {
  value: string | number;
  label: string;
}

interface SelectFieldProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  placeholder: string;
  options: Option[];
  isLoading?: boolean;
  required?: boolean;
  disabled?: boolean;
}

export function SelectField({
  form,
  name,
  label,
  placeholder,
  options,
  isLoading = false,
  required = false,
  disabled = false,
}: SelectFieldProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-sm font-medium">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </FormLabel>
          <Select
            value={
              Array.isArray(field.value)
                ? (field.value[0] ?? "")
                : (field.value ?? "")
            }
            onValueChange={field.onChange}
            disabled={disabled || isLoading}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue
                  placeholder={isLoading ? "Loading..." : placeholder}
                />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={String(option.value)}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
