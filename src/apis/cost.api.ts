import {
  Cost,
  createCostInput,
  createCostQuoInput,
  Pagination,
  Res,
  updateCostInput,
} from '@/types';

import { axios } from '@/lib/axios';
import { generateSearchQuery } from '@/lib/utils';

export const create = async (payload: createCostInput) => {
  const res = await axios.post('/cost', payload);

  return res.data;
};

export const getAll = async ({
  page = 1,
  limit = 10,
  searchQueries,
}: Pagination): Promise<Res<Cost[]>> => {
  const { strings } = generateSearchQuery({ searchQueries });

  const res = await axios.get(`/cost?page=${page}&limit=${limit}${strings}`);

  return res.data;
};

export const getById = async (id: string): Promise<Res<Cost>> => {
  const res = await axios.get(`/cost/${id}`);
  return res.data;
};

export const updateById = async ({
  id,
  data,
}: {
  id: string;
  data: updateCostInput;
}) => {
  const res = await axios.put(`/cost/${id}`, data);

  return res.data;
};

export const createCostQuo = async ({
  data,
  quo_no,
}: {
  data: createCostQuoInput;
  quo_no: string;
}) => {
  try {
    const res = await axios.post(`/cost/${quo_no}`, data);
    return res.data;
  } catch (error) {
    throw new Error(`Gagal membuat data: ${error}`);
  }
};

export const deleteById = async (id: string) => {
  const res = await axios.delete(`/cost/${id}`);
  return res.data;
};
