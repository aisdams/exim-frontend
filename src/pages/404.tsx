import { ReactElement } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { NextPageCustomLayout } from '@/types/_app.type';
import { Button } from '@/components/ui/button';

const CustomError: NextPageCustomLayout = () => {
  const router = useRouter();
  return (
    <div className=" grid h-screen w-screen place-items-center">
      <h1 className="text-center text-5xl">
        404 Error
        <br />
        <span className="text-lg">
          Sorry, Please <Button onClick={() => router.back()}>Back</Button>
        </span>
      </h1>
    </div>
  );
};

CustomError.getLayout = function getLayout(page: ReactElement) {
  return page;
};

export default CustomError;
