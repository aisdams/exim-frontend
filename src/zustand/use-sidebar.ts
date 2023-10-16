import { SidebarType } from '@/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type SidebarState = {
  showSidebar: boolean;
  setShowSidebar: (bool: boolean) => void;
  autoWidthMode: boolean;
  setAutoWidthMode: (bool: boolean) => void;
  sidebarType: SidebarType;
  setSidebarType: (sidebarType: SidebarType) => void;
};

const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      showSidebar: true,
      setShowSidebar: (bool) => set(() => ({ showSidebar: bool })),
      autoWidthMode: false,
      setAutoWidthMode: (bool) => set(() => ({ autoWidthMode: bool })),
      sidebarType: 'vertical',
      setSidebarType: (sidebarType) => set(() => ({ sidebarType })),
    }),
    {
      name: 'sidebar',
    }
  )
);

export default useSidebarStore;
