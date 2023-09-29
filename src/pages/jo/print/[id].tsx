import React from 'react';
import dynamic from 'next/dynamic';
import { NextPageCustomLayout } from '@/pages/_app';

const JoPdf = dynamic(() => import('@/components/pdf/jo.pdf'), {
  ssr: false,
});

const JoPrint: NextPageCustomLayout = () => {
  return (
    <div>
      <JoPdf />
    </div>
  );
};

JoPrint.getLayout = function getLayout(page: React.ReactElement) {
  return page;
};

export default JoPrint;
