import { createSlice } from '@reduxjs/toolkit/';

type InitialState = {
  active: {
    title: string;
    children: any[];
  };
};

const initialState: InitialState = {
  active: {
    title: '',
    children: [],
  },
};

const sidebarDropdownSlice = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    setActive: (state, action) => {
      state.active = action.payload;
    },
  },
});

export const { setActive } = sidebarDropdownSlice.actions;

export default sidebarDropdownSlice.reducer;
