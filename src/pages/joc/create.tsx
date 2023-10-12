import React, { useEffect, useState } from 'react';
import InputText from '@/components/forms/input-text';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Command, Search } from 'lucide-react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { InferType } from 'yup';
import { IS_DEV } from '@/constants';
import { yupResolver } from '@hookform/resolvers/yup';
import { getNextPageParam } from '@/lib/react-query';
import { cn, getErrMessage } from '@/lib/utils';
import * as JOCService from '@/apis/joc.api';
import yup from '@/lib/yup';
import { useRouter } from 'next/router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import InputSelect from '@/components/forms/input-select';
import { Textarea } from '@/components/ui/textarea';
import InputDisable from '@/components/forms/input-disable';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Customer, Port } from '@/types';
import Link from 'next/link';

const defaultValues = {
  no_mbl: '',
  type: '',
  vessel: '',
  agent: '',
  no_container: '',
  loading: '',
  discharge: '',
  etd: '',
  eta: '',
};

const Schema = yup.object({
  no_mbl: yup.string().required(),
  type: yup.string().required(),
  vessel: yup.string().required(),
  agent: yup.string().required(),
  no_container: yup.string().required(),
  loading: yup.string().required(),
  discharge: yup.string().required(),
  etd: yup.string().required(),
  eta: yup.string().required(),
});

type JOCSchema = InferType<typeof Schema>;

export default function create() {
  const router = useRouter();
  const qc = useQueryClient();
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isPortModalOpen, setIsPortModalOpen] = useState(false);
  const [isPortTwoModalOpen, setIsPortTwoModalOpen] = useState(false);
  const [customerData, setCustomerData] = useState<Customer[]>([]);
  const [PortData, setPortData] = useState<Port[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [selectedPort, setSelectedPort] = useState<Port | null>(null);
  const [selectedPortTwo, setSelectedPortTwo] = useState<Port | null>(null);

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

  const methods = useForm<JOCSchema>({
    mode: 'all',
    defaultValues,
    resolver: yupResolver(Schema),
  });
  const { handleSubmit, setValue, watch } = methods;

  const addJOCMutation = useMutation({
    mutationFn: JOCService.create,
    onSuccess: () => {
      qc.invalidateQueries(['joc']);
      toast.success('Success, JOC has been added.');
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

    addJOCMutation.mutate(data);
  };

  return (
    <div className="overflow-hidden">
      <div className="flex">
        <Command />
        <h1>Data Consolidation</h1>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-2 gap-3 mt-10">
            <div className="grid gap-2 dark:bg-graySecondary/50 rounded-sm h-max pb-[4rem]">
              <div className="flex gap-3 bg-blueHeaderCard text-white dark:bg-secondDarkBlue mb-5 p-2">
                <Command className="text-white" />
                <h1> Data JOC</h1>
              </div>

              <div className="px-3 grid gap-3">
                <div className="grid grid-cols-[1fr_2fr]">
                  <div className="grid gap-5">
                    <Label>Type : </Label>
                    <Label>No MBL :</Label>
                    <Label>Vessel :</Label>
                    <Label>Agent :</Label>
                    <Label>Loading :</Label>
                  </div>
                  <div className="grid gap-2">
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
                    <InputText name="no_mbl" mandatory />
                    <InputText name="vessel" mandatory />
                    <div className="flex gap-2">
                      <InputText
                        name="agent"
                        value={
                          selectedCustomer ? selectedCustomer.partner_name : ''
                        }
                      />
                      <button
                        className="
                  dark:bg-blueLight bg-graySecondary text-base px-1 mt-1 w-6 h-6
                  rounded-md text-white"
                        onClick={openCustomerModal}
                      >
                        <Search className="w-4" />
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <InputText
                        name="loading"
                        value={selectedPort ? selectedPort.port_name : ''}
                      />
                      <button
                        className="
                  dark:bg-blueLight bg-graySecondary text-base px-1 mt-1 w-6 h-6
                  rounded-md text-white"
                        onClick={openPortModal}
                      >
                        <Search className="w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-2 dark:bg-graySecondary/50 rounded-sm h-max pb-[4rem]">
              <div className="flex gap-3 bg-blueHeaderCard text-white dark:bg-secondDarkBlue mb-5 p-2">
                <Command className="text-white" />
                <h1> Data Consolidation</h1>
              </div>

              <div className="px-3 grid gap-3">
                <div className="grid grid-cols-[1fr_2fr]">
                  <div className="grid gap-5">
                    <Label>Discharge :</Label>
                    <Label>ETD :</Label>
                    <Label>ETA :</Label>
                    <Label>No Container :</Label>
                  </div>
                  <div className="grid gap-2">
                    <div className="flex gap-2">
                      <InputText
                        name="discharge"
                        value={selectedPortTwo ? selectedPortTwo.port_name : ''}
                      />
                      <button
                        className="
                  dark:bg-blueLight bg-graySecondary text-base px-1 mt-1 w-6 h-6
                  rounded-md text-white"
                        onClick={openPortTwoModal}
                      >
                        <Search className="w-4" />
                      </button>
                    </div>
                    <InputText name="etd" />
                    <InputText name="eta" />
                    <InputSelect
                      name="no_container"
                      options={[
                        {
                          value: '20FR',
                          label: '20FR',
                        },
                        {
                          value: '30FR',
                          label: '30FR',
                        },
                        {
                          value: '40FR',
                          label: '50FR',
                        },
                      ]}
                    />
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
              disabled={addJOCMutation.isLoading}
              className="bg-blueLight"
            >
              {addJOCMutation.isLoading ? 'Loading...' : 'Save'}
            </Button>
          </div>

          {isCustomerModalOpen && (
            <div
              style={{ overflow: 'hidden' }}
              className={`fixed inset-0 flex items-center justify-center z-50 modal ${
                isCustomerModalOpen ? 'open' : 'closed'
              }`}
            >
              <div className="absolute inset-0 bg-black opacity-75"></div>
              <div className="z-10 bg-white p-4 rounded-lg shadow-lg w-1/3 relative">
                <Button
                  className="absolute -top-9 right-0 text-white !bg-transparent"
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
                        <TableCell className="!w-2 !h-2 rounded-md">
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
              className={`fixed inset-0 flex items-center justify-center z-50 modal ${
                isPortModalOpen ? 'open' : 'closed'
              }`}
            >
              <div className="absolute inset-0 bg-black opacity-75"></div>
              <div className="z-10 bg-white p-4 rounded-lg shadow-lg w-1/3 relative">
                <Button
                  className="absolute -top-9 right-0 text-white !bg-transparent"
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
                        <TableCell className="!w-2 !h-2 rounded-md">
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
              className={`fixed inset-0 flex items-center justify-center z-50 modal ${
                isPortTwoModalOpen ? 'open' : 'closed'
              }`}
            >
              <div className="absolute inset-0 bg-black opacity-75"></div>
              <div className="z-10 bg-white p-4 rounded-lg shadow-lg w-1/3 relative">
                <Button
                  className="absolute -top-9 right-0 text-white !bg-transparent"
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
                        <TableCell className="!w-2 !h-2 rounded-md">
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
    </div>
  );
}
