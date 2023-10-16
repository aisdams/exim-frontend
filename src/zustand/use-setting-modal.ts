import { create } from 'zustand';

type SettingModalState = {
  showSettingModal: boolean;
  setShowSettingModal: (bool: boolean) => void;
};

const useSettingModalStore = create<SettingModalState>()((set) => ({
  showSettingModal: false,
  setShowSettingModal: (bool) => set(() => ({ showSettingModal: bool })),
}));

export default useSettingModalStore;
