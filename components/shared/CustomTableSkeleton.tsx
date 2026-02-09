import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

interface CustomTableSkeletonProps {
  headers: string[];
  rows: number;
}

export const CustomTableSkeleton: React.FC<CustomTableSkeletonProps> = ({
  headers,
  rows,
}) => {
  const renderTableHeaders = headers.map((header) => (
    <TableHead
      key={header}
      className="text-xs h-8 uppercase py-0 bg-table-header px-6"
    >
      <Skeleton className="h-4 w-24 bg-primary/10 dark:bg-[#98A6AD]/10" />
    </TableHead>
  ));

  const renderSkeletonRows = Array.from({ length: rows }).map((_, rowIndex) => (
    <TableRow
      key={crypto.randomUUID()}
      className={`border-l-0 border-r-0 border-b border-gray-3   last:border-none text-xs text-center leading-5   transition-colors`}
    >
      {headers.map((header) => (
        <TableCell key={header} className="whitespace-nowrap py-2.5 px-6">
          <Skeleton className="h-4 w-16" />
        </TableCell>
      ))}
    </TableRow>
  ));

  return (
    <div className="relative mt-8 lg:mt-2 overflow-x-auto border border-gray-3  rounded-none w-full col-span-3 hide-scroll">
      <Table>
        <TableHeader className="  h-[40px] border-b border-gray-3  ">
          <TableRow className="border text-sm whitespace-nowrap text-center uppercase bg-table-header ">
            {renderTableHeaders}
          </TableRow>
        </TableHeader>
        <TableBody className=" ">{renderSkeletonRows}</TableBody>
      </Table>
    </div>
  );
};
