import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { JobOrder } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createColumnHelper,
  getCoreRowModel,
  PaginationState,
  useReactTable,
} from '@tanstack/react-table';
import {
  Calendar,
  CheckCircle2,
  Command,
  Copy,
  Edit2,
  MoreHorizontal,
  PlusCircle,
  PlusSquare,
  Printer,
  Search,
  Trash,
  XCircle,
} from 'lucide-react';
import { DateTime } from 'luxon';
import { toast } from 'react-toastify';

import * as customerService from '@/apis/customer.api';
import * as quotationService from '@/apis/quotation.api';
import { cn, getErrMessage } from '@/lib/utils';
import { DateRangePicker } from '@/components/form/data-range-picker';
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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import * as JobOrderService from '../../apis/jo.api';

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
  // columnHelper.accessor('quo_no', {
  columnHelper.display({
    id: 'sales',
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
  columnHelper.display({
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
  columnHelper.display({
    id: 'hbl',
    header: () => (
      <div>
        <div>HBL/HAWB</div>
        <div>MBL/MAWB</div>
      </div>
    ),
    cell: (info) => (
      <div>
        <div>{info.row.original.hbl}</div>
        <div>{info.row.original.mbl}</div>
      </div>
    ),
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
  // columnHelper.accessor('etd', {
  //   header: () => (
  //     <div>
  //       <div>ETD</div>
  //       <div>ETA</div>
  //     </div>
  //   ),
  //   cell: (info) => info.getValue(),
  // }),
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
        <Link href={`/jo/print/${jo_no}`} target="_blank">
          <Button>
            <Printer
              size={15}
              className="mx-auto grid items-center justify-center dark:text-white"
            />
          </Button>
        </Link>
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
      const router = useRouter();

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="mx-auto grid h-8 w-8 items-center justify-center p-0 data-[state=open]:bg-muted"
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

                            router.reload();
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
  const [orderByTwo, setOrderByTwo] = useState<keyof JobOrder>('jo_no');
  const [orderByThree, setOrderByThree] = useState('Quo No');
  const [isActive, SetIsActive] = useState('');

  const columns = useMemo(() => columnsDef, []);
  const defaultData = useMemo(() => [], []);

  const handleSelectChange = (value: any) => {
    setOrderByTwo(value);
    filterData(value, searchValue);
  };

  const handleInputChange = (e: any) => {
    const value = e.target.value;
    setSearchValue(value);
    filterData(orderByTwo, value);
  };

  const filterData = (orderBy: keyof JobOrder, search: string) => {
    if (orderBy && search) {
      const filteredData = JobOrdersQuery.data?.data.filter(
        (item: JobOrder) => {
          const propertyValue = item[orderBy];
          if (typeof propertyValue === 'string') {
            return propertyValue.toLowerCase().includes(search.toLowerCase());
          }
          return false;
        }
      );
      setSearchResults(filteredData || []);
    }
  };

  const [{ periodOf, periodUntil }, setDates] = useState({
    periodOf: DateTime.fromJSDate(new Date()).minus({ months: 1 }).toJSDate(),
    periodUntil: new Date(),
  });

  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 15,
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

  const [tableData, setTableData] = useState(JobOrdersQuery.data?.data || []);

  const filteredData = tableData.filter((item) => {
    const itemDate = new Date(item.createdAt);
    return itemDate >= periodOf && itemDate <= periodUntil;
  });

  useEffect(() => {
    filterData(orderByTwo, searchValue);
  }, []);

  const table = useReactTable({
    columns,
    data: searchValue ? searchResults : JobOrdersQuery.data?.data || [],
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
      <div className="z-[100] mb-4">
        <div className="flex gap-3 font-semibold">
          <Command className="text-blueLight" />
          <h1> Job Order</h1>
        </div>
        <div className="mt-3 flex gap-1 text-white">
          <button
            className={`rounded-sm px-3 py-1 ${
              router.pathname === '/jo' ? 'bg-blueHeaderCard' : 'bg-green-500'
            }`}
          >
            <Link href="/jo">Data JO</Link>
          </button>
          <button
            className={`rounded-sm px-3 py-1 ${
              router.pathname === '/joc' ? 'bg-blueHeaderCard' : 'bg-green-500'
            }`}
          >
            <Link href="/joc">Data Consolidation</Link>
          </button>
        </div>
        <div className="mt-5 w-full rounded-xl border-2 border-graySecondary/50 px-3 py-3 dark:bg-secondDarkBlue">
          <div className="mb-5 flex items-center gap-3">
            <Search className="h-4 w-4" />
            <h3>Filter Data JO</h3>
          </div>

          {/* NEW CHANGED */}
          <div className="relative flex gap-14">
            <div className="grid gap-1">
              <Label className="mt-4">Date TO</Label>
              <Label>Status</Label>
              {/* <Label className="absolute top-32">FIlter By</Label> */}
            </div>

            <div className="grid gap-6">
              <div>
                <DateRangePicker
                  initialDateFrom={periodOf}
                  initialDateTo={periodUntil}
                  onUpdate={({ range }) => {
                    setDates({
                      periodOf: range.from,
                      periodUntil: range.to ? range.to : range.from,
                    });
                  }}
                  align="start"
                  locale="en-GB"
                  showCompare={false}
                />
              </div>

              <div className="grid gap-1">
                <div className="relative flex gap-2">
                  <Select value={orderByTwo} onValueChange={handleSelectChange}>
                    <SelectTrigger className="h-9 w-1/2 bg-lightWhite dark:border-white dark:bg-secondDarkBlue [&>span]:text-xs">
                      <SelectValue placeholder="Order by" className="" />
                    </SelectTrigger>
                    <SelectContent align="end" className="dark:text-black">
                      <SelectGroup>
                        <SelectItem value="jo_no">JO No</SelectItem>
                        <SelectItem value="shipper">Shipper</SelectItem>
                        <SelectItem value="consignee">Consignee</SelectItem>
                        <SelectItem value="discharge">Discharge</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>

                  <Input
                    type="text"
                    name=""
                    id=""
                    placeholder="Search...."
                    className="rounded-md border border-graySecondary !bg-transparent dark:border-white"
                    value={searchValue}
                    onChange={handleInputChange}
                  />
                  <button className="absolute -right-10 rounded-md bg-[#3c8dbc] px-2 py-1">
                    <Search className="w-4 text-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid">
        <div className="!overflow-x-scroll">
          <ReactTable
            tableInstance={table}
            isLoading={JobOrdersQuery.isFetching}
          />
        </div>
      </div>
    </>
  );
}
