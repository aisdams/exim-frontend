import { useEffect, useMemo, useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { IS_DEV } from '@/constants';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDebouncedValue } from '@mantine/hooks';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { InferType } from 'yup';

import * as constService from '@/apis/cost.api';
import { getNextPageParam } from '@/lib/react-query';
import { cn, getErrMessage } from '@/lib/utils';
import yup from '@/lib/yup';
import { Button, buttonVariants } from '@/components/ui/button';
import InputText from '@/components/forms/input-text';
import { Label } from '@radix-ui/react-label';
import { Input } from '@/components/ui/input';
import { Command, PlusSquare, Printer, Search } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Cost } from '@/types';
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
  createColumnHelper,
  getCoreRowModel,
  PaginationState,
  useReactTable,
} from '@tanstack/react-table';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import ReactTable from '@/components/table/react-table';
import InputSelect from '@/components/forms/input-select';
import InputNumber from '@/components/forms/input-number';

interface Port {
  item_cost: string;
  qty: string;
  caption: string;
}

const defaultValues = {
  item_name: '',
  qty: '',
  unit: '',
  mata_uang: '',
  amount: '',
  note: '',
};

const Schema = yup.object({
  item_name: yup.string().required(),
  qty: yup.string().required(),
  unit: yup.string().required(),
  mata_uang: yup.string().required(),
  amount: yup.string().required(),
  note: yup.string().required(),
});

const columnHelper = createColumnHelper<Cost>();

const columnsDef = [
  columnHelper.accessor('item_cost', {
    header: 'Item Cost',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('item_name', {
    header: 'Item Name',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('qty', {
    header: 'Qyt',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('unit', {
    header: 'Unit',
    cell: (info) => info.getValue(),
  }),
];

type CostSchema = InferType<typeof Schema>;

export default function QuotationEdit() {
  const router = useRouter();
  const qc = useQueryClient();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isCostModalOpen, setIsCostModalOpen] = useState(false);
  const [orderBy, setOrderBy] = useState('Choose');
  const methods = useForm<CostSchema>({
    mode: 'all',
    defaultValues,
    resolver: yupResolver(Schema),
  });
  const { handleSubmit, setValue, watch } = methods;

  const closePortModal = () => {
    setIsCostModalOpen(false);
  };

  const openCostModal = () => {
    setIsCostModalOpen(true);
  };

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

  const quotationsQuery = useQuery({
    queryKey: ['quotations', fetchDataOptions],
    queryFn: () => constService.getAll(fetchDataOptions),
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
    mutationFn: constService.deleteById,
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

  const addQuotationMutation = useMutation({
    mutationFn: constService.create,
    onSuccess: () => {
      qc.invalidateQueries(['cost']);
      toast.success('Success, Cost has been added.');
      router.push('/quotation');
    },
    onError: (err) => {
      toast.error(`Error, ${getErrMessage(err)}`);
    },
  });

  const onSubmit: SubmitHandler<CostSchema> = (data) => {
    if (IS_DEV) {
      console.log('data =>', data);
    }

    addQuotationMutation.mutate(data);
  };

  return (
    <div className="overflow-hidden">
      <div className="mb-4 flex gap-3 ">
        <Command className="text-blueLight" />
        <h1 className="">Add Quotation</h1>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2 dark:bg-graySecondary/50 rounded-sm pb-5">
              <div className="flex gap-3 bg-blueHeaderCard text-white dark:bg-secondDarkBlue mb-5 p-0">
                <Command className="text-white" />
                <h1> Data Quotation</h1>
              </div>

              <div className="px-3 grid gap-5">
                <div className="grid grid-cols-[1fr_2fr]">
                  <Label>#Quote No :</Label>
                  <InputText placeholder="~Auto" name="quo_no" />
                </div>
                <div className="grid grid-cols-[1fr_2fr]">
                  <Label>Date :</Label>
                  <InputText placeholder="~Auto~" name="date" />
                </div>
                <div className="grid grid-cols-[1fr_2fr]">
                  <Label>Sales :</Label>
                  <InputText name="sales" mandatory />
                </div>
                <div className="grid grid-cols-[1fr_2fr]">
                  <Label>Subject :</Label>
                  <InputText name="subject" mandatory />
                </div>
                <div className="grid grid-cols-3">
                  <Label>Customer :</Label>
                  <InputText name="customer" mandatory />
                  <Search className="bg-lightWhite text-base" />
                </div>
                <div className="grid grid-cols-[1fr_2fr]">
                  <Label>Attn :</Label>
                  <InputText name="attn" mandatory />
                </div>
                <div className="grid grid-cols-[1fr_2fr]">
                  <Label>Type :</Label>
                  <InputText name="type" mandatory />
                </div>
                <div className="grid grid-cols-[1fr_2fr]">
                  <Label>Delivery :</Label>
                  <InputText name="delivery" mandatory />
                </div>
                <div className="grid grid-cols-3">
                  <Label>Loading :</Label>
                  <InputText name="loading" mandatory />
                  <Search className="bg-lightWhite text-base" />
                </div>
                <div className="grid grid-cols-3">
                  <Label>Discharge :</Label>
                  <InputText name="discharge" mandatory />
                  <Search className="bg-lightWhite text-base" />
                </div>
                <div className="grid grid-cols-[1fr_2fr]">
                  <Label>Kurs</Label>
                  <InputText name="kurs" mandatory />
                </div>
              </div>
            </div>

            <div className="grid gap-2 dark:bg-graySecondary/50 rounded-sm relative">
              <div className="flex gap-3 bg-blueHeaderCard max-h-6 text-white dark:bg-secondDarkBlue p-0">
                <Command className="text-white" />
                <h1> Data Quotation</h1>
              </div>

              <div className="px-3 absolute top-14 w-full h-full">
                <div className="flex gap-2 mb-5">
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
                    value="Will be happy to supply and any further information you may need and trust that you call on us to fill your order which will receive our prompt and careful attention. "
                  />{' '}
                </div>
              </div>
            </div>
          </div>
          <Link href="#">
            <Button
              className="mb-5 bg-green-600 text-white w-max px-2 py-4 gap-2"
              onClick={openCostModal}
            >
              <PlusSquare className="h-5" />
              <h3>Create Cost</h3>
            </Button>
          </Link>
        </form>
      </FormProvider>

      <ReactTable
        tableInstance={table}
        isLoading={quotationsQuery.isFetching}
      />

      {/* Buttons */}
      <div className="flex items-center gap-2 my-3">
        <Button className="bg-green-500">
          <Link href="/jo">Back</Link>
        </Button>
        <Button
          type="submit"
          disabled={addQuotationMutation.isLoading}
          className="bg-blueLight"
        >
          {addQuotationMutation.isLoading ? 'Loading...' : 'Save'}
        </Button>
        <Button>
          <Link href="/" className="flex items-center gap-1">
            <Printer size={15} className="dark:text-white" />
            Print Quotation
          </Link>
        </Button>
      </div>

      {isCostModalOpen && (
        <div
          style={{ overflow: 'hidden' }}
          className={`fixed inset-0 flex items-center justify-center z-50 modal ${
            isCostModalOpen ? 'open' : 'closed'
          }`}
        >
          <div className="absolute inset-0 bg-black opacity-75"></div>
          <div className="z-10 bg-white px-1 pt-1 rounded-lg shadow-lg w-1/2 relative">
            <Button
              className="absolute -top-9 right-0 text-white !bg-transparent"
              onClick={closePortModal}
            >
              <h1 className="text-xl">X</h1>
            </Button>

            <div className="w-full">
              <div className="flex gap-3 w-full bg-secondDarkBlue pl-5 py-2">
                <Command />
                <h1>Add Data Cost</h1>
              </div>
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)} className="py-5">
                  <div>
                    <div className="flex gap-3">
                      <div className="grid gap-2 text-black w-full">
                        <Label>Item Cost </Label>
                        <Label>Qyt</Label>
                        <Label>Price</Label>
                        <Label>Note</Label>
                      </div>

                      <div className="grid gap-3 justify-start">
                        <InputText name="item_cost" />
                        <div className="flex">
                          <InputNumber name="qty" />
                          <Select value={orderBy} onValueChange={setOrderBy}>
                            <SelectTrigger className="rounded-md w-max [&>span]:text-xs bg-lightWhite dark:bg-black h-9">
                              <SelectValue
                                placeholder="Order by"
                                className=""
                              />
                            </SelectTrigger>
                            <SelectContent
                              align="end"
                              className="dark:text-black"
                            >
                              <SelectGroup>
                                <SelectItem value="Choose">Choose</SelectItem>
                                <SelectItem value="10FR">10FR</SelectItem>
                                <SelectItem value="20FR">20FR</SelectItem>
                                <SelectItem value="30FR">30FR</SelectItem>
                                <SelectItem value="40FR">40FR</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex">
                          <InputNumber name="price" />
                        </div>
                        <InputText name="note" />
                      </div>
                    </div>
                  </div>
                </form>
              </FormProvider>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
