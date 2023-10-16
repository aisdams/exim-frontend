import '@/styles/globals.css';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';

import type { AppProps } from 'next/app';
import Head from 'next/head';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';

import { NextPageCustomLayout } from '@/types/_app.type';
import Layout from '@/components/layouts/layout';
import AppProvider from '@/components/providers/app-provider';

const qc = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

const App = ({
  Component,
  pageProps,
}: AppProps & {
  Component: NextPageCustomLayout;
}) => {
  const getLayout = Component.getLayout ?? ((page) => <Layout>{page}</Layout>);

  return (
    <>
      <Head>
        <title>EXIM | NELLO</title>
        <meta name="keywords" key="keywords" content="EXIM NELLO" />
        <link
          rel="shortcut icon"
          href="https://i.postimg.cc/cCXVYXkC/favicon.png"
        />
      </Head>
      <QueryClientProvider client={qc}>
        <SessionProvider session={pageProps.session}>
          <ThemeProvider
            attribute="class"
            themes={['light', 'dark']}
            enableSystem={false}
            defaultTheme="dark"
            forcedTheme={Component.theme || undefined}
            disableTransitionOnChange
          >
            <AppProvider>{getLayout(<Component {...pageProps} />)}</AppProvider>
          </ThemeProvider>
        </SessionProvider>

        <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
      </QueryClientProvider>
    </>
  );
};

export default App;
