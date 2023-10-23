import { ParsedUrlQuery } from 'querystring';
import React from 'react';
import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';

import { NextPageCustomLayout } from '@/types/_app.type';

const QuotationPdf = dynamic(() => import('@/components/pdf/quotation.pdf'), {
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

type QuotationPrintProps = {
  id: string;
};

const QuotationPrint: NextPageCustomLayout<QuotationPrintProps> = ({
  id: quo_no,
}) => {
  return <QuotationPdf quo_no={quo_no} />;
};

QuotationPrint.theme = 'light';
QuotationPrint.getLayout = function getLayout(page: React.ReactElement) {
  return page;
};

export default QuotationPrint;
