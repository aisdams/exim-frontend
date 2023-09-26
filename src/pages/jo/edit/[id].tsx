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
import { Command, Search } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

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

export default function JOEdit() {
  const router = useRouter();
  const qc = useQueryClient();
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
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
                  <InputText name="jo_no" placeholder="~Auto~" />
                  <InputText name="jo_date" placeholder="25-09-2023" />
                  <InputText name="quo_no" placeholder="" />
                  <InputText name="customer_code" placeholder="" />
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
                  <Input placeholder="QUO-2300001" />
                  <Input placeholder="11-01-2023" />
                  <Input placeholder="Sales" />
                </div>
              </div>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
