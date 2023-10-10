import Link from 'next/link';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import {
  createColumnHelper,
  getCoreRowModel,
  PaginationState,
  useReactTable,
} from '@tanstack/react-table';
import { Label } from '@/components/ui/label';
import { yupResolver } from '@hookform/resolvers/yup';
import { IS_DEV } from '@/constants';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import yup from '@/lib/yup';
import {
  CheckCircle2,
  PlusCircle,
  XCircle,
  Calendar,
  MoreHorizontal,
  PlusSquare,
  Search,
  Command,
  PackageSearch,
  Trash,
  Edit2,
  Printer,
  Copy,
  MoreVertical,
  CheckIcon,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useDebouncedValue } from '@mantine/hooks';
import { cn, getErrMessage } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import * as CostService from '../../apis/cost.api';
import React, { useMemo, useState } from 'react';
import ReactTable from '@/components/table/react-table';
import InputSearch from '@/components/forms/input-search';
import { DateRangePicker } from '@/components/forms/data-range-picker';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';

import { Cost, Quotation } from '@/types';
import ActionLink from '@/components/table/action-link';
import { InferType } from 'yup';
import InputNumber from '../forms/input-number';
import InputText from '../forms/input-text';
import { useRouter } from 'next/router';

const defaultValues = {
  item_name: '',
  qty: '',
  unit: '',
  price: '',
  note: '',
};

const Schema = yup.object({
  item_name: yup.string().required(),
  qty: yup.string().required(),
  unit: yup.string().required(),
  price: yup.string().required(),
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

export default function CreateCost() {
  const qc = useQueryClient();
  const [statusesKey, setStatusesKey] = useState<string[]>([]);
  const router = useRouter();
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [orderBy, setOrderBy] = useState('All');
  const [orderByTwo, setOrderByTwo] = useState('Quo No');
  const [orderByThree, setOrderByThree] = useState('Quo No');
  const [searchValue, setSearchValue] = useState('');
  const [isCostModalOpen, setIsCostModalOpen] = useState(false);

  const methods = useForm<CostSchema>({
    mode: 'all',
    defaultValues,
    resolver: yupResolver(Schema),
  });
  const debouncedSearchValue = useDebouncedValue(searchValue, 500);
  const columns = useMemo(() => columnsDef, []);
  const defaultData = useMemo(() => [], []);
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { handleSubmit, setValue, watch } = methods;
  const fetchDataOptions = {
    page: pageIndex + 1,
    limit: pageSize,
  };

  const fetchData = (fetchDataOptions: any, debouncedSearchValue: any) => {
    return CostService.getAll({
      ...fetchDataOptions,
      searchValue: debouncedSearchValue,
      quo_no: debouncedSearchValue,
    });
  };

  const costQuery = useQuery({
    queryKey: ['cost', { fetchDataOptions, searchValue }],
    queryFn: () => fetchData(fetchDataOptions, searchValue),
    keepPreviousData: true,
    onError: (err) => {
      toast.error(`Error, ${getErrMessage(err)}`);
    },
  });

  const openCostModal = () => {
    setIsCostModalOpen(true);
  };

  const closeCostModal = () => {
    setIsCostModalOpen(false);
  };

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );

  const deleteCostMutation = useMutation({
    mutationFn: CostService.deleteById,
    onSuccess: () => {
      qc.invalidateQueries(['cost']);
      toast.success('Cost deleted successfully.');
    },
    onError: (err) => {
      toast.error(`Error, ${getErrMessage(err)}`);
    },
  });

  const table = useReactTable({
    columns,
    data: costQuery.data?.data ?? [],
    pageCount: costQuery.data?.pagination.total_page ?? -1,
    state: {
      pagination,
    },
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    meta: {
      deleteMutation: deleteCostMutation,
    },
  });

  const addCostMutation = useMutation({
    mutationFn: CostService.create,
    onSuccess: () => {
      qc.invalidateQueries(['cost']);
      toast.success('Success, Cost has been added.');
      const { quo_no } = router.query;
      router.push(`/quotation/edit/${quo_no}`);
    },
    onError: (err) => {
      toast.error(`Error, ${getErrMessage(err)}`);
    },
  });

  const onSubmit: SubmitHandler<CostSchema> = (data) => {
    if (IS_DEV) {
      console.log('data =>', data);
    }

    addCostMutation.mutate(data);
  };

  return (
    <div className="mt-10">
      <Link href="#">
        <Button
          className="mb-5 bg-green-600 text-white w-max px-2 py-4 gap-2"
          onClick={openCostModal}
        >
          <PlusSquare className="h-5" />
          <h3>Create Cost</h3>
        </Button>
      </Link>
      <ReactTable tableInstance={table} isLoading={costQuery.isFetching} />

      {isCostModalOpen && (
        <div
          style={{ overflow: 'hidden' }}
          className={`fixed inset-0 flex items-center justify-center z-50 modal ${
            isCostModalOpen ? 'open' : 'closed'
          }`}
        >
          <div className="absolute inset-0 bg-black opacity-75"></div>
          <div className="z-10 bg-white px-1 pt-1 rounded-lg shadow-lg w-2/5 relative">
            <Button
              className="absolute -top-9 right-0 text-white !bg-transparent"
              onClick={closeCostModal}
            >
              <h1 className="text-xl">X</h1>
            </Button>

            <div className="w-full">
              <div className="flex gap-3 w-full bg-blueHeaderCard pl-5 py-2">
                <Command />
                <h1>Add Data Cost</h1>
              </div>
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)} className="py-5">
                  <div>
                    <div className="flex  gap-3">
                      <div className="grid gap-2 text-black w-full">
                        {/* <Label>Item Cost </Label> */}
                        <Label>Item Name </Label>
                        <Label>Qyt</Label>
                        <Label>Unit</Label>
                        <Label>Price</Label>
                        <Label>Note</Label>
                      </div>

                      <div className="grid gap-3 justify-end">
                        <InputText name="item_name" />
                        <div className="flex">
                          <InputNumber name="qty" />
                          {/* <Select value={orderBy} onValueChange={setOrderBy}>
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
                          </Select> */}
                        </div>
                        <InputNumber name="unit" />
                        <div className="flex">
                          <InputNumber name="price" />
                        </div>
                        <InputText name="note" />
                      </div>
                    </div>
                  </div>
                  {/* Buttons */}
                  <div className="flex items-center gap-2 mt-5">
                    <Button className="bg-graySecondary">
                      <Link href="/quotation">Back</Link>
                    </Button>
                    <Button
                      type="submit"
                      disabled={addCostMutation.isLoading}
                      className="bg-blueLight"
                    >
                      {addCostMutation.isLoading ? 'Loading...' : 'Save'}
                    </Button>
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