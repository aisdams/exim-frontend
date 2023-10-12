import Link from 'next/link';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  createColumnHelper,
  getCoreRowModel,
  PaginationState,
  useReactTable,
} from '@tanstack/react-table';
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
import * as quotationService from '@/apis/quotation.api';
import * as customerService from '@/apis/customer.api';
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
  MoreHorizontal,
  Edit2,
  Trash,
  Copy,
  Printer,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/router';
import { cn, getErrMessage } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import * as JobOrderService from '../../apis/jo.api';
import React, { useEffect, useMemo, useState } from 'react';
import { useDebouncedValue } from '@mantine/hooks';
import ReactTable from '@/components/table/react-table';
import InputSearch from '@/components/forms/input-search';
import { DateRangePicker } from '@/components/forms/data-range-picker';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';

import { JobOrder } from '@/types';
import { Label } from '@/components/ui/label';

const columnHelper = createColumnHelper<JobOrder>();

const columnsDef = [
  columnHelper.accessor('jo_no', {
    enableSorting: false,
    header: () => (
      <div>
        <div>#JO NO</div>
        <div>DATE</div>
      </div>
    ),
    cell: (info) => {
      const date = new Date(info.row.original.createdAt);
      const formattedDate = `${date.getDate()}/${
        date.getMonth() + 1
      }/${date.getFullYear()}`;

      return (
        <div>
          <div>{info.row.original.jo_no}</div>
          <div>{formattedDate}</div>
        </div>
      );
    },
  }),
  columnHelper.accessor('quo_no', {
    enableSorting: false,
    header: () => (
      <div>
        <div>QUO NO</div>
        <div>SALES</div>
      </div>
    ),
    cell: (info) => {
      const [sales, setSales] = useState('');

      useEffect(() => {
        const quoNo = info.row.original.quo_no.toString();

        quotationService.getById(quoNo).then((quotation) => {
          if (quotation && quotation.data && quotation.data.sales) {
            setSales(quotation.data.sales);
          }
        });
      }, []);

      return (
        <div>
          <div>{info.row.original.quo_no}</div>
          <div>{sales}</div>
        </div>
      );
    },
  }),
  columnHelper.accessor('quo_no', {
    header: 'TYPE',
    cell: (info) => {
      const [type, setType] = useState('');

      useEffect(() => {
        const quoNo = info.row.original.quo_no.toString();

        quotationService.getById(quoNo).then((quotation) => {
          if (quotation && quotation.data && quotation.data.type) {
            setType(quotation.data.type);
          }
        });
      }, []);

      return (
        <div>
          <div>{type}</div>
        </div>
      );
    },
  }),
  columnHelper.accessor('customer_code', {
    header: 'CUSTOMER',
    cell: (info) => {
      const [partner_name, setPartnerName] = useState('');

      useEffect(() => {
        const customer_code = info.row.original.customer_code.toString();

        customerService.getById(customer_code).then((customer) => {
          if (customer && customer.data && customer.data.partner_name) {
            setPartnerName(customer.data.partner_name);
          }
        });
      }, []);

      return (
        <div>
          <div>{partner_name}</div>
        </div>
      );
    },
  }),
  columnHelper.accessor('hbl', {
    header: () => (
      <div>
        <div>HBL/HAWB</div>
        <div>MBL/MAWB</div>
      </div>
    ),
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('quo_no', {
    enableSorting: false,
    header: () => (
      <div>
        <div>LOADING</div>
        <div>DISCHARGE</div>
      </div>
    ),
    cell: (info) => {
      const [loading, setLoading] = useState('');
      const [discharge, setDischarge] = useState('');

      useEffect(() => {
        const quoNo = info.row.original.quo_no.toString();

        quotationService.getById(quoNo).then((quotation) => {
          if (quotation && quotation.data && quotation.data.loading) {
            setLoading(quotation.data.loading);
          }
        });

        quotationService.getById(quoNo).then((quotation) => {
          if (quotation && quotation.data && quotation.data.discharge) {
            setDischarge(quotation.data.discharge);
          }
        });
      }, []);

      return (
        <div>
          <div>{loading}</div>
          <div>{discharge}</div>
        </div>
      );
    },
  }),
  columnHelper.accessor('etd', {
    header: () => (
      <div>
        <div>ETD</div>
        <div>ETA</div>
      </div>
    ),
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('createdBy', {
    header: 'CREATED',
    cell: (info) => info.getValue(),
  }),
  columnHelper.display({
    id: 'printQuo',
    header: 'Print',
    cell: (info) => {
      const { jo_no } = info.row.original;

      return (
        <Button>
          <Link href={`/jo/print/${jo_no}`} target="_blank">
            <Printer
              size={15}
              className="dark:text-white items-center grid mx-auto justify-center"
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
      const { jo_no } = info.row.original;
      const deleteJobOrderMutation = info.table.options.meta?.deleteMutation;
      const [open, setOpen] = useState(false);

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0 data-[state=open]:bg-muted grid mx-auto justify-center items-center"
            >
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="font-normal">
            <DropdownMenuItem className="p-0">
              <Link
                href={`/jo/edit/${jo_no}`}
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

                        deleteJobOrderMutation?.mutate(jo_no, {
                          onSuccess: () => {
                            setOpen(false);
                          },
                        });
                      }}
                    >
                      {deleteJobOrderMutation?.isLoading
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
  const router = useRouter();
  const [statusesKey, setStatusesKey] = useState<string[]>([]);
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [searchResults, setSearchResults] = useState<JobOrder[]>([]);
  const [searchValue, setSearchValue] = useState('');
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
    data: searchValue ? searchResults : JobOrdersQuery.data?.data ?? [],
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
        <div className="flex gap-1 mt-3 text-white">
          <button
            className={`px-3 py-1 rounded-sm ${
              router.pathname === '/jo' ? 'bg-blueHeaderCard' : 'bg-green-500'
            }`}
          >
            <Link href="/jo">Data JO</Link>
          </button>
          <button
            className={`px-3 py-1 rounded-sm ${
              router.pathname === '/joc' ? 'bg-blueHeaderCard' : 'bg-green-500'
            }`}
          >
            <Link href="/joc">Data Consolidation</Link>
          </button>
        </div>
        <div className="w-full rounded-xl border-2 border-graySecondary/50 mt-5 px-3 py-3 dark:bg-secondDarkBlue">
          <div className="flex gap-3 items-center mb-5">
            <Search className="w-4 h-4" />
            <h3> Filter Data JO</h3>
          </div>

          {/* NEW CHANGED */}
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

              <div className="grid gap-1">
                <div className="flex gap-1">
                  <Select value={orderByTwo} onValueChange={setOrderByTwo}>
                    <SelectTrigger className="h-7 w-1/2 [&>span]:text-xs bg-lightWhite dark:bg-secondDarkBlue dark:border-white">
                      <SelectValue placeholder="Order by" className="" />
                    </SelectTrigger>
                    <SelectContent align="end" className="dark:text-black">
                      <SelectGroup>
                        <SelectItem value="Quo No">JO No</SelectItem>
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
                    placeholder="Search..."
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
                          <SelectItem value="Quo No">JO No</SelectItem>
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
                      onChange={(e) => {
                        setSearchValue(e.target.value);
                        const filteredData = JobOrdersQuery.data?.data.filter(
                          (item) =>
                            item.jo_no
                              .toLowerCase()
                              .includes(e.target.value.toLowerCase())
                        );
                        setSearchResults(filteredData || []);
                      }}
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

      <ReactTable tableInstance={table} isLoading={JobOrdersQuery.isFetching} />
    </>
  );
}
