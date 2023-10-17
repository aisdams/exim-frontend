import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useIsMediumScreen } from '@/hooks';
import { useSession } from 'next-auth/react';

import useSidebarStore from '@/zustand/use-sidebar';
import { cn } from '@/lib/utils';
import Footer from '@/components/layouts/footer';
import Sidebar from '@/components/layouts/sidebar';
import Topbar from '@/components/layouts/topbar';

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isMediumScreen } = useIsMediumScreen();
  const showSidebar = useSidebarStore((state) => state.showSidebar);
  const sidebarType = useSidebarStore((state) => state.sidebarType);
  const autoWidthMode = useSidebarStore((state) => state.autoWidthMode);
  const setAutoWidthMode = useSidebarStore((state) => state.setAutoWidthMode);
  const { data: session } = useSession();
  const router = useRouter();

  // useEffect(() => {
  //   if (!session) {
  //     // Jika pengguna belum masuk, arahkan mereka ke halaman login
  //     router.push('/auth/login');
  //   }
  // }, [session]);

  // // Jika pengguna belum masuk, tidak akan memuat konten layout
  // if (!session) {
  //   return null;
  // }
  useEffect(() => {
    if (isMediumScreen) {
      if (!showSidebar) {
        setAutoWidthMode(true);
      }
      return;
    }

    //! onBelowMediumScreen logic
    if (autoWidthMode) {
      setAutoWidthMode(false);
    }
  }, [isMediumScreen]);

  return (
    <div className="flex h-screen dark:bg-[#262e4b]">
      <Sidebar />
      <div className="z-50 flex flex-1 flex-col">
        <Topbar />
        <div className="flex-1 overflow-y-auto">
          <div className="z-50 mx-6 mb-20 mt-8 overflow-y-auto">{children}</div>
        </div>
        <Footer />
      </div>
    </div>
    // <div className="relative flex min-h-screen font-sans text-sm">
    //   <Sidebar />

    //   <div
    //     className={cn(
    //       'w-full transition-[margin-left,max-width] duration-300',
    //       sidebarType === 'vertical' && isMediumScreen
    //         ? // medium up logic
    //           (showSidebar && autoWidthMode) || !autoWidthMode
    //           ? 'md:ml-[265px] md:max-w-[calc(100%-265px)]'
    //           : (!showSidebar && !autoWidthMode) || autoWidthMode
    //           ? 'ml-[75px] md:max-w-[calc(100%-75px)]'
    //           : null
    //         : // medium below logic
    //           null
    //     )}
    //   >
    //     <Topbar />

    //     <div
    //       className={cn(
    //         'min-h-[calc(100vh-65px-33px)] bg-background p-4',
    //         sidebarType === 'horizontal' && 'min-h-[calc(100vh-65px-32px-43px)]'
    //       )}
    //     >
    //       {children}
    //     </div>

    //     <Footer />
    //   </div>
    // </div>
  );
};

export default Layout;
