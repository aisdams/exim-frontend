import { SidebarType } from '@/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit/';

type InitialState = {
  isSidebarOpen: boolean;
  autoWidthMode: boolean;
};

const initialState: InitialState = {
  isSidebarOpen: true,
  autoWidthMode: false,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
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
  },
});

export const { toggleSidebar, setAutoWidthMode } = appSlice.actions;

export default appSlice.reducer;
