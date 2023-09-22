import {
  JobOrder,
  createJobOrderInput,
  updateJobOrderInput,
  Pagination,
  Res,
} from '@/types';

import { axios } from '@/lib/axios';
import { generateSearchQuery } from '@/lib/utils';

export const create = async (payload: createJobOrderInput) => {
  const res = await axios.post('/joborder', payload);

  return res.data;
};

export const getAll = async ({
  page = 1,
  limit = 10,
  searchQueries,
}: Pagination): Promise<Res<JobOrder[]>> => {
  const { strings } = generateSearchQuery({ searchQueries });

  const res = await axios.get(
    `/joborder?page=${page}&limit=${limit}${strings}`
  );

  return res.data;
};

export const getById = async (id: string): Promise<Res<JobOrder>> => {
  const res = await axios.get(`/joborder/${id}`);
  return res.data;
};

export const updateById = async ({
  id,
  data,
}: {
  id: string;
  data: updateJobOrderInput;
}) => {
  const res = await axios.put(`/joborder/${id}`, data);

  return res.data;
};

export const deleteById = async (id: string) => {
  const res = await axios.delete(`/joborder/${id}`);
  return res.data;
};
