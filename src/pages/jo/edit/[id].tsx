import { ParsedUrlQuery } from 'querystring';
import { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { IS_DEV } from '@/constants';
import { Customer, Port } from '@/types';
import { yupResolver } from '@hookform/resolvers/yup';
import { Label } from '@radix-ui/react-label';
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { Command, Printer, Search } from 'lucide-react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { InferType } from 'yup';

import * as JOService from '@/apis/jo.api';
import { cn, getErrMessage } from '@/lib/utils';
import yup from '@/lib/yup';
import InputDate from '@/components/forms/input-date';
import InputDisable from '@/components/forms/input-disable';
import InputNumber from '@/components/forms/input-number';
import InputText from '@/components/forms/input-text';
import InputTextNoErr from '@/components/forms/input-text-noerr';
import Loader from '@/components/table/loader';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

const defaultValues = {
  shipper: '',
  consignee: '',
  qty: '',
  hbl: '',
  mbl: '',
  etd: '',
  eta: '',
  vessel: '',
  gross_weight: '',
  volume: '',
  name_of_goods: '',
};

const Schema = yup.object({
  shipper: yup.string().required(),
  consignee: yup.string().required(),
  qty: yup.string().required(),
  hbl: yup.string().required(),
  mbl: yup.string().required(),
  etd: yup.string().required(),
  eta: yup.string().required(),
  vessel: yup.string().required(),
  gross_weight: yup.string().required(),
  volume: yup.string().required(),
  name_of_goods: yup.string().required(),
});

type JoSchema = InferType<typeof Schema>;

interface IParams extends ParsedUrlQuery {
  id: string;
}

export const getServerSideProps: GetServerSideProps<{
  id: string;
}> = async (ctx) => {
  const { id } = ctx.params as IParams;

  return {
    props: {
      id,
    },
  };
};

type JoEditProps = {
  id: string;
};

const JoEdit: React.FC<JoEditProps> = ({ id }) => {
  const router = useRouter();
  const qc = useQueryClient();
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [customerData, setCustomerData] = useState<Customer[]>([]);
  const [PortData, setPortData] = useState<Port[]>([]);
  const [isPortModalOpen, setIsPortModalOpen] = useState(false);
  const [isPortTwoModalOpen, setIsPortTwoModalOpen] = useState(false);
  const [isPortThreeModalOpen, setIsPortThreeModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );

  // get data jo then get data quotation
  const fetchJOData = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:8089/api/jo/${id}`);
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error('Gagal mengambil data');
    }
  };

  const { data: JOData } = useQuery(['jo', id], () => {
    if (typeof id === 'string') {
      return fetchJOData(id).then((joData) => {
        const quoNo = joData?.data?.quo_no;

        const fetchQuotationData = async (quoNo: string) => {
          try {
            const response = await fetch(
              `http://localhost:8089/api/quotation/${quoNo}`
            );
            const quotationData = await response.json();
            return quotationData;
          } catch (error) {
            throw new Error('Gagal mengambil data quotation');
          }
        };

        return fetchQuotationData(quoNo);
      });
    } else {
      throw new Error('jo harus menjadi string');
    }
  });
  console.log(JOData);

  const [selectedPort, setSelectedPort] = useState<Port | null>(null);
  const [selectedPortTwo, setSelectedPortTwo] = useState<Port | null>(null);
  const [selectedPortThree, setSelectedPortThree] = useState<Port | null>(null);
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

  const openPortTwoModal = () => {
    setIsPortTwoModalOpen(true);

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

  const closePortTwoModal = () => {
    setIsPortTwoModalOpen(false);
  };

  const openPortThreeModal = () => {
    setIsPortThreeModalOpen(true);

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

  const closePortThreeModal = () => {
    setIsPortThreeModalOpen(false);
  };

  const [dd, setDd] = useState('');
  const [mm, setMm] = useState('');
  const [yyyy, setYyyy] = useState('');

  useEffect(() => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = String(today.getFullYear());

    setDd(day);
    setMm(month);
    setYyyy(year);
  }, []);

  const methods = useForm<JoSchema>({
    mode: 'all',
    defaultValues,
    resolver: yupResolver(Schema),
  });
  const { handleSubmit, resetField, setValue } = methods;

  //! get JO By Id
  const JOQuery = useQuery({
    queryKey: ['quotation'],
    queryFn: () => JOService.getById(id),
    onSuccess: ({ data }) => {
      setValue('shipper', data.shipper);
      setValue('consignee', data.consignee);
      setValue('hbl', data.hbl);
      setValue('mbl', data.mbl);
      // setValue('etd', data.etd);
      // setValue('eta', data.eta);
      setValue('qty', data.qty);
      setValue('vessel', data.vessel);
      setValue('gross_weight', data.gross_weight);
      setValue('name_of_goods', data.name_of_goods);
    },
    onError: (err) => {
      toast.error(`Error, ${getErrMessage(err)}`);
    },
  });

  const updatedJOMutation = useMutation({
    mutationFn: JOService.updateById,
    onSuccess: () => {
      qc.invalidateQueries(['jo']);
      toast.success('Success, Job Order has been updated.');
      const { jo_no } = router.query;
      router.push(`/jo/edit/${id}`);
    },
    onError: (err) => {
      toast.error(`Error, ${getErrMessage(err)}`);
    },
  });

  const onSubmit: SubmitHandler<JoSchema> = (data) => {
    if (IS_DEV) {
      console.log('data =>', data);
    }

    updatedJOMutation.mutate({ id, data });

    // resetField('shipper');
    // resetField('consignee');
    // resetField('qty');
    // resetField('hbl');
    // resetField('mbl');
    // resetField('etd');
    // resetField('eta');
    // resetField('vessel');
    // resetField('gross_weight');
    // resetField('volume');
    // resetField('name_of_goods');
  };
  return (
    <div className="ml-3 overflow-hidden">
      {JOQuery.isLoading ? (
        <Loader dark />
      ) : JOQuery.isLoadingError ? (
        <p className="text-red-600">Something went wrong!</p>
      ) : (
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-md border border-graySecondary">
                <div className="flex w-full bg-blueHeaderCard p-2">
                  <Command />
                  {''}
                  <h1>Data Order</h1>
                </div>
                <div className="grid grid-cols-[1fr_2fr] p-4">
                  <div className="grid gap-5">
                    <Label>#No Jo:</Label>
                    <Label>JO Date:</Label>
                    <Label>Type:</Label>
                    <Label>Customer:</Label>
                  </div>

                  <div className="grid gap-2">
                    <Input
                      className="w-full border-none !bg-black px-2 font-normal outline-none placeholder:text-sm placeholder:font-normal placeholder:text-muted-foreground disabled:select-none disabled:bg-muted"
                      disabled
                      placeholder="~AUTO~"
                    />
                    <InputDisable
                      name="jo_date"
                      placeholder={`${dd}-${mm}-${yyyy}`}
                      disabled
                      value={`${dd}-${mm}-${yyyy}`}
                    />
                    <Input
                      placeholder={JOData?.data?.type || 'Loading...'}
                      disabled
                    />
                    <Input
                      name="customer_code"
                      placeholder={JOData?.data?.customer || 'Loading...'}
                      disabled
                    />
                  </div>
                </div>
              </div>
              <div className="rounded-md border border-graySecondary">
                <div className="flex w-full bg-blueHeaderCard p-2">
                  <Command />
                  <h1>Data Quotation</h1>
                </div>

                <div className="grid grid-cols-[1fr_2fr] p-4">
                  <div className="grid gap-5">
                    <Label>Quo No</Label>
                    <Label>Quo Date</Label>
                    <Label>Sales</Label>
                  </div>

                  <div className="grid">
                    <Input
                      placeholder={JOData?.data?.quo_no || 'Loading...'}
                      disabled
                    />
                    <Input placeholder="~AUTO~" disabled />
                    <Input
                      placeholder={JOData?.data?.sales || 'Loading...'}
                      disabled
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 flex gap-3 rounded-md border border-graySecondary p-5">
              <div className="grid gap-8">
                <Label>Shipper</Label>
                <Label>Consignee</Label>
                <Label>ETD</Label>
                <Label>ETA</Label>
                <Label>No. HBL</Label>
                <Label>No. MBL</Label>
                <Label>Vessel</Label>
                <Label>Qty</Label>
                <Label>Gross Weight</Label>
                <Label>Volume</Label>
                <Label>Name of Goods</Label>
              </div>

              <div className="grid">
                <div className="flex gap-2">
                  <InputTextNoErr
                    name="shipper"
                    value={
                      selectedCustomer ? selectedCustomer.partner_name : ''
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
                <InputDate name="etd" />
                <InputDate name="eta" />
                <InputText name="hbl" />
                <InputText name="mbl" />
                <InputText name="vessel" />
                <div className="flex">
                  <InputNumber name="qty" />
                </div>
                <div className="flex gap-3">
                  <InputText name="gross_weight" />
                  KGS
                </div>
                <InputText name="volume" />
                <InputText name="name_of_goods" />
              </div>
            </div>

            <div className="my-3 flex items-center gap-2">
              <Button className="bg-green-500">
                <Link href="/jo">Back</Link>
              </Button>
              <Button
                type="submit"
                disabled={updatedJOMutation.isLoading}
                className="bg-blueLight"
              >
                {updatedJOMutation.isLoading ? 'Loading...' : 'Save'}
              </Button>
              <Button>
                <Link
                  href={`/jo/print/${id}`}
                  target="_blank"
                  className="flex items-center gap-1"
                >
                  <Printer size={15} className="dark:text-white" />
                  Print Job Order
                </Link>
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
                        <TableHead className="hover:!text-white">
                          Port Name
                        </TableHead>
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

            {isPortTwoModalOpen && (
              <div
                style={{ overflow: 'hidden' }}
                className={`modal fixed inset-0 z-50 flex items-center justify-center ${
                  isPortTwoModalOpen ? 'open' : 'closed'
                }`}
              >
                <div className="absolute inset-0 bg-black opacity-75"></div>
                <div className="relative z-10 w-1/3 rounded-lg bg-white p-4 shadow-lg">
                  <Button
                    className="absolute -top-9 right-0 !bg-transparent text-white"
                    onClick={closePortTwoModal}
                  >
                    <h1 className="text-xl">X</h1>
                  </Button>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="hover:!text-white">
                          Port Name
                        </TableHead>
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
                                setSelectedPortTwo(port);
                                closePortTwoModal();
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

            {isPortThreeModalOpen && (
              <div
                style={{ overflow: 'hidden' }}
                className={`modal fixed inset-0 z-50 flex items-center justify-center ${
                  isPortThreeModalOpen ? 'open' : 'closed'
                }`}
              >
                <div className="absolute inset-0 bg-black opacity-75"></div>
                <div className="relative z-10 w-1/3 rounded-lg bg-white p-4 shadow-lg">
                  <Button
                    className="absolute -top-9 right-0 !bg-transparent text-white"
                    onClick={closePortThreeModal}
                  >
                    <h1 className="text-xl">X</h1>
                  </Button>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="hover:!text-white">
                          Port Name
                        </TableHead>
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
                                setSelectedPortThree(port);
                                closePortThreeModal();
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
          </form>
        </FormProvider>
      )}
    </div>
  );
};

export default JoEdit;
