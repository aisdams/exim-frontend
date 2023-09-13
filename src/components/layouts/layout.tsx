import { useIsMediumScreen } from '@/hooks';
import { cn } from '@/lib/utils';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setAutoWidthMode } from '@/redux/slices/appSlice';
import React, { useEffect } from 'react';
import Sidebar from './sidebar';
import Topbar from './topbar';

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { isMediumScreen } = useIsMediumScreen();
  const { autoWidthMode, isSidebarOpen, sidebarType } = useAppSelector(
    (state) => state.app
  );

  useEffect(() => {
    if (isMediumScreen) {
      if (!isSidebarOpen) {
        dispatch(setAutoWidthMode(true));
      }
      return;
    }

    //! onBelowMediumScreen logic
    if (autoWidthMode) {
      dispatch(setAutoWidthMode(false));
    }
  }, [isMediumScreen]);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <div className="flex-1 overflow-y-auto">
          <div className="overflow-y-auto mx-6 mt-8 mb-20">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
