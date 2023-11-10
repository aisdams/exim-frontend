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
      <div className="z-30">
        <Sidebar />
      </div>
      <div className="flex flex-1 flex-col">
        <div className="z-[20]">
          <Topbar />
        </div>
        <div className="!z-30 flex-1 overflow-y-auto">
          <div className="mx-6 mb-20 mt-8 overflow-y-auto">{children}</div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
