import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { NProgress } from '@tanem/react-nprogress';
// import { MantineProvider } from '@mantine/core';

type AppProviderProps = {
  children: React.ReactNode;
  initialLoading: boolean;
};

const AppProvider = ({ children, initialLoading }: AppProviderProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(initialLoading);

  useEffect(() => {
    const handleRouteChangeStart = () => {
      setIsLoading(true);
    };

    const handleRouteChangeComplete = () => {
      setIsLoading(false);
    };

    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
    };
  }, [router]);

  return (
    // <MantineProvider>
    <>
      <NProgress isAnimating={isLoading}>
        {({ isFinished }) => (
          <div
            className={`fixed top-0 left-0 w-full h-[6px] bg-purple-500 rounded-full z-50 transition-opacity ${
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
    // </MantineProvider>
  );
};

export default AppProvider;
