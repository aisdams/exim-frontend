import { SidebarType } from '@/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit/';

type InitialState = {
  isAnimating: boolean;
  isSidebarOpen: boolean;
  autoWidthMode: boolean;
  sidebarType: SidebarType;
  isSettingsModalOpen: boolean;
};

const initialState: InitialState = {
  isAnimating: false,
  isSidebarOpen: true,
  autoWidthMode: false,
  sidebarType: 'vertical',
  isSettingsModalOpen: false,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setIsAnimating: (state, action: PayloadAction<boolean>) => {
      state.isAnimating = action.payload;
    },
    toggleSidebar: (state, action: PayloadAction<boolean>) => {
      if (action.payload === false) {
        state.isSidebarOpen = false;
        return;
      }

      state.isSidebarOpen = !state.isSidebarOpen;
    },
    setAutoWidthMode: (state, action: PayloadAction<boolean>) => {
      state.autoWidthMode = action.payload;
    },
    setSidebarType: (state, action: PayloadAction<SidebarType>) => {
      state.sidebarType = action.payload;
    },
    toggleSettingsModal: (state, action: PayloadAction<boolean>) => {
      state.isSettingsModalOpen = action.payload;
    },
  },
});

export const {
  setIsAnimating,
  toggleSidebar,
  setAutoWidthMode,
  setSidebarType,
  toggleSettingsModal,
} = appSlice.actions;

export default appSlice.reducer;
