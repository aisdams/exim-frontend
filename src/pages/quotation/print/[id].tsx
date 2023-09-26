import React from 'react';
import dynamic from 'next/dynamic';
import { NextPageCustomLayout } from '@/pages/_app';

const QuotationPdf = dynamic(() => import('@/components/pdf/quotation.pdf'), {
  ssr: false,
});

const QuotationPrint: NextPageCustomLayout = () => {
  return (
    <div>
      <QuotationPdf />
    </div>
  );
};

QuotationPrint.getLayout = function getLayout(page: React.ReactElement) {
  return page;
};

export default QuotationPrint;
