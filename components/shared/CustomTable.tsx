// src/components/shared/CustomTable.tsx
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Checkbox } from "@/components/ui/checkbox";

// Define a generic type for your table data row, extending a basic record type
// This allows CustomTable to work with any object shape.
// CustomTable.tsx
type TableRowData = Record<
  string,
  React.ReactNode | string | number | null | object
>;

interface CustomTableProps<T extends TableRowData = TableRowData> {
  headers: string[];
  data?: T[];
  headerKeyMap: Record<string, string>;
  enableSelection?: boolean;

  selectedRows?: Set<string | number>;
  onSelectRow?: (id: string | number, isSelected: boolean) => void;
  onSelectAllRows?: (isSelected: boolean) => void;
  getId?: (row: T) => string | number;
}

// Helper function to safely get nested values
const getNestedValue = (
  obj: any,
  path: string
): React.ReactNode | string | number | null | undefined => {
  const parts = path.split(".");
  let current: any = obj;
  for (const part of parts) {
    if (current === null || typeof current !== "object" || !(part in current)) {
      return undefined; // Path not found or not an object
    }
    current = current[part];
  }
  // Convert objects/dates to string if they're not primitives or React nodes
  if (
    current &&
    typeof current === "object" &&
    !(current instanceof Date) &&
    !React.isValidElement(current)
  ) {
    return JSON.stringify(current); // Or format as needed
  }
  return current;
};

/**
 * Type guard to check if a value is a React element with props.children.
 * @param value - Any potential React element
 * @returns True if it's a React element with children
 */
const hasChildren = (
  value: any
): value is React.ReactElement<{ children?: any }> =>
  React.isValidElement(value) && value.props !== undefined;

/**
 * Recursively extracts text content from a string, number, or React element.
 * Supports nested children (e.g., <div><span>3,000</span></div>).
 *
 * @param value - The input value
 * @returns Flattened text content
 */
export const extractText = (value: any): string => {
  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }

  if (hasChildren(value)) {
    const { children } = value.props;

    if (typeof children === "string" || typeof children === "number") {
      return String(children);
    }

    if (Array.isArray(children)) {
      return children.map(extractText).join(" ");
    }

    return extractText(children);
  }

  return "";
};

/**
 * Checks whether the given value resembles a currency string,
 * e.g. "3,000.00", <p>80,000</p>, 100000
 *
 * @param value - Value to check
 * @returns True if currency-like
 */
export const isCurrencyLike = (value: any): boolean => {
  const text = extractText(value).trim();

  if (!text) return false;

  // Remove known currency symbols (₦, $, €, etc.)
  const cleaned = text.replace(/^[₦$€£¥₹]/, "");

  // Only consider strings that are *pure* numbers or formatted currency strings.
  // Matches: "1,000", "1000.00", "₦50,000", "USD 1,000.00"
  // Rejects: "26th Payroll", "Invoice 1", etc.
  const match = cleaned.match(/^([A-Z]{3})?\s?(\d{1,3}(,\d{3})*|\d+)(\.\d+)?$/);

  if (!match) return false;

  const numericPart = match[2]?.replace(/,/g, "");

  return !isNaN(Number(numericPart));
};



/**
 * Checks if a column is currency-like based on sample data.
 */
const isCurrencyColumn = (
  keyPath: string,
  data: TableRowData[] = []
): boolean => {
  const sampleSize = Math.min(data.length, 5); // Check up to 5 rows
  let currencyLikeCount = 0;

  for (let i = 0; i < sampleSize; i++) {
    const val = getNestedValue(data[i], keyPath);
    if (isCurrencyLike(val)) {
      currencyLikeCount++;
    }
  }

  return currencyLikeCount >= Math.ceil(sampleSize / 2); // majority
};

// Make CustomTable a generic component
const CustomTable = <T extends TableRowData>({
  headers,
  data,
  headerKeyMap,
  enableSelection = false,
  selectedRows,
  onSelectRow,
  onSelectAllRows,
  getId,
}: CustomTableProps<T>) => {
  const allRowsSelected =
    enableSelection &&
    data &&
    data.length > 0 &&
    selectedRows?.size === data.length;
  const isIndeterminate =
    enableSelection &&
    data &&
    data.length > 0 &&
    selectedRows &&
    selectedRows.size > 0 &&
    selectedRows.size < data.length;

  const handleHeaderCheckboxChange = (checked: boolean) => {
    onSelectAllRows?.(checked);
  };

  const renderTableHeaders = (
    <>
      {enableSelection && (
        <TableHead className="text-xs h-8 uppercase py-0 px-6 bg-table-header">
          <Checkbox
            checked={isIndeterminate ? "indeterminate" : allRowsSelected}
            onCheckedChange={handleHeaderCheckboxChange}
            aria-label="Select all rows"
          />
        </TableHead>
      )}
      {headers.map((header) => {
        const keyPath = headerKeyMap[header];
        const isCostCode = header.toLowerCase().replace(/[_\s-]/g, "").includes("costcode");
        const alignRight = !isCostCode && isCurrencyColumn(keyPath, data);

        return (
          <TableHead
            key={header}
            className={`text-xs h-8 uppercase py-0 px-6 bg-table-header ${
              alignRight ? "text-right" : ""
            }`}
          >
            {header}
          </TableHead>
        );
      })}
    </>
  );

  const renderTableRows = data?.map((row, rowIndex) => {
    const typedRow: T = row;
    const rowId =
      enableSelection && getId
        ? getId(typedRow)
        : (row as any).id?.toString() || rowIndex;

    const isRowSelected = enableSelection && selectedRows?.has(rowId);

    const handleRowCheckboxChange = (checked: boolean) => {
      if (onSelectRow) {
        onSelectRow(rowId, checked);
      }
    };

    return (
      <TableRow
        key={rowId}
        className={` border-l-0 border-gray-3  border-r-0 last:border-none  text-gray-12 text-xs  leading-0 
        transition-colors ${
          rowIndex % 2 === 0
            ? "hover:/50"
            : "bg-table-row-odd hover:bg-table-row-odd/25 dark:hover:bg-[#333333]"
        } ${isRowSelected ? "bg-blue-50 dark:bg-blue-900/20" : ""}`}
      >
        {enableSelection && (
          <TableCell className="whitespace-nowrap py-2.5 px-6">
            <Checkbox
              checked={isRowSelected}
              onCheckedChange={handleRowCheckboxChange}
              aria-label={`Select row ${rowId}`}
            />
          </TableCell>
        )}
        {headers.map((header) => {
          const keyPath = headerKeyMap[header]; // e.g., "organization.org_name"
          const cellValue = getNestedValue(typedRow, keyPath); // Use the helper
          const isCostCode = header.toLowerCase().replace(/[_\s-]/g, "").includes("costcode");
          return (
            <TableCell
              key={`${rowId}-${header}`}
              className={`whitespace-nowrap py-2.5 px-6 ${
                !isCostCode && isCurrencyLike(cellValue) ? "text-right" : ""
              }`}
            >
              {cellValue !== undefined ? cellValue : "-"}
            </TableCell>
          );
        })}
      </TableRow>
    );
  });

  return (
    <div className="relative mt-8 lg:mt-2 overflow-x-auto border border-gray-3  rounded-none w-full col-span-3 hide-scroll">
      <Table>
        <TableHeader className=" h-[40px] border-b ">
          <TableRow className="border-none text-sm whitespace-nowrap  uppercase ">
            {renderTableHeaders}
          </TableRow>
        </TableHeader>
        <TableBody className=" ">{renderTableRows}</TableBody>
      </Table>
    </div>
  );
};

export default CustomTable;
