import Link from 'next/link';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import {
  createColumnHelper,
  getCoreRowModel,
  PaginationState,
  useReactTable,
} from '@tanstack/react-table';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  CheckCircle2,
  PlusCircle,
  XCircle,
  Calendar,
  MoreHorizontal,
  PlusSquare,
  Search,
  Command,
  PackageSearch,
  Trash,
  Edit2,
  Printer,
  Copy,
  MoreVertical,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useDebouncedValue } from '@mantine/hooks';
import { cn, getErrMessage } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import * as QuotationService from '../../apis/quotation.api';
import React, { useMemo, useState } from 'react';
import ReactTable from '@/components/table/react-table';
import InputSearch from '@/components/forms/input-search';
import { DateRangePicker } from '@/components/forms/data-range-picker';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';

import { Quotation } from '@/types';
import ActionLink from '@/components/table/action-link';
import ActionEdit from '@/components/table/action-edit';
import ActionDelete from '@/components/table/action-delete';

const columnHelper = createColumnHelper<Quotation>();

const columnsDef = [
  columnHelper.accessor('quo_no', {
    header: () => (
      <div>
        <div>QUO NO</div>
        <div>QUO DATE</div>
      </div>
    ),
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('type', {
    header: 'TYPE',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('customer_code', {
    header: 'CUSTOMER',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('loading', {
    header: () => (
      <div>
        <div>LOADING</div>
        <div>DISCHARGE</div>
      </div>
    ),
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('subject', {
    header: 'SUBJECT',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('sales', {
    header: 'SALES',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('status', {
    header: 'STATUS',
    cell: (info) => info.getValue(),
  }),
  columnHelper.display({
    id: 'print',
    header: 'COPY DATA',
    cell: (info) => {
      const { quo_no } = info.row.original;
      const [isCopying, setIsCopying] = useState(false);

      const handleCopyData = async () => {
        try {
          setIsCopying(true);

          const response = await QuotationService.copyQuotationData(quo_no);

          if (response.status === 200) {
            console.log('Data has been copied successfully');
          } else {
            console.error('Failed to copy data:', response.statusText);
          }
        } catch (error) {
          console.error('Error copying data:', error);
        } finally {
          setIsCopying(false);
        }
      };

      return (
        <button
          onClick={handleCopyData}
          disabled={isCopying}
          className="cursor-pointer"
        >
          {isCopying ? (
            'Copying...'
          ) : (
            <Copy size={15} className="dark:text-white items-center ml-5" />
          )}
        </button>
      );
    },
  }),
  columnHelper.display({
    id: 'addJO',
    header: 'ADD JO',
    cell: (info) => {
      const { quo_no } = info.row.original;

      return (
        <Link href={`/jo/create/${quo_no}`}>
          <PlusSquare size={15} className="dark:text-white items-center ml-3" />
        </Link>
      );
    },
  }),

  columnHelper.display({
    id: 'actions',
    header: 'ACTIONS',
    cell: (info) => {
      const { quo_no } = info.row.original;
      const deleteQuotationMutation = info.table.options.meta?.deleteMutation;
      const [open, setOpen] = useState(false);

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0 data-[state=open]:bg-muted"
            >
              <span className="sr-only">Open menu</span>
              <MoreVertical className="h-4 w-4 ml-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="font-normal">
            <DropdownMenuItem className="p-0">
              <Link
                href={`/quotation/edit/${quo_no}`}
                className="flex w-full select-none items-center px-2 py-1.5 hover:cursor-default"
              >
                <Edit2 className="mr-2 h-3.5 w-3.5 text-darkBlue hover:text-white" />
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.preventDefault();
              }}
              className="p-0"
            >
              <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogTrigger className="flex w-full select-none items-center px-2 py-1.5 font-sans hover:cursor-default">
                  <Trash className="mr-2 h-3.5 w-3.5 text-darkBlue hover:text-white" />
                  Delete
                </AlertDialogTrigger>

                <AlertDialogContent className="font-sans">
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you sure absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="font-sans">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={(e) => {
                        e.preventDefault();

                        deleteQuotationMutation?.mutate(quo_no, {
                          onSuccess: () => {
                            setOpen(false);
                          },
                        });
                      }}
                    >
                      {deleteQuotationMutation?.isLoading
                        ? 'Loading...'
                        : 'Continue'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  }),
];

export default function Index() {
  const qc = useQueryClient();
  const [statusesKey, setStatusesKey] = useState<string[]>([]);
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [orderBy, setOrderBy] = useState('All');
  const [orderByTwo, setOrderByTwo] = useState('Quo No');
  const [orderByThree, setOrderByThree] = useState('Quo No');
  const [searchValue, setSearchValue] = useState('');
  const debouncedSearchValue = useDebouncedValue(searchValue, 500);
  const columns = useMemo(() => columnsDef, []);
  const defaultData = useMemo(() => [], []);
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const fetchDataOptions = {
    page: pageIndex + 1,
    limit: pageSize,
  };

  const fetchData = (fetchDataOptions: any, debouncedSearchValue: any) => {
    return QuotationService.getAll({
      ...fetchDataOptions,
      searchValue: debouncedSearchValue,
      quo_no: debouncedSearchValue,
    });
  };

  const quotationsQuery = useQuery({
    queryKey: ['quotations', { fetchDataOptions, searchValue }],
    queryFn: () => fetchData(fetchDataOptions, searchValue),
    keepPreviousData: true,
    onError: (err) => {
      toast.error(`Error, ${getErrMessage(err)}`);
    },
  });

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );

  const deleteQuotationMutation = useMutation({
    mutationFn: QuotationService.deleteById,
    onSuccess: () => {
      qc.invalidateQueries(['quotations']);
      toast.success('Quotation deleted successfully.');
    },
    onError: (err) => {
      toast.error(`Error, ${getErrMessage(err)}`);
    },
  });

  const table = useReactTable({
    columns,
    data: quotationsQuery.data?.data ?? [],
    pageCount: quotationsQuery.data?.pagination.total_page ?? -1,
    state: {
      pagination,
    },
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    meta: {
      deleteMutation: deleteQuotationMutation,
    },
  });

  console.log('Search Value:', searchValue);
  console.log('Quotations Data:', quotationsQuery.data?.data);
  return (
    <>
      <div className="mb-4 z-[100]">
        <div className="flex gap-3 font-semibold">
          <Command className="text-blueLight" />
          <h1>Quotation</h1>
        </div>
        <div className="w-full rounded-xl border-2 border-graySecondary/50 mt-5 px-3 py-3 dark:bg-secondDarkBlue">
          <div className="flex gap-3 items-center mb-5">
            <Search className="w-4 h-4" />
            <h3> Filter Data</h3>
          </div>

          <div className="">
            <div className="flex items-center gap-3">
              <h3>Date and To: </h3>

              <div>
                <DateRangePicker
                  onUpdate={(values) => console.log(values)}
                  initialDateFrom="2023-01-01"
                  initialDateTo="2023-12-31"
                  align="start"
                  locale="en-GB"
                  showCompare={false}
                />
                {/* <Calendar
                  mode="single"
                  captionLayout="dropdown-buttons"
                  selected={date}
                  onSelect={setDate}
                  fromYear={1960}
                  toYear={2030}
                /> */}
              </div>
            </div>

            <div className="flex items-center gap-3 mt-3">
              <h1>Status : </h1>
              <Select value={orderBy} onValueChange={setOrderBy}>
                <SelectTrigger className="h-7 w-max [&>span]:text-xs bg-lightWhite dark:bg-secondDarkBlue dark:border-white">
                  <SelectValue placeholder="Order by" className="" />
                </SelectTrigger>
                <SelectContent align="end" className="dark:text-black">
                  <SelectGroup>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Executed">Executed</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-3 mt-3">
              <h3>Filter By :</h3>

              <div className="grid gap-1">
                <div className="flex gap-1">
                  <Select value={orderByTwo} onValueChange={setOrderByTwo}>
                    <SelectTrigger className="h-7 w-1/2 [&>span]:text-xs bg-lightWhite dark:bg-secondDarkBlue dark:border-white">
                      <SelectValue placeholder="Order by" className="" />
                    </SelectTrigger>
                    <SelectContent align="end" className="dark:text-black">
                      <SelectGroup>
                        <SelectItem value="Quo No">Quo No</SelectItem>
                        <SelectItem value="Customer">Customer</SelectItem>
                        <SelectItem value="Tipe">Tipe</SelectItem>
                        <SelectItem value="Delivery">Delivery</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>

                  <Input
                    type="text"
                    name=""
                    id=""
                    placeholder="Search...."
                    className="border border-graySecondary dark:border-white rounded-md"
                  />
                </div>

                <div className="flex relative">
                  <div className="flex gap-1">
                    <Select
                      value={orderByThree}
                      onValueChange={setOrderByThree}
                    >
                      <SelectTrigger className="h-7 w-1/2 [&>span]:text-xs bg-lightWhite dark:bg-secondDarkBlue dark:border-white">
                        <SelectValue placeholder="Order by" className="" />
                      </SelectTrigger>
                      <SelectContent align="end" className="dark:text-black">
                        <SelectGroup>
                          <SelectItem value="Quo No">Quo No</SelectItem>
                          <SelectItem value="Customer">Customer</SelectItem>
                          <SelectItem value="Tipe">Tipe</SelectItem>
                          <SelectItem value="Delivery">Delivery</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>

                    <Input
                      type="text"
                      name=""
                      id=""
                      placeholder="Search...."
                      className="border border-graySecondary dark:border-white rounded-md"
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                    />
                  </div>

                  <button
                    className="bg-[#3c8dbc] rounded-md absolute -right-10 px-2 py-1"
                    onClick={() => {
                      console.log('Pencarian:', searchValue);
                    }}
                  >
                    <Search className="text-white w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Link href="/quotation/create">
        <Button className="mb-5 bg-green-600 text-white w-max px-2 py-4 gap-2">
          <PlusSquare className="h-5" />
          <h3>Create Quotation</h3>
        </Button>
      </Link>
      <ReactTable
        tableInstance={table}
        isLoading={quotationsQuery.isFetching}
      />
    </>
  );
}
