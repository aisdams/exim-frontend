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
import { Command, Search } from 'lucide-react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { InferType } from 'yup';

import * as JoService from '@/apis/jo.api';
import * as QuotationService from '@/apis/quotation.api';
import { axios } from '@/lib/axios';
import { getNextPageParam } from '@/lib/react-query';
import { cn, getErrMessage } from '@/lib/utils';
import yup from '@/lib/yup';
import InputDisable from '@/components/form/input-disable';
import InputHidden from '@/components/form/input-hidden';
import InputText from '@/components/form/input-text';
import { Button, buttonVariants } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
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

type JoCreateProps = {
  id: string;
};

const JoCreate: React.FC<JoCreateProps> = ({ id }) => {
  const router = useRouter();
  const qc = useQueryClient();

  const fetchQuotationData = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:8089/api/quotation/${id}`);
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error('Get Data');
    }
  };
  const { data: quotationData } = useQuery(['quotation', id], () =>
    fetchQuotationData(id)
  );

  // console.log(quotationData?.data.customer_code);

  // get data success
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
    addJOMutation.mutate(data);
  };

  return (
    <div className="ml-3 overflow-hidden">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-3 lg:mt-5 lg:grid-cols-2">
            <div className="rounded-md border border-graySecondary">
              <div className="mb-5 flex gap-3 bg-blueHeaderCard p-2 text-white">
                <Command className="text-white" />
                <h1>Data Order</h1>
              </div>
              <div className="grid grid-cols-[1fr_2fr] p-4">
                <div className="grid gap-5">
                  <Label>No Jo:</Label>
                  <Label>JO Date:</Label>
                  <Label>Type:</Label>
                </div>

                <div className="grid gap-2">
                  <Input
                    className="w-full border border-secondDarkBlue/80 px-2 font-normal outline-none placeholder:text-sm placeholder:font-normal placeholder:text-muted-foreground disabled:select-none disabled:bg-muted dark:border-none dark:!bg-black"
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
                    placeholder={quotationData?.data?.type || 'Loading...'}
                    disabled
                    className="w-full border border-secondDarkBlue/80 px-2 font-normal outline-none placeholder:text-sm placeholder:font-normal placeholder:text-muted-foreground disabled:select-none disabled:bg-muted dark:border-none dark:!bg-black"
                  />
                  <InputHidden
                    name="customer_code"
                    disabled
                    placeholder={
                      quotationData?.data?.customer_code || 'Loading...'
                    }
                    value={quotationData?.data?.customer_code || 'Loading...'}
                  />
                </div>
              </div>
            </div>
            <div className="rounded-md border border-graySecondary">
              <div className="mb-5 flex gap-3 bg-blueHeaderCard p-2 text-white">
                <Command className="text-white" />
                <h1>Data Quotation</h1>
              </div>

              <div className="grid grid-cols-[1fr_2fr] p-4">
                <div className="grid gap-5">
                  <Label>Quo No</Label>
                  <Label>Quo Date</Label>
                  <Label>Sales</Label>
                </div>

                <div className="grid">
                  <InputDisable
                    name="quo_no"
                    placeholder={id}
                    value={id}
                    disabled
                  />
                  <Input
                    placeholder={quotationData?.data?.createdAt || 'Loading...'}
                    disabled
                    className="w-full border border-secondDarkBlue/80 px-2 font-normal outline-none placeholder:text-sm placeholder:font-normal placeholder:text-muted-foreground disabled:select-none disabled:bg-muted dark:border-none dark:!bg-black"
                  />
                  <Input
                    placeholder={quotationData?.data?.sales || 'Loading...'}
                    disabled
                    className="w-full border border-secondDarkBlue/80 px-2 font-normal outline-none placeholder:text-sm placeholder:font-normal placeholder:text-muted-foreground disabled:select-none disabled:bg-muted dark:border-none dark:!bg-black"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-5 flex items-center gap-2">
            <Button
              className="bg-graySecondary"
              onClick={() => router.back()}
              type="button"
            >
              Back
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
  );
};

export default JoCreate;
