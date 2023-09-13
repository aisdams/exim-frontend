import { AuthSession } from '@/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit/';

type InitialState = AuthSession;

const initialState: InitialState = {
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setSession: (state, action: PayloadAction<AuthSession>) => {
      state.user = action.payload.user;
    },
  },
});

export const { setSession } = authSlice.actions;

export default authSlice.reducer;
