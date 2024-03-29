import '@/styles/globals.css';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';

import type { AppProps } from 'next/app';
import Head from 'next/head';
import { NovuProvider } from '@novu/notification-center';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';

import { NextPageCustomLayout } from '@/types/_app.type';
import useUserUuid from '@/hooks/use-user-uuid';
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
  const userUuid = useUserUuid();
  const novuAppId = process.env.NEXT_PUBLIC_NOVU_APP_ID || '';
  return (
    <>
      <Head>
        <title>EXIM | NELLO</title>
        <meta name="keywords" key="keywords" content="EXIM NELLO" />
        <link
          rel="shortcut icon"
          href="https://www.4shared.com/img/9E2N7MiLge/s25/18bacde1348/logo_neelo_2"
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
            <AppProvider initialLoading={false}>
              <NovuProvider
                subscriberId={userUuid}
                applicationIdentifier={novuAppId}
                backendUrl={process.env.NEXT_PUBLIC_API_URL}
                socketUrl={process.env.NEXT_PUBLIC_WS_URL}
              >
                {getLayout(<Component {...pageProps} />)}
              </NovuProvider>
            </AppProvider>
          </ThemeProvider>
        </SessionProvider>

        <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
      </QueryClientProvider>
    </>
  );
};

export default App;
