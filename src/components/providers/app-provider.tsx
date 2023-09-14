import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ToastContainer } from 'react-toastify';
import { NProgress } from '@tanem/react-nprogress';

type AppProviderProps = {
  children: React.ReactNode;
};

const AppProvider = ({ children }: AppProviderProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [slowLoadingTimeout, setSlowLoadingTimeout] =
    useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleRouteChangeStart = () => {
      setIsLoading(true);

      const timeout = setTimeout(() => {
        setIsLoading(false);
      }, 10000);

      setSlowLoadingTimeout(timeout);
    };

    const handleRouteChangeComplete = () => {
      setIsLoading(false);

      if (slowLoadingTimeout) {
        clearTimeout(slowLoadingTimeout);
      }
    };

    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);

      if (slowLoadingTimeout) {
        clearTimeout(slowLoadingTimeout);
      }
    };
  }, [router, slowLoadingTimeout]);

  return (
    <>
      <NProgress isAnimating={isLoading}>
        {({ isFinished }) => (
          <div
            className={`fixed top-0 left-0 w-full h-[6px] bg-blueLight rounded-full transition-opacity ${
              isFinished ? 'opacity-0' : 'opacity-100'
            }`}
          />
        )}
      </NProgress>

      {children}

      <ToastContainer
        position="top-right"
        autoClose={4000}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
};

export default AppProvider;
