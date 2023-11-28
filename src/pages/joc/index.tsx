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
  X,
  XCircle,
} from 'lucide-react';
import { DateTime } from 'luxon';
import { fetchData } from 'next-auth/client/_utils';
import { toast } from 'react-toastify';

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
  columnHelper.accessor('type', {
    header: 'TYPE',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('agent', {
    header: 'AGENT',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('no_mbl', {
    header: 'NO MBL',
    cell: (info) => info.getValue(),
  }),
  columnHelper.display({
    id: 'loading',
    enableSorting: false,
    header: () => (
      <div>
        <div>LOADING</div>
        <div>DISCHARGE</div>
      </div>
    ),
    cell: (info) => {
      return (
        <div>
          <div>{info.row.original.loading}</div>
          <div>{info.row.original.discharge}</div>
        </div>
      );
    },
  }),
  columnHelper.accessor('eta', {
    header: () => (
      <div>
        <div>ETD</div>
        <div>ETA</div>
      </div>
    ),
    cell: (info) => {
      const date = new Date(info.row.original.etd);
      const formattedDate = `${date.getDate()}/${
        date.getMonth() + 1
      }/${date.getFullYear()}`;

      const dateTwo = new Date(info.row.original.eta);
      const formattedDateTwo = `${dateTwo.getDate()}/${
        dateTwo.getMonth() + 1
      }/${dateTwo.getFullYear()}`;

      return (
        <div>
          <div>{formattedDate}</div>
          <div>{formattedDateTwo}</div>
        </div>
      );
    },
  }),
  columnHelper.display({
    id: 'jml',
    header: 'JML',
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
              ? 'bg-yellow-600 text-white'
              : info.getValue() === 'Executed'
              ? 'bg-green-500 text-white'
              : info.getValue() === 'Cancel'
              ? 'bg-red-600 text-white'
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
        <Link href={`/joc/print/${joc_no}`} target="_blank">
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
      const [openTwo, setOpenTwo] = useState(false);
      const [openThree, setOpenThree] = useState(false);
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

      const changeStatusTwo = async (joc_no: string) => {
        try {
          const data = { status: 'Cancel' };

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
            {status !== 'Cancel' && (
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
            {status !== 'Executed' && status !== 'Cancel' && (
              <DropdownMenuItem
                className="p-0"
                onClick={(e) => {
                  e.preventDefault();
                }}
              >
                <AlertDialog open={openTwo} onOpenChange={setOpenTwo}>
                  <AlertDialogTrigger className="flex w-full select-none items-center px-2 py-1.5 font-sans hover:cursor-default">
                    <CheckIcon className="mr-2 h-3.5 w-3.5 text-darkBlue hover:text-white" />
                    Executed
                  </AlertDialogTrigger>

                  <AlertDialogContent className="font-sans">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure ?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        updated your data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="font-sans">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => {
                          const joc_no = jocQuery.data?.data.joc_no;
                          if (joc_no) {
                            changeStatus(joc_no);
                          }
                        }}
                        className="!bg-green-500"
                      >
                        continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuItem>
            )}
            {status !== 'Executed' && status !== 'Cancel' && (
              <DropdownMenuItem
                className="p-0"
                onClick={(e) => {
                  e.preventDefault();
                }}
              >
                <AlertDialog open={openThree} onOpenChange={setOpenThree}>
                  <AlertDialogTrigger className="flex w-full select-none items-center px-2 py-1.5 font-sans hover:cursor-default">
                    <X className="mr-2 h-3.5 w-3.5 text-darkBlue hover:text-white" />
                    Cancel
                  </AlertDialogTrigger>

                  <AlertDialogContent className="font-sans">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure ?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        updated your data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="font-sans">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => {
                          const joc_no = jocQuery.data?.data.joc_no;
                          if (joc_no) {
                            changeStatusTwo(joc_no);
                          }
                        }}
                        className="!bg-green-500"
                      >
                        continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuItem>
            )}
            {status !== 'Executed' && (
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
                        This action cannot be undone. This will permanently
                        delete your data from our servers.
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
                        {deleteJOCMutation?.isLoading
                          ? 'Loading...'
                          : 'Continue'}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuItem>
            )}
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
  const [orderByTwo, setOrderByTwo] = useState<keyof JOC>('joc_no');
  const [orderByThree, setOrderByThree] = useState('JOC No');
  const [isActive, SetIsActive] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const handleSelectChange = (value: any) => {
    setOrderByTwo(value);
    filterData(value, searchValue);
  };

  const handleInputChange = (e: any) => {
    const value = e.target.value;
    setSearchValue(value);
    filterData(orderByTwo, value);
  };

  const filterData = (orderBy: keyof JOC, search: string) => {
    if (orderBy && search) {
      const filteredData = jocQuery.data?.data.filter((item: JOC) => {
        const propertyValue = item[orderBy];
        if (typeof propertyValue === 'string') {
          return propertyValue.toLowerCase().includes(search.toLowerCase());
        }
        return false;
      });
      setSearchResults(filteredData || []);
    }
  };
  const [{ periodOf, periodUntil }, setDates] = useState({
    periodOf: DateTime.fromJSDate(new Date()).minus({ months: 1 }).toJSDate(),
    periodUntil: new Date(),
  });

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

  const filteredData = tableData.filter((item) => {
    const itemDate = new Date(item.createdAt);
    return itemDate >= periodOf && itemDate <= periodUntil;
  });

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
    data: searchValue
      ? searchResults
      : filteredData || jocQuery.data?.data || [],
    pageCount: jocQuery.data?.pagination.total_page ?? -1,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
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
          <div className="relative flex gap-14">
            <div className="grid gap-1">
              <Label className="mt-4">Date JOC</Label>
              <Label>Status</Label>
              <Label className="absolute top-32">FIlter By</Label>
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
                <div className="relative flex gap-2">
                  <Select value={orderByTwo} onValueChange={handleSelectChange}>
                    <SelectTrigger className="h-9 w-1/2 bg-lightWhite dark:border-white dark:bg-secondDarkBlue [&>span]:text-xs">
                      <SelectValue placeholder="Order by" className="" />
                    </SelectTrigger>
                    <SelectContent align="end" className="dark:text-black">
                      <SelectGroup>
                        <SelectItem value="joc_no">JOC No</SelectItem>
                        <SelectItem value="agent">Agent</SelectItem>
                        <SelectItem value="vessel">Vessel</SelectItem>
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
