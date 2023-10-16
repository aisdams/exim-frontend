import { cn } from '@/lib/utils';
import React, { useEffect } from 'react';
import { useIsMediumScreen } from '@/hooks';
import Topbar from '@/components/layouts/topbar';
import Footer from '@/components/layouts/footer';
import Sidebar from '@/components/layouts/sidebar';
import { setAutoWidthMode } from '@/redux/slices/appSlice';
import { ThemeProvider } from '@/components/theme-provider';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { isMediumScreen } = useIsMediumScreen();
  const { autoWidthMode, isSidebarOpen } = useAppSelector((state) => state.app);
  const { data: session } = useSession();
  const router = useRouter();

  // Periksa apakah pengguna belum masuk
  useEffect(() => {
    if (!session) {
      // Jika pengguna belum masuk, arahkan mereka ke halaman login
      router.push('/auth/login');
    }
  }, [session]);

  // Jika pengguna belum masuk, tidak akan memuat konten layout
  if (!session) {
    return null;
  }
  useEffect(() => {
    if (isMediumScreen) {
      if (!isSidebarOpen) {
        dispatch(setAutoWidthMode(true));
      }
      return;
    }

    if (autoWidthMode) {
      dispatch(setAutoWidthMode(false));
    }
  }, [isMediumScreen]);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col z-50">
          <Topbar />
          <div className="flex-1 overflow-y-auto">
            <div className="overflow-y-auto mx-6 mt-8 mb-20 z-50">
              {children}
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Layout;
