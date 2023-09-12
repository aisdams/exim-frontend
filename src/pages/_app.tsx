import '@/styles/globals.css';
import { AppProps } from 'next/app';
import AppProvider from '@/components/providers/app-provider';
import Head from 'next/head';
import { ReactElement, ReactNode, useEffect, useState } from 'react';
import { NextPage } from 'next';
import Sidebar from '@/components/layouts/sidebar';
import { useRouter } from 'next/router';
import ImageSML from '../../public/img/icon2.png';
import Image from 'next/image';
import Script from 'next/script';
import Footer from '@/components/layouts/footer';
import Topbar from '@/components/layouts/topbar';

export type NextPageCustomLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
  theme?: string;
};
function App({
  Component,
  pageProps,
}: AppProps & {
  Component: NextPageCustomLayout;
}) {
  const getLayout = Component.getLayout ?? ((page: any) => page);

  const router = useRouter();

  const preventRightClick = (e: MouseEvent) => {
    e.preventDefault();
  };

  useEffect(() => {
    const handleRouteChangeStart = () => {};

    router.events.on('routeChangeStart', handleRouteChangeStart);

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
    };
  }, [router.events]);

  return (
    <>
      <Head>
        <title>MY FORWARDING</title>
        <meta name="keywords" key="keywords" content="MY FORWARDING" />
        <link
          rel="shortcut icon"
          href="https://i.postimg.cc/cCXVYXkC/favicon.png"
        />
      </Head>
      <AppProvider>
        <div className="grid relative">
          <div className="flex gap-8">
            <Sidebar />
            <div className="!block">
              <Topbar />
              {getLayout(<Component {...pageProps} />)}
            </div>
          </div>
        </div>
      </AppProvider>
    </>
  );
}

export default App;
