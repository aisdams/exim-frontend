import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useDebouncedValue } from '@mantine/hooks';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { format } from 'date-fns';
import {
  CheckCircle2,
  PlusCircle,
  XCircle,
  Calendar,
  PlusSquare,
  Search,
  Command,
} from 'lucide-react';
import { toast } from 'react-toastify';

import { cn, getErrMessage } from '@/lib/utils';
import InputSearch from '@/components/table/input-search';
import ReactTable from '@/components/table/react-table';
import { Button } from '@/components/ui/button';
import { DateRangePicker } from '@/components/forms/data-range-picker';

type Quotation = {
  quotation_code: string;
  title: string;
  description: string;
  createdBy: string;
};

const Quotation = [
  {
    quotation_code: 'QuoCode101',
    title: 'Que Code Satu',
  },
  {
    quotation_code: 'QuoCode102',
    title: 'Que Code Dua',
  },
  {
    quotation_code: 'QuoCode103',
    title: 'Que Code Tiga',
  },
];

const columnHelper = createColumnHelper<Quotation>();

const columnsDef = [
  columnHelper.accessor('quotation_code', {
    header: 'QUO NO QUO DATE',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('title', {
    header: 'TYPE',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('description', {
    header: 'CUSTOMER',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('createdBy', {
    header: 'LOADING DISCHARGE',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('createdBy', {
    header: 'SUBJECT',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('createdBy', {
    header: 'SALES',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('createdBy', {
    header: 'Action',
    cell: (info) => info.getValue(),
  }),
];

const searchByOptions = [
  { value: 'quotation_code', label: 'Quotation Code' },
  { value: 'title', label: 'Quotation Title' },
];

export default function Index() {
  const qc = useQueryClient();

  const [searchBy, setSearchBy] = useState(searchByOptions[0].value);
  const [searchKey, setSearchKey] = useState('');
  const [statusesKey, setStatusesKey] = useState<string[]>([]);
  const [date, setDate] = React.useState<Date>();
  const [orderBy, setOrderBy] = useState('All');
  const [orderByTwo, setOrderByTwo] = useState('Quo No');
  const [orderByThree, setOrderByThree] = useState('Quo No');

  const [searchKeyDebounce] = useDebouncedValue(searchKey, 500);

  const columns = useMemo(() => columnsDef, []);
  const defaultData = useMemo(() => [], []);

  const searchQueries = useMemo(() => {
    const queries = [
      {
        by: searchBy,
        key: searchKeyDebounce.trim(),
      },
    ];

    statusesKey.forEach((status) => {
      queries.push({
        by: 'status',
        key: status,
      });
    });

    return queries;
  }, [searchBy, searchKeyDebounce, statusesKey]);

  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const fetchDataOptions = {
    page: pageIndex + 1,
    limit: pageSize,
    searchQueries,
  };

  const quotationsQuery = useQuery({
    queryKey: ['quotations', fetchDataOptions],
    // queryFn: () => quotationService.getAll(fetchDataOptions)
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
    // mutationFn: quotationService.deleteById,
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
    data: quotationsQuery.data?.Quotation ?? defaultData,
    // pageCount: quotationsQuery.data?.pagination.total_page ?? -1,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    meta: {
      deleteMutation: deleteQuotationMutation,
    },
  });

  return (
    <>
      <div className="mb-4">
        <div className="flex gap-3 font-semibold">
          <Command className="text-blueLight" />
          <h1> Quotation</h1>
        </div>
        <div className="w-full rounded-xl border-2 border-graySecondary/50 mt-5 px-3 py-3">
          <div className="flex gap-3 items-center mb-5">
            <Search className="w-4 h-4" />
            <h3> Filter Data</h3>
          </div>

          <div className="">
            <div className="flex items-center gap-3">
              <h3>Date & To: </h3>

              <div>
                <DateRangePicker
                  onUpdate={(values) => console.log(values)}
                  initialDateFrom="2023-01-01"
                  initialDateTo="2023-12-31"
                  align="start"
                  locale="en-GB"
                  showCompare={false}
                />
              </div>
            </div>

            <div className="flex items-center gap-3 mt-3">
              <h1>Status : </h1>
              <Select value={orderBy} onValueChange={setOrderBy}>
                <SelectTrigger className="h-7 w-max [&>span]:text-xs bg-lightWhite">
                  <SelectValue placeholder="Order by" className="" />
                </SelectTrigger>
                <SelectContent align="end">
                  <SelectGroup>
                    <SelectLabel>Order By</SelectLabel>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="OUT_OF_STOCK">OUT_OF_STOCK</SelectItem>
                    <SelectItem value="TOP_SELLING">TOP_SELLING</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-3 mt-3">
              <h3>Filter By : </h3>

              <div className="grid">
                <div className="flex gap-1">
                  <Select value={orderByTwo} onValueChange={setOrderByTwo}>
                    <SelectTrigger className="h-7 w-max [&>span]:text-xs bg-lightWhite">
                      <SelectValue placeholder="Order by" className="" />
                    </SelectTrigger>
                    <SelectContent align="end">
                      <SelectGroup>
                        <SelectLabel>Order By</SelectLabel>
                        <SelectItem value="Quo No">Quo No</SelectItem>
                        <SelectItem value="OUT_OF_STOCK">
                          OUT_OF_STOCK
                        </SelectItem>
                        <SelectItem value="TOP_SELLING">TOP_SELLING</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>

                  <input
                    type="text"
                    name=""
                    id=""
                    placeholder=""
                    className="border border-graySecondary rounded-md"
                  />
                </div>

                <div className="flex gap-1 mt-2">
                  <Select value={orderByThree} onValueChange={setOrderByThree}>
                    <SelectTrigger className="h-7 w-max [&>span]:text-xs bg-lightWhite">
                      <SelectValue placeholder="Order by" className="" />
                    </SelectTrigger>
                    <SelectContent align="end">
                      <SelectGroup>
                        <SelectLabel>Order By</SelectLabel>
                        <SelectItem value="Quo No">Quo No</SelectItem>
                        <SelectItem value="OUT_OF_STOCK">
                          OUT_OF_STOCK
                        </SelectItem>
                        <SelectItem value="TOP_SELLING">TOP_SELLING</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>

                  <input
                    type="text"
                    name=""
                    id=""
                    placeholder=""
                    className="border border-graySecondary rounded-md"
                  />

                  <Button
                    className={cn(
                      'justify-start text-left font-normal bg-blue-500 rounded-md h-7'
                    )}
                  >
                    <Search className="w- 4 h-4 text-white" />
                  </Button>
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
