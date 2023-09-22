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
});

type QuotationSchema = InferType<typeof Schema>;

export default function QuotationAdd() {
  const router = useRouter();
  const qc = useQueryClient();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const methods = useForm<QuotationSchema>({
    mode: 'all',
    defaultValues,
    resolver: yupResolver(Schema),
  });
  const { handleSubmit, setValue, watch } = methods;

  const addQuotationMutation = useMutation({
    mutationFn: quotationService.create,
    onSuccess: () => {
      qc.invalidateQueries(['quotation']);
      toast.success('Success, Quotation has been added.');
      router.push('/inbounds');
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
            <div className="grid gap-2 dark:bg-graySecondary/50 rounded-sm">
              <div className="flex gap-3 bg-blueHeaderCard text-white dark:bg-secondDarkBlue mb-5 p-0">
                <Command className="text-white" />
                <h1> Data Quotation</h1>
              </div>

              <div className="px-3 grid gap-3">
                <div className="grid grid-cols-[1fr_2fr]">
                  <Label>#Quote No :</Label>
                  <InputText placeholder="~Auto" name="quo_no" />
                </div>
                <div className="grid grid-cols-[1fr_2fr]">
                  <Label>Date :</Label>
                  <InputText placeholder="~Auto~" name="date" />
                  {/* <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
              /> */}
                </div>
                <div className="grid grid-cols-[1fr_2fr]">
                  <Label>Sales :</Label>
                  <InputText name="sales" mandatory />
                </div>
                <div className="grid grid-cols-[1fr_2fr]">
                  <Label>Subject :</Label>
                  <InputText name="subject" mandatory />
                </div>
                <div className="grid grid-cols-3">
                  <Label>Customer :</Label>
                  <InputText name="customer" mandatory />
                  <Search className="bg-lightWhite text-base" />
                </div>
                <div className="grid grid-cols-[1fr_2fr]">
                  <Label>Attn :</Label>
                  <InputText name="attn" mandatory />
                </div>
                <div className="grid grid-cols-[1fr_2fr]">
                  <Label>Type :</Label>
                  <InputText name="type" mandatory />
                </div>
                <div className="grid grid-cols-[1fr_2fr]">
                  <Label>Delivery :</Label>
                  <InputText name="delivery" mandatory />
                </div>
                <div className="grid grid-cols-3">
                  <Label>Loading :</Label>
                  <InputText name="loading" mandatory />
                  <Search className="bg-lightWhite text-base" />
                </div>
                <div className="grid grid-cols-3">
                  <Label>Discharge :</Label>
                  <InputText name="discharge" mandatory />
                  <Search className="bg-lightWhite text-base" />
                </div>
                <div className="grid grid-cols-[1fr_2fr]">
                  <Label>Kurs</Label>
                  <InputText name="kurs" mandatory />
                </div>
              </div>
            </div>

            <div className="grid gap-2 dark:bg-graySecondary/50 rounded-sm shadow-md shadow-black relative">
              <div className="flex gap-3 bg-blueHeaderCard max-h-6 text-white dark:bg-secondDarkBlue p-0">
                <Command className="text-white" />
                <h1> Data Quotation</h1>
              </div>

              <div className="px-3 absolute top-14 w-full h-full">
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
            <Button className="bg-graySecondary">Back</Button>
            <Button
              type="submit"
              disabled={addQuotationMutation.isLoading}
              className="bg-green-600"
            >
              {addQuotationMutation.isLoading ? 'Loading...' : 'Save'}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
