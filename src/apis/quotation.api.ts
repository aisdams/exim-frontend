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
