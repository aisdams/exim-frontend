import { shared } from 'use-broadcast-ts';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { type Theme } from '@/data/themes';

interface ConfigState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const useConfigStore = create<ConfigState>()(
  shared(
    persist(
      (set) => ({
        theme: 'default',
        setTheme: (theme) => set(() => ({ theme })),
      }),
      {
        name: 'config',
      }
    )
  )
);

export default useConfigStore;
