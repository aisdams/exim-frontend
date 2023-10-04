import {
  Quotation,
  createQuotationInput,
  updateQuotationInput,
  Pagination,
  Res,
} from '@/types';

import { axios } from '@/lib/axios';
import { generateSearchQuery } from '@/lib/utils';

export const create = async (payload: createQuotationInput) => {
  const res = await axios.post('/quotation', payload);

  return res.data;
};

export const copyQuotationData = async (quo_no: string) => {
  const res = await axios.post(`/quotation/${quo_no}`);

  return res.data;
};

export const getAll = async ({
  page = 1,
  limit = 10,
  searchQueries,
}: Pagination): Promise<Res<Quotation[]>> => {
  const { strings } = generateSearchQuery({ searchQueries });

  const res = await axios.get(
    `/quotation?page=${page}&limit=${limit}${strings}`
  );

  return res.data;
};

export const getById = async (id: string): Promise<Res<Quotation>> => {
  const res = await axios.get(`/quotation/${id}`);
  return res.data;
};

export const updateById = async ({
  id,
  data,
}: {
  id: string;
  data: updateQuotationInput;
}) => {
  const res = await axios.put(`/quotation/${id}`, data);

  return res.data;
};

export const deleteById = async (id: string) => {
  const res = await axios.delete(`/quotation/${id}`);
  return res.data;
};
