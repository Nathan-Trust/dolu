import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface CustomTableEmptyStateProps {
  headers: string[];
  emptyMessage?: string;
}

const CustomTableEmptyState: React.FC<CustomTableEmptyStateProps> = ({
  headers,
  emptyMessage = "No data available.",
}) => {
  const renderTableHeaders = headers.map((header) => (
    <TableHead
      key={header}
      className="text-xs h-8 uppercase py-0 text-gray-10 bg-table-header px-6"
    >
      {header}
    </TableHead>
  ));

  return (
    <div className="relative mt-8 lg:mt-2  border border-gray-3  rounded-none hide-scroll w-full col-span-3">
      <Table className="hide-scroll">
        <TableHeader className="bg-table-header  h-[40px] border-b border-gray-3">
          <TableRow className="border-none text-sm whitespace-nowrap  uppercase bg-table-header">
            {renderTableHeaders}
          </TableRow>
        </TableHeader>
        <TableBody className="  h-[300px] hide-scroll">
          <TableRow className="border-none text-gray-11 bg-transparent hover:bg-transparent">
            <TableCell
              colSpan={headers.length}
              className="text-center py-4 px-6"
            >
              {emptyMessage}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default CustomTableEmptyState;
