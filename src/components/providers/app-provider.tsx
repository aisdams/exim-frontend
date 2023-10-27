import 'react-toastify/dist/ReactToastify.css';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useIsBelowSmallScreen, useMounted } from '@/hooks';
import { MantineProvider } from '@mantine/core';
import { NProgress } from '@tanem/react-nprogress';
import { useTheme } from 'next-themes';
import { ToastContainer } from 'react-toastify';

import useProgressBarStore from '@/zustand/use-progress-bar';
import useSidebarStore from '@/zustand/use-sidebar';
// import Progress from '@/components/progress/progress';
import { ThemeSwitcher } from '@/components/shared/theme-switcher';
import { Toaster } from '@/components/ui/toaster';
import SessionLoader from './session-loader';

type AppProviderProps = {
  children: React.ReactNode;
  initialLoading: boolean;
};

export default function AppProvider({
  children,
  initialLoading,
}: AppProviderProps) {
  const router = useRouter();
  const isMounted = useMounted();
  const [isLoading, setIsLoading] = useState(initialLoading);
  const { isBelowSmallScreen } = useIsBelowSmallScreen();
  const { theme: mode, forcedTheme } = useTheme();
  const isAnimating = useProgressBarStore((state: any) => state.isAnimating);
  const setIsAnimating = useProgressBarStore(
    (state: any) => state.setIsAnimating
  );
  const sidebarType = useSidebarStore((state: any) => state.sidebarType);
  const setSidebarType = useSidebarStore((state: any) => state.setSidebarType);
  const setShowSidebar = useSidebarStore((state: any) => state.setShowSidebar);

  useEffect(() => {
    if (window.innerWidth < 576 && sidebarType === 'horizontal') {
      setSidebarType('vertical');
    }
  }, [isBelowSmallScreen, sidebarType]);

  useEffect(() => {
    if (window.innerWidth < 576) {
      setShowSidebar(false);
    }
  }, []);

  //! Loading Bar Logic
  useEffect(() => {
    const handleRouteChangeStart = () => {
      setIsLoading(true);
    };

    const handleRouteChangeComplete = () => {
      setIsLoading(false);
    };
    const handleRouteStop = () => {
      setIsLoading(false);
    };

    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);
    router.events.on('routeChangeError', () => handleRouteStop());

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
      router.events.off('routeChangeError', handleRouteStop);
    };
  }, [router]);

  return (
    <MantineProvider
      theme={{
        fontFamily: 'var(--font-sans)',
        // primaryColor: 'violet',
      }}
      forceColorScheme={(forcedTheme as any) || (mode as any)}
    >
      <SessionLoader>
        {/* <Progress isAnimating={isAnimating} /> */}

        {/* THE COMPONENT */}
        <NProgress isAnimating={isLoading}>
          {({ isFinished }) => (
            <div
              className={`fixed left-0 top-0 z-[999] h-[6px] w-full rounded-full bg-purple-500 transition-opacity ${
                isFinished ? 'opacity-0' : 'opacity-100'
              }`}
            />
          )}
        </NProgress>

        {children}

        {isMounted && (
          <ToastContainer
            position="top-right"
            autoClose={4000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme={(forcedTheme as any) || (mode as any)}
          />
        )}

        {/* shadcn/ui TOASTER */}
        <Toaster />
      </SessionLoader>

      <ThemeSwitcher />
    </MantineProvider>
  );
}
