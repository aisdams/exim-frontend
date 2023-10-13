import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { IS_DEV } from '@/constants';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import { LucideKeyRound } from 'lucide-react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import bgLogis from 'public/img/bg-log.jpg';
import bgLogo from 'public/img/logo.png';
import { toast } from 'react-toastify';
import { InferType } from 'yup';

import * as userService from '@/apis/user.api';
import yup from '@/lib/yup';
import InputPassword from '@/components/forms/input-password';
import InputText from '@/components/forms/input-text';
import { Button } from '@/components/ui/button';
import { NextPageCustomLayout } from '../_app';

const defaultValues = {
  email: '',
  password: '',
};

const Schema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().min(6).required(),
});

type LoginSchema = InferType<typeof Schema>;

const Login: NextPageCustomLayout = () => {
  const { status } = useSession();
  const methods = useForm<LoginSchema>({
    mode: 'all',
    defaultValues,
    resolver: yupResolver(Schema),
  });
  const { handleSubmit, watch } = methods;

  const router = useRouter();

  //! Error Message from Query Params
  const [errMsgQS, setErrMsgQS] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getUserByEmailMutation = useMutation({
    mutationFn: userService.getByEmail,
    onSuccess: (res) => {
      localStorage.setItem(
        process.env.NEXT_PUBLIC_PERMISSIONS_NAME,
        res.data.permissions
      );
      setIsLoading(false);

      router.replace('/');
    },
    onError: () => {
      setIsLoading(false);
      toast.error('Something went wrong, please retry later.');
      signOut({ redirect: false });
    },
  });

  const onSubmit: SubmitHandler<LoginSchema> = async (data) => {
    setIsLoading(true);
    if (IS_DEV) {
      console.log('data =>', data);
    }

    signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    }).then(async (res) => {
      console.log('res =>', res);
      if (res?.error) {
        setIsLoading(false);
        setErrMsgQS("Email or Password that you've entered are incorrect!");
      }
    });
  };

  useEffect(() => {
    if (status === 'authenticated')
      getUserByEmailMutation.mutate(watch('email'));
  }, [status]);

  //! Error Query Params logic
  useEffect(() => {
    setErrMsgQS(router?.query.error as string | null);
  }, [router?.query?.error]);

  return (
    <>
      <div className="grid min-h-screen bg-[url('https://aplikasisaya.net/fw/css/img/back.jpg')] bg-no-repeat bg-cover bg-center z-0 relative">
        <Image
          src={bgLogis}
          alt=""
          width={0}
          height={0}
          className="mx-auto grid w-[800px] h-52 bg-cover bg-center my-auto border-white border-2"
        />

        <div className="card w-[335px] bg-white shadow-md mx-auto grid my-auto absolute left-[28%] top-[25%]">
          <div className="px-5 py-10">
            <Image src={bgLogo} alt="" />
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)} className="">
                <InputText
                  name="email"
                  labelCN="text-sm"
                  inputCN="text-sm text-black"
                  containerCN="mb-4"
                  defaultCase
                  withLabel={false}
                />
                <InputPassword
                  name="password"
                  labelCN="text-sm"
                  inputCN="text-sm text-black"
                  containerCN="mb-4"
                  withLabel={false}
                />
                <Button
                  type="submit"
                  className="w-full text-[#fafafa] bg-blueHeaderCard"
                  disabled={isLoading}
                >
                  <LucideKeyRound className="rotate-[-80deg] w-5" />
                  {isLoading ? 'Loading...' : 'Login'}
                </Button>
                {errMsgQS && (
                  <div className="mt-2 text-center text-sm leading-none text-red-600">
                    {errMsgQS && <p>{errMsgQS}</p>}
                  </div>
                )}
              </form>
            </FormProvider>
          </div>
        </div>
      </div>
    </>
  );
};

Login.theme = 'dark';
Login.getLayout = function getLayout(page: React.ReactElement) {
  return page;
};

export default Login;
