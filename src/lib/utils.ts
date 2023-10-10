import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { SearchQuery } from '@/types';
import { IS_DEV } from '@/constants';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getErrMessage(err: any) {
  const errMsg =
    err?.response?.data?.message || err?.message || 'Something went wrong!';

  if (IS_DEV) {
    console.log('err =>', errMsg);
  }

  return errMsg;
}

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

export const handleResetFieldAfterChange = ({
  resetFieldAfterChange = [],
  setValue,
}: {
  resetFieldAfterChange?: string | string[];
  setValue: (
    name: string,
    value: any,
    options?: Partial<{
      shouldValidate: boolean;
      shouldDirty: boolean;
      shouldTouch: boolean;
    }>
  ) => void;
}) => {
  if (typeof resetFieldAfterChange === 'string') {
    setValue(resetFieldAfterChange, '');
  }

  if (Array.isArray(resetFieldAfterChange)) {
    resetFieldAfterChange.map((field) => setValue(field, ''));
  }
};
