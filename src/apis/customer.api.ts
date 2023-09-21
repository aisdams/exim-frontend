import {
  Customer,
  createCustomerInput,
  updateCustomerInput,
  Pagination,
  Res,
} from '@/types';

import { axios } from '@/lib/axios';
import { generateSearchQuery } from '@/lib/utils';

export const create = async (payload: createCustomerInput) => {
  const res = await axios.post('/customer', payload);

  return res.data;
};

export const getAll = async ({
  page = 1,
  limit = 10,
  searchQueries,
}: Pagination): Promise<Res<Customer[]>> => {
  const { strings } = generateSearchQuery({ searchQueries });

  const res = await axios.get(
    `/customer?page=${page}&limit=${limit}${strings}`
  );

  return res.data;
};

export const getById = async (id: string): Promise<Res<Customer>> => {
  const res = await axios.get(`/customer/${id}`);
  return res.data;
};

export const updateById = async ({
  id,
  data,
}: {
  id: string;
  data: updateCustomerInput;
}) => {
  const res = await axios.put(`/customer/${id}`, data);

  return res.data;
};

export const deleteById = async (id: string) => {
  const res = await axios.delete(`/customer/${id}`);
  return res.data;
};
