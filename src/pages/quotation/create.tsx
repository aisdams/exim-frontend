import { useEffect, useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import Link from 'next/link';
import { useRouter } from 'next/router';
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

interface Customer {
  item_cost: string;
  item_name: string;
  unit: string;
}

const defaultValues = {
  sales: '',
  subject: '',
  attn: '',
  type: '',
  delivery: '',
  kurs: '',
  status: '',
  loading: '',
  discharge: '',
  customer_code: '',
  item_cost: '',
  port_code: '',
};

const Schema = yup.object({
  sales: yup.string().required(),
  subject: yup.string().required(),
  attn: yup.string().required(),
  type: yup.string().required(),
  delivery: yup.string().required(),
  kurs: yup.string().required(),
  status: yup.string().required(),
  loading: yup.string().required(),
  discharge: yup.string().required(),
  customer_code: yup.string().required(),
  item_cost: yup.string().required(),
  port_code: yup.string().required(),
});

type QuotationSchema = InferType<typeof Schema>;

export default function QuotationAdd() {
  const router = useRouter();
  const qc = useQueryClient();
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isPortModalOpen, setIsPortModalOpen] = useState(false);
  const [customerData, setCustomerData] = useState<Customer[]>([]);
  const methods = useForm<QuotationSchema>({
    mode: 'all',
    defaultValues,
    resolver: yupResolver(Schema),
  });
  const { handleSubmit, setValue, watch } = methods;
  const openCustomerModal = () => {
    setIsCustomerModalOpen(true);

    fetch('http://localhost:8089/api/customer')
      .then((response) => response.json())
      .then((data) => {
        console.log('Data Pelanggan:', data);
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
        console.log('Data Port:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const closeCustomerModal = () => {
    setIsCustomerModalOpen(false);
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
                    <InputText placeholder="~Auto~" name="date" />
                    <InputText name="sales" mandatory />
                    <InputText name="subject" mandatory />
                    <div className="flex gap-2">
                      <InputText name="customer" mandatory />
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
                    <InputText name="type" mandatory />
                    <InputText name="delivery" mandatory />
                    <div className="flex gap-2">
                      <InputText name="loading" mandatory />
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
                      <InputText name="discharge" mandatory />
                      <Search
                        className="
                  dark:bg-blueLight bg-graySecondary text-base px-1 mt-1
                  rounded-md text-white"
                      />
                    </div>
                    <InputText name="kurs" mandatory />
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
                    value="We are pleased to quote you the following :"
                  />{' '}
                </div>

                <div className="flex gap-2">
                  <Label>Footer: </Label>
                  <Textarea
                    className="footer h-32"
                    value="Will be happy to supply and any further information you may need and trust that you call on us to fill your order which will receive our prompt and careful attention. "
                  />{' '}
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
              className="bg-green-600"
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
                      <TableRow key={customer.item_cost}>
                        <TableCell className="font-medium">
                          {customer.item_name}
                        </TableCell>
                        <TableCell className="font-medium">
                          {customer.unit}
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
