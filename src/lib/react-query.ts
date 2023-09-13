import { Res } from '@/types';

export const getNextPageParam = (
  lastPage: Res<any[]>,
  allPages: Res<any[]>[]
) =>
  lastPage.data.length === 0 ||
  allPages[allPages.length - 1].data.length === lastPage.pagination.total
    ? undefined
    : allPages.length + 1;
