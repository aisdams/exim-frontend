import { axios } from '@/lib/axios';

type LoginPayload = {
  email: string;
  password: string;
};

export const login = async (payload: LoginPayload) => {
  const res = await axios.post('/auth/login', payload);

  return res.data;
};

export const me = async () => {
  const res = await axios.get('/auth/me');

  return res.data;
};

export const logout = async () => {
  const res = await axios.post('/auth/logout');

  return res.data;
};
