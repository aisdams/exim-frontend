import { Pagination, Res, User } from '@/types';

import { axios } from '@/lib/axios';
import { generateSearchQuery } from '@/lib/utils';

export const getAll = async ({
  page = 1,
  limit = 10,
  searchQueries,
}: Pagination): Promise<Res<User[]>> => {
  const { strings } = generateSearchQuery({ searchQueries });

  const res = await axios.get(`/users?page=${page}&limit=${limit}${strings}`);

  return res.data;
};

export const deleteById = async (id: string) => {
  const res = await axios.delete(`/user/${id}`);
  return res.data;
};

type TUser = {
  user_code: string;
  name: string;
  email: string;
  photo: string;
  role: string;
  permissions: string;
};

export const getByUserCode = async (user_code: string): Promise<Res<TUser>> => {
  const res = await axios.get(`/users/get/by/user-code/${user_code}`);
  return res.data;
};

export const getByEmail = async (email: string): Promise<Res<TUser>> => {
  const res = await axios.get(`/users/get/by/email/${email}`);
  return res.data;
};
