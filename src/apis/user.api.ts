import { Res } from '@/types';

import { axios } from '@/lib/axios';

type User = {
  user_code: string;
  name: string;
  email: string;
  photo: string;
  role: string;
  permissions: string;
};

export const getByEmail = async (email: string): Promise<Res<User>> => {
  const res = await axios.get(`/users/get/by/email/${email}`);
  return res.data;
};
