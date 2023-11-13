import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { IS_DEV } from '@/constants';
import { Customer, JobOrder, JOC, Port, Quotation } from '@/types';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDebouncedValue } from '@mantine/hooks';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createColumnHelper,
  getCoreRowModel,
  PaginationState,
  useReactTable,
} from '@tanstack/react-table';
import { Command, Copy, PlusSquare, Search, Trash } from 'lucide-react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { InferType } from 'yup';

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
import * as JOCService from '../../apis/joc.api';
import InputHidden from '../forms/input-hidden';
import InputNumber from '../forms/input-number';
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
  customer_code: '',
  quo_no: '',
};

const Schema = yup.object({
  shipper: yup.string().required(),
  consignee: yup.string().required(),
  qty: yup.string().required(),
  vessel: yup.string().required(),
  gross_weight: yup.string().required(),
  volume: yup.string().required(),
  customer_code: yup.string().required(),
  quo_no: yup.string().nullable(),
});

const columnHelper = createColumnHelper<JOC>();

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
  columnHelper.accessor('joc_no', {
    header: 'JO No',
    cell: (info) => info.getValue(),
  }),
];

type JOSchema = InferType<typeof Schema>;

export default function CreateJO({
  onJOCreated,
}: {
  onJOCreated: (newItemJO: any) => void;
}) {
  const qc = useQueryClient();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState<JOC[]>([]);
  const [isJOModalOpen, setIsJOModalOpen] = useState(false);
  const [JOData, setJOData] = useState<any | null>(null);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [customerData, setCustomerData] = useState<Customer[]>([]);
  const [isPortModalOpen, setIsPortModalOpen] = useState(false);
  const [PortData, setPortData] = useState<Port[]>([]);
  const [isQuotationModalOpen, setIsQuotationModalOpen] = useState(false);
  const [QuotationData, setQuotationData] = useState<Quotation[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [customerCode, setCustomerCode] = useState('');
  const [portCode, setPortCode] = useState('');
  const [quotationCode, setQuotationCode] = useState('');
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(
    null
  );
  const [selectedPort, setSelectedPort] = useState<Port | null>(null);

  const methods = useForm<JOSchema>({
    mode: 'all',
    defaultValues,
    resolver: yupResolver(Schema),
  });
  const columns = useMemo(() => columnsDef, []);
  const defaultData = useMemo(() => [], []);

  const { id } = router.query;
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 15,
  });

  const { handleSubmit, setValue, watch } = methods;
  const fetchDataOptions = {
    page: pageIndex + 1,
    limit: pageSize,
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
      return JOCService.getById(setId);
    } else {
      throw new Error('Invalid ID');
    }
  };

  const jocQuery = useQuery({
    queryKey: ['joc'],
    queryFn: fetchData,
    keepPreviousData: true,
    onError: (err) => {
      toast.error(`Error, ${getErrMessage(err)}`);
    },
  });

  useEffect(() => {
    if (jocQuery.data?.data?.joc_no) {
      JOService.getById(jocQuery.data.data.joc_no)
        .then((res) => {
          setJOData(res.data);
        })
        .catch((error) => {
          console.error('Error fetching JO data:', error);
        });
    }
  }, [jocQuery.data?.data?.joc_no]);

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

  useEffect(() => {
    if (selectedCustomer) {
      setCustomerCode(selectedCustomer.customer_code);
    } else {
      setCustomerCode('');
    }
  }, [selectedCustomer]);

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
  useEffect(() => {
    if (selectedPort) {
      setPortCode(selectedPort.port_code);
    } else {
      setPortCode('');
    }
  }, [selectedPort]);

  const closePortModal = () => {
    setIsPortModalOpen(false);
  };

  const openQuotationModal = () => setIsQuotationModalOpen(true);
  {
    fetch('http://localhost:8089/api/quotation')
      .then((response) => response.json())
      .then((data) => {
        console.log('Data Quotation:', data.data);
        setQuotationData(data.data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  useEffect(() => {
    if (selectedQuotation) {
      setQuotationCode(selectedQuotation.quo_no);
    } else {
      setQuotationCode('');
    }
  }, [selectedQuotation]);

  const closeQuotationModal = () => {
    setIsQuotationModalOpen(false);
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

  const deleteJOMutation = useMutation({
    mutationFn: JOService.deleteById,
    onSuccess: () => {
      qc.invalidateQueries(['jo']);
      toast.success('JO deleted successfully.');
      router.reload();
    },
    onError: (err) => {
      toast.error(`Error, ${getErrMessage(err)}`);
    },
  });

  const table = useReactTable({
    columns,
    data: (jocQuery.data?.data || []) as JOC[],
    state: {
      pagination,
    },
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    meta: {
      deleteMutation: deleteJOMutation,
    },
  });

  console.log(searchValue);

  const addJOMutation = useMutation({
    mutationFn: JOService.createJOforJOC,
    onSuccess: () => {
      qc.invalidateQueries(['jo']);
      toast.success('Success, JO has been added.');
      const { id } = router.query;
      router.reload();
      // router.push(`/joc/edit/${id}`);
    },
    onError: (err) => {
      toast.error(`Error, ${getErrMessage(err)}`);
    },
  });

  const onSubmit: SubmitHandler<JOSchema> = (data) => {
    if (IS_DEV) {
      console.log('data =>', data);
    }

    const { id } = router.query;
    const parsedQuoNo = Array.isArray(id) ? id[0] : id;

    addJOMutation.mutate({ data, joc_no: parsedQuoNo || '' });

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
        <Button
          className="mb-5 w-max gap-2 bg-green-600 px-2 py-4 text-white"
          onClick={openJOModal}
        >
          <PlusSquare className="h-5" />
          <h3>Create JobOrder</h3>
        </Button>

        {/* <ReactTable tableInstance={table} isLoading={jocQuery.isFetching} /> */}
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
                JO NO
              </th>
              <th className="border-x-2 border-graySecondary/70 p-2 text-start text-sm font-medium tracking-wide dark:border-white/30">
                AGENT
              </th>
              <th className="border-x-2 border-graySecondary/70 p-2 text-start text-sm font-medium tracking-wide dark:border-white/30">
                CONSIGNEE
              </th>
              <th className="border-x-2 border-graySecondary/70 p-2 text-start text-sm font-medium tracking-wide dark:border-white/30">
                QTY
              </th>
              <th className="border-x-2 border-graySecondary/70 p-2 text-start text-sm font-medium tracking-wide dark:border-white/30">
                NO MBL
              </th>
              <th className="border-x-2 border-graySecondary/70 p-2 text-start text-sm font-medium tracking-wide dark:border-white/30">
                OPTION
              </th>
            </tr>
          </thead>
          <tbody className="relative border-l-2 border-graySecondary/70 font-normal dark:border-white/30">
            {Array.isArray(jocQuery.data?.data?.joborder) ? (
              jocQuery.data?.data?.joborder.map((item: any, index: number) => (
                <tr
                  key={index}
                  className="border-2 border-graySecondary/70 p-2 text-start text-sm font-medium tracking-wide dark:border-white/30"
                >
                  <td className="border-2 border-graySecondary/70 p-2 text-start text-sm font-medium tracking-wide dark:border-white/30">
                    {index + 1}
                  </td>
                  <td className="border-2 border-graySecondary/70 p-2 text-start text-sm font-medium tracking-wide dark:border-white/30">
                    {item.jo_no}
                  </td>
                  <td className="border-2 border-graySecondary/70 p-2 text-start text-sm font-medium tracking-wide dark:border-white/30">
                    {item.shipper}
                  </td>
                  <td className="border-2 border-graySecondary/70 p-2 text-start text-sm font-medium tracking-wide dark:border-white/30">
                    {item.consignee}
                  </td>
                  <td className="border-2 border-graySecondary/70 p-2 text-start text-sm font-medium tracking-wide dark:border-white/30">
                    {item.qty}
                  </td>
                  <td className="border-x-2 border-graySecondary/70 p-2 text-start text-sm font-medium tracking-wide dark:border-white/30">
                    {item.mbl}
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
                          <div className="flex items-center text-white hover:text-darkBlue">
                            <Trash className="mr-2 h-3.5 w-3.5" />
                          </div>
                        </AlertDialogTrigger>

                        <AlertDialogContent className="font-sans">
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you sure absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will
                              permanently delete your data from our servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="font-sans">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={(e) => {
                                e.preventDefault();

                                deleteJOMutation?.mutate(item.jo_no, {
                                  onSuccess: () => {
                                    setOpen(false);
                                  },
                                });
                              }}
                            >
                              {deleteJOMutation?.isLoading
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
                <td colSpan={4}>No cost data available</td>
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
                        <div className="hidden">
                          <InputHidden
                            name="customer_code"
                            value={customerCode}
                          />
                          <InputHidden name="quo_no" value={quotationCode} />
                        </div>
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
                            value={
                              selectedQuotation
                                ? selectedQuotation.discharge
                                : ''
                            }
                          />
                          <button
                            className="
          mt-1 h-6 w-6 rounded-md bg-graySecondary px-1 text-base
          text-white dark:bg-blueLight"
                            onClick={openQuotationModal}
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
                          const customerCodeInput = document.querySelector(
                            'input[name="customer_code"]'
                          );
                          if (customerCodeInput) {
                            (customerCodeInput as HTMLInputElement).value =
                              customer.customer_code;
                          }
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
                          const portCodeInput = document.querySelector(
                            'input[name="port_code"]'
                          );
                          if (portCodeInput) {
                            (portCodeInput as HTMLInputElement).value =
                              port.port_code;
                          }
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

      {isQuotationModalOpen && (
        <div
          style={{ overflow: 'hidden' }}
          className={`modal fixed inset-0 z-50 flex items-center justify-center ${
            isQuotationModalOpen ? 'open' : 'closed'
          }`}
        >
          <div className="absolute inset-0 bg-black opacity-75"></div>
          <div className="relative z-10 w-1/3 rounded-lg bg-white p-4 shadow-lg">
            <Button
              className="absolute -top-9 right-0 !bg-transparent text-white"
              onClick={closeQuotationModal}
            >
              <h1 className="text-xl">X</h1>
            </Button>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="hover:!text-white">Type</TableHead>
                  <TableHead className="hover:!text-white">Delivery</TableHead>
                  <TableHead className="hover:!text-white">Add</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="text-black">
                {QuotationData.map((quotation) => (
                  <TableRow key={quotation.type}>
                    <TableCell className="font-medium">
                      {quotation.type}
                    </TableCell>
                    <TableCell className="font-medium">
                      {quotation.discharge}
                    </TableCell>
                    <TableCell className="!h-2 !w-2 rounded-md">
                      <Button
                        className=""
                        onClick={() => {
                          setSelectedQuotation(quotation);
                          const quotationCodeInput = document.querySelector(
                            'input[name="quo_no"]'
                          );
                          if (quotationCodeInput) {
                            (quotationCodeInput as HTMLInputElement).value =
                              quotation.quo_no;
                          }
                          closeQuotationModal();
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
