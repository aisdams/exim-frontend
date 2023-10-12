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
import * as JOCService from '@/apis/joc.api';
import yup from '@/lib/yup';
import { useRouter } from 'next/router';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const defaultValues = {
  no_mbl: '',
  vessel: '',
  agent: '',
  no_container: '',
  loading: '',
  discharge: '',
  etd: '',
  eta: '',
  quo_no: '',
  jo_no: '',
  customer_code: '',
};

const Schema = yup.object({
  no_mbl: yup.string().required(),
  vessel: yup.string().required(),
  agent: yup.string().required(),
  no_container: yup.string().required(),
  loading: yup.string().required(),
  discharge: yup.string().required(),
  etd: yup.string().required(),
  eta: yup.string().required(),
  quo_no: yup.string().required(),
  jo_no: yup.string().required(),
  customer_code: yup.string().required(),
});

type JOCSchema = InferType<typeof Schema>;

export default function create() {
  const router = useRouter();
  const qc = useQueryClient();
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
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
          <div className="card grid grid-cols-2 gap-5">
            <div className="grid">
              <div className="grid">
                <div className="grid grid-cols-2">
                  <div className="">
                    <Label>No MBL</Label>
                    <Label>Vessel</Label>
                    <Label>Agent</Label>
                    <Label>No Container</Label>
                    <Label>Loading</Label>
                  </div>
                  <div className="">
                    <InputText name="no_mbl" />
                    <InputText name="vessel" />
                    <InputText name="agent" />
                    <InputText name="no_container" />
                    <InputText name="loading" />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid">
              <div className="grid">
                <div className="grid grid-cols-2">
                  <div className="">
                    <Label>Discharge</Label>
                    <Label>ETD</Label>
                    <Label>ETA</Label>
                    <Label>Quo No</Label>
                    <Label>Customer Code</Label>
                  </div>
                  <div className="">
                    <InputText name="discharge" />
                    <InputText name="etd" />
                    <InputText name="eta" />
                    <InputText name="quo_no" />
                    <InputText name="customer_code" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </FormProvider>
      <Button className="bg-green-600">Save</Button>
      <Button>Back</Button>

      <div className="flex">
        <Button className="bg-green-600">Data</Button>
      </div>
    </div>
  );
}
