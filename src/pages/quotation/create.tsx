import React, { useMemo, useState } from 'react';
import { Copy } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import ReactTable from '@/components/table/react-table';
import { toast } from 'react-toastify';
import {
  createColumnHelper,
  getCoreRowModel,
  PaginationState,
  useReactTable,
} from '@tanstack/react-table';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getErrMessage } from '@/lib/utils';

type Quotation = {
  quotation_code: string;
  title: string;
  description: string;
  createdBy: string;
};

const Quotation = [
  {
    quotation_code: 'QuoCode101',
    title: 'Que Code Satu',
  },
  {
    quotation_code: 'QuoCode102',
    title: 'Que Code Dua',
  },
  {
    quotation_code: 'QuoCode103',
    title: 'Que Code Tiga',
  },
];

const columnHelper = createColumnHelper<Quotation>();

const columnsDef = [
  columnHelper.accessor('quotation_code', {
    header: 'QUO NO QUO DATE',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('title', {
    header: 'TYPE',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('description', {
    header: 'CUSTOMER',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('createdBy', {
    header: 'LOADING DISCHARGE',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('createdBy', {
    header: 'SUBJECT',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('createdBy', {
    header: 'SALES',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('createdBy', {
    header: 'Action',
    cell: (info) => info.getValue(),
  }),
];

export default function Create() {
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

  const quotationsQuery = useQuery({
    queryKey: ['quotations', fetchDataOptions],
    // queryFn: () => quotationService.getAll(fetchDataOptions)
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
    // mutationFn: quotationService.deleteById,
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
    data: quotationsQuery.data?.Quotation ?? defaultData,
    // pageCount: quotationsQuery.data?.pagination.total_page ?? -1,
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
    <div className="w-full">
      <div className="grid grid-cols-2 mt-5 gap-3">
        <div className="border-2 border-graySecondary/50 px-3 py-3 rounded-md">
          <div className="flex gap-5">
            <h3>
              Data <span>:</span>
            </h3>
            <Input name="data" type="email" className="w-1/2" />
          </div>
          <div className="flex gap-5">
            <h3>
              Subject <span>:</span>
            </h3>
            <Input name="data" type="email" className="w-1/2" />
          </div>
          <div className="flex gap-5">
            <h3>
              Shipper <span>:</span>
            </h3>
            <Input name="data" type="email" className="w-1/2" />
          </div>
        </div>

        <div className="border-2 border-graySecondary/50 px-3 py-3 rounded-md">
          <div className="flex gap-5">
            <h3>Data :</h3>
            <Input name="data" type="email" className="w-1/2" />
          </div>
          <div className="flex gap-5">
            <h3>Subject :</h3>
            <Input name="data" type="email" className="w-1/2" />
          </div>
          <div className="flex gap-5">
            <h3>Shipper :</h3>
            <Input name="data" type="email" className="w-1/2" />
          </div>
        </div>
      </div>

      <ReactTable
        tableInstance={table}
        isLoading={quotationsQuery.isFetching}
      />
    </div>
  );
}
