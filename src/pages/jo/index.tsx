import Link from 'next/link';
import { format } from 'date-fns';
import React, { useMemo, useState } from 'react';
import {
  CheckCircle2,
  PlusCircle,
  XCircle,
  Calendar,
  PlusSquare,
  Search,
  Command,
  Copy,
  Trash,
  EditIcon,
  Box,
} from 'lucide-react';
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
import { toast } from 'react-toastify';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn, getErrMessage } from '@/lib/utils';
import { useDebouncedValue } from '@mantine/hooks';
import ReactTable from '@/components/table/react-table';
import InputSearch from '@/components/forms/input-search';
import { DateRangePicker } from '@/components/forms/data-range-picker';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

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
    <div className="w-full ">
      <div className="rounded-xl border border-graySecondary/50 dark:bg-secondDarkBlue mb-5 px-3 py-2">
        <div className="flex gap-5 font-semibold items-center mb-5">
          <Box className="text-blueLight" />
          <h1>Job Order</h1>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border-graySecondary/50 border-2 p-3">
            <Label>Example 1 :</Label>
            <Input name="example" />
            <Label>Example 2 :</Label>
            <Input name="example" />
            <Label>Example 3 :</Label>
            <Input name="example" />
          </div>

          <div className="rounded-lg border-graySecondary/50 border-2 p-3">
            <div>
              <Label>Example 1 :</Label>
              <Input name="example" />
              <Label>Example 2 :</Label>
              <Input name="example" />
              <Label>Example 3 :</Label>
              <Input name="example" />
            </div>
          </div>

          <Button className="bg-green-500 mt-3 w-max mb-3">Save</Button>
        </div>
        <hr />
      </div>

      <ReactTable
        tableInstance={table}
        isLoading={quotationsQuery.isFetching}
      />
    </div>
  );
}
