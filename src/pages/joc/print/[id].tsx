import { ParsedUrlQuery } from 'querystring';
import React from 'react';
import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';

import { NextPageCustomLayout } from '@/types/_app.type';

const JOCPdf = dynamic(() => import('@/components/pdf/joc.pdf'), {
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

type JOCPrintProps = {
  id: string;
};

const JOCPrint: NextPageCustomLayout<JOCPrintProps> = ({ id: joc_no }) => {
  return <JOCPdf joc_no={joc_no} />;
};

JOCPrint.theme = 'light';
JOCPrint.getLayout = function getLayout(page: React.ReactElement) {
  return page;
};

export default JOCPrint;
