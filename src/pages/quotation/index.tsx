import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Quotation } from '@/types';
import { useDebouncedValue } from '@mantine/hooks';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createColumnHelper,
  getCoreRowModel,
  PaginationState,
  useReactTable,
} from '@tanstack/react-table';
import { format } from 'date-fns';
import {
  Calendar,
  CheckCircle2,
  CheckIcon,
  Command,
  Copy,
  Edit2,
  MoreHorizontal,
  MoreVertical,
  PackageSearch,
  PlusCircle,
  PlusSquare,
  Printer,
  Search,
  Trash,
  XCircle,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';

import { cn, getErrMessage } from '@/lib/utils';
import { DateRangePicker } from '@/components/forms/data-range-picker';
import InputSearch from '@/components/forms/input-search';
import ActionLink from '@/components/table/action-link';
import ReactTable from '@/components/table/react-table';
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
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import * as QuotationService from '../../apis/quotation.api';

const handleExecuteButtonClick = (info: any, setStatusInDatabase: any) => {
  const currentStatus = info.getValue();
  if (currentStatus !== 'Executed') {
    setStatusInDatabase('Executed');
  }
};

const columnHelper = createColumnHelper<Quotation>();
const columnsDef = [
  columnHelper.accessor('quo_no', {
    enableSorting: false,
    header: () => (
      <div>
        <div>QUO NO</div>
        <div>QUO DATE</div>
      </div>
    ),
    cell: (info) => {
      const date = new Date(info.row.original.createdAt);
      const formattedDate = `${date.getDate()}/${
        date.getMonth() + 1
      }/${date.getFullYear()}`;

      return (
        <div>
          <div>{info.row.original.quo_no}</div>
          <div>{formattedDate}</div>
        </div>
      );
    },
  }),
  columnHelper.accessor('type', {
    header: 'TYPE',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('customer', {
    header: 'CUSTOMER',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('loading', {
    enableSorting: false,
    header: () => (
      <div>
        <div>LOADING</div>
        <div>DISCHARGE</div>
      </div>
    ),
    cell: (info) => (
      <div>
        <div>{info.row.original.loading}</div>
        <div>{info.row.original.discharge}</div>
      </div>
    ),
  }),
  columnHelper.accessor('subject', {
    header: 'SUBJECT',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('status', {
    header: 'STATUS',
    cell: (info) => (
      <div>
        <div
          className={`rounded-md px-2 ${
            info.getValue() === 'InProgress'
              ? 'bg-yellow-600'
              : info.getValue() === 'Executed'
              ? 'bg-green-500'
              : info.getValue() === 'Cancel'
              ? 'bg-red-600'
              : ''
          }`}
        >
          {info.getValue()}
        </div>
      </div>
    ),
  }),
  columnHelper.accessor('sales', {
    header: 'SALES',
    cell: (info) => info.getValue(),
  }),
  columnHelper.display({
    id: 'copy',
    header: 'COPY DATA',
    cell: (info) => {
      const { quo_no } = info.row.original;
      const [isCopying, setIsCopying] = useState(false);
      const router = useRouter();

      const handleCopyData = async () => {
        try {
          setIsCopying(true);

          const response = await QuotationService.copyQuotationData(quo_no);

          if (response.status === 200) {
            toast.success('Status successfully changed');
          }
        } finally {
          setIsCopying(false);
          router.reload();
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
            <Copy
              size={15}
              className="mx-auto grid items-center justify-center dark:text-white"
            />
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
          <PlusSquare
            size={15}
            className="mx-auto grid items-center justify-center dark:text-white"
          />
        </Link>
      );
    },
  }),
  columnHelper.display({
    id: 'printQuo',
    header: 'Print',
    cell: (info) => {
      const { quo_no } = info.row.original;

      return (
        <Button>
          <Link href={`/quotation/print/${quo_no}`} target="_blank">
            <Printer
              size={15}
              className="mx-auto grid items-center justify-center dark:text-white"
            />
          </Link>
        </Button>
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
      const [newStatus, setNewStatus] = useState('InProgress');
      const currentStatus = info.getValue();
      const quotationQuery = useQuery({
        queryKey: ['quotation', quo_no],
        queryFn: () => QuotationService.getById(quo_no),
        onError: (err) => {
          toast.error(`Error, ${getErrMessage(err)}`);
        },
      });

      const router = useRouter();

      const changeStatus = async (quo_no: string) => {
        try {
          const data = { status: 'Executed' };

          const response = await QuotationService.updateStatusById({
            quo_no,
            data,
          });

          toast.success('Status successfully changed');
          router.reload();
        } finally {
        }
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="mx-auto grid h-8 w-8 items-center justify-center p-0 data-[state=open]:bg-muted"
            >
              <span className="sr-only">Open menu</span>
              <MoreVertical className="mx-auto grid h-4 w-4 items-center justify-center" />
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
            <DropdownMenuItem className="p-0">
              <button
                className="flex w-full select-none items-center px-2 py-1.5 hover:cursor-default"
                onClick={() => {
                  const quo_no = quotationQuery.data?.data.quo_no;
                  if (quo_no) {
                    changeStatus(quo_no);
                  }
                }}
              >
                <CheckIcon className="mr-2 h-3.5 w-3.5 text-darkBlue hover:text-white" />
                Executed
              </button>
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
  const [searchResults, setSearchResults] = useState<Quotation[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
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

  const handleSearch = () => {
    const filteredData = quotationsQuery.data?.data.filter((item) => {
      if (selectedStatus === 'All') {
        return item.status.toLowerCase().includes(searchValue.toLowerCase());
      } else {
        return (
          item.status.toLowerCase().includes(searchValue.toLowerCase()) &&
          item.status === selectedStatus
        );
      }
    });

    setSearchResults(filteredData || []);
  };

  const quotationsQuery = useQuery({
    queryKey: ['quotations', { fetchDataOptions, searchValue }],
    queryFn: () => fetchData(fetchDataOptions, searchValue),
    keepPreviousData: true,
    onError: (err) => {
      toast.error(`Error, ${getErrMessage(err)}`);
    },
  });

  const [tableData, setTableData] = useState(quotationsQuery.data?.data || []);

  const filterDataByStatus = (status: string) => {
    if (status === 'All') {
      setTableData(quotationsQuery.data?.data || []);
    } else {
      const filteredData = quotationsQuery.data?.data.filter(
        (item) => item.status === status
      );
      setTableData(filteredData || []);
    }
    quotationsQuery.data?.data || [];
  };

  useEffect(() => {
    filterDataByStatus(selectedStatus);
  }, [selectedStatus]);

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
    data: searchValue
      ? searchResults
      : tableData || quotationsQuery.data?.data || [],
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
  // console.log(selectedStatus);

  return (
    <>
      <div className="z-[100] mb-4">
        <div className="flex gap-3 font-semibold">
          <Command className="text-blueLight" />
          <h1>Quotation</h1>
        </div>
        <div className="mt-5 w-full rounded-xl border-2 border-graySecondary/50 px-3 py-3 dark:bg-secondDarkBlue">
          <div className="flex gap-20">
            <div className="grid gap-1">
              <Label className="mt-4">Date TO</Label>
              <Label>Status</Label>
              <Label>FIlter By</Label>
            </div>

            <div className="grid gap-6">
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
              <Select
                value={selectedStatus}
                onValueChange={(selectedStatus) => {
                  setSelectedStatus(selectedStatus);
                  filterDataByStatus(selectedStatus);
                }}
              >
                <SelectTrigger className="h-7 w-max bg-lightWhite dark:border-white dark:bg-secondDarkBlue [&>span]:text-xs">
                  <SelectValue placeholder="Order by" className="" />
                </SelectTrigger>
                <SelectContent align="end" className="dark:text-black">
                  <SelectGroup>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="InProgress">InProgress</SelectItem>
                    <SelectItem value="Executed">Executed</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>

              <div className="grid gap-1">
                <div className="flex gap-1">
                  <Select value={orderByTwo} onValueChange={setOrderByTwo}>
                    <SelectTrigger className="h-7 w-1/2 bg-lightWhite dark:border-white dark:bg-secondDarkBlue [&>span]:text-xs">
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
                    className="rounded-md border border-graySecondary dark:border-white"
                    value={searchValue}
                    onChange={(e) => {
                      setSearchValue(e.target.value);
                      const filteredData = quotationsQuery.data?.data.filter(
                        (item) =>
                          item.quo_no
                            .toLowerCase()
                            .includes(e.target.value.toLowerCase())
                      );
                      setSearchResults(filteredData || []);
                    }}
                  />
                </div>

                <div className="relative flex">
                  <div className="flex gap-1">
                    <Select
                      value={orderByThree}
                      onValueChange={setOrderByThree}
                    >
                      <SelectTrigger className="h-7 w-1/2 bg-lightWhite dark:border-white dark:bg-secondDarkBlue [&>span]:text-xs">
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
                      className="rounded-md border border-graySecondary dark:border-white"
                      value={searchValue}
                      onChange={(e) => {
                        setSearchValue(e.target.value);
                        const filteredData = quotationsQuery.data?.data.filter(
                          (item) =>
                            item.quo_no
                              .toLowerCase()
                              .includes(e.target.value.toLowerCase())
                        );
                        setSearchResults(filteredData || []);
                      }}
                    />
                  </div>

                  <button
                    className="absolute -right-10 rounded-md bg-[#3c8dbc] px-2 py-1"
                    onClick={() => {
                      console.log('Pencarian:', searchValue);
                    }}
                  >
                    <Search className="w-4 text-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Link href="/quotation/create">
        <Button className="mb-5 w-max gap-2 bg-green-600 px-2 py-4 text-white">
          <PlusSquare className="h-5" />
          <h3>Create Quotation</h3>
        </Button>
      </Link>
      <div className="grid">
        <div className="overflow-x-scroll">
          <ReactTable
            tableInstance={table}
            isLoading={quotationsQuery.isFetching}
          />
        </div>
      </div>
    </>
  );
}
