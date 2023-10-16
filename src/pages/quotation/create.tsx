import { useEffect, useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { format } from 'date-fns';
import { IS_DEV } from '@/constants';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDebouncedValue } from '@mantine/hooks';
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { InferType } from 'yup';

import * as quotationService from '@/apis/quotation.api';
import { getNextPageParam } from '@/lib/react-query';
import { cn, getErrMessage } from '@/lib/utils';
import yup from '@/lib/yup';
import { Button, buttonVariants } from '@/components/ui/button';
import InputText from '@/components/forms/input-text';
import { Label } from '@radix-ui/react-label';
import { Input } from '@/components/ui/input';
import { Command, Search } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import InputDate from '@/components/forms/input-date';
import InputNumber from '@/components/forms/input-number';
import InputSelect from '@/components/forms/input-select';

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

const defaultValues = {
  sales: '',
  subject: '',
  customer: '',
  attn: '',
  type: '',
  delivery: '',
  loading: '',
  discharge: '',
  kurs: '',
};

const Schema = yup.object({
  sales: yup.string().required(),
  subject: yup.string().required(),
  customer: yup.string().required(),
  attn: yup.string().required(),
  type: yup.string().required(),
  delivery: yup.string().required(),
  loading: yup.string().required(),
  discharge: yup.string().required(),
  kurs: yup.string().required(),
});

type QuotationSchema = InferType<typeof Schema>;

export default function QuotationAdd() {
  const router = useRouter();
  const qc = useQueryClient();
  const methods = useForm<QuotationSchema>({
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
  const [headerText, setHeaderText] = useState(
    'We are pleased to quote you the following :'
  );
  const [footerText, setFooterText] = useState(
    'Will be happy to supply and any further information you may need and trust that you call on us to fill your order which will receive our prompt and careful attention.'
  );
  const [selectedPort, setSelectedPort] = useState<Port | null>(null);
  const [selectedPortTwo, setSelectedPortTwo] = useState<Port | null>(null);
  const { handleSubmit, setValue, watch } = methods;

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

  const addQuotationMutation = useMutation({
    mutationFn: quotationService.create,
    onSuccess: () => {
      qc.invalidateQueries(['quotation']);
      toast.success('Success, Quotation has been added.');
      router.push('/quotation');
    },
    onError: (err) => {
      toast.error(`Error, ${getErrMessage(err)}`);
    },
  });

  const onSubmit: SubmitHandler<QuotationSchema> = (data) => {
    if (IS_DEV) {
      console.log('data =>', data);
    }

    addQuotationMutation.mutate(data);
  };

  return (
    <div className="overflow-hidden ml-3">
      <div className="mb-4 flex gap-3 ">
        <Command className="text-blueLight" />
        <h1 className="">Add Quotation</h1>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2 dark:bg-graySecondary/50 rounded-sm pb-4">
              <div className="flex gap-3 bg-blueHeaderCard text-white dark:bg-secondDarkBlue mb-5 p-2">
                <Command className="text-white" />
                <h1> Data Quotation</h1>
              </div>

              <div className="px-3 grid gap-3">
                <div className="grid grid-cols-[1fr_2fr]">
                  <div className="grid gap-5">
                    <Label>Date :</Label>
                    <Label>Sales :</Label>
                    <Label>Subject :</Label>
                    <Label>Customer :</Label>
                    <Label>Attn :</Label>
                    <Label>Type :</Label>
                    <Label>Delivery :</Label>
                    <Label>Loading :</Label>
                    <Label>Discharge :</Label>
                    <Label>Kurs :</Label>
                  </div>
                  <div className="grid gap-2">
                    <Input
                      name="createdAt"
                      className="border border-black dark:!bg-black bg-transparent px-2 font-normal outline-none placeholder:text-sm placeholder:font-normal placeholder:text-black dark:placeholder:text-muted-foreground disabled:select-none disabled:bg-muted w-[300px] dark:border-none"
                      disabled
                      placeholder="~AUTO~"
                      // value="2023-10-05T03:17:44.892Z"
                    />
                    <InputText name="sales" mandatory />
                    <InputText name="subject" mandatory />
                    <div className="flex gap-2">
                      <InputText
                        name="customer"
                        mandatory
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
                    <InputText name="attn" mandatory />
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
                    <InputSelect
                      name="delivery"
                      options={[
                        {
                          value: 'FCL',
                          label: 'FCL',
                        },
                        {
                          value: 'LCL',
                          label: 'LCL',
                        },
                      ]}
                    />
                    <div className="flex gap-2">
                      <InputText
                        name="loading"
                        mandatory
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

                    <div className="flex gap-2">
                      <InputText
                        name="discharge"
                        mandatory
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
                    <InputNumber name="kurs" mandatory />
                  </div>
                </div>
              </div>
            </div>

            <div className="block gap-2 dark:bg-graySecondary/50 rounded-sm shadow-md shadow-black">
              <div className="flex gap-3 bg-blueHeaderCard text-white dark:bg-secondDarkBlue mb-5 p-2 h-max">
                <Command className="text-white" />
                <h1> Data Quotation</h1>
              </div>

              <div className="px-3">
                <div className="flex gap-2 mb-5">
                  <Label>Header: </Label>
                  <Textarea
                    className="header h-32"
                    value={headerText}
                    onChange={(e) => setHeaderText(e.target.value)}
                  />
                </div>

                <div className="flex gap-2">
                  <Label>Footer:</Label>
                  <Textarea
                    className="footer h-32"
                    value={footerText}
                    onChange={(e) => setFooterText(e.target.value)}
                  />
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
              disabled={addQuotationMutation.isLoading}
              className="bg-blueLight"
            >
              {addQuotationMutation.isLoading ? 'Loading...' : 'Save'}
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
