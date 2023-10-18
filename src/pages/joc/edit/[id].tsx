import { ParsedUrlQuery } from 'querystring';
import { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { IS_DEV } from '@/constants';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDebouncedValue } from '@mantine/hooks';
import { Label } from '@radix-ui/react-label';
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { format } from 'date-fns';
import { Command, Search } from 'lucide-react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { InferType } from 'yup';

import * as JOCService from '@/apis/joc.api';
import { getNextPageParam } from '@/lib/react-query';
import { cn, getErrMessage } from '@/lib/utils';
import yup from '@/lib/yup';
import InputDate from '@/components/forms/input-date';
import InputHidden from '@/components/forms/input-hidden';
import InputNumber from '@/components/forms/input-number';
import InputSelect from '@/components/forms/input-select';
import InputText from '@/components/forms/input-text';
import Loader from '@/components/table/loader';
import { Button, buttonVariants } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
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

interface Customer {
  customer_code: string;
  partner_name: string;
  unit: string;
}

interface Port {
  port_code: string;
  port_name: string;
  caption: string;
}

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

const defaultValues = {
  type: '',
  vessel: '',
  loading: '',
  discharge: '',
  no_container: '',
  jo_no: '',
};

const Schema = yup.object({
  type: yup.string().required(),
  vessel: yup.string().required(),
  loading: yup.string().required(),
  discharge: yup.string().required(),
  no_container: yup.string().required(),
  jo_no: yup.string().required(),
});

type JOCSchema = InferType<typeof Schema>;

type JOCEditProps = {
  id: string;
};
const JOCEdit: React.FC<JOCEditProps> = ({ id }) => {
  const router = useRouter();
  const qc = useQueryClient();
  const methods = useForm<JOCSchema>({
    mode: 'all',
    defaultValues,
    resolver: yupResolver(Schema),
  });
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isPortModalOpen, setIsPortModalOpen] = useState(false);
  const [isPortTwoModalOpen, setIsPortTwoModalOpen] = useState(false);
  const [customerData, setCustomerData] = useState<Customer[]>([]);
  const [PortData, setPortData] = useState<Port[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [createdItemCost, setCreatedItemCost] = useState('');
  const [selectedPort, setSelectedPort] = useState<Port | null>(null);
  const [selectedPortTwo, setSelectedPortTwo] = useState<Port | null>(null);
  const { handleSubmit, setValue, watch } = methods;
  const openCustomerModal = () => {
    setIsCustomerModalOpen(true);

    fetch('http://localhost:8089/api/customer')
      .then((response) => response.json())
      .then((data) => {
        console.log('Data Pelanggan:', data.data);
        setCustomerData(data.data);
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
        console.log('Data Port:', data.data);
        setPortData(data.data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
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

  const closeCustomerModal = () => {
    setIsCustomerModalOpen(false);
  };

  const closePortModal = () => {
    setIsPortModalOpen(false);
  };

  const closePortTwoModal = () => {
    setIsPortTwoModalOpen(false);
  };

  //! get quotation By Id
  const jocQuery = useQuery({
    queryKey: ['joc'],
    queryFn: () => JOCService.getById(id),
    onSuccess: ({ data }) => {
      if (data.type !== undefined) {
        setValue('type', data.type);
      } else {
      }
      setValue('vessel', data.vessel);
      setValue('loading', data.loading);
      setValue('discharge', data.discharge);
      setValue('no_container', data.no_container);
    },
    onError: (err) => {
      toast.error(`Error, ${getErrMessage(err)}`);
    },
  });

  const updatedJOCMutation = useMutation({
    mutationFn: JOCService.updateById,
    onSuccess: () => {
      qc.invalidateQueries(['joc']);
      toast.success('Success, JOC has been updated.');
      router.push('/joc');
    },
    onError: (err) => {
      toast.error(`Error, ${getErrMessage(err)}`);
    },
  });

  const onSubmit: SubmitHandler<JOCSchema> = (data) => {
    if (IS_DEV) {
      console.log('data =>', data);
    }

    updatedJOCMutation.mutate({ id, data });
  };

  return (
    <div className="ml-3 overflow-hidden">
      <div className="mb-4 flex gap-3 ">
        <Command className="text-blueLight" />
        <h1 className="">Edit JOC</h1>
      </div>
      {jocQuery.isLoading ? (
        <Loader dark />
      ) : jocQuery.isLoadingError ? (
        <p className="text-red-600">Something went wrong!</p>
      ) : (
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
                      <Label>JOC NO :</Label>
                      <Label>Date :</Label>
                      <Label>Types :</Label>
                      <Label>Vessel :</Label>
                    </div>
                    <div className="grid gap-2">
                      <Input
                        name="joc_no"
                        className="w-[300px] border-none !bg-black px-2 font-normal outline-none placeholder:text-sm placeholder:font-normal placeholder:text-muted-foreground  disabled:select-none disabled:bg-muted"
                        disabled
                        placeholder={`${id}`}
                      />
                      <Input
                        name="createdAt"
                        className="w-[300px] border-none !bg-black px-2 font-normal outline-none placeholder:text-sm placeholder:font-normal placeholder:text-muted-foreground  disabled:select-none disabled:bg-muted"
                        disabled
                        placeholder="~AUTO~"
                      />
                      <InputSelect
                        name="type"
                        options={[
                          {
                            value: 'Import',
                            label: 'Import',
                          },
                          {
                            value: 'Export',
                            label: 'Export',
                          },
                          {
                            value: 'Domestik',
                            label: 'Domestik',
                          },
                        ]}
                      />
                      <InputText name="vessel" mandatory />
                    </div>
                  </div>
                </div>
              </div>
              {/*  */}
              <div className="grid gap-2 rounded-sm pb-4 dark:bg-graySecondary/50">
                <div className="mb-5 flex gap-3 bg-blueHeaderCard p-2 text-white dark:bg-secondDarkBlue">
                  <Command className="text-white" />
                  <h1> Data Quotation</h1>
                </div>

                <div className="grid gap-3 px-3">
                  <div className="grid grid-cols-[1fr_2fr]">
                    <div className="grid gap-5">
                      <Label>Loading :</Label>
                      <Label>Discharge :</Label>
                      <Label>no_container :</Label>
                    </div>
                    <div className="grid gap-2">
                      <div className="flex gap-2">
                        <InputText
                          name="loading"
                          mandatory
                          value={selectedPort ? selectedPort.port_name : ''}
                        />
                        <button
                          type="button"
                          className="
                  mt-1 h-6 w-6 rounded-md bg-graySecondary px-1 text-base
                  text-white dark:bg-blueLight"
                          onClick={openPortModal}
                        >
                          <Search className="w-4" />
                        </button>
                      </div>

                      <div className="flex gap-2">
                        <InputText
                          name="discharge"
                          mandatory
                          value={
                            selectedPortTwo ? selectedPortTwo.port_name : ''
                          }
                        />
                        <button
                          type="button"
                          className="
                  mt-1 h-6 w-6 rounded-md bg-graySecondary px-1 text-base
                  text-white dark:bg-blueLight"
                          onClick={openPortTwoModal}
                        >
                          <Search className="w-4" />
                        </button>
                      </div>

                      <InputText name="no_container" mandatory />
                      <InputText name="jo_no" mandatory />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Buttons */}
            <div className="flex items-center gap-2">
              <Button className="bg-graySecondary">
                <Link href="/quotation">Back</Link>
              </Button>
              <Button
                type="submit"
                disabled={updatedJOCMutation.isLoading}
                className="bg-blueLight"
              >
                {updatedJOCMutation.isLoading ? 'Loading...' : 'Save'}
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
          </form>
        </FormProvider>
      )}
    </div>
  );
};

export default JOCEdit;
