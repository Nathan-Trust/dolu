/* eslint-disable @typescript-eslint/no-explicit-any */
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
  headerClassName?: string;
  rowClassName?: string;
  searchSlot?: React.ReactNode;
  title?: string;
  headerRight?: React.ReactNode;
  onRowClick?: (row: T, index: number) => void;
}

const getNestedValue = (
  obj: any,
  path: string,
): React.ReactNode | string | number | null | undefined => {
  const parts = path.split(".");
  let current: any = obj;
  for (const part of parts) {
    if (current === null || typeof current !== "object" || !(part in current)) {
      return undefined;
    }
    current = current[part];
  }
  if (
    current &&
    typeof current === "object" &&
    !(current instanceof Date) &&
    !React.isValidElement(current)
  ) {
    return JSON.stringify(current);
  }
  return current;
};

const hasChildren = (
  value: any,
): value is React.ReactElement<{ children?: any }> =>
  React.isValidElement(value) && value.props !== undefined;

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

export const isCurrencyLike = (value: any): boolean => {
  const text = extractText(value).trim();
  if (!text) return false;
  const cleaned = text.replace(/^[₦$€£¥₹]/, "");
  const match = cleaned.match(/^([A-Z]{3})?\s?(\d{1,3}(,\d{3})*|\d+)(\.\d+)?$/);
  if (!match) return false;
  const numericPart = match[2]?.replace(/,/g, "");
  return !isNaN(Number(numericPart));
};

const isCurrencyColumn = (
  keyPath: string,
  data: TableRowData[] = [],
): boolean => {
  const sampleSize = Math.min(data.length, 5);
  let currencyLikeCount = 0;
  for (let i = 0; i < sampleSize; i++) {
    const val = getNestedValue(data[i], keyPath);
    if (isCurrencyLike(val)) {
      currencyLikeCount++;
    }
  }
  return currencyLikeCount >= Math.ceil(sampleSize / 2);
};

const CustomTable = <T extends TableRowData>({
  headers,
  data,
  headerKeyMap,
  enableSelection = false,
  selectedRows,
  onSelectRow,
  onSelectAllRows,
  getId,
  headerClassName,
  rowClassName,
  searchSlot,
  title,
  headerRight,
  onRowClick,
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
        <TableHead className="h-8 px-3 py-0">
          <Checkbox
            checked={isIndeterminate ? "indeterminate" : allRowsSelected}
            onCheckedChange={handleHeaderCheckboxChange}
            aria-label="Select all rows"
          />
        </TableHead>
      )}
      {headers.map((header) => {
        const keyPath = headerKeyMap[header];
        const isCostCode = header
          .toLowerCase()
          .replace(/[_\s-]/g, "")
          .includes("costcode");
        const alignRight = !isCostCode && isCurrencyColumn(keyPath, data);

        return (
          <TableHead
            key={header}
            className={`h-8 px-3 py-0 font-montserrat text-sm font-bold text-[#0f0f0f] ${
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
        className={`border-b border-[#e0e0e0] transition-colors ${
          rowIndex % 2 !== 0 ? "bg-[#f3f3f3]" : ""
        } ${isRowSelected ? "bg-blue-50" : ""} ${onRowClick ? "cursor-pointer hover:bg-[#e8e8e8]" : ""} ${rowClassName ?? ""}`}
        onClick={onRowClick ? () => onRowClick(typedRow, rowIndex) : undefined}
      >
        {enableSelection && (
          <TableCell className="whitespace-nowrap px-3 py-2">
            <Checkbox
              checked={isRowSelected}
              onCheckedChange={handleRowCheckboxChange}
              aria-label={`Select row ${rowId}`}
            />
          </TableCell>
        )}
        {headers.map((header) => {
          const keyPath = headerKeyMap[header];
          const cellValue = getNestedValue(typedRow, keyPath);
          const isCostCode = header
            .toLowerCase()
            .replace(/[_\s-]/g, "")
            .includes("costcode");
          return (
            <TableCell
              key={`${rowId}-${header}`}
              className={`whitespace-nowrap px-3 py-2 font-montserrat text-sm ${
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
    <div className="w-full overflow-hidden rounded-lg bg-[#f8f8f8] p-4">
      {/* Optional title bar */}
      {(title || searchSlot || headerRight) && (
        <div className="mb-2.5 flex items-center justify-between">
          <div className="flex items-center gap-8">
            {title && (
              <p className="font-montserrat text-sm font-bold text-[#0f0f0f]">
                {title}
              </p>
            )}
            {searchSlot}
          </div>
          {headerRight}
        </div>
      )}

      {/* Table */}
      <div className="w-full overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow
              className={`border-none ${headerClassName ?? "rounded bg-[#f2d5ff]"}`}
            >
              {renderTableHeaders}
            </TableRow>
          </TableHeader>
          <TableBody>{renderTableRows}</TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CustomTable;
