import InputText from '@/components/forms/input-text';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Command } from 'lucide-react';
import { toast } from 'react-toastify';
import React, { useMemo, useState } from 'react';
import ReactTable from '@/components/table/react-table';
import * as JOCService from '../../../apis/joc.api';
import { cn, getErrMessage } from '@/lib/utils';
import {
  createColumnHelper,
  getCoreRowModel,
  PaginationState,
  useReactTable,
} from '@tanstack/react-table';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { JOC } from '@/types';

const columnHelper = createColumnHelper<JOC>();

const columnsDef = [
  columnHelper.accessor('jo_no', {
    header: '#JO NO',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('customer_code', {
    header: 'Customer',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('quo_no', {
    header: 'TYPE',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('customer_code', {
    header: 'CUSTOMER',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('no_mbl', {
    header: 'NO. BL',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('quo_no', {
    header: 'LOADING',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('quo_no', {
    header: 'DISCARGE',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('jo_no', {
    header: 'GROSS WEIGHT',
    cell: (info) => info.getValue(),
  }),
];

export default function DetailJOC() {
  const qc = useQueryClient();

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

  const JOCsQuery = useQuery({
    queryKey: ['JOCs', fetchDataOptions],
    queryFn: () => JOCService.getAll(fetchDataOptions),
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

  const deleteJOCMutation = useMutation({
    mutationFn: JOCService.deleteById,
    onSuccess: () => {
      qc.invalidateQueries(['JOCs']);
      toast.success('JOC deleted successfully.');
    },
    onError: (err) => {
      toast.error(`Error, ${getErrMessage(err)}`);
    },
  });

  const table = useReactTable({
    columns,
    data: JOCsQuery.data?.data ?? defaultData,
    pageCount: JOCsQuery.data?.pagination.total_page ?? -1,

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
    <div>
      <div className="flex">
        <Command />
        <h1>Data Consolidation</h1>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-sm dark:bg-graySecondary/70">
          <div className="bg-blueHeaderCard w-full">
            <div className="flex">
              <Command />
              <h1>Data JOC</h1>
            </div>

            <div className="grid">
              <div className="flex">
                <Label>#No JOC</Label>
                <InputText name="" />
              </div>
              <div className="flex">
                <Label>JOC Date</Label>
                <InputText name="" />
              </div>
              <div className="flex">
                <Label>Type</Label>
                <InputText name="" />
              </div>
              <div className="flex">
                <Label>No. MBL</Label>
                <InputText name="" />
              </div>
              <div className="flex">
                <Label>Vessel</Label>
                <InputText name="vessel" />
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-sm dark:bg-graySecondary/70">
          <div className="bg-blueHeaderCard w-full">
            <div className="flex">
              <Command />
              <h1>Data Consolidation</h1>
            </div>
            <div className="grid">
              <div className="flex">
                <Label>Agent :</Label>
                <InputText name="agent" />
              </div>
              <div className="flex">
                <Label>Loading :</Label>
                <InputText name="joc_no" />
              </div>
              <div className="flex">
                <Label>Discharge :</Label>
                <InputText name="type" />
              </div>
              <div className="flex">
                <Label>ETD :</Label>
                <InputText name="etd" />
              </div>
              <div className="flex">
                <Label>ETA</Label>
                <InputText name="eta" />
              </div>
              <div className="flex">
                <Label>No. Container</Label>
                <InputText name="eta" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Button className="bg-green-600">Save</Button>
      <Button>Back</Button>

      <div className="flex">
        <div className="bg-blueNav py-1 px-2">Data</div>
        <div className="bg-green-500 py-1 px-2">CN</div>
        <div className="bg-green-500 py-1 px-2">DN</div>
        <div className="bg-green-500 py-1 px-2">PR</div>
      </div>

      <ReactTable tableInstance={table} isLoading={JOCsQuery.isFetching} />
    </div>
  );
}
