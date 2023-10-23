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
import { InferType, string } from 'yup';

import * as CostService from '@/apis/cost.api';
import * as quotationService from '@/apis/quotation.api';
import { getNextPageParam } from '@/lib/react-query';
import { cn, getErrMessage } from '@/lib/utils';
import yup from '@/lib/yup';
import CreateCost from '@/components/cost/create';
import InputDate from '@/components/forms/input-date';
import InputHidden from '@/components/forms/input-hidden';
import InputNumber from '@/components/forms/input-number';
import InputSelect from '@/components/forms/input-select';
import InputText from '@/components/forms/input-text';
import InputTextNoErr from '@/components/forms/input-text-noerr';
import TextareaN from '@/components/inputs/rhf/input-text-area';
import InputTextArea from '@/components/inputs/rhf/input-text-area';
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
  sales: '',
  subject: '',
  customer: '',
  attn: '',
  type: '',
  delivery: '',
  loading: '',
  discharge: '',
  kurs: '',
  valheader: '',
  valfooter: '',
  item_cost: '',
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
  valheader: yup.string().required(),
  valfooter: yup.string().required(),
  item_cost: yup.string().required(),
});

type QuotationSchema = InferType<typeof Schema>;

type QuotationEditProps = {
  id: string;
};
const QuotationEdit: React.FC<QuotationEditProps> = ({ id }) => {
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
  const [createdItemCost, setCreatedItemCost] = useState('');
  const [itemCostValue, setItemCostValue] = useState('');
  const [submittedItemCost, setSubmittedItemCost] = useState('');
  // const handleCostCreated = (newItemCost: any) => {
  //   setCreatedItemCost(newItemCost);

  //   setValue('item_cost', newItemCost);
  // };

  const handleCostCreated = (newItemCost: { data: { item_cost: string } }) => {
    setValue('item_cost', newItemCost.data.item_cost);

    setItemCostValue(newItemCost.data.item_cost);

    // Set data cost yang baru saja dibuat
    setCreatedItemCost(newItemCost.data.item_cost);

    const itemCost = newItemCost.data.item_cost;
  };

  const [headerText, setHeaderText] = useState(
    'We are pleased to quote you the following :'
  );
  const [footerText, setFooterText] = useState(
    'Will be happy to supply and any further information you may need and trust that you call on us to fill your order which will receive our prompt and careful attention.'
  );

  const [selectedPort, setSelectedPort] = useState<Port | null>(null);
  const [selectedPortTwo, setSelectedPortTwo] = useState<Port | null>(null);
  const { handleSubmit, setValue, watch, register } = methods;
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
  const quotationQuery = useQuery({
    queryKey: ['quotation'],
    queryFn: () => quotationService.getById(id),
    onSuccess: ({ data }) => {
      setValue('sales', data.sales);
      setValue('subject', data.subject);
      setValue('customer', data.customer);
      setValue('attn', data.attn);
      setValue('type', data.type);
      setValue('delivery', data.delivery);
      setValue('kurs', data.kurs);
      setValue('loading', data.loading);
      setValue('discharge', data.discharge);
      setValue('valheader', data.valheader);
      setValue('valfooter', data.valfooter);
      setValue('loading', data.loading);
    },
    onError: (err) => {
      toast.error(`Error, ${getErrMessage(err)}`);
    },
  });

  const updatedQuotationMutation = useMutation({
    mutationFn: quotationService.updateById,
    onSuccess: () => {
      qc.invalidateQueries(['quotation']);
      toast.success('Success, Quotation has been updated.');
      router.push('/quotation');
    },
    onError: (err) => {
      toast.error(`Error, ${getErrMessage(err)}`);
    },
  });

  async function fetchCostData() {
    try {
      const response = await fetch('http://localhost:8089/api/cost');
      if (!response.ok) {
        throw new Error('Failed to fetch customer data');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching customer data:', error);
      return [];
    }
  }

  useEffect(() => {
    fetchCostData()
      .then((costData) => {
        if (costData.length > 0) {
          const firstItemCost = costData[0].item_cost;
          setValue('item_cost', firstItemCost);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, []);

  const onSubmit: SubmitHandler<QuotationSchema> = (data) => {
    if (IS_DEV) {
      console.log('data =>', data);
    }

    updatedQuotationMutation.mutate({ id, data });
    const itemCostValue = data.item_cost;
    console.log('item_cost value submitted:', data.item_cost);
  };

  return (
    <div className="ml-3 overflow-hidden">
      <div className="mb-4 flex gap-3 ">
        <Command className="text-blueLight" />
        <h1 className="">Edit Quotation</h1>
      </div>
      {quotationQuery.isLoading ? (
        <Loader dark />
      ) : quotationQuery.isLoadingError ? (
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
                      <Label>Quo No :</Label>
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
                        name="quo_no"
                        className="w-[300px] border-none !bg-black px-2 font-normal outline-none placeholder:text-sm placeholder:font-normal placeholder:text-muted-foreground  disabled:select-none disabled:bg-muted"
                        disabled
                        placeholder={`${id}`}
                      />
                      <Input
                        name="createdAt"
                        className="w-[300px] border-none !bg-black px-2 font-normal outline-none placeholder:text-sm placeholder:font-normal placeholder:text-muted-foreground  disabled:select-none disabled:bg-muted"
                        disabled
                        placeholder="~AUTO~"
                        value="2023-10-05T03:17:44.892Z"
                      />
                      <InputText name="sales" mandatory />
                      <InputText name="subject" mandatory />
                      <div className="flex gap-2">
                        <InputText
                          name="customer"
                          mandatory
                          value={
                            selectedCustomer
                              ? selectedCustomer.partner_name
                              : ''
                          }
                        />
                        <button
                          type="button"
                          className="
                  mt-1 h-6 w-6 rounded-md bg-graySecondary px-1 text-base
                  text-white dark:bg-blueLight"
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
                          type="button"
                          className="
                  InputTextNoErr mt-1 h-6 w-6 rounded-md bg-graySecondary px-1 text-base
                  text-white dark:bg-blueLight"
                          onClick={openPortModal}
                        >
                          <Search className="w-4" />
                        </button>
                      </div>

                      <div className="flex gap-2">
                        <InputTextNoErr
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
                      <InputNumber name="kurs" mandatory />
                      <div>
                        <InputText name="item_cost" value={itemCostValue} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/*  */}
              <div className="block gap-2 rounded-sm shadow-md shadow-black dark:bg-graySecondary/50">
                <div className="mb-5 flex h-max gap-3 bg-blueHeaderCard p-2 text-white dark:bg-secondDarkBlue">
                  <Command className="text-white" />
                  <h1> Data Quotation</h1>
                </div>

                <div className="px-3">
                  <div className="mb-5 flex gap-2">
                    <Label>Header: </Label>
                    <div className="w-full">
                      <InputTextArea mandatory name="valheader" />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Label>Footer:</Label>
                    <div className="w-full">
                      <InputTextArea mandatory name="valfooter" />
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
                disabled={updatedQuotationMutation.isLoading}
                className="bg-blueLight"
              >
                {updatedQuotationMutation.isLoading ? 'Loading...' : 'Save'}
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

      <CreateCost onCostCreated={setItemCostValue} />
    </div>
  );
};

export default QuotationEdit;
