import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { UserSession } from '@/types';
import { useMutation } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useDispatch } from 'react-redux';

import * as authServices from '@/apis/auth.api';
import { setSession } from '@/redux/slices/auth-slice';

type SessionProviderProps = {
  children: React.ReactNode;
};

const SessionProvider: React.FC<SessionProviderProps> = ({ children }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { data: session } = useSession();

  const getAuthUserMutation = useMutation({
    mutationFn: authServices.me,
    onSuccess: (res: UserSession) => {
      dispatch(setSession({ user: res }));
    },
  });

  useEffect(() => {
    // Periksa apakah pengguna sudah masuk
    if (!session?.user) {
      // Jika pengguna belum masuk, alihkan ke halaman login
      router.push('/auth/login');
    } else {
      // Jika pengguna sudah masuk, ambil data sesi pengguna
      getAuthUserMutation.mutate();
    }
  }, [router, session]);
  useEffect(() => {
    if (
      !router.pathname.startsWith('/auth') &&
      !router.pathname.startsWith('/403') &&
      !router.pathname.startsWith('/404') &&
      !session?.user
    ) {
      getAuthUserMutation.mutate();
    }
  }, [router.pathname]);

  if (getAuthUserMutation.isLoading) {
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        Checking Authentication...
      </div>
    );
  }

  if (getAuthUserMutation.isError) {
    return <ErrorComp />;
  }

  return children;
};

function ErrorComp() {
  return (
    <div className="grid min-h-screen place-items-center font-normal">
      <div className="text-center">
        <p className="mb-2 text-lg font-medium text-red-600">
          Something Went Wrong...
        </p>
        <div className="text-sm">
          <p>You can try to refresh this page,</p>
          <p>or contact the developers.</p>
        </div>
      </div>
    </div>
  );
}

export default SessionProvider;
