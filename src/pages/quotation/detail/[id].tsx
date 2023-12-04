import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { IS_DEV } from '@/constants';
import { Cost } from '@/types';
import { yupResolver } from '@hookform/resolvers/yup';
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
  Command,
  PlusCircle,
  PlusSquare,
  Search,
  XCircle,
} from 'lucide-react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { InferType } from 'yup';

import * as quotationService from '@/apis/quotation.api';
import { cn, getErrMessage } from '@/lib/utils';
import yup from '@/lib/yup';
import { DateRangePicker } from '@/components/form/data-range-picker';
import InputText from '@/components/form/input-text';
import ReactTable from '@/components/table/react-table';
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
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import * as CostService from '../../../apis/cost.api';

interface Customer {
  item_cost: string;
  item_name: string;
  unit: string;
}

const defaultValues = {
  sales: '',
  subject: '',
  attn: '',
  type: '',
  delivery: '',
  kurs: '',
  status: '',
  loading: '',
  discharge: '',
  customer_code: '',
  item_cost: '',
  valheader: '',
  valfooter: '',
  port_code: '',
};

const Schema = yup.object({
  sales: yup.string().required(),
  subject: yup.string().required(),
  attn: yup.string().required(),
  type: yup.string().required(),
  delivery: yup.string().required(),
  kurs: yup.string().required(),
  status: yup.string().required(),
  loading: yup.string().required(),
  discharge: yup.string().required(),
  customer_code: yup.string().required(),
  item_cost: yup.string().required(),
  valheader: yup.string().required(),
  valfooter: yup.string().required(),
  port_code: yup.string().required(),
});

type QuotationSchema = InferType<typeof Schema>;

const columnHelper = createColumnHelper<Cost>();

const columnsDef = [
  columnHelper.accessor('item_cost', {
    header: 'ITEM COST',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('qty', {
    header: 'QTY',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('unit', {
    header: 'Unit',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('mata_uang', {
    header: () => (
      <div className="flex">
        <div>IDR</div>
        <div>USD</div>
      </div>
    ),
    cell: (info) => info.getValue(),
  }),
  // columnHelper.accessor('amount', {
  //   header: 'AMOUNT',
  //   cell: (info) => info.getValue(),
  // }),
  columnHelper.accessor('note', {
    header: 'NOTE',
    cell: (info) => info.getValue(),
  }),
];

export default function QuotationDetail() {
  const qc = useQueryClient();
  const router = useRouter();
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isPortModalOpen, setIsPortModalOpen] = useState(false);
  const [customerData, setCustomerData] = useState<Customer[]>([]);
  const [statusesKey, setStatusesKey] = useState<string[]>([]);
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [orderBy, setOrderBy] = useState('All');
  const [orderByTwo, setOrderByTwo] = useState('Quo No');
  const [orderByThree, setOrderByThree] = useState('Quo No');
  const methods = useForm<QuotationSchema>({
    mode: 'all',
    defaultValues,
    resolver: yupResolver(Schema),
  });
  const { handleSubmit, setValue, watch } = methods;
  const openCustomerModal = () => {
    setIsCustomerModalOpen(true);

    fetch('http://localhost:8089/api/customer')
      .then((response) => response.json())
      .then((data) => {
        console.log('Data Pelanggan:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const openPortModal = () => {
    setIsPortModalOpen(true);

    fetch('http://localhost:8089/api/port')
      .then((response) => response.json())
      .then((data) => {
        console.log('Data Port:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const closeCustomerModal = () => {
    setIsCustomerModalOpen(false);
  };

  const addQuotationMutation = useMutation({
    mutationFn: quotationService.create,
    onSuccess: () => {
      qc.invalidateQueries(['quotation']);
      toast.success('Success, Quotation has been added.');
      router.push('/quotation');
    },
    onError: (err) => {
      toast.error(`Error, ${getErrMessage(err)}`);
    },
  });

  const onSubmit: SubmitHandler<QuotationSchema> = (data) => {
    addQuotationMutation.mutate(data);
  };

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

  const quotationsQuery = useQuery({
    queryKey: ['quotations', fetchDataOptions],
    queryFn: () => CostService.getAll(fetchDataOptions),
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
    mutationFn: CostService.deleteById,
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
    data: quotationsQuery.data?.data ?? defaultData,
    pageCount: quotationsQuery.data?.pagination.total_page ?? -1,

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
      <div className="z-[100] mb-4">
        <div className="flex gap-3 font-semibold">
          <Command className="text-blueLight" />
          <h1> Quotation</h1>
        </div>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2 rounded-sm pb-4 dark:bg-graySecondary/50">
                <div className="mb-5 flex gap-3 bg-blueHeaderCard p-2 text-white dark:bg-secondDarkBlue">
                  <Command className="text-white" />
                  <h1> Data Quotation</h1>
                </div>

                <div className="grid gap-3 px-3">
                  <div className="grid grid-cols-[1fr_2fr]">
                    <div className="grid gap-5">
                      <Label>Date :</Label>
                      <Label>Sales :</Label>
                      <Label>Subject :</Label>
                      <Label>Customer :</Label>
                      <Label>Attn :</Label>
                      <Label>Type :</Label>
                      <Label>Delivery :</Label>
                      <Label>Loading :</Label>
                      <Label>Discharge :</Label>
                      <Label>Kurs :</Label>
                    </div>
                    <div className="grid gap-2">
                      <InputText placeholder="~Auto~" name="date" />
                      <InputText name="sales" mandatory />
                      <InputText name="subject" mandatory />
                      <div className="flex gap-2">
                        <InputText name="customer" mandatory />
                        <button
                          type="button"
                          className="
                  mt-1 h-6 w-6 rounded-md bg-graySecondary px-1 text-base
                  text-white dark:bg-blueLight"
                          onClick={openCustomerModal}
                        >
                          <Search className="w-4" />
                        </button>
                      </div>
                      <InputText name="attn" mandatory />
                      <InputText name="type" mandatory />
                      <InputText name="delivery" mandatory />
                      <div className="flex gap-2">
                        <InputText name="loading" mandatory />
                        <button
                          type="button"
                          className="
                  mt-1 h-6 w-6 rounded-md bg-graySecondary px-1 text-base
                  text-white dark:bg-blueLight"
                          onClick={openCustomerModal}
                        >
                          <Search className="w-4" />
                        </button>
                      </div>
                      <div className="flex gap-2">
                        <InputText name="discharge" mandatory />
                        <Search
                          className="
                  mt-1 rounded-md bg-graySecondary px-1 text-base
                  text-white dark:bg-blueLight"
                        />
                      </div>
                      <InputText name="kurs" mandatory />
                    </div>
                  </div>
                </div>
              </div>

              <div className="block gap-2 rounded-sm dark:bg-graySecondary/50">
                <div className="mb-5 flex h-max gap-3 bg-blueHeaderCard p-2 text-white dark:bg-secondDarkBlue">
                  <Command className="text-white" />
                  <h1> Data Quotation</h1>
                </div>

                <div className="px-3">
                  <div className="mb-5 flex gap-2">
                    <Label>Header: </Label>
                    <Textarea
                      className="header h-32"
                      value="We are pleased to quote you the following :"
                    />{' '}
                  </div>

                  <div className="flex gap-2">
                    <Label>Footer: </Label>
                    <Textarea
                      className="footer h-32"
                      value="Will be happy to supply and any further information you may need and trust that you call on us to fill your order which will receive our prompt and careful attention."
                    />{' '}
                  </div>
                </div>
              </div>
            </div>
            {/* Buttons */}
            <div className="flex items-center gap-2">
              <Button
                className="bg-graySecondary"
                onClick={() => router.back()}
              >
                Back
              </Button>
              <Button
                type="submit"
                disabled={addQuotationMutation.isLoading}
                className="bg-green-600"
              >
                {addQuotationMutation.isLoading ? 'Loading...' : 'Save'}
              </Button>
            </div>

            {isCustomerModalOpen && (
              <div
                style={{ overflow: 'hidden' }}
                className={`modal fixed inset-0 z-50 flex items-center justify-center ${
                  isCustomerModalOpen ? 'open' : 'closed'
                }`}
              >
                <div className="absolute inset-0 bg-black opacity-75"></div>
                <div className="relative z-10 w-1/3 rounded-lg bg-white p-4 shadow-lg">
                  <Button
                    className="absolute -top-9 right-0 !bg-transparent text-white"
                    onClick={closeCustomerModal}
                  >
                    <h1 className="text-xl">X</h1>
                  </Button>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="hover:!text-white">
                          Partner Name
                        </TableHead>
                        <TableHead className="hover:!text-white">
                          Unit
                        </TableHead>
                        <TableHead className="hover:!text-white">Add</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="text-black">
                      {customerData.map((customer) => (
                        <TableRow key={customer.item_cost}>
                          <TableCell className="font-medium">
                            {customer.item_name}
                          </TableCell>
                          <TableCell className="font-medium">
                            {customer.unit}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </form>
        </FormProvider>
      </div>

      <Link href="/quotation/create">
        <Button className="mb-5 w-max gap-2 bg-green-600 px-2 py-4 text-white">
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
