import type { ReactElement, ReactNode } from 'react';
import type { NextPage } from 'next';

export type NextPageCustomLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
  theme?: 'light' | 'dark';
};
