import { cn } from '@/lib/utils';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Loader from './loader';
import ButtonNavigation from './button-navigation';
import { flexRender, Table } from '@tanstack/react-table';

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
    <div className="border-2 border-graySecondary/50 rounded-lg p-3 dark:bg-secondDarkBlue">
      <div className="grid place-content-end mb-5">
        <Select
          defaultValue="15"
          onValueChange={(newValue) => {
            table.setPageSize(Number(newValue));
          }}
        >
          <SelectTrigger className="w-max font-sans dark:bg-darkBlue">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup className="dark:text-black">
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
      <div className="react-table-wrapper mb-2 overflow-x-auto rounded-md border dark:bg-secondDarkBlue">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                className="transition-colors border-graySecondary/50 border-y-2"
              >
                <th className="p-2 border-l-2 border-graySecondary/70 dark:border-white/30">
                  No
                </th>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="border-x-2 p-2 text-start text-sm font-medium tracking-wide border-graySecondary/70 dark:border-white/30"
                  >
                    <div className="text-center">
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
          <tbody className="relative font-normal border-l-2 border-graySecondary/70 dark:border-white/30">
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
                  <td className="border-b p-2 text-center font-semibold border-graySecondary/70">
                    {rowNumber + idx + 1}
                  </td>
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="border-b border-x-2 p-2 text-center border-graySecondary/70 dark:border-white/30"
                    >
                      <div className="!grid">
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

      {/* Pagination*/}
      <div className="flex flex-wrap items-center justify-between gap-2">
        {/* Page Count & Show */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <span className="flex items-center gap-1">
            Page&nbsp;
            {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </span>
        </div>

        {/* Next & Prev Buttons*/}
        <div className="flex flex-wrap items-center gap-2">
          {[...Array(table.getPageCount() > 0 ? table.getPageCount() : 3)].map(
            (_, pageIndex) => (
              <button
                key={pageIndex}
                className={cn(
                  'px-2 py-1 rounded-md',
                  table.getState().pagination.pageIndex === pageIndex
                    ? 'bg-black text-white'
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
