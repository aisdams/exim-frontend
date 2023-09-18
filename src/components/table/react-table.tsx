import { flexRender, Table } from '@tanstack/react-table';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Loader from '../table/loading';
import ButtonNavigation from './button-navigation';

type ReactTableProps = {
  tableInstance: Table<any>;
  isLoading: boolean;
  containerCN?: string;
};

const ReactTable: React.FC<ReactTableProps> = ({
  tableInstance: table,
  isLoading,
  containerCN,
}) => {
  return (
    <div className="border-2 border-graySecondary/50 rounded-lg p-3">
      <div className="grid place-content-end mb-5">
        <Select
          defaultValue="15"
          onValueChange={(newValue) => {
            table.setPageSize(Number(newValue));
          }}
        >
          <SelectTrigger className="w-max font-sans">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {[15, 25, 50, 100, 200].map((pageSize) => (
                <SelectItem
                  key={pageSize}
                  value={String(pageSize)}
                  className="font-normal"
                >
                  Show {pageSize}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="react-table-wrapper mb-2 overflow-x-auto rounded-md border">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                className="transition-colors border-graySecondary/50 border-y-2"
              >
                <th className="w-[1px] border-b p-2" />
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="border-b p-2 text-start text-sm font-medium tracking-wide"
                  >
                    <div className="">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="relative font-normal">
            {table.getRowModel().rows.map((row, idx) => {
              const rowNumber =
                table.getState().pagination.pageIndex === 0
                  ? table.getState().pagination.pageIndex
                  : table.getState().pagination.pageIndex *
                    table.getState().pagination.pageSize; // 0

              return (
                <tr
                  key={row.id}
                  className={cn(
                    'transition-colors hover:bg-muted/50 [&:last-child>td]:!border-b-0'
                  )}
                >
                  <td className="border-b p-2 text-center font-semibold">
                    {rowNumber + idx + 1}
                  </td>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="border-b p-2">
                      <div className="">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </div>
                    </td>
                  ))}
                </tr>
              );
            })}

            {/* No data info */}
            {table.getRowModel().rows.length < 1 && (
              <tr className="">
                <td
                  colSpan={table.getAllColumns().length + 1}
                  className="p-2 text-center"
                >
                  No data found.
                </td>
              </tr>
            )}

            {/* Table Loading Overlay */}
            {isLoading && (
              <tr
                className={cn(
                  'absolute inset-0 z-[2] place-items-center bg-black/30',
                  isLoading ? 'grid' : 'hidden'
                )}
              >
                <td className="bg-transparent">
                  <Loader />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        {/* Page Count & Show */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <span className="flex items-center gap-1">
            Page&nbsp;
            {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </span>
        </div>

        {/* Next & Prev Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {[...Array(table.getPageCount() > 0 ? table.getPageCount() : 3)].map(
            (_, pageIndex) => (
              <button
                key={pageIndex}
                className={cn(
                  'p-2',
                  table.getState().pagination.pageIndex === pageIndex
                    ? 'bg-green-500'
                    : 'bg-transparent'
                )}
                onClick={() => table.setPageIndex(pageIndex)}
              >
                {pageIndex + 1}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default ReactTable;
