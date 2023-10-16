import 'react-toastify/dist/ReactToastify.css';

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useIsBelowSmallScreen, useMounted } from '@/hooks';
import { MantineProvider } from '@mantine/core';
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
};

export default function AppProvider({ children }: AppProviderProps) {
  const router = useRouter();
  const isMounted = useMounted();
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
    const handleStart = () => setIsAnimating(true);
    const handleStop = () => setIsAnimating(false);

    router.events.on('routeChangeStart', () => handleStart());
    router.events.on('routeChangeComplete', () => handleStop());
    router.events.on('routeChangeError', () => handleStop());

    return () => {
      router.events.off('routeChangeStart', () => handleStart());
      router.events.off('routeChangeComplete', () => handleStop());
      router.events.off('routeChangeError', () => handleStop());
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
