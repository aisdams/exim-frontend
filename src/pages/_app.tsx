// import '@/styles/globals.css';
// import { AppProps } from 'next/app';
// import AppProvider from '@/components/providers/app-provider';
// import Head from 'next/head';
// import { ReactElement, ReactNode, useEffect, useState } from 'react';
// import { NextPage } from 'next';
// import Sidebar from '@/components/layouts/sidebar';
// import { useRouter } from 'next/router';
// import ImageSML from '../../public/img/icon2.png';
// import Progress from '@/components/progress/progress';

// export type NextPageCustomLayout<P = {}, IP = P> = NextPage<P, IP> & {
//   getLayout?: (page: ReactElement) => ReactNode;
//   theme?: string;
// };

// function App({
//   Component,
//   pageProps,
// }: AppProps & {
//   Component: NextPageCustomLayout;
// }) {
//   const getLayout = Component.getLayout ?? ((page: any) => page);

//   const router = useRouter();

//   const preventRightClick = (e: MouseEvent) => {
//     e.preventDefault();
//   };

//   useEffect(() => {
//     const handleRouteChangeStart = () => {};

//     router.events.on('routeChangeStart', handleRouteChangeStart);

//     return () => {
//       router.events.off('routeChangeStart', handleRouteChangeStart);
//     };
//   }, [router.events]);

//   return (
//     <>
// <Head>
//   <title>MY FORWARDING</title>
//   <meta name="keywords" key="keywords" content="MY FORWARDING" />
//   <link
//     rel="shortcut icon"
//     href="https://i.postimg.cc/cCXVYXkC/favicon.png"
//   />
// </Head>
//       <AppProvider>{getLayout(<Component {...pageProps} />)}</AppProvider>
//     </>
//   );
// }

// export default App;

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
          <AppProvider>{getLayout(<Component {...pageProps} />)}</AppProvider>
          <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  );
}
