import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { flexRender, Table } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table as ShadTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '../ui/skeleton';

interface DataTableBasicProps<_T extends object> {
  tableInstance: Table<any>;
  columns: any[];
  toggleVisibility?: boolean;
  id?: string;
  isLoading?: boolean;
  withPagination?: boolean;
  skeletonCount?: number;
}

export const DataTable = <T extends object>({
  tableInstance: table,
  columns,
  toggleVisibility,
  id,
  isLoading,
  withPagination = true,
  skeletonCount = 4,
}: DataTableBasicProps<T>) => {
  return (
    <div className="custom-data-table" id={id}>
      {toggleVisibility && (
        <div className="custom-filter-section">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="warning" className="ml-auto">
                Column Options <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
      <div className="custom-rounded-md">
        <ShadTable>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              //! Loading Skeletons
              [...Array(skeletonCount)].map((_each, idx) => (
                <TableRow key={idx}>
                  {table.getAllColumns().map((each, index) => (
                    <TableCell key={`${index}${Math.random()}`}>
                      <Skeleton className="h-6 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-12 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </ShadTable>
      </div>
      {withPagination && (
        <div className="custom-pagination-section">
          <div className="custom-pagination-buttons">
            <Button
              variant="warning"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="warning"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
