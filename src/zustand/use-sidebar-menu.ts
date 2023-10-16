import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Active = {
  label: string | null;
  children: string[];
};

type SidebarState = {
  active: Active;
  setActive: (active: Active) => void;
};

const useSidebarMenuStore = create<SidebarState>()(
  persist(
    (set) => ({
      active: {
        label: '',
        children: [],
      },
      setActive: (active) => set(() => ({ active })),
    }),
    {
      name: 'sidebar-menu',
    }
  )
);

export default useSidebarMenuStore;
