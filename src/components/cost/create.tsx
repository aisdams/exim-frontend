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
import { Command, PlusSquare, Trash } from 'lucide-react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { useLocation, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { InferType, string } from 'yup';

import { axios } from '@/lib/axios';
import { cn, getErrMessage } from '@/lib/utils';
import yup from '@/lib/yup';
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
import { Label } from '@/components/ui/label';
import * as CostService from '../../apis/cost.api';
import * as QuotationService from '../../apis/quotation.api';
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
  note: yup.string().nullable(),
});

const columnHelper = createColumnHelper<Quotation>();

const columnsDef = [
  columnHelper.accessor('loading', {
    header: 'loading',
    cell: (info) => {
      return (
        <>
          <div>{info.row.original.loading}</div>
        </>
      );
    },
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
  // const { quo_no } = useParams();
  const [searchValue, setSearchValue] = useState('');
  const [isCostModalOpen, setIsCostModalOpen] = useState(false);
  const [selectedItemCost, setSelectedItemCost] = useState(itemCostValue);
  const [cost, setCost] = useState<any | null>([]);
  const [open, setOpen] = useState(false);
  const [costData, setCostData] = useState<any | null>(null);
  const [QuoOptions, setQuoOptions] = useState<{ label: string; value: any }[]>(
    []
  );
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

  const { id } = router.query;

  const fetchDataOptions = {
    page: pageIndex + 1,
    limit: pageSize,
    id,
  };

  const fetchData = () => {
    let setId;
    if (typeof id === 'string') {
      setId = id;
    } else if (Array.isArray(id)) {
      setId = id[0];
    } else {
      throw new Error('Invalid ID');
    }

    if (setId) {
      return QuotationService.getById(setId);
    } else {
      throw new Error('Invalid ID');
    }
  };

  const quotationsQuery = useQuery({
    queryKey: ['quotations'],
    queryFn: fetchData,
    keepPreviousData: true,
    onError: (err) => {
      toast.error(`Error, ${getErrMessage(err)}`);
    },
  });

  useEffect(() => {
    if (quotationsQuery.data?.data?.quo_no) {
      CostService.getById(quotationsQuery.data.data.quo_no)
        .then((res) => {
          setCostData(res.data);
        })
        .catch((error) => {
          toast.error('Error fetching quotation data:', error);
        });
    }
  }, [quotationsQuery.data?.data?.quo_no]);

  useEffect(() => {
    setSelectedItemCost(itemCostValue);
  }, [itemCostValue]);

  const openCostModal = () => {
    setIsCostModalOpen(true);
  };

  // alert(quotationsQuery);
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
      router.reload();
    },
    onError: (err) => {
      toast.error(`Error, ${getErrMessage(err)}`);
    },
  });

  const table = useReactTable({
    columns,
    data: (quotationsQuery.data?.data || []) as Quotation[],
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
    mutationFn: CostService.createCostQuo,
    onSuccess: () => {
      qc.invalidateQueries(['cost']);
      toast.success('Success, Cost has been added.');

      const { id } = router.query;
      router.reload();
      // router.push(`/quotation/edit/${id}`);
    },
    onError: (err: any) => {
      toast.error(`Error, ${getErrMessage(err)}`);
    },
  });

  const onSubmit: SubmitHandler<CostSchema> = (data) => {
    // if (IS_DEV) {
    //   console.log('data =>', data);
    // }
    const { id } = router.query;
    const parsedQuoNo = Array.isArray(id) ? id[0] : id;

    addCostMutation.mutate({ data, quo_no: parsedQuoNo || '' });

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
      {/* <ReactTable
        tableInstance={table}
        isLoading={quotationsQuery.isFetching} 
      /> */}

      <table className="w-full">
        <thead>
          <tr className="border-y-2 border-graySecondary/50 transition-colors">
            {/* <th className="border-x-2 border-graySecondary/70 p-2 text-start text-sm font-medium tracking-wide dark:border-white/30">
              Option
            </th> */}
            <th className="border-l-2 border-graySecondary/70 p-2 dark:border-white/30">
              No
            </th>
            <th className="border-x-2 border-graySecondary/70 p-2 text-start text-sm font-medium tracking-wide dark:border-white/30">
              ITEM COST
            </th>
            <th className="border-x-2 border-graySecondary/70 p-2 text-start text-sm font-medium tracking-wide dark:border-white/30">
              ITEM NAME
            </th>
            <th className="border-x-2 border-graySecondary/70 p-2 text-start text-sm font-medium tracking-wide dark:border-white/30">
              QYT
            </th>
            <th className="border-x-2 border-graySecondary/70 p-2 text-start text-sm font-medium tracking-wide dark:border-white/30">
              UNIT
            </th>
            <th className="border-x-2 border-graySecondary/70 p-2 text-start text-sm font-medium tracking-wide dark:border-white/30">
              OPTION
            </th>
          </tr>
        </thead>
        <tbody className="relative border-l-2 border-graySecondary/70 font-normal dark:border-white/30">
          {Array.isArray(quotationsQuery.data?.data?.cost) &&
          quotationsQuery.data?.data?.cost.length > 0 ? (
            quotationsQuery.data?.data?.cost.map((item: any, index: number) => (
              <tr
                key={index}
                className="border-2 border-graySecondary/70 p-2 text-start text-sm font-medium tracking-wide dark:border-white/30"
              >
                <td className="border-2 border-graySecondary/70 p-2 text-start text-sm font-medium tracking-wide dark:border-white/30">
                  {index + 1}
                </td>
                <td className="border-2 border-graySecondary/70 p-2 text-start text-sm font-medium tracking-wide dark:border-white/30">
                  {item.item_cost}
                </td>
                <td className="border-2 border-graySecondary/70 p-2 text-start text-sm font-medium tracking-wide dark:border-white/30">
                  {item.item_name}
                </td>
                <td className="border-2 border-graySecondary/70 p-2 text-start text-sm font-medium tracking-wide dark:border-white/30">
                  {item.qty}
                </td>
                <td className="border-x-2 border-graySecondary/70 p-2 text-start text-sm font-medium tracking-wide dark:border-white/30">
                  {item.unit}
                </td>
                <td className="border-x-2 border-graySecondary/70 p-2 text-start text-sm font-medium tracking-wide dark:border-white/30">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                    }}
                    className="p-0"
                  >
                    <AlertDialog open={open} onOpenChange={setOpen}>
                      <AlertDialogTrigger className="flex w-full select-none items-center px-2 py-1.5 font-sans hover:cursor-default">
                        <div className="flex items-center rounded-md bg-red-600 px-2 py-2 hover:bg-transparent">
                          <Trash className="h-4 w-4" />
                        </div>
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

                              deleteCostMutation?.mutate(item.item_cost, {
                                onSuccess: () => {
                                  setOpen(false);
                                },
                              });
                            }}
                          >
                            {deleteCostMutation?.isLoading
                              ? 'Loading...'
                              : 'Continue'}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={table.getAllColumns().length + 1}
                className="p-2 text-center"
              >
                No data found.
              </td>
            </tr>
          )}
          {/* {setCost} */}

          {/* No data info */}
          {/* {quotationsQuery.data?.data.quo_no.length < 1 && ( */}
          {table.getAllColumns().length < 1 && (
            <tr className="">
              <td
                colSpan={table.getAllColumns().length + 1}
                className="p-2 text-center"
              >
                No data found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {isCostModalOpen && (
        <div
          style={{ overflow: 'hidden' }}
          className={`modal fixed inset-0 z-50 flex items-center justify-center ${
            isCostModalOpen ? 'open' : 'closed'
          }`}
        >
          <div className="absolute inset-0 bg-black opacity-75"></div>
          <div className="relative z-10 w-1/3 rounded-lg bg-white px-1 pt-1 shadow-lg">
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
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="mx-auto grid justify-center py-5"
                >
                  <div>
                    <div className="mb-3">
                      <InputText name="item_name" mandatory />
                    </div>
                    <div className="mb-3">
                      <InputNumber name="qty" mandatory />
                    </div>
                    <div className="mb-3">
                      <InputNumber name="unit" mandatory />
                    </div>
                    <div className="mb-3">
                      <InputNumber name="price" mandatory />
                    </div>
                    <div>
                      <InputText name="note" />
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
