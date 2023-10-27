import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { IS_DEV } from '@/constants';
import { Customer, JobOrder, Port } from '@/types';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDebouncedValue } from '@mantine/hooks';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createColumnHelper,
  getCoreRowModel,
  PaginationState,
  useReactTable,
} from '@tanstack/react-table';
import { Command, Copy, PlusSquare, Search } from 'lucide-react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { InferType } from 'yup';

import { cn, getErrMessage } from '@/lib/utils';
import yup from '@/lib/yup';
import ReactTable from '@/components/table/react-table';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import * as JOService from '../../apis/jo.api';
import InputNumber from '../forms/input-number';
import InputSearch from '../forms/input-search';
import InputText from '../forms/input-text';
import InputTextNoErr from '../forms/input-text-noerr';
import { Input } from '../ui/input';

const defaultValues = {
  shipper: '',
  consignee: '',
  qty: '',
  vessel: '',
  gross_weight: '',
  volume: '',
};

const Schema = yup.object({
  shipper: yup.string().required(),
  consignee: yup.string().required(),
  qty: yup.string().required(),
  vessel: yup.string().required(),
  gross_weight: yup.string().required(),
  volume: yup.string().required(),
});

const columnHelper = createColumnHelper<JobOrder>();

const copyJo = (jo_no: any) => {
  navigator.clipboard
    .writeText(jo_no)
    .then(() => {
      toast.success(`copied to clipboard.`);
    })
    .catch((error) => {
      console.error('Failed to copy JO No: ', error);
    });
};
const columnsDef = [
  columnHelper.display({
    id: 'CopyJo',
    header: 'Copy No Jo',
    cell: (info) => {
      const jo_no = info.row.original.jo_no;
      return (
        <Button
          className="mx-auto grid h-10 w-10 items-center justify-center bg-gray-100/20 text-white"
          onClick={() => copyJo(jo_no)}
        >
          <Copy
            size={15}
            className="mx-auto grid items-center justify-center dark:text-white"
          />
        </Button>
      );
    },
  }),
  columnHelper.accessor('jo_no', {
    header: 'JO No',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('shipper', {
    header: 'Shipper',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('consignee', {
    header: 'Consignee',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('qty', {
    header: 'QTY',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('vessel', {
    header: 'Vessel',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('gross_weight', {
    header: 'gross_weight',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('volume', {
    header: 'volume',
    cell: (info) => info.getValue(),
  }),
];

type CostSchema = InferType<typeof Schema>;

export default function CreateJO({
  onJOCreated,
}: {
  onJOCreated: (newItemJO: any) => void;
}) {
  const qc = useQueryClient();
  const router = useRouter();
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState<JobOrder[]>([]);
  const [isJOModalOpen, setIsJOModalOpen] = useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [customerData, setCustomerData] = useState<Customer[]>([]);
  const [PortData, setPortData] = useState<Port[]>([]);
  const [isPortModalOpen, setIsPortModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [selectedPort, setSelectedPort] = useState<Port | null>(null);

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
  };

  const fetchData = (fetchDataOptions: any, debouncedSearchValue: any) => {
    return JOService.getAll({
      ...fetchDataOptions,
      searchValue: debouncedSearchValue,
      quo_no: debouncedSearchValue,
    });
  };

  const jobOrderQuery = useQuery({
    queryKey: ['jo', { fetchDataOptions, searchValue }],
    queryFn: () => fetchData(fetchDataOptions, searchValue),
    keepPreviousData: true,
    onError: (err) => {
      toast.error(`Error, ${getErrMessage(err)}`);
    },
  });

  const openCustomerModal = () => {
    setIsCustomerModalOpen(true);

    fetch('http://localhost:8089/api/customer')
      .then((response) => response.json())
      .then((data) => {
        console.log('Data Customer:', data.data);
        setCustomerData(data.data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const closeCustomerModal = () => {
    setIsCustomerModalOpen(false);
  };

  const openPortModal = () => {
    setIsPortModalOpen(true);

    fetch('http://localhost:8089/api/port')
      .then((response) => response.json())
      .then((data) => {
        console.log('Data Port:', data.data);
        setPortData(data.data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const closePortModal = () => {
    setIsPortModalOpen(false);
  };

  const openJOModal = () => {
    setIsJOModalOpen(true);
  };

  const closeJOModal = () => {
    setIsJOModalOpen(false);
  };

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );

  const deleteCostMutation = useMutation({
    mutationFn: JOService.deleteById,
    onSuccess: () => {
      qc.invalidateQueries(['cost']);
      toast.success('JO deleted successfully.');
    },
    onError: (err) => {
      toast.error(`Error, ${getErrMessage(err)}`);
    },
  });

  const table = useReactTable({
    columns,
    data: searchValue ? searchResults : jobOrderQuery.data?.data ?? [],
    pageCount: jobOrderQuery.data?.pagination.total_page ?? -1,
    state: {
      pagination,
    },
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    meta: {
      deleteMutation: deleteCostMutation,
    },
  });

  console.log(searchValue);

  const addJOMutation = useMutation({
    mutationFn: JOService.create,
    onSuccess: (newItemJO) => {
      onJOCreated(newItemJO);
      qc.invalidateQueries(['cost']);
      toast.success('Success, JO has been added.');
      const { id } = router.query;
      router.reload();
      // router.push(`/joc/edit/${id}`);
    },
    onError: (err) => {
      toast.error(`Error, ${getErrMessage(err)}`);
    },
  });

  const onSubmit: SubmitHandler<CostSchema> = (data) => {
    if (IS_DEV) {
      console.log('data =>', data);
    }

    addJOMutation.mutate(data);

    onJOCreated(data);

    setIsJOModalOpen(false);
  };

  return (
    <div className="mt-10">
      <Link href="#">
        {/* <Button
          className="mb-5 w-max gap-2 bg-green-600 px-2 py-4 text-white"
          onClick={openJOModal}
        >
          <PlusSquare className="h-5" />
          <h3>Create JO</h3>
        </Button> */}
      </Link>

      <div className="">
        <Input
          type="text"
          name=""
          id=""
          placeholder="Search...."
          className="my-5 w-[300px] rounded-md border border-graySecondary !bg-transparent dark:border-white"
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value);
            const filteredData = jobOrderQuery.data?.data.filter((item) =>
              item.jo_no.toLowerCase().includes(e.target.value.toLowerCase())
            );
            setSearchResults(filteredData || []);
          }}
        />
        <ReactTable
          tableInstance={table}
          isLoading={jobOrderQuery.isFetching}
        />
      </div>

      {isJOModalOpen && (
        <div
          style={{ overflow: 'hidden' }}
          className={`modal fixed inset-0 z-50 flex items-center justify-center ${
            isJOModalOpen ? 'open' : 'closed'
          }`}
        >
          <div className="absolute inset-0 bg-black opacity-75"></div>
          <div className="relative z-10 w-2/5 rounded-lg bg-white px-1 pt-1 shadow-lg">
            <Button
              className="absolute -top-9 right-0 !bg-transparent text-white"
              onClick={closeJOModal}
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
                        <Label>Shipper </Label>
                        <Label>consignee</Label>
                        <Label>Qyt</Label>
                        <Label>Vessel</Label>
                        <Label>gross_weight</Label>
                        <Label>Volume</Label>
                      </div>

                      <div className="grid justify-end gap-3">
                        <div className="flex gap-2">
                          <InputTextNoErr
                            name="shipper"
                            value={
                              selectedCustomer
                                ? selectedCustomer.partner_name
                                : ''
                            }
                          />
                          <button
                            className="
          mt-1 h-6 w-6 rounded-md bg-graySecondary px-1 text-base
          text-white dark:bg-blueLight"
                            onClick={openCustomerModal}
                          >
                            <Search className="w-4" />
                          </button>
                        </div>
                        <div className="flex gap-2">
                          <InputTextNoErr
                            name="consignee"
                            value={selectedPort ? selectedPort.port_name : ''}
                          />
                          <button
                            className="
          mt-1 h-6 w-6 rounded-md bg-graySecondary px-1 text-base
          text-white dark:bg-blueLight"
                            onClick={openPortModal}
                          >
                            <Search className="w-4" />
                          </button>
                        </div>
                        <InputNumber name="qty" />
                        <InputText name="vessel" />
                        <InputNumber name="gross_weight" />
                        <InputNumber name="volume" />
                      </div>
                    </div>
                  </div>
                  {/* Buttons */}
                  <div className="mt-5 flex items-center gap-2">
                    <Button
                      className="bg-graySecondary"
                      onClick={() => router.back()}
                    >
                      LBack
                    </Button>
                    <Button
                      type="submit"
                      disabled={addJOMutation.isLoading}
                      className="bg-blueLight"
                    >
                      {addJOMutation.isLoading ? 'Loading...' : 'Save'}
                    </Button>
                  </div>
                </form>
              </FormProvider>
            </div>
          </div>
        </div>
      )}

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
                  <TableHead className="hover:!text-white">Unit</TableHead>
                  <TableHead className="hover:!text-white">Add</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="text-black">
                {customerData.map((customer) => (
                  <TableRow key={customer.customer_code}>
                    <TableCell className="font-medium">
                      {customer.partner_name}
                    </TableCell>
                    <TableCell className="font-medium">
                      {customer.unit}
                    </TableCell>
                    <TableCell className="!h-2 !w-2 rounded-md">
                      <Button
                        className=""
                        onClick={() => {
                          setSelectedCustomer(customer);
                          closeCustomerModal();
                        }}
                      >
                        add
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {isPortModalOpen && (
        <div
          style={{ overflow: 'hidden' }}
          className={`modal fixed inset-0 z-50 flex items-center justify-center ${
            isPortModalOpen ? 'open' : 'closed'
          }`}
        >
          <div className="absolute inset-0 bg-black opacity-75"></div>
          <div className="relative z-10 w-1/3 rounded-lg bg-white p-4 shadow-lg">
            <Button
              className="absolute -top-9 right-0 !bg-transparent text-white"
              onClick={closePortModal}
            >
              <h1 className="text-xl">X</h1>
            </Button>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="hover:!text-white">Port Name</TableHead>
                  <TableHead className="hover:!text-white">Add</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="text-black">
                {PortData.map((port) => (
                  <TableRow key={port.port_code}>
                    <TableCell className="font-medium">
                      {port.port_name}
                    </TableCell>
                    <TableCell className="!h-2 !w-2 rounded-md">
                      <Button
                        className=""
                        onClick={() => {
                          setSelectedPort(port);
                          closePortModal();
                        }}
                      >
                        add
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}
