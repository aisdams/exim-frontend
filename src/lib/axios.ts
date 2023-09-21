import Axios from 'axios';
import { SearchQuery } from '@/types';

const axios = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Menambahkan interceptor untuk permintaan
axios.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export { axios };

export const generateSearchQuery = ({
  searchQueries,
}: {
  searchQueries?: SearchQuery[] | SearchQuery;
}) => {
  let strings = '';

  if (!searchQueries) return { strings };

  if (
    !Array.isArray(searchQueries) &&
    !!searchQueries.by &&
    !!searchQueries.key
  ) {
    strings = `&${searchQueries.by}=${searchQueries.key}`;
    return { strings };
  }

  if (Array.isArray(searchQueries)) {
    searchQueries.forEach((q: any, idx: number) => {
      if (!q?.by || !q?.key) return;

      //! generate the query params
      strings += `&${q.by}=${q.key}${
        idx + 1 < searchQueries.length ? '&' : ''
      }`;
    });
  }

  return { strings };
};
