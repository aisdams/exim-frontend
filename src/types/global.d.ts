import { ChangeEvent } from 'react';

export type Option = {
  value: string;
  label: string;
};

export type SidebarType = 'vertical' | 'horizontal';

export type Mode = 'light' | 'dark';

export type UserSession = {
  id: string;
  email: string;
  name: string;
  role: string;
  iat: number;
  exp: number;
};

export type AuthSession = {
  user: UserSession | null;
};

export type SearchQuery = {
  by: string;
  key: string | null;
};

export type Pagination = {
  page?: number;
  limit?: number;
  searchQueries?: SearchQuery[] | SearchQuery;
};

export type FileEvent = ChangeEvent<HTMLInputElement> & {
  target: EventTarget & { files: FileList };
};

export type ValueOf<T> = T[keyof T];
