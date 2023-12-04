import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { IS_DEV } from '@/constants';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import { signIn, signOut, useSession } from 'next-auth/react';
import bgLogis from 'public/img/bg-log.jpg';
import bgImg from 'public/img/bg-log.jpg';
import bgLogo from 'public/img/logo_neelo.png';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { InferType } from 'yup';

import { NextPageCustomLayout } from '@/types/_app.type';
import * as userService from '@/apis/user.api';
import yup from '@/lib/yup';
import InputPassword from '@/components/form/input-password';
import InputText from '@/components/form/input-text';
import { Button } from '@/components/ui/button';

const defaultValues = {
  email: '',
  password: '',
};

const Schema = yup.object({
  email: yup.string().required(),
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

  // const getUserByEmailMutation = useMutation({
  //   mutationFn: userService.getByEmail,
  //   onSuccess: (res) => {
  //     localStorage.setItem(
  //       process.env.NEXT_PUBLIC_PERMISSIONS_NAME,
  //       res.data.permissions
  //     );
  //     setIsLoading(false);
  //     router.replace('/');
  //   },
  //   onError: () => {
  //     setIsLoading(false);
  //     toast.error('Something went wrong, please retry later.');
  //     signOut({ redirect: false });
  //     // router.replace('/');
  //   },
  // });

  const onSubmit: SubmitHandler<LoginSchema> = async (data) => {
    setIsLoading(true);
    signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    })
      .then(async (res) => {
        if (res?.error) {
          setIsLoading(false);
          setErrMsgQS("Email or Password that you've entered are incorrect!");
          toast.error('Something went wrong, please retry later.');
        }
        router.replace('/');
        if (res?.ok) {
          console.log('ok');
        }
      })
      .finally(() => setIsLoading(false));
  };

  // useEffect(() => {
  //   if (status === 'authenticated')
  //     getUserByEmailMutation.mutate(watch('email'));
  // }, [status]);

  //! Error Query Params logic
  useEffect(() => {
    setErrMsgQS(router?.query.error as string | null);
  }, [router?.query?.error]);

  return (
    <div className="relative z-0 grid min-h-screen bg-[url('https://aplikasisaya.net/fw/css/img/back.jpg')] bg-cover bg-center bg-no-repeat">
      <Image
        src={bgLogis}
        alt=""
        width={0}
        height={0}
        className="mx-auto my-auto grid h-56 w-[800px] border-2 border-white bg-cover bg-center"
      />

      <div className="card absolute left-0 right-0 top-[25%] mx-auto my-auto grid w-[335px] bg-white shadow-md md:left-[-28%]">
        <div className="px-5 py-10">
          <Image src={bgLogo} alt="" />
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-5">
              <InputText
                name="email"
                label="Email"
                labelCN="text-sm"
                inputCN="text-sm !bg-transparent text-black !border-black border"
                containerCN="mb-4"
                mandatory
                uppercase={false}
                // withLabel={false}
              />
              <InputPassword
                name="password"
                labelCN="text-sm"
                mandatory
                inputCN="text-sm bg-transparent text-black"
                containerCN="mb-4"
                // withLabel={false}
              />
              <Button
                type="submit"
                className="w-full bg-blueHeaderCard text-[#fafafa]"
                disabled={isLoading}
              >
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
  );
};

Login.theme = 'dark';
Login.getLayout = function getLayout(page: React.ReactElement) {
  return page;
};

export default Login;
