import {
  Port,
  createPortInput,
  updatePortInput,
  Pagination,
  Res,
} from '@/types';

import { axios } from '@/lib/axios';
import { generateSearchQuery } from '@/lib/utils';

export const create = async (payload: createPortInput) => {
  const res = await axios.post('/port', payload);

  return res.data;
};

export const getAll = async ({
  page = 1,
  limit = 10,
  searchQueries,
}: Pagination): Promise<Res<Port[]>> => {
  const { strings } = generateSearchQuery({ searchQueries });

  const res = await axios.get(`/port?page=${page}&limit=${limit}${strings}`);

  return res.data;
};

export const getById = async (id: string): Promise<Res<Port>> => {
  const res = await axios.get(`/port/${id}`);
  return res.data;
};

export const updateById = async ({
  id,
  data,
}: {
  id: string;
  data: updatePortInput;
}) => {
  const res = await axios.put(`/port/${id}`, data);

  return res.data;
};

export const deleteById = async (id: string) => {
  const res = await axios.delete(`/port/${id}`);
  return res.data;
};
