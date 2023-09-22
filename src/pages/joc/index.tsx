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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  CheckCircle2,
  PlusCircle,
  XCircle,
  Calendar,
  PlusSquare,
  Search,
  Command,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn, getErrMessage } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import * as JobOrderService from '../../apis/jo.api';
import React, { useMemo, useState } from 'react';
import { useDebouncedValue } from '@mantine/hooks';
import ReactTable from '@/components/table/react-table';
import InputSearch from '@/components/forms/input-search';
import { DateRangePicker } from '@/components/forms/data-range-picker';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';

import { JobOrder } from '@/types';

const columnHelper = createColumnHelper<JobOrder>();

const columnsDef = [
  columnHelper.accessor('jo_no', {
    header: '#JO NO DATE',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('quo_no', {
    header: 'QUO NO SALES',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('quo_no', {
    header: 'TYPE',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('customer_code', {
    header: 'CUSTOMER',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('hbl', {
    header: 'HBL/HAWB MBL/MAWB',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('quo_no', {
    header: 'LOADING DISCHARGE',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('etd', {
    header: 'ETD ETA',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('createdBy', {
    header: 'CREATED',
    cell: (info) => info.getValue(),
  }),
];

export default function Index() {
  const qc = useQueryClient();
  const [statusesKey, setStatusesKey] = useState<string[]>([]);
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [orderBy, setOrderBy] = useState('All');
  const [orderByTwo, setOrderByTwo] = useState('Quo No');
  const [orderByThree, setOrderByThree] = useState('Quo No');
  const [isActive, SetIsActive] = useState('');

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

  const JobOrdersQuery = useQuery({
    queryKey: ['JobOrders', fetchDataOptions],
    queryFn: () => JobOrderService.getAll(fetchDataOptions),
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

  const deleteJobOrderMutation = useMutation({
    mutationFn: JobOrderService.deleteById,
    onSuccess: () => {
      qc.invalidateQueries(['jobOrders']);
      toast.success('jobOrder deleted successfully.');
    },
    onError: (err) => {
      toast.error(`Error, ${getErrMessage(err)}`);
    },
  });

  const table = useReactTable({
    columns,
    data: JobOrdersQuery.data?.data ?? defaultData,
    pageCount: JobOrdersQuery.data?.pagination.total_page ?? -1,

    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    meta: {
      deleteMutation: deleteJobOrderMutation,
    },
  });

  return (
    <>
      <div className="mb-4 z-[100]">
        <div className="flex gap-3 font-semibold">
          <Command className="text-blueLight" />
          <h1> Job Order</h1>
        </div>
        <div className="flex gap-2 mt-3 text-white">
          <div className="bg-blueHeaderCard px-3 py-1 rounded-sm">Data JO</div>
          <div className="bg-green-500 px-3 py-1 rounded-sm">Data JOC</div>
        </div>
        <div className="w-full rounded-xl border-2 border-graySecondary/50 mt-5 px-3 py-3 dark:bg-secondDarkBlue">
          <div className="flex gap-3 items-center mb-5">
            <Search className="w-4 h-4" />
            <h3> Filter Data Consolidation</h3>
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
              <h3>Filter By : </h3>

              <div className="grid gap-1">
                <div className="flex gap-1">
                  <Select value={orderByTwo} onValueChange={setOrderByTwo}>
                    <SelectTrigger className="h-7 w-1/2 [&>span]:text-xs bg-lightWhite dark:bg-secondDarkBlue dark:border-white">
                      <SelectValue placeholder="Order by" className="" />
                    </SelectTrigger>
                    <SelectContent align="end" className="dark:text-black">
                      <SelectGroup>
                        <SelectItem value="JOC No">JOC No</SelectItem>
                        <SelectItem value="Agent">Agent</SelectItem>
                        <SelectItem value="Tipe">Tipe</SelectItem>
                        <SelectItem value="Loading">Loading</SelectItem>
                        <SelectItem value="Discharge">Discharge</SelectItem>
                        <SelectItem value="MBL">MBL</SelectItem>
                        <SelectItem value="No. Container">
                          No. Container
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>

                  <Input
                    type="text"
                    name=""
                    id=""
                    placeholder=""
                    className="border border-graySecondary dark:border-white rounded-md"
                  />
                </div>

                <div className="flex relative">
                  <div className="flex gap-1">
                    <Select value={orderByTwo} onValueChange={setOrderByTwo}>
                      <SelectTrigger className="h-7 w-1/2 [&>span]:text-xs bg-lightWhite dark:bg-secondDarkBlue dark:border-white">
                        <SelectValue placeholder="Order by" className="" />
                      </SelectTrigger>
                      <SelectContent align="end" className="dark:text-black">
                        <SelectGroup>
                          <SelectItem value="JOC No">JOC No</SelectItem>
                          <SelectItem value="Agent">Agent</SelectItem>
                          <SelectItem value="Tipe">Tipe</SelectItem>
                          <SelectItem value="Loading">Loading</SelectItem>
                          <SelectItem value="Discharge">Discharge</SelectItem>
                          <SelectItem value="MBL">MBL</SelectItem>
                          <SelectItem value="No. Container">
                            No. Container
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>

                    <Input
                      type="text"
                      name=""
                      id=""
                      placeholder=""
                      className="border border-graySecondary dark:border-white rounded-md"
                    />
                  </div>

                  <button className="bg-[#3c8dbc] rounded-md absolute -right-10 px-2 py-1">
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
          <h3>Create JOC</h3>
        </Button>
      </Link>
      <ReactTable tableInstance={table} isLoading={JobOrdersQuery.isFetching} />
    </>
  );
}
