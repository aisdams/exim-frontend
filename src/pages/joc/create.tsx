import React, { useState } from 'react';
import InputText from '@/components/forms/input-text';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Command } from 'lucide-react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { InferType } from 'yup';
import { IS_DEV } from '@/constants';
import { yupResolver } from '@hookform/resolvers/yup';
import { getNextPageParam } from '@/lib/react-query';
import { cn, getErrMessage } from '@/lib/utils';
import * as JoService from '@/apis/jo.api';
import yup from '@/lib/yup';
import { useRouter } from 'next/router';
import { useMutation, useQueryClient } from '@tanstack/react-query';

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

export default function create() {
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
    <div className="overflow-hidden">
      <div className="flex">
        <Command />
        <h1>Data Consolidation</h1>
      </div>

      <FormProvider {...methods}>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-sm dark:bg-graySecondary/70">
            <div className="bg-blueHeaderCard w-full">
              <div className="flex">
                <Command />
                <h1>Data JOC</h1>
              </div>

              <div className="grid">
                <div className="flex">
                  <Label>#No JOC</Label>
                  <InputText name="" />
                </div>
                <div className="flex">
                  <Label>JOC Date</Label>
                  <InputText name="" />
                </div>
                <div className="flex">
                  <Label>Type</Label>
                  <InputText name="" />
                </div>
                <div className="flex">
                  <Label>No. MBL</Label>
                  <InputText name="" />
                </div>
                <div className="flex">
                  <Label>Vessel</Label>
                  <InputText name="vessel" />
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-sm dark:bg-graySecondary/70">
            <div className="bg-blueHeaderCard w-full">
              <div className="flex">
                <Command />
                <h1>Data Consolidation</h1>
              </div>
              <div className="grid">
                <div className="flex">
                  <Label>Agent :</Label>
                  <InputText name="agent" />
                </div>
                <div className="flex">
                  <Label>Loading :</Label>
                  <InputText name="joc_no" />
                </div>
                <div className="flex">
                  <Label>Discharge :</Label>
                  <InputText name="type" />
                </div>
                <div className="flex">
                  <Label>ETD :</Label>
                  <InputText name="etd" />
                </div>
                <div className="flex">
                  <Label>ETA</Label>
                  <InputText name="eta" />
                </div>
                <div className="flex">
                  <Label>No. Container</Label>
                  <InputText name="eta" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </FormProvider>
      <Button className="bg-green-600">Save</Button>
      <Button>Back</Button>

      <div className="flex">
        <Button className="bg-green-600">Data</Button>
      </div>
    </div>
  );
}
