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
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { InferType } from 'yup';

import * as JoService from '@/apis/jo.api';
import { getNextPageParam } from '@/lib/react-query';
import { cn, getErrMessage } from '@/lib/utils';
import yup from '@/lib/yup';
import { Button, buttonVariants } from '@/components/ui/button';
import InputText from '@/components/forms/input-text';
import { Label } from '@radix-ui/react-label';
import { Input } from '@/components/ui/input';
import { Command, Printer, Search } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import InputNumber from '@/components/forms/input-number';

const defaultValues = {
  jo_date: '',
  quo_no: '',
  customer_code: '',
};

const Schema = yup.object({
  jo_date: yup.string().required(),
  quo_no: yup.string().required(),
  customer_code: yup.string().required(),
});

type JoSchema = InferType<typeof Schema>;

export default function JOEdit(quo_no: any) {
  const router = useRouter();
  const qc = useQueryClient();

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
  const { handleSubmit, setValue, watch } = methods;

  const addJOMutation = useMutation({
    mutationFn: JoService.create,
    onSuccess: () => {
      qc.invalidateQueries(['jo']);
      toast.success('Success, jo has been added.');
      router.push('/jo');
    },
    onError: (err) => {
      toast.error(`Error, ${getErrMessage(err)}`);
    },
  });

  const onSubmit: SubmitHandler<JoSchema> = (data) => {
    if (IS_DEV) {
      console.log('data =>', data);
    }

    addJOMutation.mutate(data);
  };

  return (
    <div className="overflow-hidden ml-3">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-2 gap-3">
            <div className="border border-graySecondary rounded-md">
              <div className="flex w-full bg-blueHeaderCard p-2">
                <Command />
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
                    className="!bg-black px-2 font-normal outline-none placeholder:text-sm placeholder:font-normal placeholder:text-muted-foreground disabled:select-none disabled:bg-muted w-full border-none"
                    disabled
                    placeholder="~AUTO~"
                  />
                  <InputText
                    name="jo_date"
                    placeholder={`${dd}-${mm}-${yyyy}`}
                    disabled
                    value={`${dd}-${mm}-${yyyy}`}
                  />
                  <Input placeholder="Import" disabled />
                  <Input
                    name="customer_code"
                    placeholder="PT SARANA MULYA"
                    disabled
                  />
                </div>
              </div>
            </div>
            <div className="border border-graySecondary rounded-md">
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
                  <InputText
                    name="quo_no"
                    disabled
                    value={quo_no}
                    placeholder={quo_no}
                  />
                  <Input placeholder="11-01-2023" disabled />
                  <Input placeholder="Sales" disabled />
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 border border-graySecondary rounded-md mt-5 p-5">
            <div className="grid gap-8">
              <Label>Shipper</Label>
              <Label>Consignee</Label>
              <Label>Loading</Label>
              <Label>Discharge</Label>
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
                <InputText name="shipper" />
                <button
                  className="
                  dark:bg-blueLight bg-graySecondary text-base px-1 mt-1 w-6 h-6
                  rounded-md text-white"
                >
                  <Search className="w-4" />
                </button>
              </div>
              <div className="flex gap-2">
                <InputText name="consignee" />
                <button
                  className="
                  dark:bg-blueLight bg-graySecondary text-base px-1 mt-1 w-6 h-6
                  rounded-md text-white"
                >
                  <Search className="w-4" />
                </button>
              </div>
              <div className="flex gap-2">
                <InputText name="loading" />
                <button
                  className="
                  dark:bg-blueLight bg-graySecondary text-base px-1 mt-1 w-6 h-6
                  rounded-md text-white"
                >
                  <Search className="w-4" />
                </button>
              </div>
              <div className="flex gap-2">
                <InputText name="discharge" />
                <button
                  className="
                  dark:bg-blueLight bg-graySecondary text-base px-1 mt-1 w-6 h-6
                  rounded-md text-white"
                >
                  <Search className="w-4" />
                </button>
              </div>
              <InputText name="etd" />
              <InputText name="eta" />
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

          <div className="flex items-center gap-2 my-3">
            <Button className="bg-green-500">
              <Link href="/jo">Back</Link>
            </Button>
            <Button type="submit" className="bg-blueLight">
              Save
            </Button>
            <Button>
              <Link href="/" className="flex items-center gap-1">
                <Printer size={15} className="dark:text-white" />
                Print Job Order
              </Link>
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
