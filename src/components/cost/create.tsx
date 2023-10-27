import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { IS_DEV } from '@/constants';
import { Cost, Quotation } from '@/types';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDebouncedValue } from '@mantine/hooks';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createColumnHelper,
  getCoreRowModel,
  PaginationState,
  useReactTable,
} from '@tanstack/react-table';
import { Command, PlusSquare } from 'lucide-react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { InferType } from 'yup';

import { cn, getErrMessage } from '@/lib/utils';
import yup from '@/lib/yup';
import ReactTable from '@/components/table/react-table';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import * as CostService from '../../apis/cost.api';
import * as quotationService from '../../apis/quotation.api';
import InputNumber from '../forms/input-number';
import InputText from '../forms/input-text';

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

export default function CreateCost({
  onCostCreated,
  itemCostValue,
}: {
  onCostCreated: (newItemCost: any) => void;
  itemCostValue: string | undefined;
}) {
  const qc = useQueryClient();
  const router = useRouter();
  const [searchValue, setSearchValue] = useState('');
  const [isCostModalOpen, setIsCostModalOpen] = useState(false);
  const [selectedItemCost, setSelectedItemCost] = useState(itemCostValue);

  const methods = useForm<CostSchema>({
    mode: 'all',
    defaultValues,
    resolver: yupResolver(Schema),
  });
  const columns = useMemo(() => columnsDef, []);
  const defaultData = useMemo(() => [], []);
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 15,
  });

  const { handleSubmit, setValue, watch } = methods;
  const fetchDataOptions = {
    page: pageIndex + 1,
    limit: pageSize,
    item_cost: selectedItemCost,
  };
  const { quo_no } = router.query;

  const fetchData = (fetchDataOptions: any, debouncedSearchValue: any) => {
    return CostService.getAll({
      ...fetchDataOptions,
      searchValue: debouncedSearchValue,
      quo_no: debouncedSearchValue,
    });
  };

  const quotationQuery = useQuery({
    queryKey: ['quotations', { fetchDataOptions, searchValue }],
    queryFn: () => fetchData(fetchDataOptions, searchValue),
    keepPreviousData: true,
    onError: (err) => {
      toast.error(`Error, ${getErrMessage(err)}`);
    },
  });

  useEffect(() => {
    setSelectedItemCost(itemCostValue);
  }, [itemCostValue]);

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
    data: quotationQuery.data?.data ?? [],
    pageCount: quotationQuery.data?.pagination.total_page ?? -1,
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
    onSuccess: (newItemCost) => {
      onCostCreated(newItemCost);
      qc.invalidateQueries(['cost']);
      toast.success('Success, Cost has been added.');
      const { id } = router.query;
      router.push(`/quotation/edit/${id}`);
      // router.reload();
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

    onCostCreated(data);

    setIsCostModalOpen(false);
  };

  return (
    <div className="mt-10">
      <Link href="#">
        <Button
          className="mb-5 w-max gap-2 bg-green-600 px-2 py-4 text-white"
          onClick={openCostModal}
        >
          <PlusSquare className="h-5" />
          <h3>Create Cost</h3>
        </Button>
      </Link>
      <ReactTable tableInstance={table} isLoading={quotationQuery.isFetching} />

      {isCostModalOpen && (
        <div
          style={{ overflow: 'hidden' }}
          className={`modal fixed inset-0 z-50 flex items-center justify-center ${
            isCostModalOpen ? 'open' : 'closed'
          }`}
        >
          <div className="absolute inset-0 bg-black opacity-75"></div>
          <div className="relative z-10 w-2/5 rounded-lg bg-white px-1 pt-1 shadow-lg">
            <Button
              className="absolute -top-9 right-0 !bg-transparent text-white"
              onClick={closeCostModal}
            >
              <h1 className="text-xl">X</h1>
            </Button>

            <div className="w-full">
              <div className="flex w-full gap-3 bg-blueHeaderCard py-2 pl-5">
                <Command />
                <h1>Add Data Cost</h1>
              </div>
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)} className="py-5">
                  <div>
                    <div className="flex  gap-3">
                      <div className="grid w-full gap-2 text-black">
                        {/* <Label>Item Cost </Label> */}
                        <Label>Item Name </Label>
                        <Label>Qyt</Label>
                        <Label>Unit</Label>
                        <Label>Price</Label>
                        <Label>Note</Label>
                      </div>

                      <div className="grid justify-end gap-3">
                        <InputText name="item_name" />
                        <div className="flex">
                          <InputNumber name="qty" />
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
                  <div className="mt-5 flex items-center gap-2">
                    <Button
                      className="bg-graySecondary"
                      onClick={() => router.back()}
                    >
                      Back
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
