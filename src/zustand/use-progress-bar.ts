import { create } from 'zustand';

type ProgressBarState = {
  isAnimating: boolean;
  setIsAnimating: (bool: boolean) => void;
};

const useProgressBarStore = create<ProgressBarState>()((set) => ({
  isAnimating: false,
  setIsAnimating: (bool) => set(() => ({ isAnimating: bool })),
}));

export default useProgressBarStore;
