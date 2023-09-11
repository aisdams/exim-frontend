import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>SARANA MULYA LOGISTIK</title>
        <meta name="keywords" key="keywords" content="MY FORWARDING" />
        <link
          rel="shortcut icon"
          href="https://i.postimg.cc/cCXVYXkC/favicon.png"
        />
      </Head>

      <Component {...pageProps} />
    </>
  );
}
