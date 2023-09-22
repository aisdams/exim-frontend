import { JOC, createJOCInput, updateJOCInput, Pagination, Res } from '@/types';

import { axios } from '@/lib/axios';
import { generateSearchQuery } from '@/lib/utils';

export const create = async (payload: createJOCInput) => {
  const res = await axios.post('/joc', payload);

  return res.data;
};

export const getAll = async ({
  page = 1,
  limit = 10,
  searchQueries,
}: Pagination): Promise<Res<JOC[]>> => {
  const { strings } = generateSearchQuery({ searchQueries });

  const res = await axios.get(`/joc?page=${page}&limit=${limit}${strings}`);

  return res.data;
};

export const getById = async (id: string): Promise<Res<JOC>> => {
  const res = await axios.get(`/joc/${id}`);
  return res.data;
};

export const updateById = async ({
  id,
  data,
}: {
  id: string;
  data: updateJOCInput;
}) => {
  const res = await axios.put(`/joc/${id}`, data);

  return res.data;
};

export const deleteById = async (id: string) => {
  const res = await axios.delete(`/joc/${id}`);
  return res.data;
};
