import '@/styles/globals.css';
import Layout from '@/components/layouts/layout';
import AppProvider from '@/components/providers/app-provider';
import reduxStore from '@/redux/store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import type { ReactElement, ReactNode } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

const { persistor, store } = reduxStore();

const qc = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

export type NextPageCustomLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
  theme?: string;
};

export default function App({
  Component,
  pageProps,
}: AppProps & {
  Component: NextPageCustomLayout;
}) {
  const getLayout = Component.getLayout ?? ((page) => <Layout>{page}</Layout>);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={qc}>
          <Head>
            <title>MY FORWARDING</title>
            <meta name="keywords" key="keywords" content="MY FORWARDING" />
            <link
              rel="shortcut icon"
              href="https://i.postimg.cc/cCXVYXkC/favicon.png"
            />
          </Head>
          {/* Menggunakan AppProvider di sini dengan prop initialLoading */}
          <AppProvider initialLoading={false}>
            {getLayout(<Component {...pageProps} />)}
          </AppProvider>
          <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  );
}
