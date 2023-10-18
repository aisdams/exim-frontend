import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { JOC } from '@/types';
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
  PlusCircle,
  PlusSquare,
  Printer,
  Search,
  Trash,
  XCircle,
} from 'lucide-react';
import { fetchData } from 'next-auth/client/_utils';
import { toast } from 'react-toastify';

import * as quotationService from '@/apis/quotation.api';
import { cn, getErrMessage } from '@/lib/utils';
import { DateRangePicker } from '@/components/forms/data-range-picker';
import InputSearch from '@/components/forms/input-search';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import * as JOCService from '../../apis/joc.api';

const columnHelper = createColumnHelper<JOC>();

const columnsDef = [
  columnHelper.accessor('joc_no', {
    enableSorting: false,
    header: () => (
      <div>
        <div>#JOC NO</div>
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
          <div>{info.row.original.joc_no}</div>
          <div>{formattedDate}</div>
        </div>
      );
    },
  }),
  columnHelper.display({
    header: 'TYPE',
    cell: (info) => {
      const [type, setType] = useState('');

      useEffect(() => {
        const quoNo = info.row.original.quo_no
          ? info.row.original.quo_no.toString()
          : null;

        if (quoNo) {
          quotationService.getById(quoNo).then((quotation) => {
            if (quotation && quotation.data && quotation.data.type) {
              setType(quotation.data.type);
            }
          });
        }
      }, []);

      return (
        <div>
          <div>{type}</div>
        </div>
      );
    },
  }),
  columnHelper.accessor('agent', {
    header: 'AGENT',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('no_mbl', {
    header: 'NO MBL',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('joc_no', {
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
  columnHelper.accessor('eta', {
    header: () => (
      <div>
        <div>ETD</div>
        <div>ETA</div>
      </div>
    ),
    cell: (info) => info.getValue(),
  }),
  columnHelper.display({
    id: 'jml',
    header: 'JML JO',
    cell: (info) => {
      const { jo_no } = info.row.original;

      return <h1>1</h1>;
    },
  }),
  columnHelper.accessor('createdBy', {
    header: 'CREATED',
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
  columnHelper.display({
    id: 'printJOC',
    header: 'Print',
    cell: (info) => {
      const { joc_no } = info.row.original;

      return (
        <Button>
          <Link href={`/joc/print/${joc_no}`} target="_blank">
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
      const { joc_no } = info.row.original;
      const deleteJOCMutation = info.table.options.meta?.deleteMutation;
      const [open, setOpen] = useState(false);
      const jocQuery = useQuery({
        queryKey: ['joc', joc_no],
        queryFn: () => JOCService.getById(joc_no),
        onError: (err) => {
          toast.error(`Error, ${getErrMessage(err)}`);
        },
      });
      const router = useRouter();
      const status = jocQuery.data?.data.status;

      const changeStatus = async (joc_no: string) => {
        try {
          const data = { status: 'Executed' };

          const response = await JOCService.updateStatusById({
            joc_no,
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
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="font-normal">
            {status !== 'Executed' && (
              <DropdownMenuItem className="p-0">
                <Link
                  href={`/joc/edit/${joc_no}`}
                  className="flex w-full select-none items-center px-2 py-1.5 hover:cursor-default"
                >
                  <Edit2 className="mr-2 h-3.5 w-3.5 text-darkBlue hover:text-white" />
                  Edit
                </Link>
              </DropdownMenuItem>
            )}
            {status !== 'Executed' && (
              <DropdownMenuItem className="p-0">
                <button
                  className="flex w-full select-none items-center px-2 py-1.5 hover:cursor-default"
                  onClick={() => {
                    const joc_no = jocQuery.data?.data.joc_no;
                    if (joc_no) {
                      changeStatus(joc_no);
                    }
                  }}
                >
                  <CheckIcon className="mr-2 h-3.5 w-3.5 text-darkBlue hover:text-white" />
                  Executed
                </button>
              </DropdownMenuItem>
            )}
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

                        deleteJOCMutation?.mutate(joc_no, {
                          onSuccess: () => {
                            setOpen(false);
                          },
                        });
                      }}
                    >
                      {deleteJOCMutation?.isLoading ? 'Loading...' : 'Continue'}
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
  const [searchResults, setSearchResults] = useState<JOC[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [orderBy, setOrderBy] = useState('All');
  const [orderByTwo, setOrderByTwo] = useState('JOC No');
  const [orderByThree, setOrderByThree] = useState('JOC No');
  const [isActive, SetIsActive] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const columns = useMemo(() => columnsDef, []);
  const defaultData = useMemo(() => [], []);

  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 15,
  });

  const fetchDataOptions = {
    page: pageIndex + 1,
    limit: pageSize,
  };

  const jocQuery = useQuery({
    queryKey: ['joc', fetchDataOptions],
    queryFn: () => JOCService.getAll(fetchDataOptions),
    keepPreviousData: true,
    onError: (err) => {
      toast.error(`Error, ${getErrMessage(err)}`);
    },
  });

  const [tableData, setTableData] = useState(jocQuery.data?.data || []);

  const filterDataByStatus = (status: string) => {
    if (status === 'All') {
      setTableData(jocQuery.data?.data || []);
    } else {
      const filteredData = jocQuery.data?.data.filter(
        (item) => item.status === status
      );
      setTableData(filteredData || [] || jocQuery.data?.data || []);
    }
    jocQuery.data?.data || [];
  };

  useEffect(() => {
    setTableData(jocQuery.data?.data || []);
  }, []);

  // useEffect(() => {
  //   filterDataByStatus(selectedStatus);
  // }, [selectedStatus]);
  useEffect(() => {
    filterDataByStatus(selectedStatus);
  }, [selectedStatus, jocQuery.data]);

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );

  const deleteJOCMutation = useMutation({
    mutationFn: JOCService.deleteById,
    onSuccess: () => {
      qc.invalidateQueries(['joc']);
      toast.success('JOC deleted successfully.');
    },
    onError: (err) => {
      toast.error(`Error, ${getErrMessage(err)}`);
    },
  });

  const table = useReactTable({
    columns,
    data: searchValue ? searchResults : tableData || jocQuery.data?.data || [],
    pageCount: jocQuery.data?.pagination.total_page ?? -1,
    state: {
      pagination,
    },
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    meta: {
      deleteMutation: deleteJOCMutation,
    },
  });

  return (
    <>
      <div className="z-[100] mb-4 !overflow-hidden">
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
            <h3> Filter Data JOC</h3>
          </div>

          {/* NEW CHANGED */}
          <div className="flex gap-20">
            <div className="grid gap-1">
              <Label className="mt-4">Date JOC</Label>
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
                        <SelectItem value="JOC No">JOC No</SelectItem>
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
                    className="rounded-md border border-graySecondary !bg-transparent dark:border-white"
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
                          <SelectItem value="JOC No">JOC No</SelectItem>
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
                      className="rounded-md border border-graySecondary !bg-transparent dark:border-white"
                      value={searchValue}
                      onChange={(e) => {
                        setSearchValue(e.target.value);
                        const filteredData = jocQuery.data?.data.filter(
                          (item) =>
                            item.joc_no
                              .toLowerCase()
                              .includes(e.target.value.toLowerCase())
                        );
                        setSearchResults(filteredData || []);
                      }}
                    />
                  </div>

                  <button className="absolute -right-10 rounded-md bg-[#3c8dbc] px-2 py-1">
                    <Search className="w-4 text-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Link href="/joc/create">
          <Button className="my-5 w-max gap-2 bg-green-600 px-2 py-4 text-white">
            <PlusSquare className="h-5" />
            <h3>Create JOC</h3>
          </Button>
        </Link>
      </div>

      <div className="grid">
        <div className="!overflow-hidden">
          <ReactTable tableInstance={table} isLoading={jocQuery.isFetching} />
        </div>
      </div>
    </>
  );
}
