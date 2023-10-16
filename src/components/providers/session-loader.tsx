import { useSession } from 'next-auth/react';

import { usePage } from '@/hooks/use-page';
import { setToken } from '@/lib/axios';
import CheckAuthSplash from '../shared/check-auth-splash';

const SessionLoader = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();

  const { privatePage } = usePage();

  //! alternative: redirect to auth page if accessToken expired (client side)
  // useEffect(() => {
  //   if (
  //     session?.accessTokenExpires &&
  //     Date.now() / 1000 > session.accessTokenExpires
  //   ) {
  //     signOut({ redirect: false }).then(() => router.replace('/auth/login'));
  //   }
  // }, [router.pathname]);

  if (privatePage && status === 'loading') {
    return <CheckAuthSplash />;
  }

  if (status === 'authenticated') {
    setToken(session?.accessToken!);
  }

  return children;
};

export default SessionLoader;
