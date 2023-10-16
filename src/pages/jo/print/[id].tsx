import { ParsedUrlQuery } from 'querystring';
import React from 'react';
import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';

import { NextPageCustomLayout } from '@/types/_app.type';

const JOPdf = dynamic(() => import('@/components/pdf/jo.pdf'), {
  ssr: false,
});

interface IParams extends ParsedUrlQuery {
  id: string;
}

export const getServerSideProps: GetServerSideProps<{
  id: string;
}> = async (ctx) => {
  const { id } = ctx.params as IParams;

  return {
    props: {
      id,
    },
  };
};

type JOPrintProps = {
  id: string;
};

const JOPrint: NextPageCustomLayout<JOPrintProps> = ({ id: jo_no }) => {
  return <JOPdf jo_no={jo_no} />;
};

JOPrint.theme = 'light';
JOPrint.getLayout = function getLayout(page: React.ReactElement) {
  return page;
};

export default JOPrint;
